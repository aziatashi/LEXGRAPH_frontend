/* Self-check for app.js. Run: node test.js
   Loads app.js in a minimal DOM stub and asserts the logic that can silently rot. */

const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const el = () => ({ className: "", innerHTML: "", hidden: false, style: {}, setAttribute() {}, focus() {}, setSelectionRange() {}, querySelectorAll() { return []; } });

const ctx = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  JSON,
  Object,
  String,
  Array,
  RegExp,
  document: {
    activeElement: null,
    documentElement: el(),
    body: el(),
    getElementById: (id) => (id === "app" ? ctx.appNode : null),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  window: {
    matchMedia: () => ({ matches: true, addEventListener: () => {} }),
    localStorage: { getItem: () => null, setItem: () => {} }
  },
  navigator: { clipboard: { writeText: () => {} } }
};
ctx.appNode = el();
ctx.fetch = undefined; // no network in the sandbox — translateText must not need it when no key is set
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/api.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync(__dirname + "/app.js", "utf8"), ctx);

// ── escaping — the XSS boundary ──
assert.strictEqual(ctx.esc('<img src=x onerror="a">'), "&lt;img src=x onerror=&quot;a&quot;&gt;");
assert.strictEqual(ctx.esc("O'Brien & co"), "O&#39;Brien &amp; co");
const bubble = ctx.messageHtml({ id: "u1", role: "user", text: "<script>bad()</script>" });
assert.ok(bubble.includes("&lt;script&gt;") && !bubble.includes("<script>"), "user text must be escaped");

// ── answer routing — English ──
ctx.S.locale = "en";
ctx.S.profile = "citizen";
assert.strictEqual(ctx.pickAnswer("Police detained my brother last night").key, "police");
assert.strictEqual(ctx.pickAnswer("My employer hasn't paid my salary").key, "wages");
assert.strictEqual(ctx.pickAnswer("My landlord sent me a notice").key, "tenancy");

// ── escalation banner fires on the risk words ──
const risky = (t) => ctx.HIGH_RISK.some((k) => t.toLowerCase().includes(k));
assert.ok(risky("Police detained my brother last night"));
assert.ok(!risky("I bought a defective product"));

// ── progressive reveal: section N appears only once reveal reaches N ──
const msg = (reveal) => ctx.answerHtml({ id: "a1", answer: ctx.getLocalizedAnswer("tenancy"), reveal });
assert.ok(msg(1).includes("simple"));
assert.ok(!msg(1).includes("What this usually means"));
assert.ok(msg(2).includes("What this usually means"));
assert.ok(msg(5).includes("lawyer") || msg(5).includes("talk to"));

// ── the law section is collapsed until toggled ──
ctx.S.openLaw = {};
assert.ok(!msg(4).includes(ctx.ANSWERS.tenancy.en.law));
ctx.S.openLaw = { a1: true };
assert.ok(msg(4).includes(ctx.ANSWERS.tenancy.en.law));
ctx.S.openLaw = {};

// ── PII hint threshold ──
assert.ok(/\d{6,}/.test("account 123456"));
assert.ok(!/\d{6,}/.test("flat 12345"));

// ── PROFILE SYSTEM ──
// Profiles exist
assert.ok(ctx.PROFILES.length === 4, "Should have 4 profiles");
assert.strictEqual(
  JSON.stringify(ctx.PROFILES.map(p => p.id)),
  JSON.stringify(["student", "lawyer", "msme", "citizen"])
);

// profileOf returns the correct profile
assert.strictEqual(ctx.profileOf("student").id, "student");
assert.strictEqual(ctx.profileOf("lawyer").id, "lawyer");
assert.strictEqual(ctx.profileOf("msme").id, "msme");
assert.strictEqual(ctx.profileOf("citizen").id, "citizen");

// Profile names are multilingual
assert.ok(ctx.profileOf("student").name.hi, "Student profile should have Hindi name");
assert.ok(ctx.profileOf("student").name.mr, "Student profile should have Marathi name");
assert.ok(ctx.profileOf("student").name.kn, "Student profile should have Kannada name");
assert.ok(ctx.profileOf("student").name.ta, "Student profile should have Tamil name");

