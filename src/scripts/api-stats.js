// ── LIVE GITHUB + PACKAGE STATS ─────────────────────────────────────────
async function initApiStats() {
  const repos = [
    { id: 'agentrem-stars', repo: 'fraction12/agentrem' },
    { id: 'openrank-stars', repo: 'fraction12/open-rank' },
    { id: 'clawk-stars', repo: 'fraction12/ClawK' },
    { id: 'agentsense-stars', repo: 'fraction12/agentsense' },
    { id: 'agentplan-stars', repo: 'fraction12/agentplan' },
  ];

  for (const { id, repo } of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`);
      if (res.ok) {
        const data = await res.json();
        const el = document.getElementById(id);
        if (el) el.textContent = data.stargazers_count;
      }
    } catch {}
  }

  const agentplanTestsEl = document.getElementById('agentplan-tests');
  if (agentplanTestsEl) {
    agentplanTestsEl.textContent = '104';
    agentplanTestsEl.setAttribute('data-target', '104');
  }

  try {
    const res = await fetch('https://pypi.org/pypi/agentplan/json');
    if (res.ok) {
      const data = await res.json();
      const verEl = document.getElementById('agentplan-version');
      if (verEl) verEl.textContent = data?.info?.version ?? '—';
    }
  } catch {}
}

document.addEventListener('astro:page-load', initApiStats);
