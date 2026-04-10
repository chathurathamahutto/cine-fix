export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false });
  }

  try {
    const api = `https://karicine.netlify.app/.netlify/functions/scrapper?url=${url}`;

    const response = await fetch(api);
    const data = await response.json();

    const manual = data?.links?.manual;

    const newDomain = "https://06.sume321.online/";

    let fileName = decodeURIComponent(manual.split("/").pop());

    const cleanBase = fileName
      .replace(/360p|480p|720p|1080p/g, "")
      .replace(/\.mp4/g, "");

    const build = (q) => {
      const rawUrl =
        newDomain +
        cleanBase.trim() +
        q +
        ".mp4";

      // 🔥 IMPORTANT FIX
      return encodeURI(`https://karicine.vercel.app/api/download?url=${rawUrl}`);
    };

    return res.json({
      status: true,
      creator: "Chathura",
      title: data.title,
      downloads: {
        "480p": build("480p"),
        "720p": build("720p"),
        "1080p": build("1080p")
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}
