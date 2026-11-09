import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);
const origins = {
  live: args.get('--live-origin') ?? 'https://dushyantgarg.com',
  local: args.get('--local-origin') ?? 'http://127.0.0.1:8787',
};
const outputDir = path.resolve(args.get('--output-dir') ?? '/tmp/portfolio-migration');
const localHTTPSOrigin = args.get('--local-https-origin');
const assetsRoot = ['dist/client', 'dist'].map(name => path.join(root, name)).find(name => existsSync(path.join(name, 'sitemap-index.xml')));
if (!assetsRoot) throw new Error('Build the site before running hosting parity.');

const relevantHeaders = ['content-type', 'cache-control', 'content-security-policy', 'x-content-type-options', 'strict-transport-security', 'location'];
const inventory = new Map();
const records = [];
const externalReferences = new Set();
const failures = [];

function add(route, kind, source) {
  if (!route.startsWith('/') || route.startsWith('//')) return;
  const item = inventory.get(route) ?? { route, kind, sources: new Set(), checked: false };
  item.sources.add(source);
  inventory.set(route, item);
}

function files(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? files(path.join(directory, entry.name), relative) : [relative];
  });
}

function discover(text, documentPath, source) {
  const references = [];
  for (const match of text.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)) references.push(match[1]);
  for (const match of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
    references.push(...match[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
  }
  for (const match of text.matchAll(/url\(\s*["']?([^\s)'";]+)["']?\s*\)/gi)) references.push(match[1]);
  for (const match of text.matchAll(/<loc>([^<]+)<\/loc>/gi)) references.push(match[1]);
  for (const reference of references) {
    if (!reference || reference.startsWith('#') || /^(?:data:|mailto:|tel:|javascript:)/i.test(reference)) continue;
    let url;
    try { url = new URL(reference.replaceAll('&amp;', '&'), new URL(documentPath, origins[source] ?? origins.live)); }
    catch { continue; }
    if (![new URL(origins.live).origin, new URL(origins.local).origin].includes(url.origin)) {
      externalReferences.add(url.origin);
      continue;
    }
    const route = url.pathname + url.search;
    const kind = /\.[a-z\d]+$/i.test(url.pathname) && !/\.(?:html|txt|xml)$/i.test(url.pathname) || url.pathname === '/_image' ? 'asset' : 'route';
    add(route, kind, `${source}-reference`);
  }
}

function textValue(html, expression) {
  return expression.exec(html)?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? null;
}

function shape(html) {
  const navigation = [...html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)]
    .flatMap(match => [...match[1].matchAll(/href=["']([^"']+)["']/gi)].map(link => link[1]));
  return {
    title: textValue(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    heading: textValue(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
    canonical: /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html)?.[1] ?? null,
    navigation,
  };
}

async function request(url, { headers = [], head = false, insecure = false } = {}) {
  const command = ['--silent', '--show-error', '--compressed', '--path-as-is', '--max-time', '40', '--include'];
  if (head) command.push('--head');
  if (insecure) command.push('--insecure');
  for (const header of headers) command.push('--header', header);
  command.push(url);
  try {
    const { stdout } = await execute('curl', command, { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });
    let offset = 0;
    let status = 0;
    let responseHeaders = {};
    while (stdout.subarray(offset, offset + 5).toString() === 'HTTP/') {
      const end = stdout.indexOf('\r\n\r\n', offset);
      if (end === -1) throw new Error('curl did not return complete response headers');
      const lines = stdout.subarray(offset, end).toString().split('\r\n');
      status = Number(lines.shift().split(' ')[1]);
      responseHeaders = Object.fromEntries(lines.filter(line => line.includes(':')).map(line => {
        const index = line.indexOf(':');
        return [line.slice(0, index).toLowerCase(), line.slice(index + 1).trim()];
      }));
      offset = end + 4;
    }
    const body = stdout.subarray(offset);
    const contentType = responseHeaders['content-type'] ?? '';
    const text = /text|xml|javascript|json/.test(contentType) ? body.toString() : '';
    return {
      status,
      headers: Object.fromEntries(relevantHeaders.map(name => [name, responseHeaders[name] ?? null])),
      bytes: head ? Number(responseHeaders['content-length'] ?? 0) : body.length,
      sha256: head ? null : createHash('sha256').update(body).digest('hex'),
      shape: /text\/html/.test(contentType) ? shape(text) : null,
      text,
      bodyCheck: head ? 'HEAD only' : 'GET',
    };
  } catch (error) {
    return { status: 0, headers: {}, error: error.message.split('\n').at(-1), text: '' };
  }
}

function compare(item, live, local) {
  const differences = [];
  const required = {
    live: item.kind !== 'asset' || item.sources.has('public') || item.sources.has('live-reference'),
    local: item.kind !== 'asset' || item.sources.has('public') || item.sources.has('built') || item.sources.has('local-reference'),
  };
  for (const side of ['live', 'local']) {
    const response = side === 'live' ? live : local;
    if (response.status === 0) failures.push(`${item.route}: ${side} request failed, ${response.error}`);
    if (item.kind === 'asset' && required[side] && response.status !== 200) failures.push(`${item.route}: required ${side} asset returned ${response.status}`);
  }
  if (live.status !== local.status) {
    differences.push(`status ${live.status} / ${local.status}`);
    if (item.kind !== 'asset' || required.live && required.local) failures.push(`${item.route}: status mismatch ${live.status} / ${local.status}`);
  }
  if (live.status === local.status) {
    for (const name of relevantHeaders) {
      if (live.headers[name] === local.headers[name]) continue;
      differences.push(`${name}: ${live.headers[name] ?? '(absent)'} / ${local.headers[name] ?? '(absent)'}`);
      if (['content-security-policy', 'x-content-type-options', 'location'].includes(name) && !(live.status === 403 && live.headers[name] === null)) failures.push(`${item.route}: ${name} mismatch`);
    }
    if (live.shape && local.shape) {
      for (const name of ['title', 'heading', 'canonical', 'navigation']) {
        if (JSON.stringify(live.shape[name]) === JSON.stringify(local.shape[name])) continue;
        differences.push(`${name} differs`);
        failures.push(`${item.route}: HTML ${name} mismatch`);
      }
    }
    if (item.sources.has('public') && live.sha256 && local.sha256 && live.sha256 !== local.sha256) {
      differences.push('public asset bytes differ');
      failures.push(`${item.route}: public asset bytes differ`);
    }
  }
  return { route: item.route, kind: item.kind, sources: [...item.sources].sort(), required, live, local, differences };
}

for (const file of files(assetsRoot)) {
  if (file.startsWith('_worker-media/')) continue;
  if (file.split('/').some(part => part.startsWith('.')) || /(?:^|\/)_(?:headers|redirects|worker\.js)(?:\/|$)/.test(file) || file.endsWith('.map')) continue;
  if (file.endsWith('/index.html')) {
    const route = '/' + file.slice(0, -'/index.html'.length);
    add(route, 'route', 'built');
    add(route + '/', 'route', 'built');
    add('/' + file, 'route', 'built');
  } else if (!file.endsWith('.html')) add('/' + file, /\.(?:txt|xml)$/.test(file) ? 'route' : 'asset', 'built');
  if (/\.(?:html|css|xml)$/.test(file)) discover(readFileSync(path.join(assetsRoot, file), 'utf8'), '/' + file, 'local');
}
for (const file of files(path.join(root, 'public'))) {
  if (file.startsWith('_worker-media/')) continue;
  if (!file.startsWith('.') && !['_headers', '_redirects'].includes(file)) add('/' + file, 'asset', 'public');
}
for (const route of ['/', '/tools', '/tools/', '/writing', '/writing/', '/llms.txt', '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', '/tools?page=2', '/tools/?page=2', '/tools?page=999']) add(route, 'route', 'explicit');
for (const route of ['/404', '/404/', '/404.html', '/index.html', '/tools/microcanvas.html', '/missing-portfolio-check', '/missing-portfolio-check/', '/missing.js', '/.env', '/.git/HEAD', '/api/play', '/_isr']) add(route, 'probe', 'explicit');

while ([...inventory.values()].some(item => !item.checked)) {
  const pending = [...inventory.values()].filter(item => !item.checked);
  for (let index = 0; index < pending.length; index += 6) {
    await Promise.all(pending.slice(index, index + 6).map(async item => {
      item.checked = true;
      const head = /\.(?:mp4|gif)$/i.test(item.route);
      const [live, local] = await Promise.all(Object.values(origins).map(origin => request(new URL(item.route, origin).href, { head })));
      for (const [side, response] of [['live', live], ['local', local]]) {
        if (response.status === 200 && /html|css|xml/.test(response.headers['content-type'] ?? '')) discover(response.text, item.route, side);
      }
      records.push(compare(item, live, local));
    }));
  }
}

const liveURL = new URL(origins.live);
const wwwHost = liveURL.hostname.startsWith('www.') ? liveURL.hostname : 'www.' + liveURL.hostname;
const redirectChecks = [];
for (const protocol of ['https:', 'http:']) {
  for (const hostname of [liveURL.hostname, wwwHost]) {
    const route = '/tools/?page=2';
    const live = await request(`${protocol}//${hostname}${route}`);
    const localOrigin = protocol === 'https:' ? localHTTPSOrigin : origins.local;
    const local = localOrigin ? await request(new URL(route, localOrigin).href, { headers: [`Host: ${hostname}`], insecure: protocol === 'https:' }) : null;
    redirectChecks.push({ url: `${protocol}//${hostname}${route}`, live: { status: live.status, location: live.headers.location }, local: local ? { status: local.status, location: local.headers.location } : { status: null, location: null }, localMethod: localOrigin ? 'Local listener with production Host header' : 'Not checked; pass --local-https-origin for a separate HTTPS Wrangler listener' });
    const proxyRewritesHTTPS = protocol === 'http:' && live.status === 308 && local?.status === 308
      && local.headers.location === live.headers.location?.replace(/^https:/, 'http:');
    if (proxyRewritesHTTPS) redirectChecks.at(-1).localMethod += '; Wrangler rewrites HTTPS Location to its HTTP upstream. Verify the raw Worker with npm run test:built.';
    if (local && !proxyRewritesHTTPS && (live.status !== local.status || live.headers.location !== local.headers.location)) failures.push(`${protocol}//${hostname}${route}: origin redirect mismatch`);
  }
}

const wwwChecks = [];
for (let index = 0; index < records.length; index += 8) {
  await Promise.all(records.slice(index, index + 8).filter(record => record.live.status === 200).map(async record => {
    const live = await request(`https://${wwwHost}${record.route}`, { head: true });
    const expected = new URL(record.route, origins.live).href;
    const local = localHTTPSOrigin ? await request(new URL(record.route, localHTTPSOrigin).href, {
      head: true, insecure: true, headers: [`Host: ${wwwHost}`],
    }) : null;
    wwwChecks.push({ route: record.route, status: live.status, location: live.headers.location, localStatus: local?.status ?? null, localLocation: local?.headers.location ?? null });
    if (local && (local.status !== 307 || local.headers.location !== expected)) failures.push(`${record.route}: local www redirect differs from 307 to ${expected}`);
    if (live.status !== 307 || live.headers.location !== expected) failures.push(`${record.route}: www redirect differs from 307 to ${expected}`);
  }));
}

records.sort((a, b) => a.route.localeCompare(b.route));
for (const record of records) {
  delete record.live.text;
  delete record.local.text;
}
const report = {
  checkedAt: new Date().toISOString(), origins, localHTTPSOrigin: localHTTPSOrigin ?? null, assetsDirectory: path.relative(root, assetsRoot),
  counts: { paths: records.length, routes: records.filter(record => record.kind === 'route').length, assets: records.filter(record => record.kind === 'asset').length, probes: records.filter(record => record.kind === 'probe').length, wwwRedirects: wwwChecks.length },
  failures: [...new Set(failures)], externalReferences: [...externalReferences].sort(), redirectChecks, wwwChecks, records,
  limits: [
    'Generated asset filenames can change after removing Vercel packages. Each origin must serve the assets referenced by its own HTML.',
    'MP4 and GIF checks use HEAD to avoid downloading large media twice. Other public assets use GET and byte hashes.',
    'Dynamic upstream data can differ. HTML comparison covers titles, headings, canonical URLs and navigation, not live metrics.',
    'Cache-Control and Content-Type charset differences are reported but do not fail parity. Security header mismatches fail.',
    'Wrangler rewrites HTTPS Location values to HTTP for an HTTP upstream. The raw Worker HTTPS destinations are asserted by npm run test:built.',
    'Local origin checks use production Host headers. HTTPS checks require --local-https-origin and skip local certificate verification. They do not establish production TLS.',
    'External font providers and outbound destinations are inventoried but are outside local hosting parity.',
  ],
};
const escape = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# Portfolio hosting parity', '',
  `Checked ${report.checkedAt}. Live ${origins.live}. Local ${origins.local}.`, '',
  `${report.counts.paths} paths, ${report.counts.routes} routes, ${report.counts.assets} assets, ${report.counts.probes} probes, ${report.counts.wwwRedirects} www redirects.`, '',
  '| Path | Kind | Live | Local | Differences |', '| --- | --- | --- | --- | --- |',
  ...records.map(record => `| ${escape(record.route)} | ${record.kind} | ${record.live.status} | ${record.local.status} | ${escape(record.differences.join('; ')) || 'None'} |`), '',
  '## Origin and protocol redirects', '',
  '| URL | Live status | Live location | Local status | Local location |', '| --- | --- | --- | --- | --- |',
  ...redirectChecks.map(check => `| ${escape(check.url)} | ${check.live.status} | ${escape(check.live.location)} | ${check.local.status} | ${escape(check.local.location)} |`), '',
  '## Failures', '', ...report.failures.map(failure => `- ${failure}`), ...(report.failures.length ? [] : ['None.']), '',
  '## Limits', '', ...report.limits.map(limit => `- ${limit}`), '',
];
mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, 'hosting-parity.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(path.join(outputDir, 'hosting-parity.md'), lines.join('\n'));
console.log(JSON.stringify({ ...report.counts, failures: report.failures, outputDirectory: outputDir }, null, 2));
if (report.failures.length) process.exitCode = 1;
