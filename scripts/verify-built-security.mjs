import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const functionRoot = path.join(root, '.vercel/output/functions/_render.func');
const staticRoot = path.join(root, '.vercel/output/static');
const origin = 'https://dushyantgarg.com';
const originalFetch = globalThis.fetch;
const originalCwd = process.cwd();
const originalToken = process.env.GITHUB_TOKEN;
const syntheticImage = await sharp({ create: { width: 24, height: 24, channels: 3, background: '#345678' } }).png().toBuffer();
const intercepted = [];

// The production renderer reads only build-copied public snapshots. No real
// GitHub credential or outbound connection is used, and failed synthetic APIs
// cannot update the snapshots. The image bytes are newly generated fixtures.
process.env.GITHUB_TOKEN = '';
process.chdir(functionRoot);
globalThis.fetch = async (input) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  intercepted.push(url.origin + url.pathname);
  if (url.origin === origin && url.pathname === '/dushyant-garg-avatar.jpg') {
    return new Response(syntheticImage, { headers: { 'content-type': 'image/png' } });
  }
  return new Response('Synthetic upstream unavailable', { status: 503 });
};

try {
  const { default: app } = await import(pathToFileURL(path.join(functionRoot, 'dist/server/entry.mjs')).href);
  assert.equal(typeof app.fetch, 'function');
  const checks = [];
  for (const route of ['/', '/tools/', '/writing/']) {
    const response = await app.fetch(new Request(origin + route));
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert.match(html, /Dushyant Garg/);
    assert.ok(html.includes(`rel="canonical" href="${origin + route}"`), route + ' canonical');
    assert.match(html, /astro-view-transitions-enabled/);
    assert.doesNotMatch(html, /Astro Error|Internal Server Error/);
    checks.push({ route, status: response.status });
  }
  const text = await app.fetch(new Request(origin + '/llms.txt'));
  assert.equal(text.status, 200);
  assert.match(text.headers.get('content-type'), /text\/plain/);
  assert.match(await text.text(), /Dushyant Garg/);
  checks.push({ route: '/llms.txt', status: text.status });

  const image = await app.fetch(new Request(origin + '/_image?href=%2Fdushyant-garg-avatar.jpg&w=16&h=16&f=webp'));
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/webp');
  const metadata = await sharp(Buffer.from(await image.arrayBuffer())).metadata();
  assert.equal(metadata.width, 16);
  assert.equal(metadata.height, 16);
  checks.push({ route: '/_image (synthetic PNG to WebP)', status: image.status });

  for (const route of ['/missing-synthetic-page', '/api/play', '/.env', '/.git/HEAD', '/_isr']) {
    const response = await app.fetch(new Request(origin + route));
    assert.equal(response.status, 404, route);
    await response.body?.cancel();
    checks.push({ route, status: response.status });
  }
  const foreign = await app.fetch(new Request(origin + '/', { method: 'POST', headers: { Origin: 'https://foreign.example', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'synthetic=1' }));
  assert.equal(foreign.status, 403);
  await foreign.body?.cancel();
  checks.push({ route: '/ (cross-Origin form POST)', status: foreign.status });

  assert.ok(existsSync(path.join(staticRoot, 'robots.txt')));
  assert.ok(existsSync(path.join(staticRoot, 'sitemap-index.xml')));
  const details = readdirSync(path.join(staticRoot, 'tools')).filter(name => existsSync(path.join(staticRoot, 'tools', name, 'index.html')));
  assert.ok(details.length >= 15);
  for (const name of details) assert.match(readFileSync(path.join(staticRoot, 'tools', name, 'index.html'), 'utf8'), /Dushyant Garg/);
  assert.equal(JSON.parse(readFileSync(path.join(functionRoot, '.vc-config.json'), 'utf8')).runtime, 'nodejs24.x');
  console.log(JSON.stringify({ checks, staticDetailRoutes: details.length, network: 'all outbound fetch intercepted', interceptedCount: intercepted.length }));
} finally {
  globalThis.fetch = originalFetch;
  process.chdir(originalCwd);
  if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
  else process.env.GITHUB_TOKEN = originalToken;
}
