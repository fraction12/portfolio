import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { getSkill, getSystemPrompt, type AgentId } from '../../../lib/skills';
import { checkRateLimit, isRateLimited, type RateLimitResult } from '../../../lib/rate-limit';

const DEFAULT_MODEL = 'qwen2.5-coder:32b';
const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 8_000;
const UPSTREAM_TIMEOUT_MS = 25_000;
type ChatMessage = { role: 'user' | 'assistant'; content: string };

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return (request as { socket?: { remoteAddress?: string } }).socket?.remoteAddress ?? 'unknown';
}

async function readBoundedBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return '';

  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export const POST: APIRoute = async ({ request }) => {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: 'Request body too large' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
  }

  let body: unknown;
  let rawBody = '';

  try {
    const boundedBody = await readBoundedBody(request);
    if (boundedBody === null) {
      return new Response(JSON.stringify({ error: 'Request body too large' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
    }
    rawBody = boundedBody;
    body = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const payload = body as {
    agent?: AgentId;
    skill?: string;
    messages?: unknown;
  };

  const agent = payload.agent ?? 'codex';
  const skillSlug = payload.skill ?? 'html-diagrams';
  const messages = payload.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (messages.length > MAX_MESSAGES) {
    return new Response(JSON.stringify({ error: 'Too many messages' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
  }

  let totalChars = 0;
  const normalizedMessages: ChatMessage[] = [];
  for (const message of messages) {
    if (
      !message ||
      typeof message !== 'object' ||
      !('role' in message) ||
      !('content' in message) ||
      (message.role !== 'user' && message.role !== 'assistant') ||
      typeof message.content !== 'string'
    ) {
      return new Response(JSON.stringify({ error: 'Invalid message shape' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (message.content.length > MAX_MESSAGE_CHARS) {
      return new Response(JSON.stringify({ error: 'Message too large' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
    }
    totalChars += message.content.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      return new Response(JSON.stringify({ error: 'Conversation too large' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
    }
    normalizedMessages.push({ role: message.role, content: message.content });
  }

  const skill = getSkill(skillSlug);
  if (!skill) {
    return new Response(JSON.stringify({ error: 'Unknown skill' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'LLM provider not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://ollama.com/v1',
    timeout: UPSTREAM_TIMEOUT_MS,
  });

  const systemPrompt = getSystemPrompt(skill, agent);

  const ip = getClientIp(request);
  let limit: RateLimitResult;
  try {
    limit = await checkRateLimit(ip);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Rate limiter unavailable. Try again later.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (isRateLimited(limit)) {
    return new Response(
      JSON.stringify({ error: limit.reason }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const upstreamAbort = new AbortController();

  let stream: Awaited<ReturnType<typeof client.chat.completions.create>>;
  try {
    stream = await client.chat.completions.create(
      {
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...normalizedMessages,
        ],
        max_tokens: 2048,
        temperature: 0.6,
        stream: true,
      },
      { signal: upstreamAbort.signal }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'LLM provider request failed' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (upstreamAbort.signal.aborted) break;
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (delta) {
            const payload = JSON.stringify({ type: 'delta', content: delta });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }
        if (!upstreamAbort.signal.aborted) {
          const donePayload = JSON.stringify({ type: 'done', remaining: limit.remaining });
          controller.enqueue(encoder.encode(`data: ${donePayload}\n\n`));
        }
        controller.close();
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          controller.close();
          return;
        }
        const error = err instanceof Error ? err.message : 'Stream failed';
        const payload = JSON.stringify({ type: 'error', error });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        controller.close();
      }
    },
    cancel() {
      upstreamAbort.abort();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};
