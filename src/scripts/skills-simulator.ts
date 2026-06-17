// import { getAgentLabel } from '../lib/skills'; // available if needed

const SLASH_RE = /^\/(\S+)(?:\s+(.*))?$/;
const MAX_CLIENT_MESSAGES = 12;
const ERROR_BODY_PREVIEW_CHARS = 180;

function $(selector: string, root: ParentNode = document): HTMLElement | null {
  return root.querySelector(selector);
}

function $$(selector: string, root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll(selector));
}

const state = {
  agent: 'codex' as AgentId,
  skill: null as string | null,
  messages: [] as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  streaming: false,
  abortController: null as AbortController | null,
};

type AgentId = 'codex' | 'claude-code' | 'openclaw' | 'hermes' | 'cursor' | 'gemini-cli';

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function hardenPreviewHtml(html: string): string {
  const csp = [
    "default-src 'none'",
    "style-src 'unsafe-inline'",
    'img-src data: blob:',
    'font-src data:',
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ');
  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${meta}`);
  }
  return `${meta}\n${html}`;
}

function setView(view: 'details' | 'playground') {
  $$('[data-view-panel]').forEach(panel => {
    panel.hidden = panel.getAttribute('data-view-panel') !== view;
  });
  $$('[data-view]').forEach(btn => {
    btn.setAttribute('data-selected', btn.getAttribute('data-view') === view ? 'true' : 'false');
  });
}

function setAgent(id: AgentId) {
  state.agent = id;
  $$('[data-agent]').forEach(btn => {
    btn.setAttribute('data-selected', btn.getAttribute('data-agent') === id ? 'true' : 'false');
  });
}

function setSkill(slug: string | null) {
  const changed = slug !== state.skill;
  state.skill = slug;
  if (changed) state.messages = [];
  $$('[data-skill]').forEach(btn => {
    btn.setAttribute('data-selected', btn.getAttribute('data-skill') === slug ? 'true' : 'false');
  });

  $$('[data-skill-details]').forEach(details => {
    const matches = details.getAttribute('data-skill-details') === slug;
    details.hidden = !matches;
  });

  if (slug) {
    const skillCard = $(`.skill-card[data-skill="${slug}"]`);
    $$('[data-repo-link]').forEach(link => {
      const repoLink = link as HTMLAnchorElement;
      const repo = skillCard?.getAttribute('data-repo') || repoLink.href;
      repoLink.href = repo;
    });
  }
}

function appendMessage(role: 'user' | 'assistant' | 'system', content: string): HTMLElement {
  const template = $('[data-message-template]') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const messageEl = clone.querySelector('.chat-message') as HTMLElement;
  const roleEl = clone.querySelector('.chat-message__role') as HTMLElement;
  const bodyEl = clone.querySelector('.chat-message__body') as HTMLElement;

  roleEl.textContent = role === 'user' ? 'You' : role === 'assistant' ? state.agent : 'System';
  roleEl.classList.add(role === 'user' ? 'chat-message__role--user' : 'chat-message__role--agent');
  bodyEl.innerHTML = escapeHtml(content);

  const log = $('[data-chat-log]');
  log?.appendChild(clone);
  log?.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });

  return messageEl;
}

function showThinking(agent: AgentId): HTMLElement {
  const template = $('[data-agent-thinking-template]') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const messageEl = clone.querySelector('.chat-message') as HTMLElement;
  const roleEl = clone.querySelector('.chat-message__role') as HTMLElement;
  roleEl.textContent = agent;
  roleEl.classList.add('chat-message__role--agent');

  const log = $('[data-chat-log]');
  log?.appendChild(clone);
  log?.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });

  return messageEl;
}

function replaceThinkingWithResult(messageEl: HTMLElement, content: string, agent: AgentId, skill: string) {
  // Swap the thinking bubble for the real message template.
  const template = $('[data-message-template]') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const newMessageEl = clone.querySelector('.chat-message') as HTMLElement;
  const roleEl = clone.querySelector('.chat-message__role') as HTMLElement;
  const bodyEl = clone.querySelector('.chat-message__body') as HTMLElement;

  roleEl.textContent = agent;
  roleEl.classList.add('chat-message__role--agent');
  bodyEl.textContent = content;

  messageEl.replaceWith(newMessageEl);

  // For html-diagrams, try to extract an HTML artifact and render it.
  if (skill === 'html-diagrams') {
    const htmlMatch = content.match(/```html\n?([\s\S]*?)\n?```/);
    const html = htmlMatch ? htmlMatch[1].trim() : content.includes('<!DOCTYPE html>') ? content : '';
    if (html) {
      const preview = newMessageEl.querySelector('.chat-message__preview') as HTMLElement;
      const iframe = preview.querySelector('iframe') as HTMLIFrameElement;
      const code = preview.querySelector('code') as HTMLElement;
      if (preview && iframe && code) {
        preview.hidden = false;
        code.textContent = html;
        iframe.srcdoc = hardenPreviewHtml(html);
      }
    }
  }

  // Always hide the raw assistant text behind a collapsible source view.
  const rawBodyEl = newMessageEl.querySelector('.chat-message__body') as HTMLElement;
  const details = document.createElement('details');
  details.className = 'chat-message__source-toggle';
  const summary = document.createElement('summary');
  summary.textContent = 'View raw response';
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = content;
  pre.appendChild(code);
  details.appendChild(summary);
  details.appendChild(pre);
  rawBodyEl.replaceWith(details);

  const log = $('[data-chat-log]');
  log?.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });

  return newMessageEl;
}

function setRunCounter(remaining: { daily: number; hourly: number; global: number }) {
  const counter = $('[data-run-counter]');
  if (!counter) return;
  counter.textContent = `${remaining.daily} / day · ${remaining.hourly} / hr · ${remaining.global} global today`;
}

function compactResponseText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function htmlToReadableText(html: string): string {
  try {
    return compactResponseText(new DOMParser().parseFromString(html, 'text/html').body.textContent ?? html);
  } catch {
    return compactResponseText(html.replace(/<[^>]*>/g, ' '));
  }
}

async function getHttpErrorMessage(res: Response): Promise<string> {
  const status = `HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`;
  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      const payload = await res.json();
      const error = typeof payload?.error === 'string' ? payload.error : typeof payload?.message === 'string' ? payload.message : '';
      if (error) return `${status}: ${error}`;
    } catch {
      // Fall through to the generic fallback below.
    }
  }

  const body = await res.text().catch(() => '');
  const readable = contentType.includes('text/html') ? htmlToReadableText(body) : compactResponseText(body);
  const preview = readable.slice(0, ERROR_BODY_PREVIEW_CHARS);
  return preview ? `${status}: ${preview}` : `${status}: no response body`;
}

function trimMessageHistory() {
  if (state.messages.length > MAX_CLIENT_MESSAGES) {
    state.messages = state.messages.slice(-MAX_CLIENT_MESSAGES);
  }
}

async function sendMessage(text: string) {
  const input = $('[data-chat-input]') as HTMLInputElement | null;
  const sendBtn = $('[data-chat-send]') as HTMLButtonElement | null;
  const stopBtn = $('[data-chat-stop]') as HTMLButtonElement | null;
  const requestAgent = state.agent;
  const requestSkill = state.skill ?? 'html-diagrams';

  const userMessage = { role: 'user' as const, content: text };
  const rollbackUserMessage = () => {
    const index = state.messages.lastIndexOf(userMessage);
    if (index >= 0) state.messages.splice(index, 1);
  };

  state.messages.push(userMessage);
  trimMessageHistory();
  appendMessage('user', text);
  state.streaming = true;
  if (input) input.value = '';
  if (sendBtn) sendBtn.hidden = true;
  if (stopBtn) stopBtn.hidden = false;

  const abortController = new AbortController();
  state.abortController = abortController;
  const thinkingEl = showThinking(requestAgent);

  try {
    const res = await fetch('/api/skills/chat', {
      method: 'POST',
      signal: abortController.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent: requestAgent,
        skill: requestSkill,
        messages: state.messages,
      }),
    });

    if (!res.ok) {
      const error = await getHttpErrorMessage(res);
      rollbackUserMessage();
      thinkingEl.remove();
      appendMessage('assistant', `Error: ${error}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      rollbackUserMessage();
      thinkingEl.remove();
      appendMessage('assistant', 'Error: no response stream.');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let assistantText = '';
    let streamError = '';

    while (true) {
      if (abortController.signal.aborted) {
        await reader.cancel();
        break;
      }
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') continue;
        try {
          const event = JSON.parse(payload);
          if (event.type === 'delta' && event.content) {
            assistantText += event.content;
          } else if (event.type === 'done' && event.remaining) {
            setRunCounter(event.remaining);
          } else if (event.type === 'error') {
            streamError = event.error || 'Stream failed';
            await reader.cancel();
            break;
          }
        } catch {
          // Ignore malformed SSE lines.
        }
      }
      if (streamError) break;
    }

    if (streamError) {
      rollbackUserMessage();
      thinkingEl.remove();
      appendMessage('system', `Error: ${streamError}`);
    } else if (assistantText) {
      state.messages.push({ role: 'assistant', content: assistantText });
      trimMessageHistory();
      replaceThinkingWithResult(thinkingEl, assistantText, requestAgent, requestSkill);
    } else {
      rollbackUserMessage();
      thinkingEl.remove();
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      rollbackUserMessage();
      thinkingEl.remove();
      appendMessage('system', 'Stopped.');
    } else {
      rollbackUserMessage();
      thinkingEl.remove();
      appendMessage('assistant', `Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  } finally {
    state.streaming = false;
    state.abortController = null;
    if (sendBtn) sendBtn.hidden = false;
    if (stopBtn) stopBtn.hidden = true;
  }
}

function handleSlashCommand(text: string): boolean {
  const match = text.match(SLASH_RE);
  if (!match) return false;
  const slug = match[1];
  const rest = match[2]?.trim() ?? '';
  const skillBtn = $(`.skill-card[data-skill="${slug}"], .skill-chip[data-skill="${slug}"]`);
  if (!skillBtn) return false;

  setSkill(slug);
  if (rest) {
    sendMessage(rest);
  } else {
    appendMessage('system', `Loaded /${slug}. Type a request to try it.`);
  }
  return true;
}

function init() {
  const simulator = $('[data-simulator]');
  if (!simulator) return;

  $$('[data-nav-list] [data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view') as 'details' | 'playground' | null;
      if (view) setView(view);
    });
  });

  $$('[data-agent]').forEach(btn => {
    btn.addEventListener('click', () => {
      setAgent(btn.getAttribute('data-agent') as AgentId);
    });
  });

  $$('[data-skill]').forEach(btn => {
    // Read repo from the skill card to set the GitHub link.
    // Not stored in DOM currently; we'll fetch from data attribute if added.
    btn.addEventListener('click', () => {
      const slug = btn.getAttribute('data-skill');
      if (slug) setSkill(slug);
    });
  });

  const form = $('[data-chat-form]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('[data-chat-input]') as HTMLInputElement | null;
    const text = input?.value.trim();
    if (!text || state.streaming) return;

    // Clear welcome on first message.
    const welcome = $('.chat-welcome');
    if (welcome) welcome.remove();

    if (!handleSlashCommand(text)) {
      sendMessage(text);
    }
  });

  const stopBtn = $('[data-chat-stop]');
  stopBtn?.addEventListener('click', () => {
    if (state.abortController) {
      state.abortController.abort();
    }
  });

  $$('[data-download-skill]').forEach(downloadBtn => {
    downloadBtn.addEventListener('click', () => {
      const slug = state.skill ?? 'html-diagrams';
      const skillCard = $(`.skill-card[data-skill="${slug}"]`);
      const repo = skillCard?.getAttribute('data-repo');
      const downloadUrl = skillCard?.getAttribute('data-download-url');

      let rawUrl = downloadUrl;
      if (!rawUrl && repo) {
        const githubMatch = repo.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:tree|blob)\/([^/]+)\/(.+)/);
        if (githubMatch) {
          const [, owner, repoName, branch, path] = githubMatch;
          rawUrl = `https://github.com/${owner}/${repoName}/raw/${branch}/${path}/SKILL.md`;
        } else {
          rawUrl = `${repo.replace(/\/?$/, '')}/SKILL.md`;
        }
      }

      if (!rawUrl) {
        appendMessage('system', `No download URL configured for /${slug}.`);
        return;
      }

      const a = document.createElement('a');
      a.href = rawUrl;
      a.download = `${slug}-SKILL.md`;
      a.click();
    });
  });

  // Initial selection.
  setAgent('codex');
  setSkill('html-diagrams');
  setView('playground');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
