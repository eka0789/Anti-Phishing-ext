// Sama seperti background, kita reimplement feature extraction dan prediction
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

// Render result to popup
async function checkCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  document.getElementById("url").innerText = url;

  try {
    const model = await fetch(chrome.runtime.getURL("model/svm_model.json")).then(res => res.json());
    const features = extractURLFeatures(url);
    const result = predictPhishing(features, model);

    const resultDiv = document.getElementById("result");
    if (result === "phishing") {
      resultDiv.textContent = "⚠️ TERINDIKASI PHISHING!";
      resultDiv.className = "phishing";
    } else {
      resultDiv.textContent = "✅ Aman diakses";
      resultDiv.className = "safe";
    }
  } catch (err) {
    console.error("Gagal deteksi:", err);
    document.getElementById("result").textContent = "Gagal mendeteksi URL.";
  }
}

// Event tombol recheck
document.getElementById("recheck").addEventListener("click", checkCurrentTab);

// Jalankan saat popup dibuka
checkCurrentTab();
