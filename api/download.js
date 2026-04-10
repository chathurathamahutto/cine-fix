import fetch from "node-fetch";

globalThis.fetch = globalThis.fetch || fetch;

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("No URL provided");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://cinesubz.lk/"
      }
    });

    if (!response.ok) {
      return res.status(500).send("Failed to fetch file");
    }

    // 🔥 GET FILE SIZE
    const contentLength = response.headers.get("content-length");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    // filename
    let fileName = decodeURIComponent(url.split("/").pop() || "video.mp4");

    fileName = fileName
      .replace(/\s+/g, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/[^a-zA-Z0-9()._-]/g, "");

    fileName = `[Chdev]${fileName}`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Accept-Ranges", "bytes");

    // optional: expose size to frontend (useful for UI)
    res.setHeader("X-File-Size", contentLength || "unknown");

    response.body.pipe(res);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).send("Server error");
  }
}
