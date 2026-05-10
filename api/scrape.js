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

    let fileName = decodeURIComponent(manual.split("/").pop());
    const cleanName = fileName.replace(/(360p|480p|720p|1080p)/g, "");

    // 🔥 DOMAIN FINDER
    const baseCheck = "https://";
    let workingDomain = null;

    for (let i = 1; i <= 45; i++) {
      const testDomain = `https://${String(i).padStart(2, "0")}.teha416.online/`;
      const testUrl = testDomain + cleanName;

      try {
        const check = await fetch(testUrl, { method: "HEAD" });

        if (check.ok) {
          workingDomain = testDomain;
          break;
        }
      } catch (e) {
        // ignore failed domains
      }
    }

    if (!workingDomain) {
      return res.status(404).json({
        status: false,
        message: "No working domain found"
      });
    }

    const direct = {
      "480p": workingDomain + cleanName.replace(".mp4", "480p.mp4"),
      "720p": workingDomain + cleanName.replace(".mp4", "720p.mp4"),
      "1080p": workingDomain + cleanName.replace(".mp4", "1080p.mp4")
    };

    const baseDownload = "https://cine-fix.vercel.app/api/download?url=";

    const downloads = {
      "480p": baseDownload + encodeURIComponent(direct["480p"]),
      "720p": baseDownload + encodeURIComponent(direct["720p"]),
      "1080p": baseDownload + encodeURIComponent(direct["1080p"])
    };

    return res.status(200).json({
      status: true,
      creator: "Chathura",
      title: data.title,
      workingDomain,
      downloads
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}
