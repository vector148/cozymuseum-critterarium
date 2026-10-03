import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createApp } from "../server/app.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

const server = createApp({ staticDir: resolve(root, "dist") }).listen(0, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`CRITTERARIUM_READY ${url}`);
  if (process.env.COZYMUSEUM_NO_BROWSER === "1") return;
  const opener = spawn("cmd.exe", ["/d", "/c", "start", "", url], {
    windowsHide: true,
    stdio: "ignore",
  });
  opener.unref();
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