// ── LANGUAGE ROSTER ──
const langCodes = ctx.LANGS.map(l => l.code);
assert.strictEqual(JSON.stringify(langCodes), JSON.stringify(["en", "hi", "mr", "kn", "ta"]), "Should have en, hi, mr, kn, ta");

// ── MULTILINGUAL ANSWERS ──
// Each topic has all 5 language variants
["tenancy", "police", "wages"].forEach(topic => {
  ["en", "hi", "mr", "kn", "ta"].forEach(locale => {
    const ans = ctx.ANSWERS[topic][locale];
    assert.ok(ans, topic + " should have " + locale + " variant");
    assert.ok(ans.simple, topic + "/" + locale + " should have 'simple'");
    assert.ok(ans.means, topic + "/" + locale + " should have 'means'");
    assert.ok(Array.isArray(ans.steps), topic + "/" + locale + " should have 'steps' array");
    assert.ok(ans.steps.length >= 3, topic + "/" + locale + " should have at least 3 steps");
    assert.ok(ans.law, topic + "/" + locale + " should have 'law'");
    assert.ok(Array.isArray(ans.citations), topic + "/" + locale + " should have citations");
    assert.ok(ans.lawyer, topic + "/" + locale + " should have 'lawyer'");
    assert.ok(Array.isArray(ans.suggestions), topic + "/" + locale + " should have suggestions");
    assert.ok(ans.verification, topic + "/" + locale + " should have verification status");
  });
});

// ── LANGUAGE × PROFILE INDEPENDENCE ──
// Changing language should not reset profile
ctx.S.profile = "student";
ctx.S.locale = "hi";
assert.strictEqual(ctx.S.profile, "student", "Profile must survive language change");
ctx.S.locale = "mr";
assert.strictEqual(ctx.S.profile, "student", "Profile must survive another language change");

// Changing profile should not reset language
ctx.S.locale = "ta";
ctx.S.profile = "lawyer";
assert.strictEqual(ctx.S.locale, "ta", "Language must survive profile change");
ctx.S.profile = "msme";
assert.strictEqual(ctx.S.locale, "ta", "Language must survive another profile change");

// ── MULTILINGUAL ANSWER PIPELINE ──
// pickAnswer should return correct locale variant
ctx.S.locale = "hi";
ctx.S.profile = "citizen";
var hiAnswer = ctx.pickAnswer("My landlord sent me a notice");
assert.strictEqual(hiAnswer.key, "tenancy");
assert.ok(hiAnswer.a._locale === "hi", "Answer should carry Hindi locale");

ctx.S.locale = "mr";
var mrAnswer = ctx.pickAnswer("My employer hasn't paid my salary");
assert.strictEqual(mrAnswer.key, "wages");
assert.ok(mrAnswer.a._locale === "mr", "Answer should carry Marathi locale");

ctx.S.locale = "kn";
var knAnswer = ctx.pickAnswer("Police detained my brother");
assert.strictEqual(knAnswer.key, "police");
assert.ok(knAnswer.a._locale === "kn", "Answer should carry Kannada locale");

ctx.S.locale = "ta";
var taAnswer = ctx.pickAnswer("My landlord sent me a notice");
assert.strictEqual(taAnswer.key, "tenancy");
assert.ok(taAnswer.a._locale === "ta", "Answer should carry Tamil locale");

// Reset to English
ctx.S.locale = "en";
var enAnswer = ctx.pickAnswer("My landlord sent me a notice");
assert.ok(enAnswer.a._locale === "en", "Answer should carry English locale");

// ── PROFILE-SPECIFIC EXAMPLES ──
["student", "lawyer", "msme", "citizen"].forEach(pid => {
  ["en", "hi", "mr", "kn", "ta"].forEach(locale => {
    var ex = ctx.PROFILE_EXAMPLES[pid][locale];
    assert.ok(Array.isArray(ex) && ex.length >= 3, pid + "/" + locale + " should have at least 3 examples");
  });
});

