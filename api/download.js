export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("No URL provided");
  }

  try {
    // 🔥 STEP 1: decode incoming url
    const decodedUrl = decodeURIComponent(url);

    // 🔥 STEP 2: SAFE encode only path part
    const safeUrl = new URL(decodedUrl);
    const finalUrl =
      safeUrl.origin +
      safeUrl.pathname
        .split("/")
        .map(seg => encodeURIComponent(seg))
        .join("/");

    // 🔥 FETCH FILE
    const response = await fetch(finalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://cinesubz.lk/"
      }
    });

    if (!response.ok) {
      return res.status(500).json({
        status: false,
        message: "Remote server blocked or file not found"
      });
    }

    const buffer = await response.arrayBuffer();

    let fileName = finalUrl.split("/").pop();
    fileName = `[Chdev]${fileName}`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "video/mp4");

    return res.send(Buffer.from(buffer));

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);

    return res.status(500).json({
      status: false,
      message: "Server error"
    });
  }
}
