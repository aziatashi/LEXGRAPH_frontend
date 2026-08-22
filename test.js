/* Self-check for app.js. Run: node test.js
   Loads app.js in a minimal DOM stub and asserts the logic that can silently rot. */

const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const el = () => ({ className: "", innerHTML: "", hidden: false, setAttribute() {}, focus() {}, setSelectionRange() {} });

const ctx = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  document: {
    activeElement: null,
    documentElement: el(),
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
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/app.js", "utf8"), ctx);

// escaping — the XSS boundary for anything the user typed
assert.strictEqual(ctx.esc('<img src=x onerror="a">'), "&lt;img src=x onerror=&quot;a&quot;&gt;");
assert.strictEqual(ctx.esc("O'Brien & co"), "O&#39;Brien &amp; co");
const bubble = ctx.messageHtml({ id: "u1", role: "user", text: "<script>bad()</script>" });
assert.ok(bubble.includes("&lt;script&gt;") && !bubble.includes("<script>"), "user text must be escaped");

// answer routing
assert.strictEqual(ctx.pickAnswer("Police detained my brother last night").key, "police");
assert.strictEqual(ctx.pickAnswer("My employer hasn't paid my salary").key, "wages");
assert.strictEqual(ctx.pickAnswer("My landlord sent me a notice").key, "tenancy");

// escalation banner fires on the risk words, and only on those
const risky = (t) => ctx.HIGH_RISK.some((k) => t.toLowerCase().includes(k));
assert.ok(risky("Police detained my brother last night"));
assert.ok(!risky("I bought a defective product"));

// progressive reveal: section N appears only once reveal reaches N
const msg = (reveal) => ctx.answerHtml({ id: "a1", answer: ctx.ANSWERS.tenancy, reveal });
assert.ok(msg(1).includes("In simple terms"));
assert.ok(!msg(1).includes("What this usually means"));
assert.ok(msg(2).includes("What this usually means") && !msg(2).includes("What you can do"));
assert.ok(msg(5).includes("When to talk to a lawyer"));

// the law section is collapsed until toggled
assert.ok(msg(4).includes("Show Act") && !msg(4).includes(ctx.ANSWERS.tenancy.law));
ctx.S.openLaw = { a1: true };
assert.ok(msg(4).includes(ctx.ANSWERS.tenancy.law));
ctx.S.openLaw = {};

// PII hint threshold
assert.ok(/\d{6,}/.test("account 123456"));
assert.ok(!/\d{6,}/.test("flat 12345"));

// stop() must drop an answer that is already in flight
ctx.send("My landlord sent me a notice");
ctx.stop();
setTimeout(() => {
  assert.ok(!ctx.S.messages.some((m) => m.role === "assistant"), "stopped request must not land");
  assert.strictEqual(ctx.S.thinking, false);

  // a completed request does land, with its first section revealed
  ctx.send("My landlord sent me a notice");
  setTimeout(() => {
    const a = ctx.S.messages.find((m) => m.role === "assistant");
    assert.ok(a && a.reveal >= 1, "answer should arrive");
    assert.strictEqual(a.answer, ctx.ANSWERS.tenancy);
    console.log("ok — all checks passed");
  }, 2600);
}, 2600);
