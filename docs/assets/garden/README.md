# Night garden assets

Original botanical night-garden artwork for the arched portfolio hero, generated with the built-in imagegen tool. Assets are in [`public/garden`](../../../public/garden/), available at `/garden/` when deployed. This commit supplies the artwork; `CoverHero.astro` and `garden.js` still use the existing procedural canvas renderer.

## Contents

- `garden-full.png`: full composed scene, 2000 × 3000.
- `layer-1-sky.png` through `layer-5-foreground.png`: five aligned depth layers at 2000 × 3000. The sky fills the frame; the other layers have alpha transparency.
- `layer-5-foreground-clean.png`: the foreground without insects, for independent sprite animation.
- `butterfly-swallowtail.png`, `butterfly-admiral.png`, `butterfly-blue.png`: open-wing poses, each 600 × 600 with transparency.
- The matching `*-closed.png` files: half-closed wing poses on the same canvas.
- `dragonfly.png` and `bee.png`: transparent 600 × 600 sprites.
- `garden-preview-arch.png`: transparent 600 × 900 arched preview, with no painted window frame or bars.
- `garden-manifest.json`: stack order, dimensions, insect positions and rotations, and parallax notes.

All PNGs are sRGB. The garden layers were generated at 1024 × 1536 and upscaled to 2000 × 3000 using Core Graphics. They are source-quality assets; prepare appropriately sized, compressed derivatives before loading several layers in the browser.

## Compositing

Draw layers 1 through 5 in numerical order, at the same size and top-left position, with normal source-over blending and 100% element opacity. Layer 5 already includes the five insects. To animate them separately, replace it with `layer-5-foreground-clean.png` and draw the individual sprites using the manifest coordinates; otherwise the insects will appear twice.

The delivered full scene was assembled from the saved layer PNGs. Re-rendering those files with the same sRGB Core Graphics compositor produced a pixel-identical result. Other compositors can differ slightly in color management or rounding. Export dimensions, color space, alpha ranges and SHA-256 hashes are recorded in [`validation.json`](validation.json).

The sky is painted behind the landscape; the distance extends under the lawn; the lawn continues behind the botanical layers. For parallax, clip all layers to the same window and use centered overscan to cover the outer canvas edges. Static inspection used a 1.08 scale and opposite offsets up to 60 source pixels horizontally and 36 vertically. Use smaller travel in the hero. This is static image validation, not a browser animation test.

The preview uses a semicircular upper arch with a spring line at y=300 on its 600 × 900 canvas. The horizontal window bar is expected at 34% height and the upper vertical bar at the horizontal center. The moon, flower heads and insects were checked against these guides. The artwork has no painted text, logos or frame.

## Generation record

[`generation-prompts.json`](generation-prompts.json) records the prompts used for the original composition study, depth layers and insect poses. Reference identifiers are portable asset names; machine-local paths are omitted. The composition study was used to keep the independently generated layers consistent; the final full scene is the composite of the delivered layers.
