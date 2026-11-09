import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Miniflare, Request, Response, convertV4MiniflareOptions } from 'miniflare';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const functionRoot = path.join(root, 'dist/server');
const staticRoot = path.join(root, 'dist/client');
const origin = 'https://dushyantgarg.com';
const intercepted = [];
const scriptPolicyViolations = [];
function inspectScriptPolicy(html, route) {
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(html)) scriptPolicyViolations.push(route + ': inline event handler');
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(attributes) || /type=["']application\/ld\+json["']/.test(attributes) || !body.trim()) continue;
    scriptPolicyViolations.push(route + ': executable inline script');
  }
}

const config = JSON.parse(readFileSync(path.join(functionRoot, 'wrangler.json'), 'utf8'));
const runtime = new Miniflare(convertV4MiniflareOptions({
  name: 'portfolio',
  modules: [{ type: 'ESModule', path: path.join(functionRoot, 'security-probe.mjs'), contents: `
    import app from './${config.main}';
    export default { fetch(request, env, context) {
      if (new URL(request.url).pathname === '/__synthetic_foreign_form') request = new Request('https://dushyantgarg.com/', {
        method: 'POST', headers: { Origin: 'https://foreign.example', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'synthetic=1'
      });
      return app.fetch(request, env, context);
    } };
  ` }, ...[config.main, ...readdirSync(path.join(functionRoot, 'chunks')).filter(name => name.endsWith('.mjs')).map(name => 'chunks/' + name), 'virtual_astro_middleware.mjs']
    .map(name => ({ type: 'ESModule', path: path.join(functionRoot, name) }))],
  modulesRoot: functionRoot,
  compatibilityDate: config.compatibility_date,
  compatibilityFlags: config.compatibility_flags,
  bindings: { GITHUB_TOKEN: '' },
  assets: {
    directory: staticRoot,
    binding: 'ASSETS',
    run_worker_first: true,
    assetConfig: { html_handling: 'none', not_found_handling: 'none' },
  },
  outboundService(request) {
    intercepted.push(new URL(request.url).origin);
    return new Response('Synthetic upstream unavailable', { status: 503 });
  },
}));
const securityHeaders = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8')).headers.flatMap(rule => rule.headers);
const app = {
  async fetch(request) {
    const worker = await runtime.getWorker();
    const response = await worker.fetch(request.url, {
      method: request.method,
      redirect: 'manual',
      headers: Object.fromEntries(request.headers),
      body: request.body ? await request.arrayBuffer() : undefined,
    });
    for (const { key, value } of securityHeaders) assert.equal(response.headers.get(key), value, request.url + ' ' + key);
    assert.equal(response.headers.get('strict-transport-security'), 'max-age=63072000');
    return response;
  },
};

