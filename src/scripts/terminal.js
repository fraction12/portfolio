// ── SECRET TERMINAL ─────────────────────────────────────────────────────
(function() {
  const overlay  = document.getElementById('terminal-overlay');
  const output   = document.getElementById('terminal-output');
  const input    = document.getElementById('terminal-input');
  if (!overlay || !output || !input) return;

  let opened = false;
  let cmdHistory = [];
  let histIdx = -1;

  function print(text, cls) {
    const line = document.createElement('div');
    line.style.whiteSpace = 'pre-wrap';
    if (cls) line.style.color = cls;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printHTML(html) {
    const line = document.createElement('div');
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function openTerminal() {
    overlay.classList.add('open');
    input.focus();
    if (!opened) {
      opened = true;
      print('welcome to dushyant.dev terminal. type \'help\' to get started.');
    }
  }

  function closeTerminal() {
    overlay.classList.remove('open');
  }

  // Backtick toggles terminal (unless focus is on an input/textarea)
  document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' && document.activeElement !== input) return;
      if (tag === 'TEXTAREA') return;
      e.preventDefault();
      overlay.classList.contains('open') ? closeTerminal() : openTerminal();
    }
  });

  // Commands
  const commands = {
    help: () => 'available commands: help, whoami, ls, cat, projects, clear, lobster, matrix, coffee, exit',
    whoami: () => 'visitor. curious one, apparently.',
    ls: (args) => {
      if (args === '-la') {
        const now = 'Feb 22 03:04';
        return [
          'total 48',
          `drwxr-xr-x  7 dushyant staff  224 ${now} agentrem/`,
          `drwxr-xr-x  5 dushyant staff  160 ${now} ClawK/`,
          `drwxr-xr-x  6 dushyant staff  192 ${now} TradeSpec-AI/`,
          `drwxr-xr-x  4 dushyant staff  128 ${now} AgentSense/`,
          `drwxr-xr-x  4 dushyant staff  128 ${now} agentplan/`,
          `-rw-r--r--  1 dushyant staff   42 ${now} README.md`,
          `-rw-------  1 dushyant staff   22 ${now} .lobster-mode`,
        ].join('\n');
      }
      return 'agentrem/  ClawK/  TradeSpec-AI/  AgentSense/  agentplan/  README.md  .lobster-mode';
    },
    cat: (args) => {
      if (args === 'README.md') return 'hi. i\'m dushyant. i build things.\n\nthat\'s it. that\'s the readme.';
      if (args === '.lobster-mode') return '🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞';
      if (args) return `cat: ${args}: No such file or directory`;
      return 'cat: missing operand';
    },
    projects: () => [
      '🔔 agentrem       — persistent reminder layer for AI agents (TypeScript, SQLite, MCP)',
      '🖥  ClawK          — macOS menu bar app for OpenClaw (Swift, SwiftUI)',
      '⚡ TradeSpec AI   — AI bid analyzer for trade contractors (Node.js, AI/ML)',
      '🧠 AgentSense     — zero-cost knowledge graph for AI agents (TypeScript, FTS5)',
      '📋 agentplan      — project planning CLI for AI agents (TypeScript, SQLite)',
    ].join('\n'),
    clear: () => { output.innerHTML = ''; return null; },
    lobster: () => {
      if (typeof window.toggleLobsterMode === 'function') window.toggleLobsterMode();
      return '🦞 LOBSTER MODE TOGGLED';
    },
    matrix: () => {
      // fill with random chars for 3s
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      let matrixInterval;
      let count = 0;
      matrixInterval = setInterval(() => {
        let row = '';
        for (let i = 0; i < 60; i++) row += chars[Math.floor(Math.random() * chars.length)];
        print(row);
        count++;
        if (count >= 18) {
          clearInterval(matrixInterval);
          output.innerHTML = '';
          print('wake up, neo.');
        }
      }, 160);
      return null;
    },
    coffee: () => {
      const progressLine = document.createElement('div');
      progressLine.style.whiteSpace = 'pre';
      progressLine.style.color = '#22c55e';
      output.appendChild(progressLine);
      output.scrollTop = output.scrollHeight;

      let pct = 0;
      const bar = setInterval(() => {
        pct += 4;
        const filled = Math.floor(pct / 10);
        const empty = 10 - filled;
        progressLine.textContent = `brewing... [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${pct}%`;
        output.scrollTop = output.scrollHeight;
        if (pct >= 100) {
          clearInterval(bar);
          progressLine.textContent = 'brewing... [██████████] 100%';
          print('☕ done. now get back to work.');
        }
      }, 120);
      return null;
    },
    exit: () => {
      print('bye. come back soon.');
      setTimeout(closeTerminal, 700);
      return null;
    },
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      if (!raw) return;

      // Echo the command
      print(`visitor@dushyant.dev ~ $ ${raw}`, '#22c55e');

      // History
      cmdHistory.unshift(raw);
      if (cmdHistory.length > 20) cmdHistory.pop();
      histIdx = -1;

      input.value = '';

      // Parse
      const [cmd, ...rest] = raw.split(' ');
      const args = rest.join(' ');

      // sudo
      if (cmd === 'sudo') {
        if (args.trim() === 'rm -rf /') {
          print('permission denied. nice try though. 🦞');
        } else {
          print("you're not root here buddy");
        }
        return;
      }

      if (commands[cmd]) {
        let result;
        if (cmd === 'ls') {
          result = commands.ls(args || '');
        } else if (cmd === 'cat') {
          result = commands.cat(args || '');
        } else {
          result = commands[cmd]();
        }
        if (result !== null && result !== undefined) print(result);
      } else {
        print(`command not found: ${raw}. try 'help'`);
      }
    }

    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        input.value = cmdHistory[histIdx];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = cmdHistory[histIdx];
      } else {
        histIdx = -1;
        input.value = '';
      }
    }
  });
})();
