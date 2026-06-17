import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { getSkill, getSystemPrompt, type AgentId } from '../../../lib/skills';
import { checkRateLimit, isRateLimited } from '../../../lib/rate-limit';

const DEFAULT_MODEL = 'qwen2.5-coder:32b';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return (request as { socket?: { remoteAddress?: string } }).socket?.remoteAddress ?? 'unknown';
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const limit = await checkRateLimit(ip);
  if (isRateLimited(limit)) {
    return new Response(
      JSON.stringify({ error: limit.reason }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: {
    agent?: AgentId;
    skill?: string;
    messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { agent = 'codex', skill: skillSlug = 'html-diagrams', messages = [] } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
  });

  const systemPrompt = getSystemPrompt(skill, agent);

  const upstreamAbort = new AbortController();

  const stream = await client.chat.completions.create(
    {
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
          .filter((m): m is { role: 'user' | 'assistant'; content: string } => m.role === 'user' || m.role === 'assistant')
          .map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 2048,
      temperature: 0.6,
      stream: true,
    },
    { signal: upstreamAbort.signal }
  );

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
