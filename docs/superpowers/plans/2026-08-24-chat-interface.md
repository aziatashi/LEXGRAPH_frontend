# Chat Interface with Integrated Document Upload — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make LexGraph's chat interface actually reachable and usable standalone (it currently silently fails to render), add an in-composer document attachment as a lightweight alternative to the existing full-page upload flow, and make the language switcher retranslate an in-progress conversation instead of only affecting new messages.

**Architecture:** Vanilla JS, no build step, no framework, no module system — every file loads as a plain `<script>` tag into one shared global scope, and `app.js`'s single global state object `S` is re-rendered wholesale by `render()` on every change. This plan adds one new file (`api.js`, a service seam) and extends `app.js`/`index.html`/`test.js` in place, following that existing pattern exactly — no npm, no bundler, no imports.

**Tech Stack:** Vanilla JS (ES5-leaning, matching existing code style — `var`, function declarations, no arrow functions in app.js), hand-rolled HTML string templating, Node `vm` module for the existing test harness (`test.js`), Google Translate v2 REST API (inert without a key).

**Spec:** `docs/superpowers/specs/2026-08-24-chat-interface-design.md`

## Global Constraints

- No real backend integration — `sendMessage`/`uploadDocument` remain mocked, wrapping today's existing mock logic unchanged in behavior.
- `translateText` calls `https://translation.googleapis.com/language/translate/v2`, gated behind an `API_KEY` constant at the top of `api.js` that defaults to `""` — with no key it must return the input unchanged via `console.warn`, and must **never throw**.
- Do not modify the existing full-page "Upload PDF" → Legal Workbench flow (`uploadHtml()`, the `#pdf-upload` input, the `workspace` view's document pane, Graph tab, Compliance tab, guided tour). All of it stays exactly as it is today.
- Every new/changed user-facing string must go through the existing `esc()` XSS-escaping helper when interpolated into HTML — no exceptions.
- Match existing code style in `app.js`: `var`, `function` declarations (not arrow functions), string-concatenation HTML templates, `data-a="..."` event delegation via the single `document.addEventListener("click", ...)` handler.
- `test.js` must still pass in full (`node test.js` → `ok — all checks passed...`) after every task — extend it, never remove existing assertions.

---

## File structure

- **Create `api.js`** — the one module that "talks to the backend": `sendMessage(text, opts)`, `uploadDocument(file)`, `translateText(text, targetLocale, sourceLocale)`. Loaded before `app.js` in both `index.html` and `test.js`; its functions reference `app.js` globals (`pickAnswer`) only inside function bodies, never at load time, so load order works even though `api.js` loads first.
- **Modify `app.js`** — extract the chat pane markup into a standalone `chatPaneHtml()`, fix `render()`'s missing `"chat"` branch, add the composer attach button + attach chip + validation, route `send()` through `api.sendMessage`/keep `pickAnswer` local, add per-message translation state and `retranslateMessages()`, hook it into `setLocale()`.
- **Modify `index.html`** — add `<script src="api.js"></script>` before `<script src="app.js"></script>`; add CSS for `.attach-chip`, `.attach-err`, `.translating`.
- **Modify `test.js`** — load `api.js` into the same `vm` context before `app.js`; add assertions per task.

---

### Task 1: Create the `api.js` service layer

**Files:**
- Create: `api.js`
- Modify: `index.html:416` (add script tag before `app.js`'s)
- Modify: `test.js:34-36` (load `api.js` into the vm context before `app.js`)

**Interfaces:**
- Produces: `sendMessage(text)` → `Promise<{key: string, a: object}>` (identical shape to today's `fetchAnswer`/`pickAnswer` result — `key` is the matched topic, `a` is the localized answer object with `_locale`/`_profile` set)
- Produces: `uploadDocument(file)` → `Promise<{name: string, url: string|null, type: string}>` — `url` is `null` when `URL.createObjectURL` isn't available (e.g. in the Node test sandbox)
- Produces: `translateText(text, targetLocale, sourceLocale)` → `Promise<string>` — resolves to `text` unchanged (never rejects) when no API key is configured or the network call fails

- [ ] **Step 1: Write the failing test**

Append to `test.js`, right after the existing `ctx.appNode = el();` block and before `vm.createContext(ctx);`/`vm.runInContext(...)` calls — replace lines 34-36 with:

```js
ctx.appNode = el();
ctx.fetch = undefined; // no network in the sandbox — translateText must not need it when no key is set
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/api.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync(__dirname + "/app.js", "utf8"), ctx);
```

Then append at the very end of `test.js` (after the existing `console.log("ok — all checks passed...")` line, still inside its `setTimeout` callback, right before the closing `}, 2600);`):

```js
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
        });
      });
    });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test.js`
Expected: FAIL — `api.js` does not exist yet, so `fs.readFileSync(__dirname + "/api.js", ...)` throws `ENOENT`.

- [ ] **Step 3: Write `api.js`**

```js
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
```

- [ ] **Step 4: Wire the script tag**

Modify `index.html` — replace line 416:

```html
<script src="app.js"></script>
```

with:

```html
<script src="api.js"></script>
<script src="app.js"></script>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node test.js`
Expected: PASS — prints both `ok — all checks passed (...)` and `ok — api.js checks passed`.

- [ ] **Step 6: Commit**

```bash
git add api.js index.html test.js
git commit -m "Add api.js service seam for sendMessage/uploadDocument/translateText"
```

---

### Task 2: Fix the broken standalone chat view

**Files:**
- Modify: `app.js:1006-1064` (`workspaceHtml()` — extract its `chatTab` local into a top-level function)
- Modify: `app.js:1114-1141` (`render()` — add the missing `"chat"` branch)
- Test: `test.js`

**Interfaces:**
- Consumes: `S.view`, `S.messages`, `S.thinking`, `S.loadingCopy`, `S.draft`, `S.locale`, `getExamples()`, `chipsHtml()`, `messageHtml()` — all pre-existing, unchanged.
- Produces: `chatPaneHtml(standalone)` — `standalone` is a boolean (default `true`); returns the same HTML string the old inline `chatTab` variable held when `standalone` is `false`, and a superset (see Task 3) when `true`. Later tasks (3, 4) extend this function's body — they do not change its signature or its two call sites.

- [ ] **Step 1: Write the failing test**

Append to `test.js`, inside the same `.then()` chain from Task 1 (nest inside the `translateText` callback, replacing its `console.log("ok — api.js checks passed");` line with):

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test.js`
Expected: FAIL — `ctx.chatPaneHtml` is not a function (`TypeError`).

- [ ] **Step 3: Extract `chatPaneHtml()` and fix `render()`**

In `app.js`, replace the `workspaceHtml()` function (the block from `function workspaceHtml() {` through its closing `}` — originally lines 1006-1064) with:

```js
function chatPaneHtml(standalone) {
  if (standalone === undefined) standalone = true;
  var empty = S.messages.length === 0 && !S.thinking;
  var examples = getExamples();
  var emptyTitle = standalone && !S.attachedDoc
    ? ({ en: "Ask anything", hi: "कुछ भी पूछें" }[S.locale] || "Ask anything")
    : ({ en: "What do you want to understand?", hi: "आप क्या समझना चाहते हैं?" }[S.locale] || "What do you want to understand?");
  var emptyDesc = standalone && !S.attachedDoc
    ? ({ en: "Type a question below, in any of five languages — or attach a document to ask about it.", hi: "नीचे एक प्रश्न लिखें, या किसी दस्तावेज़ के बारे में पूछने के लिए उसे संलग्न करें।" }[S.locale] || "Type a question below, in any of five languages — or attach a document to ask about it.")
    : ({ en: "Analyze clauses, check compliance, or research the matter.", hi: "धाराओं का विश्लेषण करें, अनुपालन की जाँच करें, या मामले पर शोध करें।" }[S.locale] || "Analyze clauses, check compliance, or research the matter.");

  return '<div class="stream" id="stream"><div class="stream-in">' +
      (empty
        ? '<div class="blank"><h1>' + esc(emptyTitle) + '</h1>' +
          '<p>' + esc(emptyDesc) + '</p>' +
          '<div class="chips">' + chipsHtml(examples.slice(0, 4), "chip") + "</div></div>"
        : "") +
      S.messages.map(messageHtml).join("") +
      (S.thinking
        ? '<div class="thinking" aria-live="polite"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="c">' + esc(S.loadingCopy) + "</span></div>"
        : "") +
    "</div></div>" +
    '<div class="composer"><div class="composer-in">' +
      '<div class="box">' +
        '<textarea id="composer" rows="2" placeholder="' + esc({ en: "Analyze this clause, research this matter...", hi: "इस धारा का विश्लेषण करें, इस मामले पर शोध करें..." }[S.locale] || "Analyze this clause, research this matter...") + '"></textarea>' +
        '<div class="box-foot"><p>' + esc({ en: "Enter to send · Shift+Enter for new line" }[S.locale] || "Enter to send · Shift+Enter for new line") + '</p>' +
          (S.thinking
            ? '<button type="button" class="btn-stop" data-a="stop">' + esc({ en: "Stop" }[S.locale] || "Stop") + '</button>'
            : '<button type="button" class="btn-send-sm" data-a="submit">' + esc({ en: "Send" }[S.locale] || "Send") + '</button>') +
        "</div>" +
      "</div>" +
      '<p class="legal">LexGraph gives legal information, not legal advice.</p>' +
    "</div></div>";
}

function workspaceHtml() {
  return '<main class="ws">' +
    '<section class="ws-left">' +
      '<div class="doc-hdr">' +
        '<p class="title">' + esc(S.docName) + '</p>' +
        '<p class="meta">' + esc(S.docType) + (S.docUrl ? '' : ' · 14 pages · Scanned (OCR Complete)') + '</p>' +
      '</div>' +
      (S.docUrl
        ? '<div class="doc-body" style="padding:0; overflow:hidden;">' +
            '<iframe src="' + S.docUrl + '" style="width:100%; height:100%; border:none;"></iframe>' +
          '</div>'
        : '<div class="doc-body">' +
            '<h2>1. Parties</h2>' +
            '<p>This Facility Agreement ("Agreement") is made between Bank X ("Lender") and Meridian Textiles ("Borrower").</p>' +
            '<h2>2. Conditions Precedent</h2>' +
            '<p class="clause' + (S.activeClause === "c2" ? " active" : "") + '" data-a="clause" data-id="c2"><strong>2.1 KYC Compliance:</strong> The Borrower must furnish all KYC documentation required under the RBI Master Direction prior to disbursement.</p>' +
            '<h2>4. Indemnity</h2>' +
            '<p class="clause' + (S.activeClause === "c4" ? " active" : "") + '" data-a="clause" data-id="c4"><strong>4.2 Cap:</strong> The Borrower agrees to indemnify the Lender against any losses arising from default, subject to a cap of INR 50,000,000.</p>' +
          '</div>'
      ) +
    '</section>' +
    '<section class="ws-right">' +
      '<div class="ws-tabs">' +
        '<button class="ws-tab" aria-selected="' + (S.wsTab === 'chat') + '" data-a="tab" data-tab="chat">Analysis & Chat</button>' +
        '<button class="ws-tab" aria-selected="' + (S.wsTab === 'graph') + '" data-a="tab" data-tab="graph">Knowledge Graph</button>' +
        '<button class="ws-tab" aria-selected="' + (S.wsTab === 'compliance') + '" data-a="tab" data-tab="compliance">Compliance Impact</button>' +
      '</div>' +
      (S.wsTab === 'chat' ? chatPaneHtml(false) : (S.wsTab === 'graph' ? graphHtml() : complianceHtml())) +
    '</section>' +
  '</main>';
}
```

Then, in `render()` (originally lines 1114-1141), replace this line:

```js
  app.innerHTML = headerHtml() +
    (S.view === "workspace" ? workspaceHtml() : landingHtml()) +
    (S.modalOpen ? modalHtml() : "") +
    tourHtml();
```

with:

```js
  app.innerHTML = headerHtml() +
    (S.view === "workspace" ? workspaceHtml() : S.view === "chat" ? chatPaneHtml() : landingHtml()) +
    (S.modalOpen ? modalHtml() : "") +
    tourHtml();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node test.js`
Expected: PASS — prints `ok — chat view checks passed` in addition to the earlier lines.

- [ ] **Step 5: Commit**

```bash
git add app.js test.js
git commit -m "Fix broken standalone chat view — render() had no case for S.view === 'chat'"
```

---

### Task 3: Composer attachment (attach button, upload chip, validation)

**Files:**
- Modify: `app.js` — `chatPaneHtml()` (add attach button/chip when `standalone`), `send()` (route through `api.sendMessage`, store `topicKey`, remove old local `fetchAnswer`), the `change` event listener (add the new `#chat-attach-upload` input's handler), the `click` event listener (add `chat-attach` / `remove-attach` actions)
- Modify: `index.html` — add `.attach-chip`/`.attach-err` CSS
- Test: `test.js`

**Interfaces:**
- Consumes: `api.uploadDocument(file)` from Task 1, `api.sendMessage(text)` from Task 1, `chatPaneHtml(standalone)` from Task 2.
- Produces: `S.attachedDoc` (`null | {name, url, type}`), `S.attachError` (`null | string`), `validateAttachedFile(file)` → `string | null` (an error message, or `null` if the file is acceptable). `send()`'s assistant messages now carry `topicKey` (string) alongside the existing fields — Task 4 reads this field to re-localize an answer on language switch without re-calling the mock.

- [ ] **Step 1: Write the failing test**

Append to `test.js`, replacing the `console.log("ok — chat view checks passed");` line from Task 2 with:

```js
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
          }, 2600);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test.js`
Expected: FAIL — `ctx.validateAttachedFile` is not a function.

- [ ] **Step 3: Implement**

In `app.js`, add this new function right after `function esc(s) { ... }` (originally lines 474-478):

```js
function validateAttachedFile(file) {
  var okType = /\.(pdf|docx)$/i.test(file.name || "") || /^image\//.test(file.type || "") || file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (!okType) {
    return { en: "That file type isn't supported. Upload a PDF, DOCX, or image.", hi: "यह फ़ाइल प्रकार समर्थित नहीं है। PDF, DOCX या छवि अपलोड करें।" }[S.locale] || "That file type isn't supported. Upload a PDF, DOCX, or image.";
  }
  if (file.size && file.size > 15 * 1024 * 1024) {
    return { en: "That file is too large. Please upload something under 15 MB.", hi: "यह फ़ाइल बहुत बड़ी है। कृपया 15 MB से छोटी फ़ाइल अपलोड करें।" }[S.locale] || "That file is too large. Please upload something under 15 MB.";
  }
  return null;
}
```

Add `attachedDoc: null,` and `attachError: null,` to the `S` state object, right after the existing `docType: "Commercial Contract"` line (in the "NEW STATE" block).

Replace the `function fetchAnswer(text) { ... }` block (originally lines 519-523) — delete it entirely; `sendMessage` in `api.js` (Task 1) replaces it.

In `send()` (originally lines 602-656), replace this line:

```js
  fetchAnswer(text).then(function (picked) {
```

with:

```js
  sendMessage(text).then(function (picked) {
```

and replace the assistant-message object literal inside that same block:

```js
        .concat([{
          id: botId, role: "assistant", answer: picked.a, escalate: risk,
          reveal: 1, uncertain: picked.key === "wages", done: false
        }])
```

with:

```js
        .concat([{
          id: botId, role: "assistant", answer: picked.a, escalate: risk,
          reveal: 1, uncertain: picked.key === "wages", done: false, topicKey: picked.key
        }])
```

In `chatPaneHtml(standalone)` (from Task 2), insert the attach chip/error block and the attach button. Replace the function's `return` statement's opening — specifically this part:

```js
    "</div></div>" +
    '<div class="composer"><div class="composer-in">' +
      '<div class="box">' +
```

with:

```js
    "</div></div>" +
    '<div class="composer"><div class="composer-in">' +
      (standalone && S.attachedDoc
        ? '<div class="attach-chip">📄 <span class="name">' + esc(S.attachedDoc.name) + '</span> — ' +
            esc({ en: "Uploaded successfully", hi: "सफलतापूर्वक अपलोड किया गया" }[S.locale] || "Uploaded successfully") +
            ' <button type="button" data-a="remove-attach">' + esc({ en: "Remove", hi: "हटाएँ" }[S.locale] || "Remove") + '</button></div>'
        : "") +
      (standalone && S.attachError ? '<div class="attach-err">' + esc(S.attachError) + '</div>' : "") +
      '<div class="box">' +
```

and replace the `box-foot` markup:

```js
        '<div class="box-foot"><p>' + esc({ en: "Enter to send · Shift+Enter for new line" }[S.locale] || "Enter to send · Shift+Enter for new line") + '</p>' +
          (S.thinking
            ? '<button type="button" class="btn-stop" data-a="stop">' + esc({ en: "Stop" }[S.locale] || "Stop") + '</button>'
            : '<button type="button" class="btn-send-sm" data-a="submit">' + esc({ en: "Send" }[S.locale] || "Send") + '</button>') +
        "</div>" +
      "</div>" +
```

with:

```js
        '<div class="box-foot"><p>' + esc({ en: "Enter to send · Shift+Enter for new line" }[S.locale] || "Enter to send · Shift+Enter for new line") + '</p>' +
          '<div style="display:flex;gap:8px;align-items:center">' +
          (standalone
            ? '<button type="button" class="icon-btn" data-a="chat-attach" title="' + esc({ en: "Attach a document", hi: "एक दस्तावेज़ संलग्न करें" }[S.locale] || "Attach a document") + '">📎</button>' +
              '<input type="file" id="chat-attach-upload" accept=".pdf,.docx,image/*" style="display:none">'
            : "") +
          (S.thinking
            ? '<button type="button" class="btn-stop" data-a="stop">' + esc({ en: "Stop" }[S.locale] || "Stop") + '</button>'
            : '<button type="button" class="btn-send-sm" data-a="submit">' + esc({ en: "Send" }[S.locale] || "Send") + '</button>') +
          '</div>' +
        "</div>" +
      "</div>" +
```

In the existing `change` event listener (originally lines 1152-1167), add a new branch alongside the existing `pdf-upload` one:

```js
document.addEventListener("change", function (e) {
  if (e.target.id === "pdf-upload") {
    if (e.target.files && e.target.files.length > 0) {
      var file = e.target.files[0];
      set({ 
        uploadState: 1,
        docName: file.name,
        docUrl: URL.createObjectURL(file),
        docType: file.type === "application/pdf" ? "PDF Document" : "Document"
      });
      setTimeout(function(){ set({ uploadState: 2 }); }, 1000);
      setTimeout(function(){ set({ uploadState: 3 }); }, 2000);
      setTimeout(function(){ set({ uploadState: 4, view: "workspace", wsTab: "chat" }); }, 3000);
    }
  } else if (e.target.id === "chat-attach-upload") {
    if (e.target.files && e.target.files.length > 0) {
      var attached = e.target.files[0];
      var err = validateAttachedFile(attached);
      if (err) { set({ attachError: err }); return; }
      uploadDocument(attached).then(function (doc) {
        set({ attachedDoc: doc, attachError: null });
      });
    }
  }
});
```

In the `click` event listener, add two new branches near the existing `upload-do` one:

```js
  else if (a === "upload-do") {
    var fileInput = document.getElementById("pdf-upload");
    if (fileInput) fileInput.click();
  }
  else if (a === "chat-attach") {
    var attachInput = document.getElementById("chat-attach-upload");
    if (attachInput) attachInput.click();
  }
  else if (a === "remove-attach") {
    set({ attachedDoc: null, attachError: null });
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node test.js`
Expected: PASS — prints `ok — attachment checks passed` in addition to the earlier lines.

- [ ] **Step 5: Add CSS**

In `index.html`, add after the existing `.composer` / `.box-foot` rules (near line 245, after `.legal{margin:0;font-size:12px;color:var(--dim);text-align:center}`):

```css
.attach-chip{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--blue-tint);border:1px solid var(--blue-edge);border-radius:12px;font-size:14px;color:var(--ink);margin-bottom:8px}
.attach-chip .name{font-weight:600;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.attach-chip button{min-height:32px;padding:6px 12px;border-radius:8px;border:1px solid var(--blue);background:var(--white);color:var(--blue);font-size:13px;font-weight:600;cursor:pointer}
.attach-chip button:hover{background:var(--blue);color:#fff}
.attach-err{padding:8px 14px;background:var(--red-bg);border:1px solid var(--red-edge);border-radius:10px;font-size:13px;color:var(--red);margin-bottom:8px}
```

- [ ] **Step 6: Commit**

```bash
git add app.js index.html test.js
git commit -m "Add in-composer document attachment as a lightweight alternative to full-page upload"
```

---

### Task 4: Retranslate the conversation when the chat language changes

**Files:**
- Modify: `app.js` — `send()` (stamp `origText`/`origLocale`/`translations` on messages), `setLocale()` (call the new `retranslateMessages()`), add `retranslateMessages()`, extend the `input` listener to track `S.draftOrigLocale`
- Modify: `index.html` — add `.translating` CSS
- Test: `test.js`

**Interfaces:**
- Consumes: `translateText(text, targetLocale, sourceLocale)` from Task 1, `getLocalizedAnswer(topicKey)` (pre-existing), `topicKey` on assistant messages from Task 3.
- Produces: `S.translating` (`{[messageId]: true}`), `retranslateMessages(newLocale)` — no return value; mutates `S.messages` in place and calls `set({})` once synchronously plus once more per message when an async translation resolves.

- [ ] **Step 1: Write the failing test**

Append to `test.js`, replacing the `console.log("ok — attachment checks passed");` line from Task 3 with:

```js
            console.log("ok — attachment checks passed");

            // ── send() stamps origText/origLocale/translations on the user message ──
            var userMsg = ctx.S.messages.find((m) => m.role === "user");
            assert.strictEqual(userMsg.origText, "My employer hasn't paid my salary");
            assert.strictEqual(userMsg.origLocale, "en");
            assert.deepStrictEqual(userMsg.translations, {});

            // ── retranslateMessages: switching to the message's own origLocale needs no API call ──
            ctx.S.locale = "en";
            ctx.retranslateMessages("en");
            assert.strictEqual(userMsg.text, "My employer hasn't paid my salary", "switching to origLocale must not alter the text");
            assert.ok(!ctx.S.translating[userMsg.id], "no translation should be in flight for a same-locale switch");

            // ── retranslateMessages: assistant message re-localizes instantly from the static corpus ──
            var botMsg = ctx.S.messages.find((m) => m.role === "assistant");
            ctx.S.locale = "hi";
            ctx.retranslateMessages("hi");
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test.js`
Expected: FAIL — `ctx.retranslateMessages` is not a function, and `userMsg.origText` is `undefined`.

- [ ] **Step 3: Implement**

In `app.js`, in `send()` (already modified by Task 3), extend the two message object literals. Replace:

```js
    messages: S.messages.concat([{ id: userId, role: "user", text: text, failed: false }])
```

with:

```js
    messages: S.messages.concat([{ id: userId, role: "user", text: text, failed: false, origText: text, origLocale: S.locale, translations: {} }])
```

Add `translating: {}` and `draftOrigLocale: "en"` to the `S` state object, next to the `attachedDoc`/`attachError` fields added in Task 3.

Add this new function, right after `setLocale()` (originally lines 551-555):

```js
function retranslateMessages(newLocale) {
  var patch = { locale: newLocale };
  var pending = [];
  var nextMessages = S.messages.map(function (m) {
    if (m.role === "assistant" && m.topicKey) {
      var localized = getLocalizedAnswer(m.topicKey);
      return Object.assign({}, m, { answer: localized });
    }
    if (m.role === "user") {
      if (m.origLocale === newLocale) return Object.assign({}, m, { text: m.origText });
      if (m.translations[newLocale] !== undefined) return Object.assign({}, m, { text: m.translations[newLocale] });
      pending.push(m.id);
      return m;
    }
    return m;
  });
  var translatingPatch = Object.assign({}, S.translating);
  pending.forEach(function (id) { translatingPatch[id] = true; });
  set(Object.assign({}, patch, { messages: nextMessages, translating: translatingPatch }));

  var targetLocale = newLocale;
  S.messages.forEach(function (m) {
    if (m.role !== "user" || m.translations[targetLocale] !== undefined || m.origLocale === targetLocale) return;
    if (!S.translating[m.id]) return; // already resolved or superseded by a later switch
    translateText(m.origText, targetLocale, m.origLocale).then(function (translated) {
      if (S.locale !== targetLocale) return; // user switched again before this resolved
      var updatedTranslations = Object.assign({}, m.translations);
      updatedTranslations[targetLocale] = translated;
      var updatedTranslating = Object.assign({}, S.translating);
      delete updatedTranslating[m.id];
      set({
        translating: updatedTranslating,
        messages: S.messages.map(function (x) {
          return x.id === m.id ? Object.assign({}, x, { text: translated, translations: updatedTranslations }) : x;
        })
      });
    });
  });
}
```

Update `setLocale()` (originally lines 551-555) — replace:

```js
function setLocale(code) {
  try { window.localStorage.setItem("lexgraph.locale", code); } catch (e) {}
  document.documentElement.setAttribute("lang", code);
  set({ locale: code, highlighted: code, langMenu: false });
}
```

with:

```js
function setLocale(code) {
  try { window.localStorage.setItem("lexgraph.locale", code); } catch (e) {}
  document.documentElement.setAttribute("lang", code);
  set({ highlighted: code, langMenu: false });
  retranslateMessages(code);
  if (S.draft && S.draftOrigLocale !== code) {
    translateText(S.draft, code, S.draftOrigLocale).then(function (translated) {
      if (S.locale !== code) return;
      S.draft = translated;
      S.draftOrigLocale = code;
      render();
    });
  }
}
```

Update the `input` event listener — replace:

```js
document.addEventListener("input", function (e) {
  if (e.target.tagName !== "TEXTAREA") return;
  S.draft = e.target.value;
  var pii = document.getElementById("pii");
  if (pii) pii.hidden = !/\d{6,}/.test(S.draft);
});
```

with:

```js
document.addEventListener("input", function (e) {
  if (e.target.tagName !== "TEXTAREA") return;
  var wasEmpty = !S.draft;
  S.draft = e.target.value;
  if (wasEmpty && S.draft) S.draftOrigLocale = S.locale;
  var pii = document.getElementById("pii");
  if (pii) pii.hidden = !/\d{6,}/.test(S.draft);
});
```

Add a "Translating…" indicator in `messageHtml()` — replace the user-message branch's opening (originally lines 914-916):

```js
  if (m.role === "user") {
    return '<div class="msg"><div class="user">' +
      '<div class="bubble">' + esc(m.text) + "</div>" +
```

with:

```js
  if (m.role === "user") {
    return '<div class="msg"><div class="user">' +
      '<div class="bubble">' + esc(m.text) + "</div>" +
      (S.translating[m.id] ? '<p class="translating">' + esc({ en: "Translating…", hi: "अनुवाद हो रहा है…" }[S.locale] || "Translating…") + '</p>' : "") +
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node test.js`
Expected: PASS — prints `ok — translation checks passed` as the final line.

- [ ] **Step 5: Add CSS**

In `index.html`, add next to `.attach-err` (added in Task 3):

```css
.translating{font-size:12px;color:var(--dim);font-style:italic;margin:4px 0 0}
```

- [ ] **Step 6: Commit**

```bash
git add app.js index.html test.js
git commit -m "Retranslate conversation on language switch: assistant answers re-localize instantly, user messages translate and cache per locale"
```

---

## Self-review

**Spec coverage:**
- §1 standalone chat view fix → Task 2. ✅
- §2 upload as attachment, chip, remove, error states → Task 3. ✅
- §3 message originals + per-locale translation cache, "avoid unnecessary translation" → Task 4. ✅
- §3 draft translation mid-type → Task 4 (`setLocale`'s draft branch). ✅
- §4 document-based Q&A carries locale/doc through the one seam → `send()` already passes text to `sendMessage`; `S.attachedDoc` persists across turns untouched from Task 3 onward (never cleared on send) — no additional task needed, this falls out of not clearing `attachedDoc` in `send()`. ✅
- §4 `api.js` mock-first with real, inert `translateText` → Task 1. ✅
- §5 states: doc-attached chip, doc-attach error, translate-in-flight, translate-failed (falls back to original — built into `translateText`'s own `.catch()` from Task 1, so any caller already gets fallback behavior for free) → Tasks 1, 3, 4. ✅
- Testing section → one test block appended per task, all in `test.js`. ✅

**Placeholder scan:** none — every step has complete, runnable code.

**Type consistency:** `sendMessage(text)` returns `{key, a}` in both `api.js` (Task 1) and its Task 3 caller. `uploadDocument(file)` returns `{name, url, type}` in both Task 1 and Task 3. `chatPaneHtml(standalone)` signature is defined once in Task 2 and only its body is extended in Tasks 3–4 — both call sites (`render()`, `workspaceHtml()`) stay correct throughout. `topicKey` is written in Task 3's `send()` and read in Task 4's `retranslateMessages()` — same field name both places. `S.translating` is introduced in Task 4 and used consistently in `retranslateMessages()` and `messageHtml()`.
