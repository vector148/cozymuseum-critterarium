import { Router } from "express";
import { existsSync, createReadStream, statSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = resolve(moduleDir, "../../../../images");

const router = Router();

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

function sanitizeFilename(value) {
  const cleaned = String(value || "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "_")
    .replace(/[. ]+$/g, "")
    .trim();
  return cleaned || "untitled";
}

// GET /api/media/preview?path=...
router.get("/preview", async (req, res) => {
  try {
    let rawPath = String(req.query.path || "").trim();
    if ((rawPath.startsWith('"') && rawPath.endsWith('"')) || (rawPath.startsWith("'") && rawPath.endsWith("'"))) {
      rawPath = rawPath.slice(1, -1).trim();
    }
    if (!rawPath) return res.status(400).json({ error: "Missing path parameter" });

    if (/^https?:\/\//i.test(rawPath)) {
      try {
        let imageUrl = rawPath;
        let parsed = new URL(imageUrl);
        let response = await fetch(imageUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,text/html,*/*;q=0.8",
            "Referer": `${parsed.origin}/`,
          },
          redirect: "follow",
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("text/html")) {
            const html = await response.text();
            const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                            html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
            if (ogMatch && ogMatch[1]) {
              let extracted = ogMatch[1].trim();
              if (extracted.startsWith("/")) {
                extracted = `${parsed.origin}${extracted}`;
              }
              imageUrl = extracted;
              parsed = new URL(imageUrl);
              response = await fetch(imageUrl, {
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                  "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,text/html,*/*;q=0.8",
                  "Referer": `${parsed.origin}/`,
                },
                redirect: "follow",
              });
            }
          }
        }

        if (!response.ok) return res.status(response.status).json({ error: "Remote image fetch failed" });
        const contentType = response.headers.get("content-type") || "image/jpeg";
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        const arrayBuf = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuf));
      } catch (err) {
        return res.status(502).json({ error: err.message });
      }
    }

    let targetPath = rawPath;
    if (/^file:\/\/\//i.test(targetPath)) {
      try {
        targetPath = fileURLToPath(targetPath);
      } catch {}
    }

    targetPath = resolve(targetPath);

    if (!existsSync(targetPath)) {
      const inImages = resolve(IMAGES_ROOT, rawPath.replace(/^\/?images\//, ""));
      if (existsSync(inImages)) {
        targetPath = inImages;
      } else {
        return res.status(404).json({ error: "File not found" });
      }
    }

    const stat = statSync(targetPath);
    if (!stat.isFile()) {
      return res.status(400).json({ error: "Target is not a file" });
    }

    const ext = extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "image/jpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Cache-Control", "no-cache");
    const stream = createReadStream(targetPath);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/media/upload
router.post("/upload", async (req, res) => {
  try {
    const { data, filename = "organism.jpg", category = "catalog/uploads" } = req.body || {};
    if (!data) return res.status(400).json({ error: "Missing image data" });

    let base64Data = data;
    let ext = extname(filename).toLowerCase() || ".jpg";
    if (data.startsWith("data:")) {
      const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches) {
        const mime = matches[1];
        if (mime === "image/png") ext = ".png";
        else if (mime === "image/webp") ext = ".webp";
        else if (mime === "image/gif") ext = ".gif";
        else ext = ".jpg";
        base64Data = matches[2];
      }
    }

    let buffer = Buffer.from(base64Data, "base64");
    if (!buffer.length || buffer.length > 50 * 1024 * 1024) {
      return res.status(400).json({ error: "Invalid file size" });
    }

    if (buffer.length > 500 * 1024) {
      try {
        const sharp = (await import("sharp")).default;
        buffer = await sharp(buffer)
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();
        if (buffer.length > 500 * 1024) {
          buffer = await sharp(buffer).jpeg({ quality: 65, mozjpeg: true }).toBuffer();
        }
        ext = ".jpg";
      } catch (err) {
        console.warn("Upload compression warning:", err.message);
      }
    }

    const targetSubdir = category || "catalog/uploads";
    const rawBase = sanitizeFilename(basename(filename, extname(filename)));
    const targetDir = resolve(IMAGES_ROOT, targetSubdir);
    mkdirSync(targetDir, { recursive: true });

    let safeName = `${rawBase}${ext}`;
    let counter = 1;
    while (existsSync(resolve(targetDir, safeName))) {
      safeName = `${rawBase}-${counter}${ext}`;
      counter++;
    }

    const targetFile = resolve(targetDir, safeName);
    writeFileSync(targetFile, buffer);

    const localPath = `/images/${targetSubdir}/${safeName}`;
    res.json({ ok: true, localPath, filename: safeName, size: buffer.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/media/clone-local
router.post("/clone-local", async (req, res) => {
  try {
    let { filePath, category = "catalog/uploads" } = req.body || {};
    if (!filePath) return res.status(400).json({ error: "Missing filePath" });

    filePath = String(filePath).trim();
    if ((filePath.startsWith('"') && filePath.endsWith('"')) || (filePath.startsWith("'") && filePath.endsWith("'"))) {
      filePath = filePath.slice(1, -1).trim();
    }

    let targetPath = filePath;
    if (/^file:\/\/\//i.test(targetPath)) {
      try {
        targetPath = fileURLToPath(targetPath);
      } catch {}
    }
    targetPath = resolve(targetPath);

    if (!existsSync(targetPath)) {
      const inImages = resolve(IMAGES_ROOT, filePath.replace(/^\/?images\//, ""));
      if (existsSync(inImages)) {
        targetPath = inImages;
      } else {
        return res.status(404).json({ error: "Source local file not found" });
      }
    }

    const targetSubdir = category || "catalog/uploads";
    const ext = extname(targetPath).toLowerCase() || ".jpg";
    const rawBase = sanitizeFilename(basename(targetPath, ext));
    const targetDir = resolve(IMAGES_ROOT, targetSubdir);
    mkdirSync(targetDir, { recursive: true });

    let safeName = `${rawBase}${ext}`;
    let counter = 1;
    while (existsSync(resolve(targetDir, safeName))) {
      safeName = `${rawBase}-${counter}${ext}`;
      counter++;
    }

    const targetFile = resolve(targetDir, safeName);

    const sharp = (await import("sharp")).default;
    let buffer = await sharp(targetPath)
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    if (buffer.length > 500 * 1024) {
      buffer = await sharp(buffer).jpeg({ quality: 65, mozjpeg: true }).toBuffer();
    }

    writeFileSync(targetFile, buffer);

    const localPath = `/images/${targetSubdir}/${safeName}`;
    res.json({ ok: true, localPath, filename: safeName, size: buffer.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/media/import-url
router.post("/import-url", async (req, res) => {
  try {
    const { url, category = "catalog/uploads", title = "organism" } = req.body || {};
    if (!url) return res.status(400).json({ error: "Missing image URL" });

    let imageUrl = String(url).trim().replace(/^["']|["']$/g, "");
    let parsed = new URL(imageUrl);

    let response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,text/html,*/*;q=0.8",
        "Referer": `${parsed.origin}/`,
      },
      redirect: "follow",
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        const html = await response.text();
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                        html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
        if (ogMatch && ogMatch[1]) {
          let extracted = ogMatch[1].trim();
          if (extracted.startsWith("/")) {
            extracted = `${parsed.origin}${extracted}`;
          }
          imageUrl = extracted;
          parsed = new URL(imageUrl);
          response = await fetch(imageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "Referer": `${parsed.origin}/`,
            },
            redirect: "follow",
          });
        }
      }
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: `Asset request failed with HTTP ${response.status}` });
    }

    let ext = ".jpg";
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("png")) ext = ".png";
    else if (contentType.includes("webp")) ext = ".webp";
    else if (contentType.includes("gif")) ext = ".gif";

    let buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) return res.status(400).json({ error: "Empty image data" });

    const sharp = (await import("sharp")).default;
    buffer = await sharp(buffer)
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    if (buffer.length > 500 * 1024) {
      buffer = await sharp(buffer).jpeg({ quality: 65, mozjpeg: true }).toBuffer();
    }
    ext = ".jpg";

    const targetSubdir = category || "catalog/uploads";
    const rawBase = sanitizeFilename(title || basename(new URL(imageUrl).pathname, extname(new URL(imageUrl).pathname)) || "cover");
    const targetDir = resolve(IMAGES_ROOT, targetSubdir);
    mkdirSync(targetDir, { recursive: true });

    let safeName = `${rawBase}${ext}`;
    let counter = 1;
    while (existsSync(resolve(targetDir, safeName))) {
      safeName = `${rawBase}-${counter}${ext}`;
      counter++;
    }

    const targetFile = resolve(targetDir, safeName);
    writeFileSync(targetFile, buffer);

    const localPath = `/images/${targetSubdir}/${safeName}`;
    res.json({ ok: true, localPath, filename: safeName, size: buffer.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
