// ── LIVE GITHUB + PACKAGE STATS ─────────────────────────────────────────
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value) || 0);

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
        if (el) el.textContent = formatNumber(data.stargazers_count);
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

  try {
    const res = await fetch('https://api.npmjs.org/downloads/point/last-month/agentrem');
    if (res.ok) {
      const data = await res.json();
      const npmEl = document.getElementById('agentrem-npm');
      if (npmEl && Number.isFinite(data?.downloads)) npmEl.textContent = formatNumber(data.downloads);
    }
  } catch {}

  try {
    const res = await fetch('https://pypistats.org/api/packages/agentplan/recent');
    if (res.ok) {
      const data = await res.json();
      const downloadsEl = document.getElementById('agentplan-downloads');
      if (downloadsEl && Number.isFinite(data?.data?.last_month)) {
        downloadsEl.textContent = formatNumber(data.data.last_month);
      }
    }
  } catch {}

  try {
    const res = await fetch('https://dushyantg.substack.com/api/v1/publication');
    if (res.ok) {
      const data = await res.json();
      const subsEl = document.getElementById('substack-subs');
      if (subsEl && Number.isFinite(data?.subscriber_count)) {
        subsEl.textContent = formatNumber(data.subscriber_count);
      }
    }
  } catch {}
}

document.addEventListener('astro:page-load', initApiStats);
