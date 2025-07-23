export function extractURLFeatures(url) {
  const suspiciousWords = ["secure", "confirm", "account", "update", "webscr", "login", "ebayisapi", "banking"];
  return {
    length: url.length,
    count_at: (url.match(/@/g) || []).length,
    count_dash: (url.match(/-/g) || []).length,
    count_doubleSlash: (url.match(/\/\//g) || []).length,
    suspicious_word_count: suspiciousWords.filter(word => url.includes(word)).length,
    has_https: url.startsWith("https://") ? 1 : 0
  };
}
