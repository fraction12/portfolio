// ── LIVE GITHUB + NPM STATS ─────────────────────────────────────────────
(async () => {
  const repos = [
    { id: 'agentrem-stars', repo: 'fraction12/agentrem' },
    { id: 'clawk-stars', repo: 'fraction12/ClawK' },
    { id: 'agentsense-stars', repo: 'fraction12/agentsense' },
    { id: 'agentplan-stars', repo: 'fraction12/agentplan' },
  ];

  // Fetch GitHub stars
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

  // Fetch npm version + test count from package.json description or README
  try {
    const res = await fetch('https://registry.npmjs.org/agentrem/latest');
    if (res.ok) {
      const data = await res.json();
      const verEl = document.getElementById('agentrem-version');
      if (verEl) verEl.textContent = data.version;

      // Update the typing phrase too
      const testMatch = data.description?.match(/(\d+)\s*test/i);
      const testsEl = document.getElementById('agentrem-tests');
      if (testsEl) {
        // Try to get from README badge or default to fetched info
        testsEl.textContent = '444'; // Will update when we add test count to npm
        testsEl.setAttribute('data-target', '444');
      }
    }
  } catch {}
})();
