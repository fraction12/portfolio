# Deploy the portfolio with Workers Builds

Connect `fraction12/portfolio` to the Cloudflare Worker named `portfolio` after this PR merges.
Use the Cloudflare GitHub app and Workers Builds. No GitHub Actions workflow is required.

| Setting | Value |
| --- | --- |
| Root directory | `/`, the repository root |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npm run cloudflare:deploy` |
| Node.js | `24.22.1`, pinned in `.node-version` |
| npm | `11.19.1`, pinned in `package.json` |
| Static assets | `dist/client` |
| Worker bundle | `dist/server/entry.mjs` |
| Preview and non-production branch builds | Disabled in Workers Builds settings |

`cloudflare:deploy` runs only `wrangler deploy`. Workers Builds runs the build separately, once per push to `main`.
The build generates `.wrangler/deploy/config.json`, which directs Wrangler to `dist/server/wrangler.json`.
Keep this generated configuration and both output directories available to the deploy step.
Cloudflare documents the supported [version files and package manager setting](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).

The root `wrangler.jsonc` contains no routes or custom domains. Version preview URLs are disabled.
The production branch and branch-build settings belong to Workers Builds, not Wrangler.
This PR prepares the repository. It does not create or change the Workers Builds connection.

## Runtime and data

The repository uses Astro 7.4.2 with `output: 'server'`.
The homepage, `/tools`, and `/writing` fetch live GitHub, Substack, npm, and PyPI data.
`/tools` also renders pagination from its query string. `/llms.txt` logs each request.
There are 21 prerendered tool pages, prerendered `/robots.txt` and `/llms-full.txt`, generated sitemaps with a `/sitemap.xml` alias, and an SSR custom 404.
There is no local RSS endpoint, form submission API, existing middleware, or resume file.
The newsletter form submits to Substack. The research PDF remains at its existing public URL.
Fonts still load from Google Fonts. Images, OG images, videos, and the favicon retain their public paths.

The Cloudflare adapter preserves SSR. `src/worker.ts` handles assets, slash aliases, and origin redirects before Astro.
Both slash forms return 200, and the existing `/tools/<slug>/index.html` aliases remain available.
Unknown paths use Astro's custom 404. Protected environment and Git paths return 403, matching the live host.
The Worker reads the CSP and MIME protection rules from the retained `vercel.json` and applies them to its responses.
All requests invoke the Worker to preserve redirects and headers, including requests for static assets.
These invocations count toward Workers usage. Static asset storage requires no additional storage service.

Set these values separately during cutover:

- Set `GITHUB_TOKEN` as a Worker runtime secret for live GitHub metrics and commit history. Keep the existing token scope unchanged.
- Set `PUBLIC_GOOGLE_SITE_VERIFICATION` and `PUBLIC_BING_SITE_VERIFICATION` as build variables if the current deployment uses them.
- For local authenticated data checks, use an ignored `.dev.vars` file. Never put credentials in Wrangler configuration or Git.

Without `GITHUB_TOKEN`, GitHub metrics use the bundled snapshot and live commit history is unavailable.
All four data sources bundle their existing public snapshots so upstream failures work without a source filesystem.
A successful refresh updates the snapshot in the current Worker isolate. A new isolate starts from the checked-in snapshot.
No KV, R2, session, or Images binding is required. The existing 60-second data memoization remains in place.

## Large video and byte ranges

Cloudflare limits each static asset to 25 MiB. The KV Capsules video is 37,730,386 bytes.
The build splits it into two assets under `public/_worker-media/`, which Git ignores.
`public/.assetsignore` excludes the original from Workers uploads. The tracked original remains available to Vercel.
The Worker streams the chunks at the original video URL without re-encoding or buffering the full video.

Cloudflare static assets also ignore byte ranges. The media handler implements HEAD, single-byte-range responses,
conditional ETags, and cancellation for all four MP4 files and the research PDF. The Worker uses `FixedLengthStream` to preserve `Content-Length`.
The original video SHA-256 is `73934e7aa4e979e9ca5ff33742350796f3a1ccfa3f379077c5af70247e751b24`.
The build preparation runs before development, build, typecheck, and tests so a clean checkout needs no generated files in Git.

## Local verification

Run the checks from the repository root:

```sh
npm ci
npm run build
npm run lint
npm test
npm run test:built
npm run preview -- --local --ip 127.0.0.1 --port 8791 --inspector-port 0
```

In another terminal, start the HTTPS listener for hostname checks:

```sh
npm run preview -- --local --ip 127.0.0.1 --local-protocol https --upstream-protocol https --port 8792 --inspector-port 0
```

Then run the live comparison:

```sh
node scripts/verify-hosting-parity.mjs --local-origin http://127.0.0.1:8791 --local-https-origin https://127.0.0.1:8792 --output-dir /tmp/portfolio-migration
```

The script writes JSON and Markdown reports. [The checked parity report](hosting-parity.md) lists each checked path.
The deterministic built-security harness runs the real compiled Worker in Miniflare and forces outbound APIs to fail.
It checks snapshot fallback, security headers, executable script policy, redirects, protected paths, the 404, and cross-origin form rejection.
Its synthetic request constructor exists only in the test runtime and is never deployed.

Wrangler's HTTP proxy rewrites an HTTPS `Location` back to its HTTP upstream protocol.
The parity report records that raw response. `test:built` verifies the actual Worker's 308 HTTPS targets directly.
The migration's local HTTPS listener verified the then-current 307 `www` redirect.
The current Worker uses a permanent 301, checked by `test:built` with its path and query intact.
Local tests do not verify Cloudflare's production TLS or edge cache behavior.

## Verified results

Local verification on 2026-11-09 used Node 24.22.1 and npm 11.19.1 on macOS.
`npm run build`, `npm run lint`, `npm test`, and `npm run test:built` passed.
Typecheck reported zero errors, warnings, and hints. All 70 unit tests passed.
`npm run cloudflare:deploy -- --dry-run` validated the bundle and 135 uploadable assets without a deployment.
The independent review found two gaps, preparation for clean-checkout development and PDF ranges. Both were fixed before these checks.

| Check | Live Vercel | Local Workers |
| --- | --- | --- |
| SSR pages and 21 tool pages, including slash and index aliases | 200 | 200 |
| Pagination and invalid page fallback | 200 | 200, matching title, heading, canonical, and navigation |
| Robots, sitemap, and llms.txt | 200 | 200, matching content types and static bytes |
| Missing paths and protected paths | 404 and 403 | 404 and 403 |
| HTTPS www redirects, 142 checked paths | 307 to apex | 307 to apex, matching paths and queries |
| HTTP apex and www | 308 to HTTPS | Raw Worker target matches. Wrangler proxy rewrites Location in curl. |
| Public assets and each build's referenced bundles | Resolve | Resolve. Public asset hashes match. |
| CSP, nosniff, and HSTS | Present on site responses | Same policy, also added to redirects and protected-path denials |
| Seven video and PDF range probes | 206, exact ranges | 206, matching lengths, types, and bytes |
| Complete KV Capsules video | 37,730,386 bytes | Same SHA-256 as live and the source file |
| Google Fonts | One stylesheet, 20 font files return 200 | Same unchanged external references |

The [full table](hosting-parity.md) covers 158 paths, including 77 route variants, 69 asset URLs, and 12 failure probes.
Generated bundle paths differ after removing Vercel packages. The report includes both builds' paths and requires each build's own references to resolve.
Authenticated GitHub API responses were not tested because no runtime GitHub secret was supplied.
The deterministic upstream-failure checks prove that the bundled fallbacks render successfully.

## Differences and cutover

Vercel Analytics, Speed Insights, and the Vercel custom analytics event for `/llms.txt` are removed.
Their Vercel-hosted collection endpoints are unavailable on this Worker. `/llms.txt` retains its text, cache policy, and structured request log.
Country logging now uses Cloudflare's `cf-ipcountry` header.

The site uses plain public image files, with no `<Image>` or `<Picture>` components or optimizer URLs in its pages.
Build-time image optimization remains available. The unused `/_image` endpoint serves original image bytes instead of performing Vercel's on-demand transforms.
Dynamic page cache headers retain `s-maxage=300` and `stale-while-revalidate=1800` from the source.
Vercel consumes those directives and exposes only `Cache-Control: public`; Wrangler exposes the complete policy.
This PR does not reproduce or claim to verify Vercel's edge caching on Cloudflare.
ETags, provider headers, and generated bundle hashes also differ. Public asset bytes remain unchanged.

After merge:

1. Connect Workers Builds with the settings above and disable non-production branch builds.
2. Configure the runtime secret and any public verification variables before the first production build.
3. Verify the resulting Worker URL, live data, videos, PDF, robots, sitemap, and 404.
4. Attach both domains separately during the planned cutover. Then verify certificate coverage, HTTP-to-HTTPS 308, and `www`-to-apex 301.
5. Repeat the parity checks against the production Worker and confirm cache behavior and analytics expectations.

DNS, domain attachments, production deployment, and Vercel project settings are outside this PR.
The existing Vercel deployment remains untouched. `vercel.json` remains in the repository.
