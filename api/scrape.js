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

    const newDomain = "https://06.sume321.online/";

    // 🔥 extract file name
    let fileName = decodeURIComponent(manual.split("/").pop());

    // remove old quality if exists
    const cleanBase = fileName
      .replace(/360p|480p|720p|1080p/g, "")
      .replace(".mp4", "");

    // 🔥 build clean filenames
    const buildLink = (q) => {
      return newDomain + cleanBase.trim() + "-" + q + ".mp4";
    };

    // 🔥 FINAL DOWNLOAD LINKS (NO encode)
    const downloads = {
      "480p": `https://karicine.vercel.app/api/download?url=${buildLink("480p")}`,
      "720p": `https://karicine.vercel.app/api/download?url=${buildLink("720p")}`,
      "1080p": `https://karicine.vercel.app/api/download?url=${buildLink("1080p")}`
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
