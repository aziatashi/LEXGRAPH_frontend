# Chat interface with integrated document upload — design spec

**Status:** Approved by user, proceeding to implementation plan.
**Scope:** Frontend only (`app.js`, `index.html`, new `api.js`, `test.js`). No backend repo exists; this spec deliberately does not invent one.

## Problem

LexGraph today (`app.js`, `index.html`, no build step, no framework, single global state object `S` re-rendered wholesale by `render()`) primarily forces users through a full-page document upload before they can do anything. Two concrete defects make this worse than intended:

1. **The standalone chat view is broken.** `send()` and `startNew()` set `S.view = "chat"`, but `render()` (app.js:1128) only special-cases `"workspace"`; every other view falls through to `landingHtml()`. Asking a question without uploading a document currently does nothing visible — the message is appended to state but never rendered.
2. **Upload is a full-page detour**, not something you can do naturally mid-conversation.

Everything else (message bubbles, composer, language modal, profile picker, the 3-tab Legal Workbench for uploaded docs, the mocked answer pipeline) already exists and works — this is an integration and a missing-view fix, not a rewrite.

## Non-goals

- No real backend integration. `sendMessage`/`uploadDocument` continue to be mocked, exactly as today, just relocated behind a service seam.
- No change to the profile picker, Knowledge Graph tab, Compliance tab, or guided tour — kept as-is per explicit user decision.
- No live translation calls in this pass — `translateText` is real (Google Translate v2 REST) but inert without an API key, per explicit user decision ("get chat online first").

## Architecture

Still a single-file-per-concern vanilla JS SPA. Three files change, one is added:

- **`api.js`** (new) — the only module that "talks to the backend." Exports `sendMessage(text, {locale, doc})`, `uploadDocument(file)`, `translateText(text, targetLocale, sourceLocale)`. `sendMessage`/`uploadDocument` wrap the existing mock logic (`fetchAnswer`, the upload `setTimeout` chain) unchanged in behavior — just moved out of `app.js` so the UI never calls "the backend" directly. `translateText` calls `https://translation.googleapis.com/language/translate/v2` gated behind an `API_KEY` constant at the top of the file; empty by default → returns input unchanged + `console.warn`, never throws.
- **`app.js`** — state, rendering, event wiring (details below).
- **`index.html`** — adds `<script src="api.js">` before `app.js`; CSS additions reuse existing tokens/classes (`.msg`, `.bubble`, `.composer`, `.box`) rather than introducing a new visual language.
- **`test.js`** — extended, not replaced.

## Changes in detail

### 1. Standalone chat view (the actual fix)

Extract the chat pane markup that already exists inside `workspaceHtml()`'s `chatTab` local variable into a top-level `chatPaneHtml()` function (stream + composer, same markup, same classes). `render()` gains a real branch:

```
S.view === "workspace" ? workspaceHtml()
: S.view === "chat"    ? chatPaneHtml()   // NEW — was silently falling through to landingHtml()
: landingHtml()
```

`workspaceHtml()`'s right pane calls the same `chatPaneHtml()` for its "Analysis & Chat" tab — one implementation, two mount points. No behavior change for the workspace path.

### 2. Upload as an attachment, not a forced page

Composer gets a 📎 button beside Send, reusing the existing hidden `#pdf-upload` input and its `change` listener (already implemented, already works — just triggered from a new location). Selecting a file in `chat` view:

- Sets `S.attachedDoc = { name, url, type }` (no `uploadState` full-page animation — that stays reserved for the explicit "Upload PDF" → Legal Workbench path, unchanged).
- Renders an inline chip above the composer: `📄 {name} — Uploaded successfully  [Remove]`.
- `[Remove]` clears `S.attachedDoc` and returns to the plain composer. Conversation history is untouched.
- `S.attachedDoc` persists across turns (not cleared on send), so follow-up questions stay "about" the document without re-uploading — satisfies the continuity requirement.
- Unsupported file type / oversize file → inline error text under the dropzone-equivalent, chat stays usable (new state; today this case is silently unhandled).

The existing full-page `uploadHtml()` → `workspace` flow (doc pane, Graph tab, Compliance tab) is untouched and still reachable from the header's "Upload PDF" button, per the "keep everything" decision.

### 3. Messages: originals + per-locale translation cache

Each message object gains:

```js
{
  ...existing fields,
  origText: string,      // set once at creation, never overwritten
  origLocale: string,    // locale it was created/answered in
  translations: {}        // { [locale]: translatedText }, lazily filled
}
```

Switching `S.locale` (the existing language switcher — used as the single "conversation language" control, per user's explicit requirement that language switching drive the AI conversation, not just UI labels):

- For each message: if `translations[newLocale]` exists, or `newLocale === origLocale`, use it directly — **no API call** (avoids unnecessary translation).
- Otherwise call `api.translateText(origText, newLocale, origLocale)`, translating **from the original every time**, never from a previously-translated string, so meaning can't drift across repeated switches. Result is cached into `translations[newLocale]`.
- A message being translated shows a brief inline "Translating…" state; the rest of the thread stays interactive.
- A non-empty composer draft is translated the same way, in place, only when the user changes language mid-type with unsent text.
- Translation failure (network error, or no API key configured) falls back to showing `origText`/last-good text with a small non-blocking inline notice — never blocks the chat.

### 4. Document-based Q&A in the selected language

`sendMessage(text, { locale: S.locale, doc: S.attachedDoc })` passes the current conversation language and the attached doc reference through the one service seam on every turn, so a future real backend receives both without any UI change. For the current mock, `doc` is accepted but not yet used to alter the mocked answer content — noted as a natural follow-on once a real backend exists, not built speculatively now.

### 5. States covered

Empty chat (existing variant, reused), loading/typing (existing `.thinking` dots, reused), doc-attached chip, doc-attach error (new), translate-in-flight (new), translate-failed (new, non-blocking fallback).

## Testing

Extend `test.js` (Node `vm`-sandboxed, matching existing style) with:

- `render()` does not throw with `S.view === "chat"`, with and without `S.attachedDoc`.
- Switching `S.locale` populates `translations` cache and does not re-invoke `translateText` for a locale already cached or equal to `origLocale`.
- `translateText` with no API key configured returns the input unchanged and does not throw.

## Explicit decisions from user (do not re-litigate)

- No real backend wiring this pass; mock service layer only, swappable later.
- Translation seam is real (Google Translate v2), inert without a key — chat functionality is priority, translation activation is a later step.
- Profile picker, Graph/Compliance tabs, guided tour: kept as-is, unchanged.
