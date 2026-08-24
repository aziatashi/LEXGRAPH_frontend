/* LexGraph — service seam. The only file that "talks to the backend."
   Everything here is mocked today; sendMessage/uploadDocument wrap the
   existing mock logic unchanged in behavior. translateText is a real
   integration point (Google Translate v2) that stays inert until
   API_KEY is set — it must never throw and never block the chat. */

var API_KEY = ""; // set this to enable live translation via translate.googleapis.com

function sendMessage(text) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(pickAnswer(text)); }, 2200);
  });
}

function uploadDocument(file) {
  var url = null;
  try {
    if (typeof URL !== "undefined" && URL.createObjectURL) url = URL.createObjectURL(file);
  } catch (e) {}
  return Promise.resolve({ name: file.name, url: url, type: file.type || "" });
}

function translateText(text, targetLocale, sourceLocale) {
  if (!API_KEY) {
    console.warn("[api] translateText: no API key configured — returning original text");
    return Promise.resolve(text);
  }
  var url = "https://translation.googleapis.com/language/translate/v2?key=" + encodeURIComponent(API_KEY);
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, target: targetLocale, source: sourceLocale, format: "text" })
  }).then(function (res) {
    if (!res.ok) throw new Error("translate HTTP " + res.status);
    return res.json();
  }).then(function (data) {
    return data.data.translations[0].translatedText;
  }).catch(function (err) {
    console.warn("[api] translateText failed, falling back to original text:", err);
    return text;
  });
}