try {
  assert.equal(typeof app.fetch, 'function');
  const checks = [];
  for (const route of ['/', '/tools/', '/writing/']) {
    const response = await app.fetch(new Request(origin + route));
    const html = await response.text();
    assert.equal(response.status, 200, route);
    inspectScriptPolicy(html, route);
    assert.match(html, /Dushyant Garg/);
    assert.ok(html.includes(`rel="canonical" href="${origin + route}"`), route + ' canonical');
    assert.match(html, /astro-view-transitions-enabled/);
    assert.doesNotMatch(html, /Astro Error|Internal Server Error/);
    checks.push({ route, status: response.status });
  }
  for (const [url, status, location] of [
    ['http://dushyantgarg.com/tools/?page=2', 308, 'https://dushyantgarg.com/tools/?page=2'],
    ['http://www.dushyantgarg.com/tools/?page=2', 308, 'https://www.dushyantgarg.com/tools/?page=2'],
    ['https://www.dushyantgarg.com/tools/?page=2', 307, 'https://dushyantgarg.com/tools/?page=2'],
  ]) {
    const response = await app.fetch(new Request(url));
    assert.equal(response.status, status);
    assert.equal(response.headers.get('location'), location);
    await response.body?.cancel();
    checks.push({ route: url, status });
  }
  const text = await app.fetch(new Request(origin + '/llms.txt'));
  assert.equal(text.status, 200);
  assert.match(text.headers.get('content-type'), /text\/plain/);
  assert.match(await text.text(), /Dushyant Garg/);
  checks.push({ route: '/llms.txt', status: text.status });

  const image = await app.fetch(new Request(origin + '/_image?href=%2Fdushyant-garg-avatar.jpg&w=16&h=16&f=webp'));
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/jpeg');
  const metadata = await sharp(Buffer.from(await image.arrayBuffer())).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.equal(metadata.width, 460);
  checks.push({ route: '/_image (original public image)', status: image.status });

  const media = JSON.parse(readFileSync(path.join(staticRoot, '_worker-media/manifest.json'), 'utf8'));
  for (const file of media) {
    const response = await app.fetch(new Request(origin + file.path, { headers: { Range: 'bytes=0-9' } }));
    assert.equal(response.status, 206, file.path);
    assert.equal(response.headers.get('content-range'), `bytes 0-9/${file.size}`);
    assert.equal(response.headers.get('content-length'), '10');
    assert.equal(response.headers.get('content-type'), file.contentType);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(path.join(root, 'public', file.path)).subarray(0, 10));
    checks.push({ route: file.path + ' (byte range)', status: response.status });
  }
  const largeVideo = media.find(file => file.size > 25 * 1024 * 1024);
  const boundary = await app.fetch(new Request(origin + largeVideo.path, { headers: { Range: 'bytes=20971510-20971540' } }));
  assert.equal(boundary.status, 206);
  assert.equal(boundary.headers.get('content-length'), '31');
  assert.deepEqual(Buffer.from(await boundary.arrayBuffer()), readFileSync(path.join(root, 'public', largeVideo.path)).subarray(20971510, 20971541));
  checks.push({ route: largeVideo.path + ' (range across chunks)', status: boundary.status });

  for (const route of ['/missing-synthetic-page', '/api/play', '/_isr']) {
    const response = await app.fetch(new Request(origin + route));
    assert.equal(response.status, 404, route);
    inspectScriptPolicy(await response.text(), route);
    checks.push({ route, status: response.status });
  }
  for (const route of ['/.env', '/.git/HEAD']) {
    const response = await app.fetch(new Request(origin + route));
    assert.equal(response.status, 403, route);
    await response.body?.cancel();
    checks.push({ route, status: response.status });
  }
  const foreign = await app.fetch(new Request(origin + '/__synthetic_foreign_form'));
  assert.equal(foreign.status, 403, foreign.status === 403 ? '' : await foreign.text());
  for (const { key, value } of securityHeaders) assert.equal(foreign.headers.get(key), value);
  await foreign.body?.cancel();
  checks.push({ route: '/ (cross-Origin form POST)', status: foreign.status });

  assert.ok(existsSync(path.join(staticRoot, 'robots.txt')));
  assert.ok(existsSync(path.join(staticRoot, 'sitemap-index.xml')));
  const details = readdirSync(path.join(staticRoot, 'tools')).filter(name => existsSync(path.join(staticRoot, 'tools', name, 'index.html')));
  assert.ok(details.length >= 15);
  for (const name of details) {
    const html = readFileSync(path.join(staticRoot, 'tools', name, 'index.html'), 'utf8');
    assert.match(html, /Dushyant Garg/);
    inspectScriptPolicy(html, '/tools/' + name);
  }
  assert.deepEqual(scriptPolicyViolations, [], 'Every emitted page must work without executable inline scripts or event handlers');
  assert.equal(config.name, 'portfolio');
  assert.ok(!config.routes && !config.custom_domain);
  console.log(JSON.stringify({ checks, staticDetailRoutes: details.length, network: 'all outbound fetch intercepted', interceptedCount: intercepted.length }));
} finally {
  await runtime.dispose();
}
