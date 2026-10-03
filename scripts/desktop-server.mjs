import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createApp } from "../server/app.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

const server = createApp({ staticDir: resolve(root, "dist") }).listen(0, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`CRITTERARIUM_READY ${url}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
