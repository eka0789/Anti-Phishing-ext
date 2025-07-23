document.getElementById("checkCurrent").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const features = extractURLFeatures(tab.url);
    const model = await fetch(chrome.runtime.getURL("model/svm_model.json")).then(res => res.json());
    const result = predictPhishing(features, model);

    document.getElementById("result").innerText =
      result === "phishing"
        ? "⚠️ URL ini terindikasi phishing!"
        : "✅ URL ini aman.";
  });
});
