// import { getAgentLabel } from '../lib/skills'; // available if needed

const SLASH_RE = /^\/(\S+)(?:\s+(.*))?$/;

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
  state.skill = slug;
  $$('[data-skill]').forEach(btn => {
    btn.setAttribute('data-selected', btn.getAttribute('data-skill') === slug ? 'true' : 'false');
  });

  const repoLink = $('[data-repo-link]') as HTMLAnchorElement | null;
  if (repoLink && slug) {
    const skillCard = $(`.skill-card[data-skill="${slug}"]`);
    const repo = skillCard?.getAttribute('data-repo') || repoLink.href;
    repoLink.href = repo;
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

function showThinking(): HTMLElement {
  const template = $('[data-agent-thinking-template]') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const messageEl = clone.querySelector('.chat-message') as HTMLElement;
  const roleEl = clone.querySelector('.chat-message__role') as HTMLElement;
  roleEl.textContent = state.agent;
  roleEl.classList.add('chat-message__role--agent');

  const log = $('[data-chat-log]');
  log?.appendChild(clone);
  log?.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });

  return messageEl;
}

function replaceThinkingWithResult(messageEl: HTMLElement, content: string) {
  // Swap the thinking bubble for the real message template.
  const template = $('[data-message-template]') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const newMessageEl = clone.querySelector('.chat-message') as HTMLElement;
  const roleEl = clone.querySelector('.chat-message__role') as HTMLElement;
  const bodyEl = clone.querySelector('.chat-message__body') as HTMLElement;

  roleEl.textContent = state.agent;
  roleEl.classList.add('chat-message__role--agent');
  bodyEl.textContent = content;

  messageEl.replaceWith(newMessageEl);

  // For html-diagrams, try to extract an HTML artifact and render it.
  if (state.skill === 'html-diagrams') {
    const htmlMatch = content.match(/```html\n?([\s\S]*?)\n?```/);
    const html = htmlMatch ? htmlMatch[1].trim() : content.includes('<!DOCTYPE html>') ? content : '';
    if (html) {
      const preview = newMessageEl.querySelector('.chat-message__preview') as HTMLElement;
      const iframe = preview.querySelector('iframe') as HTMLIFrameElement;
      const code = preview.querySelector('code') as HTMLElement;
      if (preview && iframe && code) {
        preview.hidden = false;
        code.textContent = html;
        iframe.srcdoc = html;
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

async function sendMessage(text: string) {
  const input = $('[data-chat-input]') as HTMLInputElement | null;
  const sendBtn = $('[data-chat-send]') as HTMLButtonElement | null;
  const stopBtn = $('[data-chat-stop]') as HTMLButtonElement | null;

  state.messages.push({ role: 'user', content: text });
  appendMessage('user', text);
  state.streaming = true;
  if (input) input.value = '';
  if (sendBtn) sendBtn.hidden = true;
  if (stopBtn) stopBtn.hidden = false;

  const abortController = new AbortController();
  state.abortController = abortController;
  const thinkingEl = showThinking();

  try {
    const res = await fetch('/api/skills/chat', {
      method: 'POST',
      signal: abortController.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent: state.agent,
        skill: state.skill ?? 'html-diagrams',
        messages: state.messages,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      thinkingEl.remove();
      appendMessage('assistant', `Error: ${err.error}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      thinkingEl.remove();
      appendMessage('assistant', 'Error: no response stream.');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let assistantText = '';

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
            assistantText += `\n[Error: ${event.error}]`;
          }
        } catch {
          // Ignore malformed SSE lines.
        }
      }
    }

    if (assistantText) {
      state.messages.push({ role: 'assistant', content: assistantText });
      replaceThinkingWithResult(thinkingEl, assistantText);
    } else {
      thinkingEl.remove();
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      thinkingEl.remove();
      appendMessage('system', 'Stopped.');
    } else {
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

  const downloadBtn = $('[data-download-skill]');
  downloadBtn?.addEventListener('click', () => {
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
