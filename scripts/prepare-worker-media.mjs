import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

const publicRoot = new URL('../public/', import.meta.url);
const outputRoot = new URL('_worker-media/', publicRoot);
const sourcePath = 'tool-media/kv-capsules-pti/kv-capsules-pti-explainer.mp4';
const chunkSize = 20 * 1024 * 1024;
const bytes = await readFile(new URL(sourcePath, publicRoot));
const chunks = [];
await mkdir(outputRoot, { recursive: true });

for (let start = 0, index = 0; start < bytes.length; start += chunkSize, index++) {
  const chunk = bytes.subarray(start, start + chunkSize);
  const name = `kv-capsules-pti-${index}.bin`;
  await writeFile(new URL(name, outputRoot), chunk);
  chunks.push({ path: `/_worker-media/${name}`, size: chunk.length });
}

const manifest = [{
  path: `/${sourcePath}`,
  size: bytes.length,
  contentType: 'video/mp4',
  etag: `"${createHash('sha256').update(bytes).digest('hex')}"`,
  chunks,
}];
const mediaRoot = new URL('tool-media/', publicRoot);
for (const name of await readdir(mediaRoot, { recursive: true })) {
  const mediaPath = 'tool-media/' + name;
  const contentType = name.endsWith('.mp4') ? 'video/mp4' : name.endsWith('.pdf') ? 'application/pdf' : null;
  if (!contentType || mediaPath === sourcePath) continue;
  const media = await readFile(new URL(mediaPath, publicRoot));
  manifest.push({
    path: '/' + mediaPath,
    size: media.length,
    contentType,
    etag: `"${createHash('sha256').update(media).digest('hex')}"`,
    chunks: [{ path: '/' + mediaPath, size: media.length }],
  });
}
await writeFile(new URL('manifest.json', outputRoot), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared ${chunks.length} media assets for ${sourcePath}, preserving ${bytes.length} bytes.`);