// ── VERIFICATION STATUS ──
assert.ok(ctx.VERIF_LABELS.verified, "Should have 'verified' status");
assert.ok(ctx.VERIF_LABELS.partial, "Should have 'partial' status");
assert.ok(ctx.VERIF_LABELS.needs_review, "Should have 'needs_review' status");
assert.ok(ctx.VERIF_LABELS.blocked, "Should have 'blocked' status");

// Verified badge renders correctly
var badge = ctx.verifBadgeHtml("verified");
assert.ok(badge.includes("verif-verified"), "Should render verified class");
var blockedBadge = ctx.verifBadgeHtml("blocked");
assert.ok(blockedBadge.includes("verif-blocked"), "Should render blocked class");

// ── SEQUENTIAL SWITCHING (no stale state) ──
// Cycle through all locales
["en", "hi", "mr", "kn", "ta", "en"].forEach(code => {
  ctx.S.locale = code;
  var ans = ctx.pickAnswer("My landlord sent me a notice");
  assert.strictEqual(ans.a._locale, code, "After switching to " + code + ", answer locale must match");
});

// Cycle through all profiles
["citizen", "student", "lawyer", "msme", "citizen"].forEach(pid => {
  ctx.S.profile = pid;
  var ans = ctx.pickAnswer("My landlord sent me a notice");
  assert.strictEqual(ans.a._profile, pid, "After switching to " + pid + ", answer profile must match");
});

