## 1. Research

- [x] 1.1 Query GitHub repository metadata for catalog artifacts with public repos
- [x] 1.2 Verify which homepage URLs are working public websites
- [x] 1.3 Exclude dead, missing, and GitHub README-only homepages from screenshot work

## 2. Media Assets

- [x] 2.1 Capture agentplan website screenshot
- [x] 2.2 Capture agentrem website screenshot
- [x] 2.3 Optimize screenshots into `public/tool-media/{slug}/{slug}-preview.jpg`

## 3. Portfolio Wiring

- [x] 3.1 Add verified website URLs to agentplan and agentrem artifacts
- [x] 3.2 Add ready image preview media to agentplan and agentrem detail overrides
- [x] 3.3 Update tests to assert the new preview media and website links

## 4. Verification

- [x] 4.1 Run `openspec validate add-repo-website-previews --json`
- [x] 4.2 Run `npm test`
- [x] 4.3 Run `npm run build`
- [x] 4.4 Browser-check `/tools/agentplan` and `/tools/agentrem` for links, screenshots, and no noisy placeholder copy
- [x] 4.5 Update this task list truthfully
