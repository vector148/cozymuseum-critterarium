import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createApp } from "../../server/app.js";

test("installed desktop server serves the showroom and local catalog on one loopback origin", async (t) => {
  const staticDir = mkdtempSync(join(tmpdir(), "critterarium-desktop-site-"));
  const dataDir = mkdtempSync(join(tmpdir(), "critterarium-desktop-data-"));
  const previousDataDir = process.env.COZYMUSEUM_DATA_DIR;
  process.env.COZYMUSEUM_DATA_DIR = dataDir;
  writeFileSync(join(staticDir, "index.html"), "<main>Critterarium desktop showroom</main>");
  const server = createApp({ staticDir }).listen(0, "127.0.0.1");
  t.after(() => {
    server.close();
    if (previousDataDir === undefined) delete process.env.COZYMUSEUM_DATA_DIR;
    else process.env.COZYMUSEUM_DATA_DIR = previousDataDir;
    rmSync(staticDir, { recursive: true, force: true });
    rmSync(dataDir, { recursive: true, force: true });
  });
  await new Promise((resolveListening) => server.once("listening", resolveListening));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const [site, catalog] = await Promise.all([
    fetch(`${origin}/`),
    fetch(`${origin}/api/atlas/organisms?wingId=fauna&locale=en`),
  ]);
  assert.equal(site.status, 200);
  assert.match(await site.text(), /Critterarium desktop showroom/);
  assert.equal(catalog.status, 200);
  assert.equal((await catalog.json()).total, 0);
});
