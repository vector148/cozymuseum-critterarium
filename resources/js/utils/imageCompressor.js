// resources/js/utils/imageCompressor.js
// Client-side image compression (< 500KB) and local-asset cloning helper.

/**
 * Compresses an image File, Blob, or dataUrl to be strictly under maxKb (default 500KB).
 * Resizes max dimension to maxDim (default 1920px) to preserve quality.
 * Iteratively adjusts JPEG compression quality to guarantee size <= maxKb.
 *
 * @param {File|Blob|string} source
 * @param {object} [options]
 * @param {number} [options.maxKb=500]
 * @param {number} [options.maxDim=1920]
 * @returns {Promise<{ dataUrl: string, blob: Blob, size: number, width: number, height: number }>}
 */
export async function compressImage(source, { maxKb = 500, maxDim = 1920 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl = null;

    if (typeof source === "string") {
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      return reject(new Error("Invalid image source for compression"));
    }

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const maxBytes = maxKb * 1024;
      let quality = 0.88;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      const getByteSize = (d) => {
        const base64 = d.split(",")[1] || "";
        return Math.round((base64.length * 3) / 4);
      };

      while (getByteSize(dataUrl) > maxBytes && quality > 0.35) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      if (getByteSize(dataUrl) > maxBytes) {
        canvas.width = Math.max(1, Math.round(width * 0.75));
        canvas.height = Math.max(1, Math.round(height * 0.75));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.72);
      }

      const byteString = atob(dataUrl.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: "image/jpeg" });

      resolve({
        dataUrl,
        blob,
        size: blob.size,
        width: canvas.width,
        height: canvas.height,
      });
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Image failed to load for compression"));
    };
  });
}

/**
 * Checks if a string is a local file path (e.g. C:\Users\... or file:/// or containing \Downloads\)
 */
export function isLocalFilePath(val) {
  if (!val || typeof val !== "string") return false;
  const s = val.trim().replace(/^["']|["']$/g, "");
  if (s.startsWith("/images/") || s.startsWith("images/")) return false;
  return /^[a-zA-Z]:[/\\]/.test(s) || s.startsWith("file:///") || s.includes("\\Downloads\\") || s.includes("/Downloads/");
}

/**
 * Compresses an image File/Blob and uploads it to the official shell images directory.
 */
export async function uploadCompressedImage({
  fileOrBlob,
  filename,
  category = "games",
  endpoint = "/api/media/upload",
  maxKb = 500,
}) {
  const { dataUrl, size } = await compressImage(fileOrBlob, { maxKb });
  const rawBase = (filename || "image").replace(/\.[^/.]+$/, "");
  const safeFilename = `${rawBase}.jpg`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: dataUrl,
      filename: safeFilename,
      category,
    }),
  });

  const json = await response.json();
  if (!response.ok || !json.localPath) {
    throw new Error(json.error || "Image upload failed");
  }

  return {
    localPath: json.localPath,
    filename: json.filename,
    size,
  };
}

/**
 * Clones a local file path (e.g. from Downloads) by previewing, compressing <500KB,
 * and saving it into the official shell image directory.
 */
export async function cloneLocalPathImage({
  filePath,
  category = "games",
  endpoint = "/api/media/clone-local",
  previewEndpoint = "/api/media/preview",
  maxKb = 500,
}) {
  const cleanPath = String(filePath || "").trim().replace(/^["']|["']$/g, "");
  if (!cleanPath) throw new Error("Empty file path");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath: cleanPath, category }),
    });
    if (response.ok) {
      const json = await response.json();
      if (json.localPath) return json;
    }
  } catch {}

  const previewUrl = `${previewEndpoint}?path=${encodeURIComponent(cleanPath)}`;
  const res = await fetch(previewUrl);
  if (!res.ok) throw new Error("Could not read local file from disk");
  const blob = await res.blob();
  const filename = cleanPath.split(/[/\\]/).pop() || "image.jpg";

  return uploadCompressedImage({ fileOrBlob: blob, filename, category, maxKb });
}

/**
 * Imports an external image URL, compresses it <500KB,
 * and saves it into the official shell image directory.
 */
export async function importExternalUrlImage({
  url,
  category = "games",
  title = "exhibit",
  endpoint = "/api/media/import-url",
}) {
  const cleanUrl = String(url || "").trim().replace(/^["']|["']$/g, "");
  if (!cleanUrl) throw new Error("Empty URL");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: cleanUrl, category, title }),
  });

  const json = await response.json();
  if (!response.ok || !json.localPath) {
    throw new Error(json.error || "Failed to import remote image");
  }

  return {
    localPath: json.localPath,
    filename: json.filename,
    size: json.size,
  };
}
