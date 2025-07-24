// Import model dan fitur ekstraksi setelah kita buat file-nya
let modelData = null;

// Load model JSON saat service worker aktif
fetch(chrome.runtime.getURL("model/svm_model.json"))
  .then(res => res.json())
  .then(json => {
    modelData = json;
  })
  .catch(err => {
    console.error("Gagal load model SVM:", err);
  });

function extractURLFeatures(url) {
  const suspiciousWords = ["secure", "confirm", "account", "update", "login", "ebayisapi", "banking"];
  return {
    length: url.length,
    count_at: (url.match(/@/g) || []).length,
    count_dash: (url.match(/-/g) || []).length,
    count_doubleSlash: (url.match(/\/\//g) || []).length,
    suspicious_word_count: suspiciousWords.filter(word => url.toLowerCase().includes(word)).length,
    has_https: url.startsWith("https://") ? 1 : 0
  };
}

function predictPhishing(features, model) {
  let score = model.bias;
  for (let key in model.weights) {
    score += model.weights[key] * features[key];
  }
  return score > 0 ? "phishing" : "legit";
}

chrome.webRequest.onBeforeRequest.addListener(
  async function (details) {
    if (!modelData) return { cancel: false };

    const url = details.url;

    const features = extractURLFeatures(url);
    const verdict = predictPhishing(features, modelData);

    if (verdict === "phishing") {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon.png",
        title: "⚠️ Phishing Alert",
        message: `Situs ini mencurigakan:\n${url}`
      });

      console.warn("[🚫 Blokir] URL phishing:", url);
      return { cancel: true }; // BLOKIR akses ke situs
    }

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
