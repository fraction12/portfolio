## Overview
This change adds the first SEO layer the portfolio actually needs: canonical site identity, crawl discovery, structured data, and verification readiness.

The portfolio is already fast and mostly server-rendered or prerendered, which gives it good raw footing. The missing pieces are the signals that help search engines understand that `dushyantgarg.com` is the official site for Dushyant Garg and that the public pages should be indexed as the primary source.

## Design Goals
- own branded search first
- improve technical crawlability without bloating the site
- keep implementation simple and durable in Astro
- avoid marketing sludge and over-instrumentation

## Proposed Implementation

### 1. Canonical origin and page metadata
- set the production site origin explicitly in Astro config so canonical URLs and social URLs always resolve to `https://dushyantgarg.com`
- keep the shared layout as the metadata source of truth
- ensure each public page passes a unique, intentional title and description
- preserve existing Open Graph and Twitter card support, but make sure they derive from the canonical production origin

### 2. Crawl discovery artifacts
- generate a sitemap at a stable canonical URL
- expose a `robots.txt` that allows public crawling and points to the sitemap
- include only intended public pages in discovery artifacts

Preferred implementation path:
- use Astro's sitemap integration where possible
- generate `robots.txt` from a small explicit source rather than a brittle static copy

### 3. Structured data
Add JSON-LD to the home page or shared layout for:
- `Person` representing Dushyant Garg
- `WebSite` representing the canonical portfolio

The structured data should include:
- name
- url
- description
- `sameAs` links for major public profiles like GitHub, LinkedIn, and Substack

Keep this first pass intentionally narrow. We do not need a sprawling schema zoo.

### 4. Verification readiness
Support search engine ownership verification through configuration, so the site can emit verification tags when tokens are present without code edits.

Preferred implementation path:
- optional public env vars for Google and Bing verification tokens
- shared layout emits verification meta tags only when configured

### 5. Operator documentation
Add a short doc covering:
- where to add verification tokens
- how to submit the sitemap to Google Search Console and Bing Webmaster Tools
- how to validate structured data and indexing artifacts after deploy

## Tradeoffs
- We are deliberately prioritizing branded/entity SEO over broad keyword SEO. That is the highest-return move for this site.
- We are not adding heavy SEO plugins or third-party tracking products. The site does not need them.
- We are not forcing dedicated per-project landing pages in this change. That can come later if needed.

## Risks
- incorrect canonical host configuration could cause mixed canonicals between preview and production
- overusing default metadata would dilute page intent
- invalid JSON-LD would create the appearance of SEO work without actual benefit

## Verification Plan
- build passes locally
- generated output contains canonical tags for production host
- generated output exposes `robots.txt` and sitemap
- home page contains valid `Person` and `WebSite` JSON-LD
- optional verification tags render only when corresponding config is provided
