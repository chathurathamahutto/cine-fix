export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("No URL provided");
  }

  try {
    // 🔥 IMPORTANT FIX: decode URL
    const cleanUrl = decodeURIComponent(url);

    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(500).send("Failed to fetch file");
    }

    const buffer = await response.arrayBuffer();

    let fileName = cleanUrl.split("/").pop();

    fileName = `[Chdev]${fileName}`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "video/mp4");

    return res.send(Buffer.from(buffer));

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}
