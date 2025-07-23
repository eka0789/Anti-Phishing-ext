chrome.webRequest.onBeforeRequest.addListener(
  async function (details) {
    const url = details.url;
    const features = extractURLFeatures(url);
    const verdict = predictPhishing(features);

    if (verdict === "phishing") {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon.png",
        title: "⚠️ Phishing Alert",
        message: `Akses ke situs berbahaya diblokir:\n${url}`
      });

      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
