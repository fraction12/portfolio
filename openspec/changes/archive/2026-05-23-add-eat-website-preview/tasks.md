## 1. Verification

- [x] 1.1 Verify `https://eat-ai.app` loads successfully
- [x] 1.2 Capture a desktop screenshot of the Eat website
- [x] 1.3 Optimize the screenshot into `public/tool-media/eat/eat-preview.jpg`

## 2. Implementation

- [x] 2.1 Update Eat artifact URL, status, and action copy
- [x] 2.2 Update Eat detail page status note and preview media
- [x] 2.3 Update machine-readable summary to include the Eat website
- [x] 2.4 Update tests for the Eat website and preview

## 3. Verification

- [x] 3.1 Run `openspec validate add-eat-website-preview --json`
- [x] 3.2 Run `npm test`
- [x] 3.3 Run `npm run build`
- [x] 3.4 Browser-check `/tools/eat` for the website link, preview image, and no stale deployment copy
- [x] 3.5 Archive the completed OpenSpec change
