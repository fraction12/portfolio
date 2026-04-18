// Shared client-side source classifier. Used by lobster.js (to pick
// contextual greetings) and InviteModal (to pick contextual pitches).
// Prefer ?utm_source= when present, else sniff document.referrer.
// Falls through to 'direct' (no referrer, e.g. Safari private mode)
// or 'other' (unknown host).

const SOURCES = [
  ['linkedin',    /linkedin/],
  ['github',      /github/],
  ['substack',    /substack/],
  ['twitter',     /^(x|twitter|t\.co)$/],
  ['hackernews',  /(news\.ycombinator|hn)/],
  ['reddit',      /reddit/],
  ['producthunt', /(producthunt|ph)/],
  ['search',      /^(google|bing|duckduckgo|ddg|baidu|search)/],
  ['meta',        /(facebook|instagram|threads|fb)/],
  ['youtube',     /(youtube|yt)/]
];

export function classifySource() {
  const url = new URL(location.href);
  const utm = (url.searchParams.get('utm_source') || '').toLowerCase();
  if (utm) {
    for (const [name, re] of SOURCES) if (re.test(utm)) return name;
    return 'other';
  }
  const ref = document.referrer;
  if (!ref) return 'direct';
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '').toLowerCase();
    if (host === location.hostname) return 'internal';
    const domain = host.replace(/\.[a-z]{2,6}$/, '');
    for (const [name, re] of SOURCES) if (re.test(domain) || re.test(host)) return name;
    return 'other';
  } catch {
    return 'other';
  }
}
