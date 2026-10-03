import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

test("Windows app icon keeps the sidebar mark on a transparent canvas", async () => {
  const { data, info } = await sharp(fileURLToPath(new URL("../src-tauri/icons/icon.png", import.meta.url)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 512);
  assert.equal(info.height, 512);
  const alpha = (x, y) => data[(y * info.width + x) * info.channels + 3];
  assert.equal(alpha(0, 0), 0);
  assert.equal(alpha(511, 511), 0);
  assert.equal(alpha(256, 0), 0);
  assert.ok(data.filter((_, index) => index % info.channels === 3 && data[index] > 200).length > 10_000);
});