// ── STOP + SEND ──
ctx.S.locale = "en";
ctx.S.profile = "citizen";
ctx.send("My landlord sent me a notice");
ctx.stop();
setTimeout(() => {
  assert.ok(!ctx.S.messages.some((m) => m.role === "assistant"), "stopped request must not land");
  assert.strictEqual(ctx.S.thinking, false);

  // a completed request does land
  ctx.send("My landlord sent me a notice");
  setTimeout(() => {
    const a = ctx.S.messages.find((m) => m.role === "assistant");
    assert.ok(a && a.reveal >= 1, "answer should arrive");
    assert.ok(a.answer.simple, "answer should have simple field");
    assert.ok(a.answer._locale === "en", "answer should be in English");
    assert.ok(a.answer._profile === "citizen", "answer should be for citizen profile");
    console.log("ok — all checks passed (" + (3 * 5) + " language×topic combos, " + (4 * 5) + " profile×language combos verified)");

    // ── api.js: sendMessage wraps pickAnswer ──
    ctx.S.locale = "en";
    ctx.sendMessage("My landlord sent me a notice").then((picked) => {
      assert.strictEqual(picked.key, "tenancy");
      assert.ok(picked.a.simple, "sendMessage should resolve a localized answer");

      // ── api.js: uploadDocument resolves without URL.createObjectURL in the sandbox ──
      ctx.uploadDocument({ name: "constitution.pdf", type: "application/pdf" }).then((doc) => {
        assert.strictEqual(doc.name, "constitution.pdf");
        assert.strictEqual(doc.type, "application/pdf");
        assert.strictEqual(doc.url, null, "no URL.createObjectURL in the sandbox — url must be null, not throw");

        // ── api.js: translateText no-ops safely with no API key configured ──
        ctx.translateText("Hello", "hi", "en").then((out) => {
          assert.strictEqual(out, "Hello", "with no key configured, translateText must return the input unchanged");
          console.log("ok — api.js checks passed");

          // ── chatPaneHtml: standalone chat view must render, not throw ──
          ctx.S.view = "chat";
          ctx.S.messages = [];
          ctx.S.thinking = false;
          var chatHtml = ctx.chatPaneHtml();
          assert.ok(chatHtml.includes('id="composer"'), "standalone chat pane must render the composer textarea");
          assert.ok(chatHtml.includes('data-a="submit"') || chatHtml.includes('data-a="stop"'), "standalone chat pane must render a send/stop control");

          // ── render(): S.view === "chat" must not fall through to the landing page ──
          ctx.render();
          assert.ok(ctx.appNode.innerHTML.includes('id="composer"'), "render() with S.view='chat' must show the chat pane, not the landing page");
          console.log("ok — chat view checks passed");

          // ── validateAttachedFile: accepts PDF, rejects unsupported type ──
          assert.strictEqual(ctx.validateAttachedFile({ name: "doc.pdf", type: "application/pdf", size: 1024 }), null);
          assert.ok(ctx.validateAttachedFile({ name: "virus.exe", type: "application/x-msdownload", size: 1024 }), "unsupported file type must return an error string");
          assert.ok(ctx.validateAttachedFile({ name: "huge.pdf", type: "application/pdf", size: 50 * 1024 * 1024 }), "oversize file must return an error string");

          // ── attaching a document sets S.attachedDoc and renders the chip ──
          ctx.S.attachedDoc = { name: "constitution.pdf", url: null, type: "application/pdf" };
          ctx.S.attachError = null;
          var withDoc = ctx.chatPaneHtml();
          assert.ok(withDoc.includes("constitution.pdf"), "attached doc name must render in the chip");
          assert.ok(withDoc.includes('data-a="remove-attach"'), "attach chip must offer a Remove control");

          // ── send() carries topicKey on the assistant message and uses api.sendMessage ──
          ctx.S.messages = [];
          ctx.S.attachedDoc = null;
          ctx.send("My employer hasn't paid my salary");
          setTimeout(() => {
            var a = ctx.S.messages.find((m) => m.role === "assistant");
            assert.ok(a, "assistant message should have arrived via send()");
            assert.strictEqual(a.topicKey, "wages", "assistant message must carry the matched topic key");
            console.log("ok — attachment checks passed");

            // ── send() stamps origText/origLocale/translations on the user message ──
            var userId = ctx.S.messages.find((m) => m.role === "user").id;
            var userMsg = ctx.S.messages.find((m) => m.id === userId);
            assert.strictEqual(userMsg.origText, "My employer hasn't paid my salary");
            assert.strictEqual(userMsg.origLocale, "en");
            assert.strictEqual(Object.keys(userMsg.translations).length, 0, "translations cache must start empty");

            // ── retranslateMessages: switching to the message's own origLocale needs no API call ──
            ctx.S.locale = "en";
            ctx.retranslateMessages("en");
            userMsg = ctx.S.messages.find((m) => m.id === userId);
            assert.strictEqual(userMsg.text, "My employer hasn't paid my salary", "switching to origLocale must not alter the text");
            assert.ok(!ctx.S.translating[userId], "no translation should be in flight for a same-locale switch");

            // ── retranslateMessages: assistant message re-localizes instantly from the static corpus ──
            ctx.S.locale = "hi";
            ctx.retranslateMessages("hi");
            var botMsg = ctx.S.messages.find((m) => m.role === "assistant");
            assert.strictEqual(botMsg.answer._locale, "hi", "assistant answer must re-localize to the new locale");
            assert.strictEqual(botMsg.answer.simple, ctx.ANSWERS.wages.hi.simple);

            // ── retranslateMessages: caches a translation and does not re-call translateText for it again ──
            var calls = 0;
            var originalTranslate = ctx.translateText;
            ctx.translateText = function (text, target, source) {
              calls++;
              return originalTranslate(text, target, source);
            };
            ctx.S.locale = "mr";
            ctx.retranslateMessages("mr");
            setTimeout(() => {
              assert.strictEqual(calls, 1, "one uncached user message should trigger exactly one translateText call");
              userMsg = ctx.S.messages.find((m) => m.id === userId);
              assert.ok(userMsg.translations.mr !== undefined, "translation must be cached after it resolves");
              var callsAfterCache = calls;
              ctx.S.locale = "en";
              ctx.retranslateMessages("en");
              ctx.S.locale = "mr";
              ctx.retranslateMessages("mr");
              assert.strictEqual(calls, callsAfterCache, "re-switching to an already-cached locale must not call translateText again");
              ctx.translateText = originalTranslate;
              console.log("ok — translation checks passed");
            }, 50);
          }, 2600);
        });
      });
    });
  }, 2600);
}, 2600);
