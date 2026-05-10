async function checkUrl(url, timeout = 5000) {
  return new Promise((resolve) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal
    })
      .then(res => {
        clearTimeout(timer);
        if (res.ok) resolve(true);
        else resolve(false);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(false);
      });
  });
}

export default async function handler(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({
      status: false,
      message: "filename required"
    });
  }

  try {
    const base = "https://";

    // build all domains
    const domains = Array.from({ length: 45 }, (_, i) =>
      `${base}${String(i + 1).padStart(2, "0")}.teha416.online/`
    );

    const testUrl = (domain) => domain + filename;

    // 🚀 parallel check (FAST)
    const results = await Promise.allSettled(
      domains.map(async (domain) => {
        const url = testUrl(domain);
        const ok = await checkUrl(url);
        return ok ? domain : null;
      })
    );

    const working = results
      .map(r => r.status === "fulfilled" ? r.value : null)
      .find(d => d);

    if (!working) {
      return res.status(404).json({
        status: false,
        message: "No working domain found"
      });
    }

    const finalUrl = working + filename;

    return res.status(200).json({
      status: true,
      workingDomain: working,
      url: finalUrl
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error"
    });
  }
}
