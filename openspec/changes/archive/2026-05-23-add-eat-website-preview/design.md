## Context

Eat was previously kept source-only because the GitHub repository still declared `https://eat-tawny.vercel.app`, which returned `DEPLOYMENT_NOT_FOUND`. The user provided the current public site, `https://eat-ai.app`, and a live HTTP check returned 200.

## Goals / Non-Goals

**Goals:**

- Represent Eat as a live public web app.
- Add a screenshot preview using the existing image media pattern.
- Keep GitHub available as a secondary link.
- Remove stale deployment language from public and machine-readable surfaces.

**Non-Goals:**

- Do not rewrite Eat's product narrative beyond the status/link/media correction.
- Do not add a fake demo video.
- Do not infer adoption, users, revenue, or availability claims beyond the live website.

## Decisions

### Decision: Set Eat to a live public artifact

Because `https://eat-ai.app` loads successfully, Eat should use `status: 'live'`, expose `url: 'https://eat-ai.app'`, and use an install/action note that points to visiting the app.

### Decision: Use a website preview, not a demo

The available artifact is a landing/app screenshot, not a walkthrough. The detail page should render it through the existing image preview section so the page stays accurate and low-noise.

## Risks / Trade-offs

- Eat may still be an experiment despite being live -> Keep it in the Experiments category while changing only public access/status.
- Website screenshots can drift -> Store the current screenshot locally and refresh when the site changes materially.
