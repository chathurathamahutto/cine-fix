export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false, message: "No URL provided" });
  }

  try {
    const api = `https://karicine.netlify.app/.netlify/functions/scrapper?url=${url}`;

    const response = await fetch(api);
    const data = await response.json();

    const manual = data?.links?.manual;

    if (!manual) {
      return res.status(500).json({ status: false, message: "No manual link" });
    }

    // 🔥 FORCE YOUR DOMAIN
    const newDomain = "https://06.sume321.online/";
    const baseDownload = "https://cine-fix.vercel.app/api/download?url=";

    // filename
    let fileName = decodeURIComponent(manual.split("/").pop());

    // extract base movie name (remove quality)
    const cleanName = fileName.replace(/(360p|480p|720p|1080p)/g, "");

    // 🔥 BUILD YOUR OWN LINKS (NO OLD DOMAIN)
    const direct = {
      "480p": newDomain + cleanName.replace(".mp4", "480p.mp4"),
      "720p": newDomain + cleanName.replace(".mp4", "720p.mp4"),
      "1080p": newDomain + cleanName.replace(".mp4", "1080p.mp4")
    };

    const downloads = {
      "480p": baseDownload + encodeURIComponent(direct["480p"]),
      "720p": baseDownload + encodeURIComponent(direct["720p"]),
      "1080p": baseDownload + encodeURIComponent(direct["1080p"])
    };

    return res.status(200).json({
      status: true,
      creator: "Chathura",
      title: data.title,
      downloads
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}
