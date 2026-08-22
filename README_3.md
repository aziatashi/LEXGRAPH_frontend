# LexGraph — Frontend Implementation Blueprint

**AI-assisted legal information for India, in the user's own language.**

> **Status:** Planning document. No application code exists yet. This README is the
> specification a developer picks up on day one.
>
> **Repository scope:** Frontend only. The API, AI/RAG pipeline, database, and auth
> live in a separate backend repository. This frontend is a *consumer* of that API.
>
> **Backend contract status:** Not yet supplied. Every integration point below is
> marked `TO BE CONFIRMED WITH BACKEND`. **Section 27 is the highest-value section
> in this document** — it is the list of questions that, once answered, unblocks
> roughly 40% of the build.

---

## Contents

| | Section | | Section |
|---|---|---|---|
| **0** | [Read this first — three things that will bite you](#0-read-this-first--three-things-that-will-bite-you) | **15** | Design System & Folder Structure |
| **1** | Project Overview | **16** | State Management |
| **2** | Vision | **17** | Internationalization |
| **3** | Goals | **18** | Accessibility |
| **4** | Target Users | **19** | Security & Privacy |
| **5** | Product Experience | **20** | Responsive Design |
| **6** | Design Inspiration | **21** | Error & Empty States |
| **6A** | **Government Standards — UX4G & GIGW 3.0** | | |
| **7** | Colour Palette & Design Tokens | **22** | Performance |
| **8** | Language Selection Experience | **23** | Testing Strategy |
| **9** | Website Pages & Routes | **24** | Development Roadmap |
| **10** | Core Features | **25** | Definition of Done |
| **11** | AI Legal Assistant | **26** | Future Enhancements |
| **12** | Backend Integration | **27** | **Backend Information Required** ← start here |
| **13** | Frontend Technology Stack | **28** | Final Implementation Checklist |
| **14** | Component Architecture | **A** | Quick Token Reference |

---

## 0. Read This First — Four Things That Will Bite You

This section exists because a blueprint that only agrees with its brief is not worth
writing. Four decisions — three from the original brief, one from the UX4G direction added
afterwards — are wrong or risky. Each is addressed in full detail later; here is the summary.

### 0.1 The palette, taken literally, fails contrast

The five swatches were sampled directly from the supplied reference image:

| Swatch | Hex | Sampled |
|---|---|---|
| Warm cream / parchment | `#EECE95` | ✅ exact |
| Deep navy | `#18304A` | ✅ exact |
| Muted blue | `#264468` | ✅ exact |
| Charcoal gray | `#595959` | ✅ exact |
| Light gray | `#D3D3D3` | ✅ exact |

The brief says navy is the primary dark and muted blue is the interactive colour.
**Those two colours have a contrast ratio of 1.35 : 1.** A blue button on a navy
header is functionally invisible. A navy heading above blue link text reads as one
undifferentiated block.

**What this plan does instead:** it keeps all five swatches as literal anchors and
derives a working scale from them. `#264468` is demoted from "resting interactive
colour" to **hover/pressed state**, and a lightened in-family derivative `#2F5C8A`
(6.96 : 1 on white) becomes the resting interactive colour. Nothing is replaced with
an off-palette colour; the family is extended, not abandoned. Full scale in §7.

Also: `#EECE95` is a saturated sand, not a pale parchment (1.51 : 1 against white). As
a full-page background behind long legal text it reads as a manila envelope and tires
the eye. It is used here as an **accent and section-band colour**, with a desaturated
tint (`#FAF6EE`) as the actual page background. §7.3 explains.

### 0.2 A blocking language modal on first paint is the wrong first impression

The brief mandates a modal on entry. The risk: your entire product thesis is
*frictionless access to legal help for people who are intimidated by legal systems.*
The first thing such a user sees would be a wall asking them to make a choice before
they have seen a single word of value — and if their language rendered as boxes
because the font had not loaded, they cannot even read the choice.

**I disagree with a hard blocking modal because** it inverts the value-then-ask order
and adds a bounce point before first value. **Here is what I would do instead:** ship
the modal as specified (it is a reasonable, tested pattern and you asked for it), but
with four non-negotiable modifications:

1. It is **non-blocking on content** — the landing page renders fully behind it, so
   the user sees the product before deciding.
2. It is **dismissible** (Esc, backdrop click, ✕) and dismissal defaults to English
   with a persistent language switcher in the navbar.
3. Indic fonts for all six languages are **preloaded before the modal paints**, so no
   option ever renders as tofu boxes (□□□).
4. It appears **once per device**, keyed on a stored preference — not per session.

**The risk in a hard modal:** measurable bounce on first visit, and total inaccessibility
for a user whose script does not render. Detail in §8.

### 0.3 The most useful thing this product can do is often *not* answer the question

For a large share of real Indian legal queries — arrest, custody, domestic violence,
bail, imminent limitation deadlines — the correct output is not a paragraph of
explanation. It is: **"Call 15100. Free legal aid. Right now."**
([NALSA](https://nalsa.gov.in/) operates a national toll-free legal-aid helpline.)

A legal-AI product that always answers, and never routes, is optimising for looking
capable rather than for helping. This plan therefore adds a route not in the original
list — `/find-help` (§9.9) — and an escalation layer that can interrupt the chat
(§11.7). Treat these as core, not nice-to-have.

**Regulatory note [Likely]:** the Bar Council of India regulates legal practice and
advertising in India, and the framing of online legal-service platforms has been
under active scrutiny. This plan keeps every surface on the **"legal information,
not legal advice"** side of that line and never uses lawyer-like framing
("your case", "we recommend you file", "your lawyer"). Have a qualified advocate
review the disclaimer copy before launch — this is a product decision, not a
frontend one, and it is listed in §27.


### 0.4 A government design system will make people think this *is* the government

You have pointed me at [UX4G](https://www.ux4g.gov.in/) — India's official government
design system (NeGD / MeitY). It is a real asset and §6A adopts a lot of it. But adopting
it carries a risk that is specific to *this* product and does not apply to most:

**A legal-help site that looks like a `.gov.in` service will be read as one.** Priya
does not distinguish "built to government design guidelines" from "built by the
government." If she believes she is talking to an official legal service, she will trust
the AI output more than she should, and may believe that describing her problem here has
*filed* something. That is a real harm vector, not a branding quibble.

**I disagree with adopting UX4G's visual layer** — its component skin and its indigo
theme colour `#4a2bc2`. **Here is what I would do instead:** take UX4G's *standards*
(GIGW 3.0, WCAG 2.1 AA, its DPDP consent patterns, its accessibility tooling) as binding,
and keep LexGraph's own cream/navy identity so the product is visually distinct from an
official portal — plus a plain "LexGraph is not a government service" line in the footer
and on `/how-it-works`. **The risk in adopting the full skin** is a user who acts, or
fails to act, because they thought a government body had told them something.

Second, smaller point: UX4G's default theme colour `#4a2bc2` is an indigo-purple — the
exact "generic purple/blue AI SaaS theme" your original brief prohibited. Dropping the
component library in unthemed would overwrite the palette in §7 on day one.

Full analysis, the three-tier adoption decision, and what to do with UX4G's Claude Code
skill: **§6A**.

---

## 1. Project Overview

LexGraph is a public-facing web application that lets any person in India describe a
legal problem in plain words, in one of six languages, and receive structured,
understandable legal *information* — what the situation typically means, what the
usual next steps are, which law or authority is relevant, and where to get free
human help.

It is **not** a lawyer, a case-management tool, or a document-filing service.

The frontend's job is narrow and well-defined:

| Frontend owns | Backend owns |
|---|---|
| All rendering, layout, routing | AI/LLM inference and RAG retrieval |
| UI localisation (6 locales) | Legal corpus, embeddings, citations |
| Language *preference* capture & transport | Response-language generation / translation |
| Conversation UI, streaming render, optimistic state | Conversation persistence & ownership |
| Client-side validation & PII warnings | Authoritative validation, rate limits, moderation |
| Token storage strategy & attachment to requests | Token issuance, refresh, revocation |
| Error, empty, loading, offline states | Error taxonomy and machine-readable codes |
| Accessibility, responsive behaviour, performance | Search indexing and ranking |
| Disclaimer presentation & consent capture UI | Consent record-keeping, audit log, retention |

**A rule to hold to for the whole build:** if a decision affects legal correctness or
data retention, it belongs in the backend. The frontend may *present* and *warn*, but
it must never be the only thing standing between a user and a bad outcome.

---

## 2. Vision

Most people in India who need legal help do not lack laws — they lack a first step.
They do not know whether the notice they received is serious, whether a deadline has
started running, whether the police were required to register their complaint, or
that free legal aid exists and they qualify for it.

LexGraph's vision is to be the **calm first step**: a page that answers in the
language you think in, tells you plainly what is going on, tells you honestly when it
does not know, and points you at a real human when a real human is what you need.

Three things it must never become:

1. **A confident wrong answer machine.** Hedged uncertainty beats fluent fabrication.
2. **A funnel.** No dark patterns to force sign-up. The core assistant works logged-out.
3. **An English product with translations bolted on.** Hindi and Tamil are first-class,
   not fallbacks. This has typography, layout, and copy consequences (§17.8).

---

## 3. Goals

### 3.1 Product goals

| # | Goal | Measurable signal |
|---|---|---|
| G1 | A user can go from landing to a useful answer in under 60 seconds | Time-to-first-token from first paint |
| G2 | Zero mandatory account creation for the core assistant | Assistant fully usable while logged out |
| G3 | Full UI parity across all six launch languages | 100% key coverage, no English leakage in non-EN builds |
| G4 | Every AI response is unambiguously framed as information, not advice | Disclaimer present on 100% of assistant turns |
| G5 | High-risk queries route to human help within one screen | Escalation card renders above the AI answer |
| G6 | Usable on a ₹8,000 Android phone on a 3G connection | LCP < 2.5 s on Moto G Power / Slow 4G throttle |

### 3.2 Engineering goals

- **No backend logic in the frontend.** No legal rules, no jurisdiction tables, no
  eligibility calculators hardcoded in React.
- **No hardcoded user-facing strings.** Every string goes through a translation key.
  Enforced by lint rule (§17.4).
- **Ship-in-a-semester scope.** A two-to-four person team should reach Phase 4 in one
  academic term. Stack chosen accordingly (§13).
- **Graceful degradation everywhere.** The backend will be down at some point. The
  user must never see a white screen (§21).

### 3.3 Explicit non-goals for v1

- Voice input / text-to-speech. (High value for low-literacy users, genuinely. But it
  is a large backend dependency — likely [Bhashini](https://bhashini.gitbook.io/bhashini-apis)
  ASR/TTS — and belongs in v2. Listed in §26.)
- Document drafting or e-filing.
- Lawyer marketplace / directory of paid advocates. (Regulatory minefield; see §0.3.)
- Native mobile apps. Ship a good responsive web app first.
- Offline mode / PWA install. §26.

---

## 4. Target Users

Design against these four. When a decision is contested, **Priya wins.**

### 4.1 Priya — the primary user (design default)

- 26, works retail in Nashik. Hindi and Marathi at home, functional but not confident English.
- ₹10k Android, 4 GB RAM, patchy 4G, limited data plan.
- Her landlord sent a notice on WhatsApp. She does not know if it is legally valid.
- **Has never used a legal website.** Does not know the words "tenancy", "eviction",
  "notice period", "jurisdiction".
- Will abandon on: any legal jargon in the first screen, any forced sign-up, any wait
  over ~5 seconds with no feedback, any layout that requires horizontal scrolling.

**Consequences for the build:** the input must accept a WhatsApp-style ramble, not a
form. The first answer must lead with a plain-language summary. Streaming is not a
nice-to-have, it is the difference between "it's working" and "it's broken."

### 4.2 Ramesh — the low-digital-literacy user

- 54, small shopkeeper, Coimbatore. Tamil only. Reads slowly.
- Taps rather than types; may hand the phone to a younger relative.
- **Consequences:** large touch targets (min 48×48 px), Tamil at a larger base size
  than English (§14.2), suggested-question chips so he can tap instead of type, and
  a copy/share affordance so he can send the answer to someone.

### 4.3 Ananya — the informed self-server

- 31, urban, English-comfortable, has already Googled her problem.
- Wants *specifics*: the section number, the actual statute, the time limit.
- **Consequences:** legal citations must be visible and linkable, not hidden. A
  "sources" affordance on every AI message. Knowledge articles must be deep-linkable
  and SEO-legible.

### 4.4 Arjun — the para-legal volunteer / law student

- Uses the tool repeatedly, for other people, in a single sitting.
- **Consequences:** conversation history, "start new conversation" that is one tap and
  does not lose the old thread, and an account (§9.12) — but only if the backend
  supports it. This is the *only* persona that justifies auth in v1.

---

## 5. Product Experience

### 5.1 The core journey

```
Landing (/)
  │
  ├─ Language modal (first visit only, non-blocking, dismissible)   §8
  │
  ├─ Hero with a REAL working input — not a "Get Started" button    §9.1
  │     "मेरे मकान मालिक ने नोटिस भेजा है, अब क्या करूँ?"
  │
  ▼  submit
Conversation (/chat/:id)                                            §9.3
  │
  ├─ [risk check] high-risk signal? → escalation card renders FIRST §11.7
  │
  ├─ Assistant streams a structured answer:                         §11.4
  │     1. Plain-language summary  ("In simple terms…")
  │     2. What this usually means
  │     3. What you can do next (ordered, concrete)
  │     4. Relevant law / authority  (collapsible)
  │     5. When to see a lawyer
  │
  ├─ Suggested follow-ups as tappable chips                         §11.6
  │
  ├─ Actions: copy · share · was this helpful? · sources
  │
  ├─ Ask follow-up  ──────────────► loop
  │
  └─ Branch out:
       ├─ /knowledge/:cat/:slug   deep read on the topic            §9.5
       ├─ /find-help              free legal aid near you           §9.9
       └─ /chat  (new)            unrelated second problem
```

### 5.2 Friction budget

Every screen between a user and their answer must justify itself.

| Step | Allowed? | Rationale |
|---|---|---|
| Language choice on first visit | ✅ once, dismissible | Real value; skippable |
| Consent to disclaimer | ✅ once per device, inline | Legally necessary; must not be a full-page gate |
| Account creation | ❌ never before first answer | Kills G2 |
| Email capture | ❌ | Not needed for the core loop |
| Captcha | ⚠️ only on abuse, backend-triggered | See §27 Q11 |
| Cookie banner | ⚠️ minimal, only if analytics are added | §19.7 |

### 5.3 Tone rules for all UI copy

These are binding on every string in `locales/*.json`.

- **Second person, present tense, short sentences.** "You can file a complaint." Not
  "The complainant may institute proceedings."
- **No legal term without a gloss on first use.** Render unfamiliar terms with a
  `<LegalTerm>` component that shows a plain-language tooltip/sheet (§14.10).
- **Never promise an outcome.** Ban list, enforced in copy review: "you will win",
  "guaranteed", "definitely illegal", "your case is strong", "don't worry".
- **Never say "we" as if a firm.** LexGraph is a tool, not counsel.
- **Uncertainty is stated, not hidden.** "This depends on which state you're in —
  here's how to check" is a good answer.

---

## 6. Design Inspiration

Bharat NyAI (bharatnyai.com) is the reference **product category**: free, no-registration,
multilingual AI legal guidance for Indian citizens, built on public language
infrastructure. Its core insight — *"your rights, your language, free"* — is the right
thesis and is adopted here.

**What is taken:** the product concept, the frictionless/no-registration posture, the
multilingual-first stance, the seriousness of the domain.

**What is explicitly NOT taken:** its brand, name, logo, wordmark, colour scheme,
typography, illustrations, iconography, page layouts, marketing copy, or any asset.
LexGraph has its own identity built on the supplied palette (§7). No screenshot of the
reference site should ever be traced, and no copy should be paraphrased from it.

**Where LexGraph should differ deliberately:**

| Axis | Typical category behaviour | LexGraph's choice |
|---|---|---|
| Answer shape | Free-form prose blob | Fixed 5-part structure (§11.4) — scannable, translatable, testable |
| Uncertainty | Buried or absent | Surfaced as a first-class UI state (§11.5) |
| Human routing | Footer link, if at all | `/find-help` as a primary route + escalation interrupts |
| Visual register | Generic AI-SaaS gradients | Institutional calm: parchment, navy, real typography (§7) |
| Citations | Hidden or hallucinated | Rendered only when the backend returns them; never fabricated client-side |

---

## 6A. Government Standards Alignment — UX4G & GIGW 3.0

### 6A.1 What UX4G is

[UX4G](https://www.ux4g.gov.in/) (User Experience for Government Applications) is India's
official government design system, currently at **version 3.0**, maintained by the
**National e-Governance Division (NeGD)** under **MeitY**, as part of the Digital India
programme. It is **advisory, not mandatory** — and in any case LexGraph is not a
government service, so no part of it is legally binding here. It is adopted below because
it is *good*, not because it is required.

What it ships:

| Asset | What it is | Value to LexGraph |
|---|---|---|
| **Design System 3.0** | 50+ components for React, Angular, Flutter, Web Components, HTML | ⚠️ Low — see §6A.4 |
| **GIGW 3.0 alignment** | Guidelines for Indian Government Websites and Apps | ✅ **High — adopt as the compliance target** |
| **Accessibility Widget** | Drop-in widget, 14 features (text resize, contrast, etc.) | ✅ Evaluate — §6A.5 |
| **Audit 360** | Automated UX/accessibility evaluation platform | ✅ Add to the QA loop (§23) |
| **UX Health Self-Check** | Self-assessment tool | ✅ Use at Phase 6 |
| **UX Handbook** | 24+ topics on government UX practice | ✅ Team reading, Phase 0 |
| **Theme Craft 2.0** | Figma plugin for theming the system | ⚠️ Only if the library is adopted |
| **Build with AI** | `SKILL.md` + `Design.md` agent contract for Claude Code, Copilot, Cursor, Codex, and others | ✅ **Use it during the build — §6A.6** |
| **BRD templates** | Business-requirements templates + samples | Optional |

### 6A.2 What GIGW 3.0 actually requires

[GIGW 3.0](https://guidelines.india.gov.in/new-features-of-gigw-3-0/) — Guidelines for
Indian Government Websites and Apps — is the standard UX4G aligns to. Its four pillars:

| Pillar | Requirement | LexGraph status |
|---|---|---|
| **Accessibility** | **WCAG 2.1 Level AA** (upgraded from 2.0; adds 17 success criteria for cognitive disability, low vision, and mobile) | ✅ **Already exceeded** — §18 targets WCAG **2.2** AA, a superset |
| **Quality** | UI/UX quality, information architecture, consistent navigation, lifecycle-managed content | ✅ §5, §9, §15, §20 |
| **Cybersecurity** | CERT-In chapter, based on ISO 27001, OWASP, CIS benchmarks — design through deployment | ⚠️ **Partially** — §19 covers frontend; the OWASP/CERT-In posture is mostly a backend obligation |
| **Lifecycle management** | A named Web Information Manager and documented policies for quality, accessibility, and security | ❌ **Gap — a process, not code.** Assign an owner before launch (§6A.7) |

> **[Likely]** WCAG 2.2 AA satisfies GIGW's 2.1 AA bar in practice — 2.2 adds criteria on
> top of 2.1 and removes only SC 4.1.1 (Parsing), which was obsoleted for modern browsers.
> If a formal GIGW audit is ever required, confirm the auditor accepts 2.2 conformance in
> place of 2.1, or run the 2.1 checklist explicitly. This is cheap to check and expensive
> to discover late.

**Net effect on §18: no change required.** The accessibility plan already clears the
government bar. That is worth knowing before anyone proposes rebuilding the UI "for
compliance".

### 6A.3 The adoption decision — three tiers

The honest read: UX4G's **standards** are an excellent fit for LexGraph, and its
**component catalogue** is not. Its 50+ components are built for *transactional
e-governance* — OTP verification, UPI and net-banking payment flows, document upload and
verification, application tracking with SLA indicators, grievance escalation pipelines,
district dropdowns, calendar pickers. LexGraph is a conversational product. Perhaps five
of those fifty map onto anything here.

Adopting a whole design system to reuse five components, at the cost of the palette in §7
and a dependency whose install path could not be verified (§6A.8), is a bad trade.

#### Tier 1 — Adopt as binding

| Item | Where it lands |
|---|---|
| **GIGW 3.0 as the stated compliance target** | §18, §25, and a public accessibility statement |
| **WCAG 2.1 AA floor** (already exceeded at 2.2 AA) | §18 — no change needed |
| **GIGW cybersecurity posture** (OWASP-informed) for the frontend | §19 — CSP, XSS, dependency hygiene already align |
| **DPDP consent-flow patterns from UX4G** | §9.8, §19.7 — use them as the reference implementation for the consent notice |
| **Named Web Information Manager + documented lifecycle policy** | §6A.7 — new launch requirement |
| **A public accessibility statement page** | New route `/accessibility` — §6A.7 |
| **"Not a government service" statement** | Footer + `/how-it-works` — §0.4 |
| **UX Handbook as team reading** | Phase 0 |

#### Tier 2 — Evaluate, with a decision gate

| Item | The gate |
|---|---|
| **UX4G Accessibility Widget** (14 features) | Adopt **only if** it is self-hostable and adds no third-party runtime request — the CSP in §19.3 forbids external origins. If it must phone home, build the two features that matter (text resize, contrast toggle) natively instead; §26 item 12 already reserves them. |
| **Audit 360 + UX Health Self-Check** | Free audit signal. Run both in Phase 6. Treat findings as input, not as a gate — automated tools miss ~two-thirds of real issues (§18.11). |
| **UX4G district/state selector pattern** | Genuinely useful for the DLSA locator on `/find-help` (§9.9). Borrow the *interaction pattern* even if not the component. |
| **UX4G form-field and date-picker patterns** | Compare against Radix equivalents. Adopt whichever has better Indic-script and screen-reader behaviour — test, do not assume. |
| **Theme Craft 2.0 Figma plugin** | Only relevant if Tier 3 is reversed. |

#### Tier 3 — Do not adopt (with the reversal trigger stated)

| Item | Why not | Reverse this decision if… |
|---|---|---|
| **The UX4G component library wholesale** | Catalogue mismatch (~5 of 50 relevant); replaces Radix + Tailwind, which were chosen for headless accessibility and palette freedom (§13.1); install path unverified (§6A.8) | …LexGraph is adopted, endorsed, or co-branded by a government body or a State Legal Services Authority. Then UX4G conformance stops being optional and the whole calculus flips. |
| **UX4G's default theme colour `#4a2bc2`** | Indigo-purple — precisely the generic AI-SaaS palette the brief prohibits; would overwrite §7 | …never, unless the product becomes an official portal, in which case §7 is replaced entirely, deliberately, not by accident |
| **UX4G's visual identity / government look** | §0.4 impersonation risk — the decisive reason | …the product genuinely *becomes* an official service, at which point looking official is correct |

> **The rule in one line:** LexGraph is built **to** government standards, not **as** a
> government site.

### 6A.4 Where this changes the existing plan

| Section | Change |
|---|---|
| §7 Palette | **No change.** Cream/navy stands. UX4G's indigo is explicitly rejected. |
| §13 Stack | **No change** to Radix + Tailwind. UX4G library listed under "rejected, with trigger" (§13.3). |
| §18 Accessibility | **No change to the bar** (2.2 AA already exceeds GIGW's 2.1 AA). Add: GIGW named as the stated target; add the `/accessibility` statement page. |
| §19 Security | Add GIGW's OWASP/CERT-In framing; note that most of that chapter is backend-owned. |
| §9 Routes | **Add `/accessibility`** (accessibility statement — a GIGW expectation and good practice regardless). |
| §23 Testing | Add Audit 360 + UX Health Self-Check to the Phase 6 QA loop. |
| §24 Roadmap | Phase 0: read the UX Handbook, install the UX4G agent skill. Phase 6: run the audits, publish the statement, name the Web Information Manager. |
| §25 DoD | Add the GIGW/UX4G checklist block. |
| §27 | Add Q26–Q28 (below). |
| §28 | Add the agent-skill install step. |

### 6A.5 Using UX4G's "Build with AI" agent skill during the build

This is the part of UX4G with the most immediate practical value, and it is easy to miss
because it is a developer tool rather than a design asset.

UX4G publishes a **two-file agent contract** — `SKILL.md` (discovery and workflow) and
`Design.md` (the full design contract) — that multiple coding agents read identically:
Claude Code, Codex, Copilot, Cursor, Antigravity, Kiro, and OpenCode. The stated workflow
is: read `Design.md` in full → use the authoritative packages → reuse UX4G components and
semantic tokens → verify themes, breakpoints, and accessibility → **report unresolved
exceptions** rather than silently improvising.

Install paths as published:

| Agent | Path | Invocation |
|---|---|---|
| Claude Code | `.claude/skills/ux4g-design/` | `/ux4g-design` |
| Copilot / OpenCode / others | `.agents/skills/ux4g-design/` | shared directory |

Also available: **Figma Make Prompt v3** (design generation), **CodeGen Prompt v1**
(application structure), a **UX4G BRD template**, and sample BRDs.

**How to use it on this project — with one important caveat.** The skill will push toward
UX4G components and UX4G semantic tokens. That is exactly what Tier 3 rejects. So:

1. Install the skill and read `Design.md` in full during **Phase 0**. It is the clearest
   statement of what UX4G expects, and reading it is how you find the parts worth taking.
2. Use it as an **accessibility and interaction-pattern reviewer**, not as a code
   generator for this codebase.
3. **Override its token guidance explicitly.** Add a project-level instruction that
   LexGraph's tokens are §7 of this README and that `#4a2bc2` and the UX4G component
   packages are out of scope. Without that, an agent following the skill faithfully will
   quietly reintroduce the indigo palette.
4. Its "report unresolved exceptions" instruction is genuinely good practice — keep that
   behaviour and log the exceptions in this README.

> Note the recursion: UX4G shipping a Claude Code skill means an agent can be pointed at
> the government design contract directly. Useful — and precisely why the override in
> step 3 has to be written down rather than assumed.

### 6A.6 New route — `/accessibility`

GIGW expects a published accessibility statement, and it is good practice regardless.

**Purpose:** State the conformance target, what has been tested, what is known to be
incomplete, and how to report a barrier.

**Sections:** conformance target (WCAG 2.2 AA, exceeding GIGW 3.0's WCAG 2.1 AA) ·
what was tested and how (automated + manual, which screen readers, which devices) ·
**known limitations, stated honestly** · accessibility features available (keyboard
shortcuts, reduced motion, zoom support) · how to report a problem, with a real contact ·
date of last review.

**Target user:** a user with a disability deciding whether this product will work for
them; and any auditor.

**Backend dependency:** none — static, localised content.

**Mobile / states:** static page; ErrorBoundary only.

> Write the *known limitations* section truthfully. An accessibility statement that claims
> full conformance and is wrong is worse than one that names three open gaps and a fix date.

### 6A.7 New non-code launch requirements

These are process, not components, and they are the easiest items in this document to
forget. Each needs a named owner before launch.

- [ ] **Web Information Manager named** — one person accountable for content quality,
      accessibility, and security over the product's life (GIGW lifecycle pillar)
- [ ] **Documented lifecycle policy** — how content is reviewed, how accessibility
      regressions are caught, how security patches are applied, and on what cadence
- [ ] **Accessibility statement published** at `/accessibility`, with a review date
- [ ] **"LexGraph is not a government service"** stated in the footer and on
      `/how-it-works` (§0.4)
- [ ] **Audit 360 and UX Health Self-Check run**, findings triaged
- [ ] **UX Handbook read** by whoever owns design decisions

### 6A.8 Open verification items — do not guess these

| # | Item | Status |
|---|---|---|
| V1 | **The exact npm package name / CDN URL for the UX4G component library** | ❌ **Unverified.** The published docs (`doc.ux4g.gov.in/web`, `doc.ux4g.gov.in/flutter`) did not resolve on attempted retrieval, and a public registry search surfaced no matching package. **Do not write an install command from memory.** Confirm from the live docs or [UX4G contact](https://www.ux4g.gov.in/contact) before adding any dependency. |
| V2 | Licence terms for the component library, the Accessibility Widget, and the design assets — specifically whether non-government use is permitted | ❌ Unverified. Confirm before shipping any UX4G asset. |
| V3 | Whether the Accessibility Widget is self-hostable, or requires a third-party runtime request (CSP-blocking either way — §19.3) | ❌ Unverified. Gates the Tier 2 decision. |
| V4 | Whether UX4G components are genuinely themeable to an arbitrary palette via Theme Craft, or only within a fixed government range | ❌ Unverified. Only matters if Tier 3 is reversed. |
| V5 | Whether a GIGW auditor accepts WCAG 2.2 AA in place of 2.1 AA | ❌ Unverified. Only matters if a formal audit is required. |
| V6 | Indic-script rendering quality of UX4G components across all six launch languages | ❌ Untested. Test before borrowing any component. |

> Every row above is a five-minute email to UX4G or a five-minute read of the live docs.
> None of them should be guessed, and none of them should block Phase 1.

---

## 7. Colour Palette & Design Tokens

### 7.1 Source swatches

Sampled programmatically from the supplied reference image (modal colour of each band).
**These five values are exact, not approximate.**

| Role in brief | Hex | RGB | Notes |
|---|---|---|---|
| Warm cream / parchment | `#EECE95` | 238, 206, 149 | Saturated sand. Accent, not page background. |
| Deep navy | `#18304A` | 24, 48, 74 | Primary dark. 13.46 : 1 on white. |
| Muted blue | `#264468` | 38, 68, 104 | Reassigned to hover/pressed (see §0.1). |
| Charcoal gray | `#595959` | 89, 89, 89 | Body/secondary text. 7.0 : 1 on white. |
| Light gray | `#D3D3D3` | 211, 211, 211 | Borders, dividers. |

### 7.2 Measured contrast — why the scale had to be extended

| Pair | Ratio | Verdict |
|---|---|---|
| `#18304A` navy ↔ `#264468` blue | **1.35 : 1** | ❌ Unusable together |
| `#18304A` navy ↔ `#EECE95` cream | 8.91 : 1 | ✅ AAA |
| `#264468` blue ↔ `#EECE95` cream | 6.59 : 1 | ✅ AA |
| `#595959` charcoal ↔ `#EECE95` cream | 4.64 : 1 | ⚠️ AA normal text only, no small text |
| `#EECE95` cream ↔ `#FFFFFF` | 1.51 : 1 | ❌ Not a text pair; band/accent only |
| `#D3D3D3` ↔ `#FFFFFF` | 1.50 : 1 | ✅ Fine — it is a border, not text |

**Derived interactive colour:** `#2F5C8A` — a lightness-lifted sibling of `#264468`,
same hue family. **6.96 : 1 on white**, **6.45 : 1 on the cream-tint page background**.
White text on it reads at 6.96 : 1. It hovers *down* into the literal palette blue
`#264468` (9.96 : 1 with white) and presses down into navy `#18304A`. Both original
swatches therefore appear literally in the interaction model.

### 7.3 Full token scale

Define once in CSS custom properties, mirror into `tailwind.config.ts`. **Never write
a raw hex inside a component.** Enforced by lint rule (§14.13).

#### Cream / parchment scale (warm neutral)

| Token | Hex | Use |
|---|---|---|
| `--cream-50` | `#FDFBF7` | Card surface on a cream page |
| `--cream-100` | `#FAF6EE` | **Default page background** |
| `--cream-200` | `#F5EDDD` | Alternating section bands, chat assistant bubble |
| `--cream-300` | `#F2E2C4` | Hover on cream surfaces, subtle highlight |
| `--cream-400` | `#EECE95` | ⭐ **Source swatch** — accent bars, callout borders, illustration fill |
| `--cream-500` | `#E0B871` | Accent hover / active |
| `--cream-600` | `#C29A56` | Accent on light — icon strokes needing more weight |

#### Navy / blue scale (cool, institutional)

| Token | Hex | Use |
|---|---|---|
| `--navy-950` | `#0C1826` | Deepest surface, footer base |
| `--navy-900` | `#0F1F31` | Dark section background |
| `--navy-800` | `#18304A` | ⭐ **Source swatch** — primary brand dark, navbar, headings |
| `--navy-700` | `#264468` | ⭐ **Source swatch** — button hover, dark card surface |
| `--navy-600` | `#2F5C8A` | ⭐ **Derived** — resting interactive: links, primary button fill, focus |
| `--navy-500` | `#3A6EA5` | Focus ring, chart/indicator accent |
| `--navy-400` | `#5C8BBE` | Link on dark backgrounds (3.78 : 1 on navy-800 — large text only) |
| `--navy-300` | `#9DBBD8` | Body text on dark (6.75 : 1 on navy-800 ✅) |
| `--navy-200` | `#CFDFEC` | Selected-state fill, info banner background |
| `--navy-100` | `#E8F0F7` | Lightest tint — user chat bubble, table header |

#### Neutral gray scale

| Token | Hex | Use |
|---|---|---|
| `--gray-900` | `#2B2B2B` | Highest-contrast body text where navy is too branded |
| `--gray-800` | `#3F3F3F` | Strong body text |
| `--gray-700` | `#595959` | ⭐ **Source swatch** — default body text |
| `--gray-600` | `#6E6E6E` | Muted / secondary text (4.73 : 1 on cream-100 ✅) |
| `--gray-500` | `#8A8A8A` | Placeholder text, disabled label |
| `--gray-400` | `#ADADAD` | Disabled fill |
| `--gray-300` | `#D3D3D3` | ⭐ **Source swatch** — default border |
| `--gray-200` | `#E4E4E4` | Subtle divider, skeleton base |
| `--gray-100` | `#F1F1F1` | Cool surface where cream is wrong (code blocks) |

#### Semantic tokens — this is the layer components consume

```css
:root {
  /* ---- Brand ---- */
  --color-primary:            var(--navy-800);   /* #18304A */
  --color-primary-hover:      var(--navy-900);
  --color-primary-fg:         #FFFFFF;
  --color-secondary:          var(--navy-600);   /* #2F5C8A */
  --color-secondary-hover:    var(--navy-700);   /* #264468 */
  --color-secondary-fg:       #FFFFFF;
  --color-accent:             var(--cream-400);  /* #EECE95 */
  --color-accent-fg:          var(--navy-800);

  /* ---- Surfaces ---- */
  --color-bg:                 var(--cream-100);  /* #FAF6EE — page */
  --color-bg-alt:             var(--cream-200);  /* banded sections */
  --color-surface:            #FFFFFF;           /* cards, modals, inputs */
  --color-surface-raised:     var(--cream-50);
  --color-surface-inverse:    var(--navy-800);   /* footer, dark bands */
  --color-overlay:            rgba(12, 24, 38, 0.55);   /* modal scrim */

  /* ---- Text ---- */
  --color-text:               var(--gray-800);   /* #3F3F3F body */
  --color-text-strong:        var(--navy-800);   /* headings */
  --color-text-muted:         var(--gray-600);   /* #6E6E6E */
  --color-text-inverse:       #FFFFFF;
  --color-text-inverse-muted: var(--navy-300);   /* #9DBBD8 on navy */
  --color-text-link:          var(--navy-600);   /* #2F5C8A */
  --color-text-link-hover:    var(--navy-700);

  /* ---- Borders ---- */
  --color-border:             var(--gray-300);   /* #D3D3D3 */
  --color-border-subtle:      var(--gray-200);
  --color-border-strong:      var(--gray-500);
  --color-border-focus:       var(--navy-500);   /* #3A6EA5 */
  --color-border-accent:      var(--cream-400);

  /* ---- Focus ---- */
  --focus-ring:               0 0 0 3px rgba(58, 110, 165, 0.45);
  --focus-ring-offset:        2px;
}
```

#### Status tokens

Chosen to sit beside navy/cream without turning into a Bootstrap alert bar. All text
pairs verified ≥ 4.5 : 1.

| Semantic | Fill (`-bg`) | Border | Text / icon (`-fg`) | On-white ratio |
|---|---|---|---|---|
| **Error** | `#FDF2F1` | `#E8B4AF` | `#B3261E` | 6.54 : 1 ✅ |
| **Warning** | `#FDF6E7` | `#E5C77A` | `#8A5A00` | 5.93 : 1 ✅ |
| **Success** | `#EEF7F1` | `#A8D3B9` | `#1B7A4B` | 5.34 : 1 ✅ |
| **Info** | `#E8F0F7` | `#9DBBD8` | `#264468` | 9.96 : 1 ✅ |
| **Legal notice** | `#FAF6EE` | `#EECE95` | `#18304A` | 12.26 : 1 ✅ |

#### Verified in-context pairs

Every combination the UI actually renders, measured. Anything not on this list needs a
check before it ships.

| Foreground | Background | Ratio | Context |
|---|---|---|---|
| `#3F3F3F` text | `#FAF6EE` page | 9.77 : 1 | Body copy |
| `#18304A` heading | `#FAF6EE` page | 12.48 : 1 | Headings |
| `#6E6E6E` muted | `#FAF6EE` page | 4.73 : 1 | Secondary text ✅ AA |
| `#2F5C8A` link | `#FAF6EE` page | 6.45 : 1 | Links on page |
| `#FFFFFF` label | `#2F5C8A` button | 6.96 : 1 | Primary button |
| `#FFFFFF` label | `#264468` button hover | 9.96 : 1 | Primary hover |
| `#18304A` label | `#EECE95` accent button | 8.91 : 1 | Accent button |
| `#3F3F3F` text | `#FDFBF7` assistant bubble | 10.19 : 1 | AI message |
| `#2B2B2B` text | `#E8F0F7` user bubble | 12.30 : 1 | User message |
| `#9DBBD8` muted | `#18304A` footer | 6.75 : 1 | Text on navy |
| `#5C8BBE` link | `#18304A` footer | 3.78 : 1 | ⚠️ **Large text only** |
| `#B3261E` | `#FDF2F1` | 5.96 : 1 | Error banner |
| `#8A5A00` | `#FDF6E7` | 5.51 : 1 | Warning banner |
| `#1B7A4B` | `#EEF7F1` | 4.89 : 1 | Success banner |
| `#264468` | `#E8F0F7` | 8.65 : 1 | Info banner |

> The **Legal notice** variant is deliberately *not* an alert colour. Disclaimers must
> read as calm institutional context, not as a warning the user learns to dismiss.

#### Button token matrix

| Variant | Rest | Hover | Active | Disabled | Focus |
|---|---|---|---|---|---|
| **Primary** | bg `#2F5C8A`, fg `#FFF` | bg `#264468` | bg `#18304A` | bg `#ADADAD`, fg `#F1F1F1`, `cursor:not-allowed` | + `--focus-ring` |
| **Secondary (outline)** | bg transparent, fg `#2F5C8A`, border `#2F5C8A` | bg `#E8F0F7` | bg `#CFDFEC` | fg/border `#ADADAD` | + `--focus-ring` |
| **Ghost / tertiary** | bg transparent, fg `#3F3F3F` | bg `#F5EDDD` | bg `#F2E2C4` | fg `#ADADAD` | + `--focus-ring` |
| **Accent** | bg `#EECE95`, fg `#18304A` | bg `#E0B871` | bg `#C29A56` | bg `#F1F1F1`, fg `#ADADAD` | + `--focus-ring` |
| **Destructive** | bg `#B3261E`, fg `#FFF` | bg `#8E1E17` | bg `#6E1711` | bg `#ADADAD` | ring `rgba(179,38,30,.4)` |
| **On-dark** | bg `#FFF`, fg `#18304A` | bg `#E8F0F7` | bg `#CFDFEC` | bg `rgba(255,255,255,.25)` | ring white @ 50% |

### 7.4 Dark mode

**Recommendation: do not ship dark mode in v1.** Justification, not laziness:

- It doubles the token surface and the visual QA matrix across six scripts.
- The cream anchor is the identity of this palette; a dark variant loses it and drifts
  toward exactly the generic dark-AI look the brief prohibits.
- Priya's phone is used in daylight far more than a developer's is.

Do this instead: **structure the tokens so dark mode is a later drop-in.** Because every
component consumes semantic tokens and never raw hexes, adding dark mode later is one
new `@media (prefers-color-scheme: dark)` block redefining ~25 variables. Reserve the
mapping now (`--color-bg` → `--navy-950`, `--color-surface` → `--navy-900`,
`--color-text` → `--navy-200`, accent stays `--cream-400`) and move on.

`prefers-reduced-motion` **is** honoured from day one — that is accessibility, not
theming (§18.10).

---

## 8. Language Selection Experience

### 8.1 Launch languages

| Code | Native name | Script | Font family | Notes |
|---|---|---|---|---|
| `en` | English | Latin | Inter | Fallback locale |
| `hi` | हिंदी | Devanagari | Noto Sans Devanagari | Longest average string expansion (~20–30% vs EN) |
| `ta` | தமிழ் | Tamil | Noto Sans Tamil | Tall glyphs — needs larger line-height |
| `te` | తెలుగు | Telugu | Noto Sans Telugu | Complex conjuncts, wide ascender/descender range |
| `bn` | বাংলা | Bengali | Noto Sans Bengali | Matra line requires generous leading |
| `kn` | ಕನ್ನಡ | Kannada | Noto Sans Kannada | Tall stacked conjuncts |

All six are LTR. No RTL requirement at launch (§17.7 covers the future case).

### 8.2 Modal specification

Matching the reference direction described in the brief:

- **Surface:** `--color-surface` (`#FFFFFF`), `border-radius: 16px`,
  `box-shadow: 0 20px 48px -12px rgba(12,24,38,0.28)`.
- **Scrim:** `--color-overlay`, `backdrop-filter: blur(2px)` (dropped under
  `prefers-reduced-transparency` / low-end device hint).
- **Header:** "Choose your language" — rendered **simultaneously in all six scripts**,
  cycling or stacked. *Rationale:* a user who reads only Kannada cannot parse an
  English header telling them to pick Kannada. This is the single most important
  detail in the whole modal.
- **Cards:** 2-column grid on ≥ 640 px, 1 column below. Each card:
  - Native name at `--text-lg`, in its own font (primary line)
  - Latin name at `--text-sm`, `--color-text-muted` (secondary line: "Hindi")
  - Rest: `bg #FFF`, `border 1px --gray-300`, radius 12px, min-height 72px
  - Hover: `bg --cream-100`, `border --navy-400`
  - **Selected: `bg --navy-100` (#E8F0F7), `border 2px --navy-600`, check icon**, and
    `aria-checked="true"`
  - Focus: `--focus-ring`
- **CTA:** full-width primary button, label "Get Started" **translated into the
  currently-highlighted language**, so it updates live as the user arrows through.
- **Dismiss:** ✕ top-right (`aria-label` in EN + current lang), Esc, backdrop click.
  All three → `en` + preference stored so it does not reappear.
- **Footer link:** "You can change this anytime" → points at the navbar switcher.

### 8.3 Behaviour rules

| Question | Answer |
|---|---|
| **When does it appear?** | Only when no stored preference exists. First visit per device/browser. |
| **Does it block the page?** | No. Landing renders behind it. `aria-modal` traps focus while open, but content is painted. |
| **Where is preference stored?** | `localStorage["lexgraph.locale"]` (v1). If auth ships, also mirrored server-side — `TO BE CONFIRMED WITH BACKEND` (§27 Q7). |
| **What if localStorage is blocked?** | Wrap every read/write in try/catch. Fall back to in-memory state for the session; modal reappears next visit. Never crash. |
| **Is it re-shown after a version bump?** | No. Adding a 7th language shows a small dismissible navbar toast instead — never re-gate a returning user. |
| **Auto-detect?** | Yes, as the *pre-highlighted* option only — never as a silent decision. Order: stored → `?lang=` query param → `navigator.languages` → `en`. The modal still shows. |
| **Change later?** | Persistent globe switcher in navbar (desktop) / in the drawer menu (mobile), plus `/settings/language`. |
| **Does switching reload?** | No. `i18next.changeLanguage()` re-renders in place. The `<html lang>` attribute updates. Scroll position preserved. |

### 8.4 UI language ≠ AI response language

**These are two separate concerns and must be modelled separately.** Conflating them is
the most common failure mode in multilingual AI products.

| | UI locale | AI response language |
|---|---|---|
| Controlled by | `i18next` + `locales/*.json` | Backend inference / translation |
| Owned by | Frontend, fully | Backend, entirely |
| Fails how | Missing key → fallback string | Model answers in the wrong language, or in poor-quality translated legalese |
| Frontend duty | Render correctly | **Transport the preference and display what comes back honestly** |

Concrete rules:

1. Every request to the AI endpoint carries the user's preferred response language
   (`preferred_language: "ta"`) — `TO BE CONFIRMED WITH BACKEND` (§27 Q3).
2. The frontend **never machine-translates an AI legal response client-side.** A
   browser-translated statutory explanation is a liability. If the backend cannot
   answer in Tamil, it must say so.
3. If the backend returns `response_language` that differs from the request, the UI
   renders a non-alarming inline notice: *"This answer is in English. Tamil isn't
   available for this topic yet."* — plus a "Show in Tamil anyway" action **only if**
   the backend exposes a translation endpoint. `TO BE CONFIRMED WITH BACKEND`.
4. Each message stores its own `language` field, so a conversation can legitimately
   contain mixed languages and re-renders correctly (correct font per bubble).
5. Legal citations (Act names, section numbers) stay in their canonical form even in a
   translated answer. Do **not** transliterate "Section 138 of the Negotiable
   Instruments Act". The plain-language gloss around it is what gets translated.

### 8.5 Font loading — do this before the modal paints

If a language card renders as `□□□□`, the modal is worse than useless.

- Self-host WOFF2 subsets of Noto Sans {Devanagari, Tamil, Telugu, Bengali, Kannada}
  + Inter. Do not rely on a CDN — some Indian networks are unreliable to third-party
  font hosts, and self-hosting avoids a third-party request on the critical path.
- **Preload only the glyphs the modal needs.** Generate a tiny "language names" subset
  (~2 KB per script) containing just हिंदी / தமிழ் / తెలుగు / বাংলা / ಕನ್ನಡ and preload
  those six with `<link rel="preload" as="font" crossorigin>`.
- Load the **full** script font lazily, only when that locale becomes active.
- `font-display: swap` everywhere; define a metric-compatible fallback stack so reflow
  is minimal.
- Verify each script renders on Android Chrome and iOS Safari before launch (§22.7).

---

## 9. Website Pages & Routes

Route table first, then the per-page detail.

| # | Route | Page | Auth | Priority |
|---|---|---|---|---|
| 1 | `/` | Landing | Public | P0 |
| 2 | `/chat` | New conversation | Public | P0 |
| 3 | `/chat/:conversationId` | Conversation | Public (owned via session/token) | P0 |
| 4 | `/knowledge` | Knowledge hub | Public | P1 |
| 5 | `/knowledge/:category` | Category index | Public | P1 |
| 6 | `/knowledge/:category/:slug` | Article | Public | P1 |
| 7 | `/search` | Search results | Public | P1 |
| 8 | `/find-help` | Free legal aid & helplines | Public | **P0 (added)** |
| 9 | `/how-it-works` | About / methodology | Public | P1 |
| 10 | `/privacy` | Privacy policy | Public | P0 |
| 11 | `/terms` | Terms & legal disclaimer | Public | P0 |
| 12 | `/settings/language` | Language settings | Public | P1 |
| 12b | `/accessibility` | Accessibility statement (GIGW) | Public | P1 · §6A.6 |
| 13 | `/account` | Profile & history | **Protected** | P2 · TBC |
| 14 | `/login` · `/signup` | Auth | Public | P2 · TBC |
| 15 | `*` | 404 | Public | P1 |

**Route-level conventions applying to all pages:**
- Every page sets a localised `document.title` and `<meta description>` via a
  `useDocumentTitle(key)` hook.
- Every page is lazy-loaded via `React.lazy` except `/` and `/chat` (§22.3).
- Every page has a defined loading skeleton, empty state, and error boundary (§21).
- Every page is reachable and operable by keyboard alone (§18).
- `<html lang>` reflects the active locale on every route.

---

### 9.1 `/` — Landing

**Purpose:** Convert a worried person into someone who has typed their problem. Nothing
else. Every element that does not serve that is a candidate for deletion.

**Target user:** Priya, arriving cold from a WhatsApp forward or a Google search.

**Sections**

1. **Hero with a live input — not a CTA button.**
   The single most important decision on this page. The hero contains the actual
   working `<textarea>` that starts a conversation. A "Get Started" button that
   navigates to a page with an input is one wasted tap and one bounce point.
   - Headline (translated): *"Describe your legal problem. Get clear answers in your language."*
   - Sub: *"Free. No sign-up. Information, not legal advice."*
   - Input placeholder rotates through real examples in the active language.
   - Submit → creates a conversation → navigates to `/chat/:id`.
2. **Example problem chips** — 4–6 tappable real queries ("Landlord sent me a notice",
   "Police won't register my FIR", "Employer hasn't paid salary", "Bought a defective
   product"). Tap fills the input. Serves Ramesh directly.
3. **How it works** — 3 steps, iconographic, ≤ 12 words each.
4. **Trust band** (`--cream-200` background) — what LexGraph is and is not, stated
   plainly. Includes the standing disclaimer.
5. **Browse by topic** — 6–8 category cards linking into `/knowledge/:category`.
6. **Need a real person?** — prominent card linking to `/find-help`.
7. Footer.

**Key components:** `HeroPrompt`, `ExamplePromptChips`, `HowItWorksSteps`, `TrustBand`,
`TopicGrid`, `HumanHelpCard`, `Footer`, `LanguageModal` (portal).

**User actions:** type + submit; tap a chip; pick a topic; open `/find-help`; change language.

**Backend dependencies:**
- Create conversation / send first message — `POST /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`
- Topic categories — `GET /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`, *or* ship as a static
  local list in v1 to avoid blocking. **Recommended: static in v1.**

**Mobile:** Hero input is the first thing above the fold — headline shrinks before the
input does. Chips scroll horizontally in a single row with momentum. Sections stack.
The submit control is a right-aligned icon button inside the textarea, not below it.

**States:** *Loading* — page is static, so none for content; the submit button shows a
spinner and disables while creating the conversation. *Empty* — n/a. *Error* — if
conversation creation fails, the input keeps the user's text (never clear it) and an
inline error appears beneath with a Retry action.

---

### 9.2 `/chat` — New conversation

**Purpose:** A dedicated blank-state entry for users who arrive here directly or tap
"New conversation".

**Sections:** Centred prompt input, greeting in the active language, suggested starters,
disclaimer strip, and (if history exists) a "Recent conversations" list.

**Behaviour:** No conversation is created until the first message is sent. This avoids
littering the backend with empty conversations. On submit → create → `navigate(/chat/:id, { replace: true })`.

**Empty state:** This page *is* an empty state. It must feel intentional — a warm,
uncrowded surface with a clear invitation, not a bare input on white.

---

### 9.3 `/chat/:conversationId` — Conversation *(the product)*

**Purpose:** The core loop. Everything else is scaffolding around this screen.

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│ Navbar (compact on this route)                          │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │  ConversationHeader                          │
│ (≥1024px)│  ├ title (backend-generated or first 40 chars)│
│          │  ├ language indicator                        │
│ history  │  └ actions: new · rename · delete · share    │
│ list     │                                              │
│          │  ┌ EscalationCard (conditional, §11.7) ─────┐│
│ + New    │  └───────────────────────────────────────────┘│
│          │                                              │
│          │  MessageList  (virtualised past ~80 msgs)    │
│          │   ├ MessageBubble user                       │
│          │   ├ MessageBubble assistant                  │
│          │   │   ├ StructuredAnswer (5 blocks)          │
│          │   │   ├ CitationList (collapsible)           │
│          │   │   ├ ConfidenceNote (conditional)         │
│          │   │   └ MessageActions copy·share·feedback   │
│          │   └ StreamingIndicator                       │
│          │                                              │
│          │  SuggestedQuestions (chips)                  │
│          │  DisclaimerStrip (sticky, one line)          │
│          │  ChatComposer (sticky bottom)                │
└──────────┴──────────────────────────────────────────────┘
```

**User actions:** send message · stop generation · retry failed message · edit-and-resend ·
copy response · share conversation · rate response · expand citations · tap a suggested
question · start new conversation · rename/delete conversation · switch language mid-thread.

**Backend dependencies (all TBC):**

- Send message / stream response — `POST /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`
- Fetch conversation by id — `GET /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`
- List conversations — `GET /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`
- Delete / rename — `DELETE` / `PATCH /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`
- Feedback (👍/👎) — `POST /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`

**Mobile behaviour — this needs real work, not a media query:**

- Sidebar becomes a slide-over drawer behind a hamburger; never a squeezed column.
- Composer is `position: sticky; bottom: 0` and must sit **above** the virtual keyboard.
  Use `env(safe-area-inset-bottom)` + the `visualViewport` API to reposition on keyboard
  open. This is the single most-broken thing in mobile chat UIs — budget time for it.
- Textarea auto-grows to a max of 5 rows, then scrolls internally.
- Auto-scroll to the newest message **only when the user is already at the bottom.** If
  they have scrolled up to read, do not yank them down — show a "↓ New message" pill.
- Long assistant messages: collapse the "Relevant law" block by default on mobile.
- Message actions become a bottom sheet on tap-and-hold rather than hover-revealed icons.

**States**

| State | Treatment |
|---|---|
| Loading conversation | Skeleton bubbles (2 short, 1 tall), not a spinner |
| Waiting for first token | Animated "Reading your question…" with a three-dot indicator, ≤ 3 s before switching copy to "Still working on this…" |
| Streaming | Text appends live; Stop button replaces Send; auto-scroll if pinned to bottom |
| Empty conversation | Greeting + suggested starters (same as §9.2) |
| Message failed | The user's bubble stays, marked with a subtle error border + inline Retry. **Never delete the user's text.** |
| Network offline | Composer disables with a banner; queued message retained and retried on reconnect |
| Rate-limited | Friendly countdown, not a raw 429 |
| Conversation not found | Empty state with "Start a new conversation", not a 404 page |

---

### 9.4 `/knowledge` — Knowledge hub

**Purpose:** For users who would rather read than ask, and the main organic-search
surface.

**Target user:** Ananya; also Priya after her first answer, following a "Learn more" link.

**Sections:** Search bar (submits to `/search`) · category grid (Housing & Tenancy,
Police & FIR, Consumer, Employment & Wages, Family & Marriage, Women's Safety, Cyber
Fraud & Online Scams, Property & Land, Documents & IDs) · "Most read" list · "Recently
updated" · CTA back into the assistant.

**Backend:** category list + article index — `GET /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`.

**Mobile:** 2-column category grid at ≥ 380 px, 1 column below. Cards are tall enough
for a 48 px tap target with the label fully visible in every script.

**Empty state:** if the backend returns zero categories, render the static fallback
category list and a single quiet notice — never an empty page.

---

### 9.5 `/knowledge/:category` and `/knowledge/:category/:slug`

**Category index:** breadcrumb · category description in plain language · article list
with reading time · "Ask about this topic" button that seeds a conversation with
category context.

**Article page:**
- Breadcrumb · H1 · last-updated date · reading time · language availability indicator
- Sticky table of contents on ≥ 1024 px; collapsible accordion on mobile
- Body rendered from backend content. **Sanitise before render** (§19.4) — if the
  backend returns HTML, run DOMPurify with a strict allowlist. If it returns Markdown,
  render with `react-markdown` and no raw-HTML plugin. Prefer Markdown; note in §27 Q9.
- `<LegalTerm>` glosses applied to known jargon
- Related articles · "Still not sure? Ask the assistant" CTA (seeds a conversation with
  the article as context — `TO BE CONFIRMED WITH BACKEND` whether the API accepts a
  context reference)
- Disclaimer footer

**Language availability:** if this article does not exist in the active locale, show the
English version with a clear banner: *"This page isn't available in Bengali yet. Showing
English."* Do **not** auto-translate legal content client-side (§8.4 rule 2).

**Backend:** `GET /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]` for article by category+slug+locale.

---

### 9.6 `/search`

**Purpose:** Find knowledge content and (if the backend supports it) statutes/judgments.

**Sections:** search input (URL-synced `?q=` and `?lang=`) · filters (category, content
type, language) · result list with highlighted snippets · pagination or infinite scroll ·
"Ask the assistant instead" escape hatch.

**Behaviour:** debounce 300 ms; abort the in-flight request on each new keystroke via
`AbortController`; keep query in the URL so results are shareable and back-button works.

**Backend:** `GET /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]`.

**States:** *Loading* — 5 skeleton rows. *No results* — this is the important one: show
the query, offer spelling suggestions if the backend provides them, list popular
categories, and put **"Ask the assistant about this"** as the primary action. A dead-end
search is a lost user. *Error* — inline retry, keep the query.

---

### 9.7 `/how-it-works` — About & methodology

**Purpose:** Earn trust by being specific about the machinery. This page is where a
sceptical user (or a journalist, or a law professor) decides whether to take the product
seriously.

**Sections:** what LexGraph does in three sentences · how the AI works (retrieval over a
legal corpus, in honest terms) · **what it cannot do** — given equal weight, not buried ·
where the legal information comes from · how languages are handled · how data is treated
(links to `/privacy`) · who built it · how to report a wrong answer.

**Do not** write marketing copy here. "We use advanced AI" is worthless; "answers are
generated by a language model over a retrieved set of Indian statutes and may be
incomplete or out of date" is what builds trust.

---

### 9.8 `/privacy` and `/terms`

Static localised documents. Requirements:

- Human-readable **summary at the top** ("In short: …") before the formal text. Priya
  will not read eight screens of clauses.
- Full text below.
- Version number + effective date, visible.
- Available in all six languages. **If a legally-reviewed translation does not exist,
  show English and say so explicitly** — a bad translation of a privacy policy is worse
  than an untranslated one. Flag which is authoritative.
- `/terms` contains the full legal disclaimer (§11 + §0.3) and is linked from the
  disclaimer strip on every chat screen.
- **Content ownership:** these documents must be drafted/reviewed by a qualified
  advocate. Not a frontend deliverable. Tracked in §27 Q14.
- **DPDP compliance:** India's Digital Personal Data Protection framework (Act 2023,
  with Rules subsequently notified) imposes consent-notice and data-principal-rights
  obligations. The frontend must be able to render a consent notice and expose
  data-deletion/export controls. *What those controls call, and what the retention
  policy is, is a backend question* — §27 Q12. **[Likely — verify current compliance
  deadlines with counsel.]**

---

### 9.9 `/find-help` — Free legal aid & helplines *(added route)*

**Why this exists:** see §0.3. For a meaningful share of queries, routing to a human is
the correct answer, and burying that in a footer is a product failure.

**Purpose:** Get a user to free, real, human legal help in as few taps as possible.

**Sections**

1. **Emergency strip** (top, always visible): national emergency `112`; NALSA legal-aid
   helpline `15100`; women's helpline `181`; child helpline `1098`; cyber-crime
   `1930` / cybercrime.gov.in. Rendered as `tel:` links with 48 px tap targets.
   > ⚠️ **Verify every number and its current status with counsel before launch.**
   > Numbers are listed here as a starting point, sourced from public government
   > information; they must be confirmed and kept in a backend-managed list so they can
   > be corrected without a frontend deploy. `TO BE CONFIRMED WITH BACKEND` (§27 Q13).
2. **"Am I eligible for free legal aid?"** — a short plain-language explainer with a
   link to the authoritative NALSA source. Do **not** build an eligibility calculator in
   the frontend; eligibility is a legal determination.
3. **Find your District Legal Services Authority (DLSA)** — state → district selector.
   Data source `TO BE CONFIRMED WITH BACKEND`; if unavailable at launch, link out to
   nalsa.gov.in rather than shipping stale scraped data.
4. **What to bring / what to expect** — reduces the intimidation barrier.
5. **When you need a private lawyer** — neutral guidance only. **No referrals, no
   listings, no lead generation** (§0.3 regulatory note).

**Mobile:** emergency numbers are the first thing on screen, one-tap dialable, no
scrolling required.

**Empty/error:** if the DLSA directory fails to load, the emergency strip and static
guidance must still render. Never let a data failure hide a helpline number.

---

### 9.10 `/settings/language`

Full-page version of the modal, plus: separate control for **AI response language** if
the backend supports decoupling it from UI language (`TO BE CONFIRMED WITH BACKEND`),
a per-language availability indicator for knowledge content, and a note on what
translation does and does not cover.

---

### 9.11 `/login`, `/signup`, `/account` — Protected area

**Everything in this group is conditional on the backend having auth.**
`TO BE CONFIRMED WITH BACKEND` (§27 Q4–Q6).

Build these **behind a feature flag** (`VITE_FEATURE_AUTH`). If the flag is off, the
routes do not render, the navbar shows no account affordance, and history is local-only.
This lets Phases 1–4 ship without waiting on backend auth.

`/account` sections (when enabled): profile · conversation history (searchable) ·
language preferences · **delete my data** (DPDP right) · export my data · sign out.

**Never** put the AI assistant behind auth (goal G2).

### 9.12 `*` — 404

Localised, calm, useful: what happened, a search box, links to `/`, `/chat`, `/knowledge`,
`/find-help`. Never a stack trace, never English-only.

---

### 9.13 Per-route state matrix

Every route must implement all four states. This table is the checklist — no route ships
without a defined answer in each column.

| Route | Loading | Empty | Error | Mobile note |
|---|---|---|---|---|
| `/` | Submit button spinner only (page is static) | n/a | Inline under composer; user's text preserved | Hero input above the fold |
| `/chat` | n/a | **This page is the empty state** — greeting + starters | Conversation-create failure inline | Composer centred, keyboard-aware |
| `/chat/:id` | Skeleton bubbles (2 short, 1 tall) | Greeting + suggested starters | Per-message retry; conversation-level banner | Drawer sidebar, sticky composer |
| `/knowledge` | Category-grid skeleton | Static fallback categories + quiet notice | Retry + link to the assistant | 1–2 column grid |
| `/knowledge/:category` | Article-list skeleton | "No articles here yet" + related categories | Retry + breadcrumb back | Accordion TOC |
| `/knowledge/:category/:slug` | Article skeleton (title, 6 lines, TOC) | n/a — 404 instead | Retry; if the locale is missing, English + banner | TOC collapses; legal blocks collapsed |
| `/search` | 5 skeleton rows | Query echoed + suggestions + **"Ask the assistant"** | Inline retry, query preserved | Filters in a bottom sheet |
| `/find-help` | Directory skeleton only; **emergency strip renders instantly, never skeletonised** | Static guidance if the directory is empty | **Emergency numbers always render even on total failure** | Helplines first on screen |
| `/how-it-works` | n/a — static | n/a | ErrorBoundary only | Stacked sections |
| `/accessibility` | n/a — static | n/a | ErrorBoundary only | Stacked; known-limitations list must not be collapsed by default |
| `/privacy`, `/terms` | n/a — static/bundled | n/a | ErrorBoundary only | Summary first, full text below |
| `/settings/language` | n/a | n/a | Persistence failure → in-memory + notice | Full-page list, 48 px rows |
| `/account` | Profile + history skeleton | "Your conversations will appear here" | Retry; session-expiry re-auth | Stacked, history as cards |
| `/login`, `/signup` | Button spinner | n/a | Field-level + form-level; never reveal which credential was wrong | Single column, 16 px inputs |
| `*` | n/a | n/a | n/a | Search box + four exits |

**Universal rules:** no route may render a bare spinner where the layout shape is known ·
no route may render an error without a next action · every state string is translated ·
every error state shows the request id in muted small text when the failure was server-side.

---

## 10. Core Features

Prioritised. P0 = product does not exist without it.

| # | Feature | Priority | Owner | Backend dependency |
|---|---|---|---|---|
| F1 | Conversational AI legal assistant | P0 | FE + BE | AI endpoint — TBC |
| F2 | Six-language UI localisation | P0 | FE only | None |
| F3 | Language selection & persistence | P0 | FE only | Optional sync — TBC |
| F4 | Language-aware AI responses | P0 | BE | Language param — TBC |
| F5 | Legal disclaimer & consent UX | P0 | FE | Consent record — TBC |
| F6 | High-risk escalation to human help | P0 | FE + BE | Risk signal — TBC |
| F7 | Free legal aid directory (`/find-help`) | P0 | FE (+BE for DLSA data) | Directory — TBC |
| F8 | Streaming responses | P1 | FE + BE | Streaming support — TBC |
| F9 | Conversation history | P1 | FE + BE | Conversation API — TBC |
| F10 | Suggested follow-up questions | P1 | FE + BE | Returned with response — TBC |
| F11 | Legal citations / sources display | P1 | FE + BE | Citations in payload — TBC |
| F12 | Knowledge base browse & read | P1 | FE + BE | Content API — TBC |
| F13 | Search | P1 | FE + BE | Search API — TBC |
| F14 | Copy / share response | P1 | FE only | None |
| F15 | Response feedback (👍/👎) | P2 | FE + BE | Feedback API — TBC |
| F16 | Authentication & account | P2 | BE | Auth API — TBC |
| F17 | Document upload for analysis | P2 | FE + BE | Upload API — TBC |
| F18 | PII detection warning | P2 | FE (client hint) | Backend redaction — TBC |
| F19 | Voice input / TTS | v2 | BE | Bhashini or equivalent — TBC |

---

## 11. AI Legal Assistant

### 11.1 Interaction model

A single, continuous conversation per legal problem. Not a form, not a wizard, not a
question-tree. The user writes what happened; the assistant asks for clarification when
it genuinely needs it and answers when it can.

**One design rule that matters more than the rest:** the assistant should ask **at most
one clarifying question at a time**, and only when the answer materially changes the
response (state, date, whether a notice was written). A model that opens with five
questions loses Priya immediately.

### 11.2 The API contract — conceptual, not invented

> **No endpoint names are asserted below.** These are the *shapes* the frontend needs.
> Every path is a placeholder to be replaced once the backend repository is available.

**Send a message**

```
POST /[BACKEND_ENDPOINT_TO_BE_CONFIRMED]
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>          # only if auth exists — TBC
  Accept-Language: <locale>              # UI locale, informational
  X-Request-Id: <uuid v4>                # client-generated, for support/debugging

Body (conceptual):
{
  "conversation_id":     string | null,   // null => backend creates one
  "message":             string,          // the user's text, unmodified
  "preferred_language":  "en"|"hi"|"ta"|"te"|"bn"|"kn",
  "stream":              boolean,         // if backend supports it — TBC
  "client_context": {                     // optional, non-PII
    "locale":       string,
    "entry_point":  "landing" | "chat" | "knowledge_article" | "suggestion",
    "article_ref":  string | null         // if seeded from a knowledge article
  }
}
```

**Expected response (non-streaming) — conceptual**

The frontend needs *these fields to exist under some name*. Actual names TBC.

| Field the UI needs | Why the UI needs it | If missing, UI degrades to |
|---|---|---|
| `conversation_id` | Route to `/chat/:id`, persist | Client-generated ephemeral id, no history |
| `message_id` | Feedback, retry, copy target, React key | Array index (fragile) |
| `answer` (text/markdown) | The actual content | Nothing — hard requirement |
| `response_language` | Detect language mismatch (§8.4 rule 3) | Assume requested language; mismatch goes unflagged |
| `citations[]` — `{title, source, section?, url?}` | Render sources for Ananya | Hide the citations block entirely |
| `suggested_questions[]` | Follow-up chips for Ramesh | Hide the chips |
| `confidence` or `uncertainty_flag` | Render the "this may be incomplete" note | Never surface uncertainty — **bad outcome** |
| `risk_level` / `escalation` | Trigger the escalation card (§11.7) | Client-side keyword heuristic only — **weak** |
| `disclaimer_variant` | Contextual disclaimer text | Generic disclaimer always |
| `created_at` | Timestamps, ordering | Client clock |

**Streaming (if supported)**

Preferred transport: **SSE** (`text/event-stream`) over WebSockets. Reasons: unidirectional
is all that is needed, it survives proxies and corporate networks better, it reconnects
natively, and it is far less code. `TO BE CONFIRMED WITH BACKEND` (§27 Q2).

Conceptual event sequence the UI is built to consume:

```
event: start      { conversation_id, message_id }
event: token      { delta: "…" }              ← append to the streaming buffer
event: citation   { … }                        ← may arrive mid-stream
event: risk       { level, reason }            ← render escalation card immediately
event: done       { suggested_questions, confidence, response_language }
event: error      { code, message }
```

If the backend cannot stream, the UI falls back to a single request with a strong
"thinking" state (§11.8). **Do not fake streaming by chunking a completed response** —
it wastes time and is dishonest about latency.

### 11.3 Frontend request-handling rules

| Concern | Rule |
|---|---|
| Idempotency | Client-generated `X-Request-Id` per send; reuse on retry so the backend can dedupe |
| Optimistic UI | The user's message renders immediately with `status: "sending"`, before the request resolves |
| Failure | The user's bubble stays with an error border and Retry. **The text is never lost.** |
| Cancel | `AbortController` on Stop; partial text is preserved and marked "stopped" |
| Timeout | 30 s to first token, 120 s total. Both configurable via env. On timeout → retry affordance, not a silent failure |
| Retry | Automatic on network error / 5xx only, max 2 attempts, exponential backoff (1 s, 3 s) with jitter. **Never auto-retry a 4xx.** |
| Concurrency | One in-flight AI request per conversation. Send is disabled while streaming |
| Ordering | Messages ordered by server `created_at`; ties broken by client sequence number |

### 11.4 Response structure — render, don't just dump

Raw model prose is hard to scan, hard to translate consistently, and hard to test. The
assistant answer renders into a fixed five-block structure:

1. **In simple terms** — 1–2 sentences, plain language. Always first, always visible.
2. **What this usually means** — the legal reality, still in plain language.
3. **What you can do** — numbered, concrete, actionable steps.
4. **The law behind this** — collapsible. Act, section, authority. Citations live here.
5. **When to talk to a lawyer** — always present, never omitted.

**If the backend returns unstructured prose**, the frontend renders it as-is inside block
1 and shows blocks 4–5 from static content. Do **not** attempt client-side parsing of
prose into sections with regex — it will fail across six languages. **Ask the backend to
return structure.** §27 Q1.

### 11.5 Uncertainty and honesty UI

- When `confidence` is low or an `uncertainty_flag` is set, render a **calm inline note**
  above the answer (using the `Info` token, not `Warning`): *"This one is less clear.
  Please double-check with a lawyer or your local legal aid office before acting."*
- Never render a low-confidence answer with the same visual authority as a high-confidence
  one.
- If the backend returns no citations for a legal claim, do not manufacture the appearance
  of sourcing (no fake "Sources" heading with nothing under it).
- Every assistant message carries a small, persistent **"Information, not legal advice"**
  label. It is quiet — `--color-text-muted`, `--text-xs` — but always there.

### 11.6 Suggested questions

- Rendered as tappable chips below the latest assistant message.
- Sourced from the backend where possible; static per-category fallbacks otherwise.
- Max 3 on mobile, 4 on desktop. More is noise.
- Tapping sends immediately (no confirm step) — this is Ramesh's primary input method.
- Must be translated: either the backend returns them in `response_language`, or they
  come from local `locales/*.json` fallbacks. Never English chips under a Tamil answer.

### 11.7 Escalation — the interrupt layer

When the backend signals high risk (`risk_level`), or a client-side safety-net heuristic
fires, an **`EscalationCard` renders above the answer**, not after it.

Categories that must escalate: arrest/custody/police detention · domestic violence or
immediate physical danger · child safety · self-harm indications · imminent statutory
deadline · bail · anything involving a minor as victim.

The card contains: a one-line acknowledgement, the relevant helpline as a one-tap `tel:`
link, a link to `/find-help`, and *then* the AI answer below it. The AI answer is **not
suppressed** — the user still gets information — but the human route comes first.

**Ownership:** risk classification is a **backend** responsibility. The frontend keyword
heuristic is a thin safety net for when the backend does not yet return a risk signal;
it must be documented as unreliable and removed once the backend provides one. Building
a serious risk classifier in React is the wrong place to solve this problem. §27 Q8.

### 11.8 Loading states — the honesty ladder

| Elapsed | Display |
|---|---|
| 0–800 ms | Three-dot typing indicator only |
| 0.8–3 s | "Reading your question…" |
| 3–8 s | "Looking through the relevant law…" |
| 8–20 s | "Still working — this one's taking a moment." + Stop button emphasised |
| > 20 s | "This is slower than usual. You can keep waiting or try again." + Retry |
| Timeout | Error state with Retry, user's text preserved |

These strings must be honest, not decorative — do not claim the system is "searching 40
statutes" if it is not.

### 11.9 Message actions

**Copy** — copies plain text (not HTML), *with the disclaimer line appended*. A response
pasted into WhatsApp without its disclaimer is exactly the failure mode this product must
avoid. `navigator.clipboard` with a `document.execCommand` fallback; confirmation toast.

**Share** — `navigator.share` where available; copy-link fallback. Sharing a conversation
requires a backend share mechanism — `TO BE CONFIRMED WITH BACKEND`. **Default to sharing
nothing until that exists**; do not expose conversation ids in guessable URLs.

**Feedback** — 👍/👎, optional one-tap reason chips ("wrong", "confusing", "not in my
language", "too general"). Fire-and-forget POST; UI never blocks on it.

**Regenerate** — only if the backend supports it. Otherwise omit rather than fake.

### 11.10 Where every legal notice appears — placement map

The brief's requirement is that disclaimers be unmissable **without** wrecking usability.
The resolution is *many small, calm, contextual notices* rather than one large modal wall.
A notice a user must dismiss is a notice they learn to dismiss.

| Notice | Where it appears | Form | Dismissible? |
|---|---|---|---|
| **Core disclaimer** ("information, not legal advice") | Footer of every page; trust band on `/`; sticky strip on every chat screen | One line, `--color-text-muted`, links to `/terms` | ❌ Never |
| **Per-response label** | Bottom-left of every assistant message | `--text-xs`, muted | ❌ Never |
| **First-use consent** | Inline above the composer before the *first ever* message, on this device | Compact card: what this is, what it is not, "I understand" | ✅ Once, then stored |
| **AI limitations** | `/how-it-works`, given equal weight to what it can do | Full section | n/a |
| **Uncertainty note** | Above a low-confidence answer | `Info` token, calm — **not** a warning colour | ❌ |
| **"When to see a lawyer"** | Block 5 of every structured answer | Always-present answer block | ❌ |
| **Escalation card** | Above the answer on high-risk queries | Prominent card with `tel:` links + `/find-help` | ❌ |
| **PII hint** | Under the composer, when a pattern is detected in the draft | Quiet inline hint | ✅ Per conversation |
| **Privacy summary** | Top of `/privacy`; linked from consent card and footer | "In short:" plain-language block | n/a |
| **Data handling on upload** | Above the file picker, before selection | Inline warning | ❌ |
| **Language-mismatch notice** | Above an answer returned in an unexpected language | Inline, informational | ✅ |
| **Copy-to-clipboard** | Appended to the copied text itself | Plain-text line | ❌ |
| **No-JavaScript fallback** | `<noscript>` in `index.html` | Helpline numbers + one-paragraph explanation | ❌ |
| **Shared-device warning** | Account area and near conversation history | Inline note + "clear from this device" action | ✅ |

**What is deliberately *not* done:** no full-screen disclaimer gate before first use, no
modal that must be accepted before typing, no repeated interstitials. Those trade real
comprehension for the appearance of compliance — users click through them without reading,
which is legally weaker *and* worse UX.

**Copy ownership:** the wording of every row above must be reviewed by a qualified
advocate before launch (§27 Q14). The frontend owns placement and prominence; it does not
own the words.


---

## 12. Backend Integration

### 12.1 Separation of concerns

The frontend is a pure API client. It holds **no** legal logic, **no** legal content of
its own beyond static UI copy, and **no** persistence of authoritative data.

```
┌────────────────────────┐        HTTPS/JSON        ┌──────────────────────────┐
│  LexGraph Frontend     │  ───────────────────────▶ │  LexGraph Backend        │
│  (this repository)     │  ◀─────────────────────── │  (separate repository)   │
│                        │      JSON / SSE stream    │                          │
│  React SPA             │                           │  API · AI/RAG · DB · Auth│
│  Static host / CDN     │                           │  Legal corpus            │
└────────────────────────┘                           └──────────────────────────┘
         │                                                        │
         └── no direct DB access, no model keys, no secrets ──────┘
```

**Hard rule: no AI provider key, no database credential, and no secret of any kind ever
appears in this repository or in the built bundle.** Everything in a Vite `VITE_*`
variable is public — it ships in the JavaScript. If a value must stay secret, it belongs
on the backend.

### 12.2 Integration status table

| Frontend Feature | Backend Requirement | Endpoint | Status |
|---|---|---|---|
| AI Chat (send message) | AI response API | `TO BE CONFIRMED` | Pending |
| AI Chat (streaming) | SSE / streaming transport | `TO BE CONFIRMED` | Pending |
| Conversation history | Conversation list API | `TO BE CONFIRMED` | Pending |
| Load a conversation | Conversation detail API | `TO BE CONFIRMED` | Pending |
| Delete / rename conversation | Conversation mutation API | `TO BE CONFIRMED` | Pending |
| Authentication | Auth API (login/signup/refresh) | `TO BE CONFIRMED` | Pending |
| Session / current user | Session API | `TO BE CONFIRMED` | Pending |
| Legal search | Search API | `TO BE CONFIRMED` | Pending |
| Knowledge categories | Content taxonomy API | `TO BE CONFIRMED` | Pending |
| Knowledge article | Content detail API | `TO BE CONFIRMED` | Pending |
| Suggested questions | Returned with AI response | `TO BE CONFIRMED` | Pending |
| Citations / sources | Returned with AI response | `TO BE CONFIRMED` | Pending |
| Risk / escalation signal | Returned with AI response | `TO BE CONFIRMED` | Pending |
| Response feedback | Feedback API | `TO BE CONFIRMED` | Pending |
| Language preference sync | User preferences API | `TO BE CONFIRMED` | Pending |
| Legal aid / DLSA directory | Directory API or static data | `TO BE CONFIRMED` | Pending |
| Document upload | Upload API | `TO BE CONFIRMED` | Pending |
| Data export / deletion (DPDP) | Data-rights API | `TO BE CONFIRMED` | Pending |
| Health check | Status endpoint | `TO BE CONFIRMED` | Pending |

### 12.3 Environment variables

`.env.example` (committed) — real `.env` files are gitignored.

```bash
# ---- API ----
VITE_API_BASE_URL=http://localhost:8000        # TO BE CONFIRMED WITH BACKEND
VITE_API_TIMEOUT_MS=30000
VITE_API_STREAM_TIMEOUT_MS=120000

# ---- Feature flags (let the frontend ship ahead of the backend) ----
VITE_FEATURE_AUTH=false
VITE_FEATURE_STREAMING=false
VITE_FEATURE_SEARCH=false
VITE_FEATURE_KNOWLEDGE=false
VITE_FEATURE_UPLOAD=false
VITE_FEATURE_FEEDBACK=false

# ---- App ----
VITE_DEFAULT_LOCALE=en
VITE_SUPPORTED_LOCALES=en,hi,ta,te,bn,kn
VITE_APP_ENV=development
```

> **Feature flags are the mechanism that stops the backend from blocking the frontend.**
> Build every backend-dependent feature behind one. Flag off ⇒ the UI hides the feature
> cleanly, with no broken affordances and no console errors.

### 12.4 The API client layer

One thin wrapper (`src/api/client.ts`) built on `fetch`. Not axios — `fetch` is native,
supports `AbortController` and streaming natively, and saves a dependency.

Responsibilities, in order:
1. Prefix `VITE_API_BASE_URL`
2. Attach `Content-Type`, `Accept-Language`, `X-Request-Id`
3. Attach `Authorization` if auth is enabled and a token exists
4. Apply timeout via `AbortController` + `setTimeout`
5. Parse JSON; on failure, throw a typed `ApiError` — never let a raw HTML error page
   reach a component
6. Normalise every error into `ApiError { code, status, message, requestId, retryable }`
7. Retry per §11.3 rules
8. On 401 (auth enabled): attempt one refresh, then redirect to `/login` — `TBC`

Every endpoint gets a typed function in `src/api/`, e.g. `sendMessage()`, `getConversation()`.
**Components never call `fetch` directly.** This is what makes swapping in the real
endpoints a one-file change per feature.

### 12.5 Error taxonomy

The frontend needs *machine-readable* error codes, not prose. Request this of the backend
(§27 Q10). Frontend mapping:

| Class | HTTP | UI treatment |
|---|---|---|
| Network / offline | — | Offline banner, queue + retry |
| Timeout | — | "Taking longer than usual" + Retry |
| Bad request | 400/422 | Inline field-level message; never blame the user vaguely |
| Unauthorised | 401 | Refresh once → `/login` (if auth on); else generic error |
| Forbidden | 403 | "You don't have access to this conversation" |
| Not found | 404 | Contextual empty state, not the 404 page |
| Rate limited | 429 | Countdown from `Retry-After`, calm copy |
| Server error | 5xx | "Something went wrong on our side" + Retry + request id for support |
| Unavailable | 503 | Maintenance state; assistant disabled, knowledge/`/find-help` still work |
| Unexpected shape | any | Zod parse failure → generic error + console warning in dev only |

**Runtime response validation:** define a Zod schema per endpoint and parse every response.
When the backend contract changes, you get a clear typed failure instead of
`Cannot read property 'map' of undefined` three components deep. This is cheap insurance
given that the contract is entirely unknown today.

### 12.6 CORS

- The backend must send `Access-Control-Allow-Origin` for the frontend's dev origin
  (`http://localhost:5173`) and every deployed origin. `TO BE CONFIRMED WITH BACKEND`.
- If cookie-based auth is used, `Access-Control-Allow-Credentials: true` is required and
  the origin cannot be `*`. Frontend must send `credentials: "include"`.
- Preflight (`OPTIONS`) must be handled for `Authorization` and `X-Request-Id` headers.
- **Dev workaround:** Vite's `server.proxy` can proxy `/api` to the backend, sidestepping
  CORS in development entirely. Use this so a CORS misconfiguration never blocks local
  work — but confirm real CORS headers before staging.

### 12.7 Token / session handling

**Cannot be finalised until the backend auth model is known.** `TO BE CONFIRMED WITH BACKEND`
(§27 Q4–Q6). The frontend's *preference*, with reasoning:

| Option | Frontend view |
|---|---|
| **httpOnly cookie + refresh (preferred)** | XSS cannot read the token. Requires CORS credentials + CSRF protection. Least frontend risk. |
| Access token in memory + refresh in httpOnly cookie | Acceptable. Token lost on refresh; silent re-auth on mount. |
| Token in `localStorage` | **Discouraged.** Any XSS exfiltrates it. Given users paste sensitive legal details here, this is the wrong trade. If the backend forces it, document the risk and tighten CSP hard (§19.3). |

Whatever is chosen: never log the token, never put it in a URL, never send it to a
non-`VITE_API_BASE_URL` origin, and clear it fully on sign-out.

### 12.8 File / document upload — if required

`TO BE CONFIRMED WITH BACKEND` whether this exists at all.

Frontend responsibilities if it does: accept-type allowlist (PDF/JPG/PNG), client-side
size cap, a **clear pre-upload warning** ("this document may contain personal details —
you can black those out first"), upload progress, cancel, retry, and a preview. Client
validation is a UX courtesy; **the backend must validate independently** (§19.6).

### 12.9 Working before the backend exists

Do not sit idle waiting for endpoints. Build against a mock:

- **MSW (Mock Service Worker)** intercepts requests at the network layer and returns
  fixtures that match the conceptual shapes in §11.2.
- Fixtures live in `src/mocks/fixtures/` with realistic multilingual content and
  deliberately include: a slow response, a 500, a 429, a low-confidence answer, an
  escalation-triggering answer, and a response in the "wrong" language.
- The same mocks power component tests and E2E tests (§23).
- **When the real contract arrives, only `src/api/*` and the Zod schemas change.**

---

## 13. Frontend Technology Stack

### 13.1 Recommended stack

| Layer | Choice | Why this and not the alternative |
|---|---|---|
| Framework | **React 18+** | Largest hiring/help pool; the whole plan assumes it; the team likely already knows it. |
| Build tool | **Vite** | Sub-second HMR, trivial config, static output deployable to any CDN. See §13.2 for the Next.js trade-off. |
| Language | **TypeScript (strict)** | The backend contract is unknown — types plus Zod are how you survive it changing. Non-negotiable. |
| Routing | **React Router v6+** | Standard for Vite SPAs; nested layouts, lazy routes, and typed loaders if wanted. |
| Styling | **Tailwind CSS** | Design tokens map cleanly to `theme.extend`; no naming bikeshed; tiny production CSS. Tokens defined as CSS variables so they are not Tailwind-locked. |
| Components | **Radix UI primitives** (headless) | Dialog, Popover, Select, Tabs, Accordion with correct focus trapping and ARIA already solved. **Accessibility is the reason** — hand-rolling a focus-trapped modal is a bug factory. Unstyled, so the palette stays yours. |
| Icons | **lucide-react** | Consistent, tree-shakeable, unopinionated line style that suits an institutional register. |
| Server state | **TanStack Query** | Caching, dedupe, retry, stale-while-revalidate for conversations/search/knowledge. Replaces ~200 lines of hand-rolled fetch state per feature — this is *less* code, not more. |
| Client state | **React Context + `useReducer`** | Language, auth, UI prefs. Small, rarely-changing. See §16. |
| i18n | **react-i18next** | Plurals, interpolation, namespaces, lazy loading, language detection. Rewriting this is a bad use of a semester. |
| Forms | **react-hook-form + Zod** | Only on `/login`, `/signup`, feedback. The chat composer does not need a form library. |
| Markdown | **react-markdown + remark-gfm** | Renders AI/knowledge content **without** `dangerouslySetInnerHTML`. Security-driven choice (§19.4). |
| Validation | **Zod** | Runtime validation of every API response (§12.5) + form schemas. One library, two jobs. |
| Testing | **Vitest + React Testing Library + Playwright + MSW + axe-core** | §23. |
| Lint/format | **ESLint + Prettier + `eslint-plugin-jsx-a11y` + `eslint-plugin-i18next`** | The last two mechanically enforce §17 and §18. |

### 13.2 Vite vs Next.js — the one real trade-off

**Decision: Vite. And you should know exactly what you are giving up.**

Next.js would give server-rendered, indexable knowledge articles. That matters, because
Priya's realistic path to this product is googling *"landlord notice kya karna chahiye"* —
and a client-rendered SPA indexes poorly.

**Why Vite still wins for v1:**
- The backend is a separate repository. Next.js adds a *second* server runtime to deploy
  and reason about, blurring the clean frontend/backend split this project is built on.
- The core product — the assistant — is inherently dynamic and gains nothing from SSR.
- Static output deploys free to Netlify/Cloudflare Pages/GitHub Pages with no Node host.
- Lower conceptual load for a student team: no server/client component boundary, no
  hydration debugging.

**The migration trigger, stated in advance:** if organic search becomes a real acquisition
goal, migrate **only `/knowledge/*`** to Next.js (or pre-render it with `vite-plugin-ssg`).
The chat app stays a client SPA. Do not migrate the whole app.

**Keep the door open now, at near-zero cost:** keep routing declarative and centralised in
one file, keep data fetching in `src/api/` rather than inline in components, and avoid
browser-only globals at module scope. Those three habits make the later split easy.

### 13.3 Explicitly rejected

| Rejected | Reason |
|---|---|
| Redux / Redux Toolkit | State is small and mostly server-owned. TanStack Query + Context covers it. Redux here is ceremony. |
| MUI / Chakra / Ant Design | They arrive with their own design language that fights the cream/navy palette. You would spend more time overriding than building. Radix + Tailwind gives the same accessibility with none of the visual baggage. |
| axios | `fetch` is native, handles streaming and aborts, and one less dependency matters on a mobile-first budget. |
| A CSS-in-JS runtime (styled-components, Emotion) | Runtime cost on low-end devices; Tailwind produces static CSS. |
| GraphQL client | The backend is REST-shaped as far as anyone knows. Do not impose a contract on a repository you have not read. |
| Framer Motion (v1) | ~30 KB for animations this product should barely have. CSS transitions suffice. Revisit only if a real need appears. |
| **UX4G component library** | Its 50+ components target transactional e-governance (OTP, UPI, document verification, SLA tracking); roughly five map onto a conversational product. It would replace Radix + Tailwind — chosen for headless accessibility and palette freedom — and its default theme `#4a2bc2` overwrites §7. Install path unverified (§6A.8 V1). **UX4G's *standards* are adopted in full (§6A Tier 1); only the skin is declined. Reversal trigger stated in §6A.3.** |

---

## 14. Component Architecture

### 14.1 Hierarchy

```
App
├── Providers
│   ├── I18nProvider              react-i18next, locale bootstrapping
│   ├── QueryProvider             TanStack Query client
│   ├── LanguageProvider          selected locale + AI response language
│   ├── AuthProvider              feature-flagged — TBC
│   ├── ToastProvider             transient notifications
│   └── ErrorBoundary             top-level crash net
│
├── RootLayout
│   ├── SkipToContent             a11y: first focusable element
│   ├── Navbar
│   │   ├── Logo
│   │   ├── NavLinks
│   │   ├── LanguageSwitcher      globe + native names
│   │   ├── AccountMenu           feature-flagged
│   │   └── MobileMenuDrawer
│   ├── <Outlet/>
│   └── Footer
│       ├── FooterNav
│       ├── LegalDisclaimerBlock
│       └── HelplineStrip         always-visible route to human help
│
├── LanguageModal                 portal · first visit only
│
├── routes/
│   ├── LandingPage
│   │   ├── HeroPrompt            ← the live input, not a CTA
│   │   ├── ExamplePromptChips
│   │   ├── HowItWorksSteps
│   │   ├── TrustBand
│   │   ├── TopicGrid
│   │   └── HumanHelpCard
│   │
│   ├── ChatPage                  /chat and /chat/:id
│   │   ├── ConversationSidebar
│   │   │   ├── NewConversationButton
│   │   │   ├── ConversationListItem
│   │   │   └── SidebarEmptyState
│   │   ├── ConversationHeader
│   │   ├── EscalationCard        conditional, renders above answers
│   │   ├── MessageList
│   │   │   ├── MessageBubbleUser
│   │   │   ├── MessageBubbleAssistant
│   │   │   │   ├── StructuredAnswer
│   │   │   │   │   ├── PlainSummaryBlock
│   │   │   │   │   ├── MeaningBlock
│   │   │   │   │   ├── NextStepsBlock
│   │   │   │   │   ├── LegalBasisBlock   (collapsible)
│   │   │   │   │   └── SeeALawyerBlock
│   │   │   │   ├── CitationList
│   │   │   │   ├── ConfidenceNote
│   │   │   │   ├── LanguageMismatchNotice
│   │   │   │   └── MessageActions
│   │   │   ├── StreamingIndicator
│   │   │   ├── MessageErrorRetry
│   │   │   └── ScrollToBottomPill
│   │   ├── SuggestedQuestions
│   │   ├── DisclaimerStrip       sticky, one line
│   │   └── ChatComposer
│   │       ├── AutoGrowTextarea
│   │       ├── PiiWarningHint
│   │       ├── SendButton / StopButton
│   │       └── AttachmentButton   feature-flagged
│   │
│   ├── KnowledgePage / CategoryPage / ArticlePage
│   │   ├── CategoryGrid · ArticleCard · ArticleBody
│   │   ├── TableOfContents · LegalTerm · RelatedArticles
│   │   └── AskAboutThisCta
│   │
│   ├── SearchPage
│   │   ├── SearchInput · SearchFilters
│   │   ├── SearchResultItem · SearchEmptyState
│   │   └── AskInsteadCta
│   │
│   ├── FindHelpPage
│   │   ├── EmergencyStrip · HelplineCard
│   │   ├── LegalAidEligibilityInfo
│   │   └── DlsaLocator
│   │
│   ├── HowItWorksPage · PrivacyPage · TermsPage
│   ├── LanguageSettingsPage
│   ├── LoginPage · SignupPage · AccountPage   feature-flagged
│   └── NotFoundPage
│
└── ui/                           the primitive layer
    ├── Button · IconButton · Input · Textarea · Select
    ├── Card · Badge · Chip · Tooltip · Modal · Drawer · Sheet
    ├── Accordion · Tabs · Alert · Toast · Spinner
    ├── Skeleton · EmptyState · ErrorState · VisuallyHidden
    └── LanguageCard
```

### 14.2 What the important components own

| Component | Responsibility | Explicitly not responsible for |
|---|---|---|
| `LanguageModal` | Present six options, capture choice, persist, close. Focus trap, keyboard nav. | Translating anything, calling the API |
| `LanguageSwitcher` | Change locale in place. Announce the change to screen readers. | Page reload |
| `HeroPrompt` | Capture the first message and create a conversation | Rendering any answer |
| `ChatComposer` | Text input, auto-grow, submit/stop, keyboard shortcuts, PII hint | Knowing about the API |
| `MessageList` | Order, virtualise, manage scroll anchoring | Fetching |
| `MessageBubbleAssistant` | Render structured answer, citations, confidence, actions | Interpreting legal meaning |
| `StructuredAnswer` | Map the 5-block schema to markup; degrade to prose if unstructured | Parsing prose into blocks |
| `EscalationCard` | Present human-help routes with maximum clarity | Classifying risk (backend's job) |
| `DisclaimerStrip` | Keep the legal notice permanently visible without stealing space | Being dismissible |
| `CitationList` | Render only what the backend supplied | Generating or guessing citations |
| `LegalTerm` | Plain-language gloss on hover/tap | Being a legal authority |
| `ErrorBoundary` | Catch render crashes; show a localised recovery screen | Retrying network calls |
| `EmptyState` / `ErrorState` | One reusable shape for every §21 state | Feature-specific logic |

### 14.3 Component conventions

- One component per file, named export, colocated `Component.test.tsx`.
- Props typed with an exported `interface`; no `any`, no untyped `props`.
- **Presentational components take data as props and never call the API.** Data fetching
  happens in route components or hooks. This makes everything testable without MSW.
- No raw hex values, no raw pixel values — tokens only (§7, §15.1–15.4).
- No user-facing string literals — `t('key')` only (§17.4).
- Every interactive element has an accessible name; every icon-only button has `aria-label`.

---

## 15. Design System & Folder Structure

### 15.1 Typography

**Latin:** Inter (variable) — high x-height, excellent at small sizes on low-DPI Android.
**Indic:** Noto Sans {Devanagari, Tamil, Telugu, Bengali, Kannada} — the only families
with genuinely complete, consistently-designed coverage across all five scripts.

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-deva: 'Noto Sans Devanagari', var(--font-sans);
--font-taml: 'Noto Sans Tamil', var(--font-sans);
--font-telu: 'Noto Sans Telugu', var(--font-sans);
--font-beng: 'Noto Sans Bengali', var(--font-sans);
--font-knda: 'Noto Sans Kannada', var(--font-sans);
```

Applied via `html[lang="ta"] { --font-app: var(--font-taml); }` etc. — one variable
swap, no per-component logic.

#### Script-aware sizing — this is not optional

Indic scripts carry more vertical information than Latin (matras above, conjuncts below).
At Latin's line-height they collide and clip. **Bump both size and leading for Indic locales:**

```css
:root                { --text-scale: 1;     --leading-scale: 1;    }
html[lang="hi"]      { --text-scale: 1.05;  --leading-scale: 1.15; }
html[lang="bn"]      { --text-scale: 1.05;  --leading-scale: 1.20; }
html[lang="ta"]      { --text-scale: 1.08;  --leading-scale: 1.25; }
html[lang="te"]      { --text-scale: 1.08;  --leading-scale: 1.25; }
html[lang="kn"]      { --text-scale: 1.08;  --leading-scale: 1.25; }
```

**Test this with real sentences, not "Hello World".** Clipped Tamil descenders are a
launch blocker, and they are invisible to anyone testing only in English.

#### Type scale

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `--text-display` | 48 / 1.1 | 700 | Landing hero (desktop) |
| `--text-h1` | 36 / 1.2 | 700 | Page title |
| `--text-h2` | 28 / 1.25 | 600 | Section heading |
| `--text-h3` | 22 / 1.3 | 600 | Card / subsection |
| `--text-h4` | 18 / 1.4 | 600 | Answer block heading |
| `--text-lg` | 18 / 1.6 | 400 | Lead paragraph, chat messages |
| `--text-base` | 16 / 1.65 | 400 | Body — **never below 16 px for legal content** |
| `--text-sm` | 14 / 1.6 | 400 | Secondary, metadata |
| `--text-xs` | 12 / 1.5 | 500 | Labels, timestamps, disclaimer line |

Mobile: display → 32, h1 → 28, h2 → 22, h3 → 19. Body stays 16.
Measure capped at **68 characters** (`max-w-[68ch]`) for all long-form legal text.

### 15.2 Spacing

4 px base. `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 ·
`-10` 40 · `-12` 48 · `-16` 64 · `-20` 80 · `-24` 96.
Section vertical rhythm: 64 mobile / 96 desktop. Card padding: 16 mobile / 24 desktop.

### 15.3 Radius

`--radius-sm` 6 (chips, badges) · `--radius-md` 10 (buttons, inputs) ·
`--radius-lg` 14 (cards, language cards) · `--radius-xl` 20 (modals, chat bubbles) ·
`--radius-full` 9999 (avatars, pills).

Consistent and moderate. Neither sharp-corner brutalism nor pill-everything.

### 15.4 Elevation

Shadows tinted with the navy hue, not neutral black — keeps them in-family.

```css
--shadow-xs: 0 1px 2px rgba(12,24,38,0.06);
--shadow-sm: 0 2px 6px  -1px rgba(12,24,38,0.08);
--shadow-md: 0 6px 16px -4px rgba(12,24,38,0.12);
--shadow-lg: 0 12px 28px -8px rgba(12,24,38,0.16);
--shadow-xl: 0 20px 48px -12px rgba(12,24,38,0.22);   /* modal only */
```

Use borders before shadows. A `1px solid --gray-300` card on cream reads as more
serious than a floating one — which suits the register.

### 15.5 Cards

Default: `bg --color-surface`, `border 1px --color-border`, `radius-lg`, `shadow-xs`.
Interactive: hover → `border --navy-400` + `shadow-sm`, `transition 150ms ease-out`
(disabled under reduced-motion). Never translate a card on hover — it causes layout
jitter on touch devices.

### 15.6 Buttons

Heights: sm 36 · md 44 · lg 52. **Minimum 44 px anywhere a finger is expected**; 48 px on
the `/find-help` helpline strip.
Padding: `0 --space-4` (sm/md), `0 --space-6` (lg).
Radius `--radius-md`, weight 600, `--text-base` (sm: `--text-sm`).
Focus: `--focus-ring` with 2 px offset — **never `outline: none` without a replacement.**
Loading: spinner replaces the label, width locked to prevent layout shift, `aria-busy`.

### 15.7 Form fields

Label above input, always visible — **never placeholder-as-label.** (Placeholders vanish
on focus, fail translation, and fail screen readers.)
Input: `bg --color-surface`, `border 1px --gray-300`, `radius-md`, height 44, padding
`--space-3`, `--text-base` (**16 px minimum — anything smaller triggers iOS auto-zoom**).
Focus: `border --navy-600` + `--focus-ring`. Error: `border --error-border`, message
below in `--error-fg` with `role="alert"` and `aria-describedby` wiring.
Helper text below in `--color-text-muted`, `--text-sm`.

### 15.8 Modals

Scrim `--color-overlay`, surface `--color-surface`, `--radius-xl`, `--shadow-xl`.
Max width 520 (language modal) / 640 (content). Mobile: full-width bottom sheet with a
drag handle, `max-height: 90vh`, internal scroll.
Focus trapped on open, restored to the trigger on close, Esc closes,
`aria-modal="true"` + `aria-labelledby`. Use Radix Dialog — do not hand-roll.

### 15.9 Chat message styling

| | User | Assistant |
|---|---|---|
| Align | Right | Left, full-width on mobile |
| Background | `--navy-100` (#E8F0F7) | `--cream-50` (#FDFBF7) |
| Border | none | `1px --gray-200` |
| Text | `--gray-900` | `--gray-800` |
| Radius | `--radius-xl`, bottom-right 6 | `--radius-xl`, bottom-left 6 |
| Max width | 78% desktop / 88% mobile | 100% (long structured content) |
| Padding | 12 / 16 | 16 / 20 |
| Font | `--text-lg` | `--text-lg`, blocks at `--text-base` |

Assistant answer blocks: headings at `--text-h4` in `--color-text-strong`; a
`3px --cream-400` left accent bar on the "In simple terms" block only, so the eye lands
there first. `LegalBasisBlock` collapsed by default on mobile, expanded on desktop.
`Information, not legal advice` label at `--text-xs` `--color-text-muted`, bottom-left.

### 15.10 Icons

lucide-react, 20 px default (16 inline, 24 nav), `stroke-width: 1.75`, `currentColor`
always. Decorative icons `aria-hidden="true"`; meaningful icons get a text label or
`aria-label`. **Never use an icon alone to convey legal meaning.**

### 15.11 Navigation

Desktop: 64 px bar, `--color-surface` with `1px --gray-300` bottom border, sticky.
Links `--text-base`, active state a 2 px `--navy-600` underline (not a colour change
alone — colour alone fails colour-blind users).
Mobile: 56 px bar, logo + hamburger + language globe. Drawer slides from the right,
full-height, focus-trapped, Esc-closable.

### 15.12 Motion

Durations: 120 ms micro · 180 ms standard · 240 ms modal/drawer. Easing
`cubic-bezier(0.2, 0, 0, 1)`. Animate `opacity` and `transform` only.
No parallax, no scroll-jacking, no entrance animations on content. Under
`prefers-reduced-motion: reduce`, all durations → 0.01 ms except opacity fades.

### 15.13 Aesthetic guardrails (enforced in review)

**Banned:** multi-stop gradients · glassmorphism / heavy backdrop blur · neon or
saturated accent colours · dark-mode-only aesthetics · 3D or isometric illustration ·
animated blobs · emoji as UI iconography · faux-terminal typography · "AI sparkle" motifs.

**Aimed for:** generous whitespace · one accent colour used sparingly · real borders ·
type hierarchy doing the work instead of colour · flat, calm surfaces · the feel of a
well-designed public institution, not a Series-A landing page.

### 15.14 Folder structure

Adapted to Vite + React. Rationale for the boundaries follows in §15.15.

```
lexgraph-frontend/
├── public/
│   ├── fonts/                     self-hosted subsetted WOFF2
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── api/                       ONE typed function per endpoint. Components never fetch.
│   │   ├── client.ts              fetch wrapper: base URL, headers, timeout, retry, errors
│   │   ├── errors.ts              ApiError + HTTP→UI-state mapping
│   │   ├── schemas/               Zod schema per response — the real contract
│   │   ├── chat.ts · conversations.ts · knowledge.ts · search.ts · auth.ts
│   │   └── stream.ts              SSE consumer
│   ├── assets/                    illustrations, icons, images
│   ├── components/
│   │   ├── ui/                    primitives — no business logic, no API awareness
│   │   ├── layout/                Navbar, Footer, RootLayout, MobileDrawer
│   │   ├── language/              LanguageModal, LanguageSwitcher, LanguageCard
│   │   ├── chat/                  MessageList, MessageBubble, ChatComposer, …
│   │   ├── legal/                 DisclaimerStrip, EscalationCard, LegalTerm, CitationList
│   │   ├── knowledge/             ArticleBody, TableOfContents, CategoryGrid
│   │   └── feedback/              EmptyState, ErrorState, Skeleton, Toast
│   ├── contexts/                  Language, Auth, UiPrefs, Toast — small, stable state only
│   ├── hooks/                     useLanguage, useLocalStorage, useConversation,
│   │                              useStreamingMessage, useDocumentTitle, useMediaQuery
│   ├── i18n/                      index.ts, config.ts, locales/{en,hi,ta,te,bn,kn}/*.json
│   ├── layouts/                   RootLayout, ChatLayout, ContentLayout, AuthLayout
│   ├── lib/                       framework-agnostic helpers: sanitize, pii, format, cn
│   ├── mocks/                     MSW handlers + fixtures — dev and test
│   ├── routes/                    one folder per page + index.tsx route table
│   ├── styles/                    tokens.css · globals.css · fonts.css
│   ├── types/                     shared domain types (Message, Conversation, Locale…)
│   ├── App.tsx · main.tsx · vite-env.d.ts
├── tests/e2e/                     Playwright specs
├── .env.example · .eslintrc.cjs · tailwind.config.ts · tsconfig.json
├── vite.config.ts · playwright.config.ts · vitest.config.ts
└── README.md                      ← this document
```

### 15.15 Why these boundaries

| Directory | The rule it enforces |
|---|---|
| `api/` | **The only place `fetch` is called.** Swapping in real endpoints touches this and nothing else. |
| `components/ui/` | Primitives know nothing about legal domain or API. Reusable, trivially testable. |
| `components/legal/` | Compliance-critical UI is grouped so it can be reviewed as a unit by a non-developer. |
| `contexts/` | Only small, slow-changing state. Server data does not belong here (§16). |
| `i18n/` | The single source of every user-facing string. |
| `lib/` | Pure functions, no React. Unit-testable with zero setup. |
| `mocks/` | Lets the frontend ship ahead of the backend, and powers the test suite. |
| `types/` | Domain types shared across layers; API-response types are derived from Zod schemas. |

---

---

## 16. State Management

### 16.1 Classify the state first

| State | Kind | Where it lives |
|---|---|---|
| Selected UI locale | Client, global, persisted | `LanguageContext` + `localStorage` |
| Preferred AI response language | Client, global, persisted | `LanguageContext` |
| Disclaimer consent | Client, global, persisted | `localStorage` (+ backend if it records consent — TBC) |
| Current user / auth | Server-derived, global | `AuthContext`, hydrated by TanStack Query |
| Auth token | Sensitive | Memory or httpOnly cookie — §12.7 |
| Conversation list | **Server** | TanStack Query |
| Conversation detail / messages | **Server** | TanStack Query |
| In-flight streaming message | Client, transient | `useReducer` local to `ChatPage` |
| Composer draft text | Client, local | `useState` (+ `sessionStorage` per conversation) |
| Knowledge articles / categories | **Server**, cacheable | TanStack Query, long `staleTime` |
| Search results | **Server** | TanStack Query, keyed on query+filters |
| Sidebar open, modal open, toasts | Client, ephemeral | `useState` / `ToastContext` |
| Reduced motion, font size pref | Client, persisted | `UiPrefsContext` |

### 16.2 The rule

> **If it comes from the backend, it is TanStack Query's. If it is a user preference or a
> UI toggle, it is Context or local state. Nothing else is needed.**

Most state-management pain comes from putting server data in a client store and then
hand-writing cache invalidation. TanStack Query removes that entire category of bug.

### 16.3 Streaming state

The streaming assistant message is the one genuinely tricky piece. It is **not** in the
Query cache while streaming — it is local reducer state in `ChatPage`:

```
IDLE ──send──▶ SENDING ──first token──▶ STREAMING ──done──▶ COMMITTED
  ▲               │                          │                  │
  │               └──error──▶ FAILED         └──stop──▶ STOPPED  │
  └──────────────────────────── retry ◀──────────────────────────┘
```

On `COMMITTED` / `STOPPED`, write the final message into the Query cache
(`queryClient.setQueryData`) and drop the local buffer. This keeps re-renders scoped to
one component while tokens arrive at high frequency — important on low-end phones.

### 16.4 Query configuration

```
defaults: staleTime 60_000 · gcTime 300_000 · retry 2 (network/5xx only)
          refetchOnWindowFocus false        ← a legal answer should not silently change
knowledge articles: staleTime 3_600_000     ← content changes rarely
conversation list:  invalidate after send/delete/rename
search:             keepPreviousData true   ← no flicker while typing
```

### 16.5 Not using Redux — the reason

There is one large piece of shared mutable state (the conversation) and it is server-owned.
Everything else is a preference. Redux would add a store, actions, reducers, selectors, and
middleware to manage a locale string and a boolean. **If** the app later grows collaborative
editing or complex offline sync, revisit. Not before.

---

## 17. Internationalization

### 17.1 Structure

```
src/i18n/
├── index.ts                 i18next init, detection, fallback chain
├── config.ts                SUPPORTED_LOCALES, metadata, font map, direction
└── locales/
    ├── en/  common.json · landing.json · chat.json · knowledge.json
    │        legal.json · errors.json · a11y.json
    ├── hi/  … same namespaces
    ├── ta/  … │  te/ … │  bn/ … │  kn/ …
```

**Namespaces, not one giant file.** `common` + the current route's namespace load on
demand; the rest are lazy. Keeps the initial bundle small on a metered connection.

`config.ts` holds per-locale metadata in one place:

```ts
{ code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil',
  dir: 'ltr', font: 'var(--font-taml)', textScale: 1.08, leadingScale: 1.25 }
```

### 17.2 Key conventions

`namespace:section.element.state` — always semantic, never English-derived.

```
✅ chat:composer.placeholder
✅ chat:error.timeout.title
✅ legal:disclaimer.short
✅ a11y:languageModal.closeLabel
❌ chat:describeYourLegalProblemBelow    ← breaks when copy changes
❌ button1                                ← meaningless
```

Rules: never build a sentence by concatenating keys (word order differs across all six
languages). Use interpolation and ICU plurals instead:

```json
{ "results.count_one":   "{{count}} result",
  "results.count_other": "{{count}} results" }
```

Hindi, Bengali, Tamil, Telugu and Kannada have their own plural rules — let i18next
handle them; never write `count === 1 ? ... : ...` in a component.

### 17.3 Detection & persistence

```
1. localStorage["lexgraph.locale"]
2. ?lang= query param        (shareable links, QR codes, campaigns)
3. navigator.languages       (pre-highlight only — never silently applied)
4. 'en'
```

Persist on every explicit change. Update `<html lang>` and `<html dir>` on change.
Announce the change via a polite live region (§18.9).

### 17.4 No hardcoded strings — enforced

- `eslint-plugin-i18next` rule `no-literal-string` set to **error** for `src/components/**`
  and `src/routes/**`.
- CI fails the build on violation.
- **A CI script compares every locale's key set against `en`** and fails on missing keys
  in a release build (warn-only on feature branches so work is not blocked).

### 17.5 Fallback behaviour

- Missing key → fall back to `en` → if still missing, render the key **only in dev**; in
  production render the English string. Never render a raw key or an empty span to a user.
- `saveMissing: true` in development writes missing keys to a report for the translators.
- **Never fall back to an auto-translated string.** Machine-translating a legal term at
  runtime is precisely the failure this product must not have.

### 17.6 Switching at runtime

`i18next.changeLanguage(code)` → React re-renders. No reload, no route change, scroll
position preserved. The locale's font stylesheet is lazily fetched on first use with a
`--font-app` swap; because a metric-compatible fallback is defined, the reflow is minor.

Mid-conversation switching: **the UI switches; past messages do not retranslate.** Each
message keeps its own `language` field and renders in its own font. A polite inline note
offers: *"Ask your next question in Tamil?"* — because that is the honest behaviour, and
silently mixing languages without explanation is confusing.

### 17.7 RTL — future-proofing at zero cost today

No launch language is RTL, but Urdu and Kashmiri are plausible additions.

Cost-free habits to adopt now: use logical CSS properties (`margin-inline-start`, not
`margin-left`; `padding-inline`, `inset-inline-start`); enable Tailwind's logical-property
utilities; keep `dir` in `config.ts` and set `<html dir>` from it; never hardcode
`text-align: left`; mirror directional icons with `[dir="rtl"] &{ transform: scaleX(-1) }`.

Doing this from day one costs nothing. Retrofitting it costs weeks.

### 17.8 AI response language — restated as a build rule

1. Frontend sends `preferred_language`. Backend decides and reports `response_language`.
2. Frontend **never** translates AI legal content client-side.
3. On mismatch → calm inline notice, never an error.
4. Suggested questions and citation labels must match `response_language`.
5. Statute names and section numbers stay canonical (§8.4 rule 5).
6. Every message carries its own language so fonts and `lang` attributes are per-bubble —
   which is also what makes screen readers pronounce them correctly (§18.5).

### 17.9 Translation workflow (process, not code)

English is the source of truth. Every new key lands in `en/` first, gets a
`_comment` field describing context, then goes to translators. **Legal-facing strings —
disclaimers, escalation copy, privacy summaries — require review by a native speaker
with legal familiarity, not a generic translation.** Track translation status per
namespace in a simple sheet. Budget real time for this; it is routinely underestimated.

---

## 18. Accessibility

Target: **WCAG 2.2 Level AA**, which also satisfies **GIGW 3.0**'s WCAG 2.1 AA
requirement (§6A.2). This is not a compliance box on a legal-aid product — the users least
served by the existing legal system overlap heavily with users least served by
inaccessible software.

**Stated conformance target, published at `/accessibility` (§6A.6):** WCAG 2.2 Level AA,
aligned with GIGW 3.0 (Guidelines for Indian Government Websites and Apps) and the
accessibility guidance of [UX4G](https://www.ux4g.gov.in/). LexGraph is **not** a
government service and makes no claim of official status (§0.4); it builds to the
government standard because that standard is good.

### 18.1 Semantic HTML first

One `<main>` per page. Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
Headings in order, never skipping levels, never chosen for size (size is a token's job).
`<button>` for actions, `<a>` for navigation — **never a clickable `<div>`.**
Lists as `<ul>`/`<ol>`. Forms with real `<label for>`.

### 18.2 Keyboard

- Every interactive element reachable by Tab in a logical order.
- **"Skip to main content"** as the first focusable element on every page.
- Modals: focus moves in on open, is trapped, returns to the trigger on close, Esc closes.
- Language modal: Arrow keys move between cards (radiogroup pattern), Enter/Space selects.
- Chat: `Enter` sends, `Shift+Enter` newline, `Esc` stops generation. `/` focuses the
  composer from anywhere on the chat page (documented in a keyboard-shortcuts sheet).
- Drawers/sheets behave as modals.
- **No keyboard traps.** Verified manually — automated tools miss these.

### 18.3 Focus visibility

`:focus-visible` styling on 100% of interactive elements, using `--focus-ring`
(3 px `rgba(58,110,165,0.45)`) with 2 px offset. Verified against **every** background:
cream, white, navy, cream-200. `outline: none` without a replacement is a CI-failing lint error.

### 18.4 Contrast

All token pairs verified in §7.2/§7.3. Additional binding rules:

- Body text ≥ 4.5 : 1. Large text (≥ 18.66 px bold / 24 px) ≥ 3 : 1.
- **UI components and focus indicators ≥ 3 : 1** (WCAG 2.2 SC 1.4.11) — this is what
  disqualified `#264468` on `#18304A`.
- Placeholder text ≥ 4.5 : 1 — `--gray-500` on white is 3.45 : 1, so placeholders use
  `--gray-600` (5.10 : 1).
- Disabled controls are exempt from contrast minimums but must not be the *only* signal;
  pair with `aria-disabled` and explanatory text.
- **Never colour alone.** Errors get an icon + text. Active nav gets an underline. Risk
  gets a label, not just a red tint.

### 18.5 Screen readers

- `<html lang>` matches the UI locale; **each message bubble carries its own `lang`** so
  a Tamil answer in an English UI is pronounced correctly.
- Icon-only buttons: `aria-label`, translated (`a11y:` namespace).
- Decorative icons/images: `aria-hidden="true"` / `alt=""`.
- Language modal: `role="dialog"` `aria-modal="true"` `aria-labelledby`; cards as
  `role="radio"` inside `role="radiogroup"` with `aria-checked`.
- Chat transcript: `<ol>` of messages, each `<li>` with a visually-hidden
  "You said" / "Assistant said" prefix.
- Collapsible legal-basis block: `aria-expanded` + `aria-controls` on the trigger.
- Tested on **NVDA + Firefox**, **VoiceOver + Safari (iOS)**, **TalkBack + Chrome (Android)**.
  TalkBack matters most here — it is what Priya's phone has.

### 18.6 Live regions

| Event | Region | Politeness |
|---|---|---|
| AI response streaming | Message container | `aria-live="polite"` `aria-atomic="false"` |
| Response complete | Status region | `polite` — "Response complete" |
| Send failed | Error region | `assertive` |
| Language changed | Status region | `polite` |
| Search results updated | Results region | `polite` — "12 results" |
| Escalation card appears | Escalation region | **`assertive`** — this one must interrupt |
| Toast | Toast container | `polite` (`assertive` for errors) |

**Do not** put `aria-live="assertive"` on the streaming text — a screen reader would
re-announce on every token and become unusable. Announce completion, not tokens.

### 18.7 Touch targets

Minimum 44×44 CSS px (WCAG 2.2 SC 2.5.8), **48×48 on `/find-help` helplines and the
language cards**. Minimum 8 px between adjacent targets. Thumb-reach: primary actions in
the lower two-thirds on mobile — which is why the composer is bottom-anchored.

### 18.8 Forms

Visible persistent labels. `aria-describedby` links helper and error text.
`aria-invalid="true"` on invalid fields. Errors announced via `role="alert"` **and** shown
inline. Error summary at the top of long forms, with links that move focus to the field.
`autocomplete` attributes on auth fields. Never validate-on-keystroke before first blur.

### 18.9 The language selector specifically

Because it is the first thing a user meets, it gets extra scrutiny:
radiogroup semantics · arrow-key navigation · native name as the accessible name with the
English name as description · selected state signalled by **check icon + border + `aria-checked`**
(three signals, not just colour) · Esc dismisses to English · the close button's `aria-label`
present in both English and the highlighted language · fully operable at 200% browser zoom.

### 18.10 Reduced motion & zoom

`@media (prefers-reduced-motion: reduce)` → all transitions to 0.01 ms except opacity;
no auto-playing anything; the typing indicator becomes static text.
Layout must survive **200% zoom** and **400% zoom with reflow** (SC 1.4.10) — no horizontal
scrolling at 320 px CSS width. Respect user font-size settings: `rem` units throughout,
never `px` for text.

### 18.11 Verification

- `eslint-plugin-jsx-a11y` in CI (catches static markup problems).
- `axe-core` via `@axe-core/playwright` on every route in E2E — **CI fails on any
  serious/critical violation.**
- Manual keyboard-only pass on the full journey, per release.
- Manual screen-reader pass on: language modal, chat, `/find-help`. Per release.
- **Automated tools catch roughly a third of real issues. The manual passes are not optional.**

---

## 19. Security & Privacy

Users will paste tenancy disputes, FIR details, salary figures, family matters, and
Aadhaar numbers into this product. Treat that accordingly.

### 19.1 Split of responsibility

| Concern | Frontend | Backend |
|---|---|---|
| Transport encryption | Enforce HTTPS, HSTS via host | TLS termination, valid certs |
| AuthN / AuthZ | Store & attach token; guard routes as UX | **Authoritative** enforcement |
| Input validation | UX-level only | **Authoritative** |
| Output escaping | Sanitise before render | Sanitise before store |
| Rate limiting | Present the 429 kindly | **Authoritative** |
| PII handling | Warn before send; minimise local storage | Detect, redact, retain, delete |
| Secrets | **Hold none** | All of them |
| Audit / consent records | Capture the interaction | **Persist the record** |
| Data deletion (DPDP) | Expose the control | Actually delete |

> **Frontend route guards are a user-experience feature, not a security boundary.**
> Anyone can edit client JavaScript. Every protected resource must be enforced server-side.

**GIGW 3.0 cybersecurity pillar (§6A.2).** GIGW's security chapter, authored by CERT-In,
is grounded in ISO 27001, OWASP, and CIS benchmarks and spans design through deployment.
Most of it is backend and infrastructure territory. The frontend's share of it is already
covered below — CSP (§19.3), XSS prevention (§19.4), dependency hygiene (§19.8), secure
token handling (§12.7), and transport enforcement. **Hand the CERT-In chapter to whoever
owns the backend and the deployment; do not assume frontend measures satisfy it.**

### 19.2 Do not store sensitive conversations locally

- **Never** write message content to `localStorage`. Conversations belong on the backend
  (if the user has an account) or nowhere.
- Composer drafts may go to `sessionStorage`, keyed per conversation, cleared on send and
  on sign-out. `sessionStorage` dies with the tab — appropriate for a draft, not a transcript.
- `localStorage` holds only: `lexgraph.locale`, `lexgraph.consent.v1`,
  `lexgraph.ui.reducedMotion`. Nothing else. Ever.
- On sign-out: clear all app storage, reset the Query cache
  (`queryClient.clear()` — otherwise the previous user's conversations sit in memory).
- **Shared devices are the norm** in this user base — cybercafés, family phones. Offer a
  visible "Clear this conversation from this device" action, and never render a history
  sidebar to a logged-out user.

### 19.3 Content Security Policy

Set via host headers (not `<meta>`, which cannot express all directives):

```
default-src 'self';
script-src  'self';
style-src   'self' 'unsafe-inline';        /* Tailwind-injected styles */
font-src    'self';                        /* fonts are self-hosted */
img-src     'self' data: https:;
connect-src 'self' <VITE_API_BASE_URL>;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests;
```

Plus `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: geolocation=(), microphone=(), camera=()`.

**No `'unsafe-eval'`. No wildcard `connect-src`.** If a dependency needs `unsafe-eval`,
replace the dependency.

### 19.4 XSS prevention

React escapes by default — the risk is where that is bypassed.

- **`dangerouslySetInnerHTML` is banned.** Add an ESLint rule (`react/no-danger`: error).
- AI responses and knowledge content render through `react-markdown` with `remark-gfm` and
  **no** `rehype-raw`. Markdown in, no HTML through.
- If the backend insists on returning HTML, DOMPurify with a strict allowlist
  (`p, br, strong, em, ul, ol, li, a, h2-h4, blockquote, code, table…`) and
  `a[target=_blank] → rel="noopener noreferrer"`. **Ask for Markdown instead** — §27 Q9.
- Never interpolate user or AI text into `href`. Validate the scheme; allow only
  `https:`, `mailto:`, `tel:`. Block `javascript:` and `data:` explicitly.
- Never build a URL for `window.open` / `location.assign` from model output unvalidated.
- Citation URLs from the backend get the same scheme validation.

### 19.5 PII awareness in the composer

A small, quiet, non-blocking hint. A client-side regex pass on the composer draft (never
transmitted anywhere) flags patterns resembling Aadhaar (12 digits), PAN, phone numbers,
bank account numbers, and card numbers:

> *"You don't need to share your Aadhaar or account number to get help. You can remove it."*

Rules: **never block the send**, never auto-edit the text, never log what was detected,
dismissible, shown at most once per conversation. This is a nudge, not a filter — real
redaction is a backend responsibility.

### 19.6 File upload (if it exists)

Client-side: type allowlist by extension **and** sniffed MIME, size cap, filename
sanitisation for display (never render a raw filename as HTML), a warning about personal
details in documents, and no client-side preview of untrusted HTML/SVG.
**The backend must re-validate everything** — client checks are trivially bypassed.

### 19.7 Privacy posture

- **No third-party analytics in v1.** If analytics are later needed, self-host (Plausible/
  Umami), collect no message content, no free-text, and no user identifiers; add a consent
  banner at that point and not before. Sending legal queries to a third-party analytics
  provider would be indefensible.
- No third-party fonts, scripts, tag managers, chat widgets, or embeds. The CSP enforces this.
- No conversation IDs in `document.title`, in `referrer`-leaking URLs, or in error reports.
- Error reporting (Sentry etc.), if added: scrub all message bodies, all form values, all
  URLs containing conversation IDs. Default-deny, allowlist what is sent. `TBC` in §27.
- **DPDP:** consent notice must be renderable in all six languages; the account area
  exposes data export and deletion. What those actions call is a backend question (§27 Q12).
  [Likely — confirm current obligations and deadlines with counsel.]

### 19.8 Dependency hygiene

`npm audit` in CI · Dependabot/Renovate on · lockfile committed · new dependencies require
justification in review (bundle size, maintenance, transitive count) · no dependency added
solely to save fewer than ~50 lines.

---

## 20. Responsive Design

### 20.1 Breakpoints

| Token | Min width | Target |
|---|---|---|
| *(base)* | 320 px | Small Android — **must work here**, the floor |
| `sm` | 640 px | Large phone / small tablet portrait |
| `md` | 768 px | Tablet portrait |
| `lg` | 1024 px | Tablet landscape / small laptop |
| `xl` | 1280 px | Desktop |
| `2xl` | 1536 px | Large desktop (content capped, not stretched) |

**Mobile-first CSS.** Base styles are the mobile styles; breakpoints add, never subtract.

### 20.2 Mobile is not a squeezed desktop

| Element | Mobile (< 768) | Desktop (≥ 1024) |
|---|---|---|
| Navigation | 56 px bar, hamburger drawer, globe icon visible | 64 px bar, inline links, labelled switcher |
| Language modal | Full-width bottom sheet, 1 column, drag handle, 90 vh | Centred dialog, 2 columns, 520 px |
| Landing hero | Input above the fold, headline shrinks first | Full display type + input side-by-side |
| Chat sidebar | Slide-over drawer | Persistent 280 px column |
| Chat composer | Sticky bottom, `visualViewport`-aware, 5-row max | Inline, 8-row max |
| Message actions | Bottom sheet on long-press | Hover-revealed icon row |
| Legal-basis block | Collapsed | Expanded |
| Suggested questions | Horizontal scroll, max 3 | Wrapped row, max 4 |
| Knowledge cards | 1–2 columns | 3 columns |
| Article TOC | Collapsible accordion at the top | Sticky right rail |
| Search filters | Bottom-sheet filter button | Inline sidebar |
| Tables | Card-per-row, or horizontally scrollable in a labelled container | Standard table |
| Footer | Accordion sections | Multi-column |
| Helpline strip | **First on screen, one-tap dial** | Prominent card |

### 20.3 The mobile keyboard problem

The most-broken thing in mobile chat interfaces. Budget real time.

- Use the `visualViewport` API to reposition the composer when the keyboard opens; do not
  rely on `100vh` (it is wrong on mobile Safari).
- Use `100dvh` where supported with a `100vh` fallback.
- `env(safe-area-inset-bottom)` for notch/home-indicator devices.
- Input `font-size: 16px` minimum — smaller triggers iOS auto-zoom, which breaks layout.
- After sending, keep the keyboard open (do not blur) so a follow-up is one tap away.
- Test on real iOS Safari and real Android Chrome. Emulators lie about this specifically.

### 20.4 Long AI responses on small screens

Structured blocks with clear headings · legal-basis collapsed by default · citations
collapsed with a count ("3 sources") · a floating "↓ New message" pill when scrolled up ·
"Copy" always reachable without scrolling to the message end (sticky action row on the
message when it is taller than the viewport) · code/statutory quote blocks scroll
horizontally **inside their own container** — the page body never scrolls sideways.

### 20.5 Typography & images

Fluid type with `clamp()` between the mobile and desktop values from §15.1. Measure capped
at 68ch. Never below 16 px body.
Images: `srcset` + `sizes`, WebP with fallback, explicit `width`/`height` to reserve space
(prevents CLS), `loading="lazy"` below the fold, `alt` in the active locale.

### 20.6 Device matrix to test

Real devices where possible: a ~₹8–10k Android (Chrome), a mid-range Android, iPhone SE
(smallest current viewport), a recent iPhone, iPad, and desktop at 1280 + 1920.
Plus: 320 px width, 200% zoom, 400% zoom, landscape phone, and **each of the six languages
on at least two devices** — string length varies enough to break layouts.

---

## 21. Error & Empty States

**Principle: no blank screens, no raw error codes, no dead ends.** Every state answers
three questions: *what happened*, *what can I do*, *where else can I go*.

### 21.1 The catalogue

| Scenario | What the user sees | Primary action | Escape hatch |
|---|---|---|---|
| **Backend unavailable (5xx/503)** | "LexGraph is having trouble right now. This isn't your fault." Illustration in cream/navy. | Try again | `/knowledge` + `/find-help` **still work** (static/cached) |
| **AI request failed** | Inline under the user's message, which is preserved | Retry (reuses `X-Request-Id`) | Rephrase, or `/find-help` |
| **Timeout** | "This is taking longer than usual." | Keep waiting / Try again | New conversation |
| **Network offline** | Persistent banner; composer disabled with an explanation | Auto-retry on reconnect | Cached knowledge pages |
| **Rate limited (429)** | "You've asked a lot of questions quickly. Try again in {n}s." Countdown from `Retry-After`. | Wait | `/knowledge`, `/find-help` |
| **No search results** | Query echoed, spelling suggestion if provided, popular topics | **"Ask the assistant about this"** | Browse categories |
| **Empty conversation** | Warm greeting + suggested starters | Type or tap a chip | Browse knowledge |
| **No conversation history** | "Your conversations will appear here." Explains where it is stored. | Start a conversation | — |
| **Conversation not found / not owned** | "We couldn't find that conversation." | New conversation | Home |
| **Invalid input** (empty / too long) | Inline, below the composer, non-blocking | Edit | — |
| **Auth failed** | "That email or password didn't match." **Never** reveal which. | Retry / reset password | Continue without an account |
| **Session expired** | Toast + return to the page after re-auth; **draft preserved** | Sign in | Continue logged out |
| **Unsupported language requested** | "We don't support that language yet. Showing English." | Pick a supported one | — |
| **Translation unavailable for content** | Inline banner on the article: "Not available in Bengali yet." | Read in English | Ask the assistant |
| **Unexpected response shape (Zod fail)** | Generic error + request id for support. Details to console **in dev only**. | Retry | Report a problem |
| **Render crash (ErrorBoundary)** | Localised recovery screen; app shell intact | Reload this section | Home / `/find-help` |
| **Feature flag off** | Feature simply absent — **no greyed buttons, no "coming soon"** | — | — |
| **404** | Localised, with search | Search | Home / chat / knowledge / find-help |

### 21.2 Error copy rules

Plain language, no codes in the headline. Never blame the user. Never say "Oops!" or
"Something went wrong" alone. Always give a next action. Always translate. Always show
the request id in small muted text on server errors, so support can trace it.

**Bad:** `Error 500: Internal Server Error`
**Good:** "Something went wrong on our side. Your question is saved — try sending it
again. If it keeps happening, mention this code: `a3f9c2`."

### 21.3 Degradation ladder

If the AI endpoint is down, the product does **not** go down:

```
AI available          → full experience
AI down, content up   → knowledge + search + /find-help; assistant shows a clear notice
Everything down       → static shell: disclaimer, helplines, offline knowledge cache
No JS / JS failed     → <noscript> with the emergency helpline numbers and a plain
                        explanation. Someone in crisis with a broken bundle should
                        still see "call 15100".
```

That last line is the one people forget. Write the `<noscript>` block on day one.

---

## 22. Performance

### 22.1 Budgets

| Metric | Target | Measured on |
|---|---|---|
| LCP | < 2.5 s | Moto G Power, Slow 4G |
| INP | < 200 ms | same |
| CLS | < 0.1 | same |
| TTFB | < 600 ms | CDN edge |
| Initial JS (gzip) | **< 180 KB** | production build |
| Initial CSS (gzip) | < 20 KB | production build |
| Per-locale font payload | < 90 KB | subsetted WOFF2 |
| Time to first AI token | < 3 s | backend-dependent |
| Lighthouse Performance | ≥ 90 mobile | CI |

**Justification for a hard JS budget:** Priya's data plan is metered and her phone is slow.
A 600 KB bundle is a real cost to her, not an abstraction. Fail CI on regression
(`rollup-plugin-visualizer` + a size-limit check).

### 22.2 Fast initial load

Route-level code splitting (§22.3) · only `common` + `landing` i18n namespaces in the
initial payload · fonts subsetted and preloaded (only the modal subset on first paint,
§8.5) · no third-party scripts at all · Brotli from the CDN · long-cache hashed assets ·
critical CSS inlined by Vite's default.

### 22.3 Code splitting

```
Eager:  App shell, Navbar, Footer, LandingPage, LanguageModal, error/empty primitives
Lazy:   ChatPage · KnowledgePage · ArticlePage · SearchPage · FindHelpPage
        · Auth pages · AccountPage · legal documents · markdown renderer
        · every non-active locale bundle
```

`React.lazy` + `Suspense` with a skeleton fallback (never a bare spinner).
**Prefetch on intent:** `onMouseEnter`/`onFocus` of a nav link starts the chunk fetch, so
by the time the click lands the chunk is warm.

### 22.4 Runtime

Virtualise the message list beyond ~80 messages (`@tanstack/react-virtual`).
Streaming tokens update a single local buffer, not the global store (§16.3) — batch DOM
writes with `requestAnimationFrame` if profiling shows jank on low-end devices.
Memoise `MessageBubble` on `message.id` + `status`.
Debounce search 300 ms; abort superseded requests.
Never put a large object in Context — it re-renders every consumer. Split contexts by
change frequency.

### 22.5 API optimisation

TanStack Query dedupes concurrent identical requests automatically.
`staleTime` per §16.4. Paginate conversation history and search.
Prefetch the conversation list on hovering the sidebar toggle.
Cancel in-flight requests on unmount and on navigation.
**Do not poll.** If live updates are ever needed, use the existing stream.

### 22.6 Loading skeletons

Skeletons, not spinners, for anything with known shape — they reduce perceived latency and
prevent CLS. Skeletons match the real layout's dimensions exactly.
Spinners only for indeterminate in-place actions (a button submitting).
Never show a skeleton for under ~200 ms — flashing is worse than waiting.

### 22.7 Assets

WebP/AVIF with fallback · SVG for icons and illustrations, inlined when small · explicit
dimensions on everything · lazy-load below the fold · no video · illustrations drawn in
palette colours so they compress well and theme cleanly.

---

## 23. Testing Strategy

### 23.1 Shape of the pyramid

```
        ╱─────────────╲     E2E (Playwright) — ~10 critical journeys
       ╱───────────────╲    Integration (RTL + MSW) — feature flows
      ╱─────────────────╲   Component (RTL) — behaviour of each component
     ╱───────────────────╲  Unit (Vitest) — hooks, utils, formatters, schemas
```

Not chasing a coverage number. Chasing coverage of the paths where failure hurts a user.

### 23.2 Unit — Vitest

`useLanguage`, `useLocalStorage` (including the throwing/blocked case), the streaming
reducer's full state machine, `ApiError` normalisation, retry/backoff logic, PII regexes
(**including false-positive cases** — an order number must not be flagged as Aadhaar),
locale formatting, every Zod schema against valid, invalid, and partial payloads.

### 23.3 Component — RTL

Test what a user does, not implementation details. Query by role and accessible name, not
by `data-testid`, so the tests double as accessibility assertions.

Must-have cases: `LanguageModal` (renders 6, keyboard nav, selection, persistence, dismiss)
· `ChatComposer` (Enter sends, Shift+Enter newline, empty blocked, disabled while streaming)
· `MessageBubbleAssistant` (all 5 blocks, missing-citations case, low-confidence note,
language-mismatch notice) · `EscalationCard` (renders above answers, `tel:` links correct)
· `ErrorState`/`EmptyState` (every variant) · every `ui/` primitive.

### 23.4 Integration — RTL + MSW

Full flows against mocked network: send a message → optimistic bubble → stream → commit ·
failure → retry → success · language switch → UI updates → next request carries the new
`preferred_language` · search → results → empty → recovery · auth (when it exists) →
expiry → refresh → draft preserved.

### 23.5 API contract tests

Because the contract is unknown and will change: keep the Zod schemas as the contract, and
run a **live smoke test against a real staging backend in CI** (separate, non-blocking job)
that parses real responses through the schemas. **This turns "the backend changed" from a
production incident into a red CI job.** Highest-leverage test in this whole plan.

### 23.6 E2E — Playwright

Ten journeys, on Chromium + WebKit, at desktop and mobile viewports:

1. First visit → language modal → pick Hindi → landing renders in Hindi
2. Landing hero → type a problem → answer streams → follow-up
3. Switch language mid-conversation → past messages keep their language
4. Backend 500 on send → error state → retry succeeds
5. Search → results → open article → "Ask about this" seeds a conversation
6. `/find-help` → helpline `tel:` links are correct and tappable
7. Full keyboard-only traversal of the core journey
8. Offline → banner → reconnect → queued message sends
9. Mobile: keyboard opens → composer stays visible → send → keyboard stays open
10. Auth (flagged): sign up → history persists → sign out clears the cache

### 23.7 Accessibility testing

`@axe-core/playwright` on every route in CI — **fail on serious/critical**.
`eslint-plugin-jsx-a11y` on every commit.
**UX4G [Audit 360](https://www.ux4g.gov.in/) and the UX Health Self-Check** run once per
release in Phase 6 — free, government-aligned audit signal. Treat their output as input to
triage, not as a pass/fail gate: like every automated tool they miss roughly two-thirds of
real barriers, and the manual passes below remain the authority.
Manual per release: keyboard-only pass; NVDA/VoiceOver/TalkBack on the language modal,
chat, and `/find-help`; 200% and 400% zoom; forced-colours mode.

### 23.8 Multilingual testing

Snapshot the six locales at 320 px and 1280 px and diff visually — catches text overflow
and clipped Indic descenders that no unit test will find.
CI key-parity check (§17.4).
Verify every script renders (no tofu) on Android Chrome and iOS Safari.
Pseudo-localisation (`en-XA`) in dev to surface hardcoded strings and length assumptions
before translations arrive.

### 23.9 CI gates

```
lint · typecheck (tsc --noEmit) · unit + component (Vitest)
i18n key parity · bundle size · axe on all routes · build
E2E on PRs to main · live contract smoke (non-blocking)
```

---

## 24. Development Roadmap

Sequenced so that **nothing waits on the backend until Phase 3**, and Phases 1–2 produce a
demoable product on their own. Durations assume a 2–4 person student team.

### Phase 0 — Contract discovery *(before or parallel to Phase 1)*

- Read the backend repository. Answer as much of §27 as possible.
- Write the Zod schemas and MSW fixtures from whatever is learned.
- **Install the UX4G agent skill** (`.claude/skills/ux4g-design/`) and read `Design.md`
  in full — then write the project-level override that keeps §7's tokens authoritative
  (§6A.5 step 3). Doing the override *before* any component is generated is the point.
- **Resolve §6A.8 V1–V3** — the UX4G package name, licence terms, and whether the
  Accessibility Widget is self-hostable. Three short emails; they gate Tier 2 decisions.
- Skim the UX4G UX Handbook; assign the **Web Information Manager** role (§6A.7).
- **Deliverable:** §12.2 table with real endpoint names, or a documented list of what is
  still unknown.
- *Cheapest phase in the plan and it de-risks everything after it. Do not skip it.*

### Phase 1 — Foundation *(~1.5 weeks)*

Vite + React + TS + Tailwind scaffold · tokens from §7 into CSS variables and Tailwind
config · `ui/` primitives (Button, Input, Card, Modal, Skeleton, EmptyState, ErrorState) ·
router + layouts + lazy routes · Navbar/Footer · fonts self-hosted and subsetted ·
ESLint/Prettier/a11y/i18n lint · CI skeleton · deploy a blank shell to staging on day one.

**Done when:** every route renders a placeholder, the design system is documented on an
internal `/styleguide` route, and CI is green.

### Phase 2 — Language experience *(~1 week)*

react-i18next + namespaces · `en` complete, other five stubbed · `LanguageModal` (fully
accessible) · `LanguageSwitcher` · detection + persistence + fallback · per-locale font and
type scale · `/settings/language` · pseudo-localisation in dev · key-parity CI check.

**Done when:** switching to Tamil changes every visible string with no layout break and no
tofu, and the modal is fully keyboard- and screen-reader-operable.

### Phase 3 — Core AI experience *(~2.5 weeks — the big one)*

API client + typed errors + Zod · MSW fixtures · `ChatPage`, `MessageList`, `ChatComposer`,
`MessageBubble` · streaming reducer + SSE consumer (behind `VITE_FEATURE_STREAMING`) ·
`StructuredAnswer` 5 blocks · loading ladder (§11.8) · every error state · retry/abort/
timeout · suggested questions · copy/share · disclaimer strip + consent · **`EscalationCard`
and `/find-help`** · mobile keyboard handling.

**Done when:** the full journey works end-to-end against mocks, and swapping the base URL
to a real backend is the only change needed.

> **`/find-help` ships in Phase 3, not later.** Shipping an AI that can discuss an arrest
> before shipping the page that says "call 15100" is the wrong order.

### Phase 4 — Knowledge & search *(~1.5 weeks)*

`/knowledge` hub, category, article · Markdown rendering + sanitisation · TOC · `LegalTerm` ·
`/search` with URL-synced query, filters, debounce, abort · empty/no-result states ·
"Ask about this" seeding · **`/accessibility` statement page (§6A.6)** · footer
"not a government service" line.

### Phase 5 — Accounts & history *(~1.5 weeks, conditional)*

**Only if the backend has auth.** Feature-flagged throughout. Login/signup/account ·
token strategy per §12.7 · protected routes · conversation history sidebar · preference
sync · **data export and deletion controls** · session expiry with draft preservation.

### Phase 6 — Hardening *(~2 weeks — do not compress this)*

Full a11y audit (automated + manual, all three screen readers) · performance to budget ·
real-device matrix in all six languages · security review + CSP + dependency audit ·
complete translations with legal review of legal-facing strings · error-state sweep ·
E2E suite · production build, CDN, cache headers, monitoring ·
**UX4G Audit 360 + UX Health Self-Check run and triaged (§6A.3 Tier 2)** ·
**accessibility statement written with its known-limitations section filled in honestly** ·
**GIGW 3.0 self-assessment across all four pillars (§6A.2)** — the lifecycle pillar is a
process gap, not a code gap, and needs a named owner.

### Phase 7 — Launch readiness

Privacy/terms finalised by counsel · helpline numbers verified · disclaimer copy reviewed ·
staging soak · rollback plan · an internal "known limitations" document.

**Realistic total: 10–12 focused weeks for a small team.** If that does not fit, cut
Phase 5 and Phase 4's search — **not** Phase 6.

---

## 25. Definition of Done

### Functionality
- [ ] All P0/P1 routes implemented with real content
- [ ] Language modal: appears on first visit only, six options, dismissible, persisted
- [ ] All six languages complete — 100% key parity with `en`, zero English leakage
- [ ] Language switching works mid-session with no reload and no layout break
- [ ] AI chat: send, stream (or fall back), display, follow up, copy, share
- [ ] Structured 5-block answer renders; degrades gracefully to prose
- [ ] Suggested questions render and are tappable
- [ ] Citations render when supplied; never fabricated
- [ ] Confidence / uncertainty surfaced when the backend supplies it
- [ ] `EscalationCard` triggers and renders above the answer
- [ ] `/find-help` live with verified helpline numbers as one-tap `tel:` links
- [ ] Conversation history (or a clear explanation of why it is absent)
- [ ] Knowledge browse + article read
- [ ] Search with working empty and error states
- [ ] Auth + account (if backend supports) or cleanly flagged off with no dead UI

### Backend integration
- [ ] Every §12.2 row resolved: real endpoint, or a documented, agreed deferral
- [ ] Zod schema for every response; contract smoke test green against staging
- [ ] All errors mapped to a user-facing state — no raw codes reach a user
- [ ] Timeout, retry, and abort verified by test
- [ ] CORS verified in staging (not only via the dev proxy)
- [ ] Token handling matches the agreed model; no token in `localStorage` unless documented
- [ ] Every feature flag toggles cleanly in both directions

### Design & UX
- [ ] Zero raw hex values in components — tokens only (lint-enforced)
- [ ] Palette matches §7; the derived scale is documented and applied
- [ ] Typography scales correctly for all five Indic scripts; no clipping at any size
- [ ] No banned aesthetic (§15.13) present
- [ ] Every interactive element has hover, focus, active, and disabled states
- [ ] Empty, loading, and error states exist for every data-driven surface

### Responsive
- [ ] Works at 320 px with no horizontal scroll
- [ ] Verified on real low-end Android, iPhone SE, a modern phone, tablet, desktop
- [ ] Mobile keyboard does not obscure the composer on iOS Safari or Android Chrome
- [ ] Layout holds in all six languages at 320 px and 1280 px
- [ ] Landscape phone works

### Accessibility
- [ ] axe: zero serious/critical on every route in CI
- [ ] Full journey completable by keyboard alone
- [ ] Screen-reader pass on NVDA, VoiceOver, and TalkBack
- [ ] All contrast pairs verified, including focus rings on every background
- [ ] Touch targets ≥ 44 px (≥ 48 px on helplines and language cards)
- [ ] `prefers-reduced-motion` honoured
- [ ] Layout survives 200% zoom and 400% zoom with reflow
- [ ] Live regions announce responses, errors, and language changes correctly

### Legal & safety
- [ ] Disclaimer visible on every AI response and every chat screen
- [ ] `/terms` and `/privacy` reviewed by a qualified advocate
- [ ] Consent captured once per device and recorded (or the gap documented)
- [ ] Escalation categories agreed with the backend and tested
- [ ] Copy audited against the banned-phrase list (§5.3)
- [ ] Copied responses include the disclaimer
- [ ] `<noscript>` block shows helpline numbers

### Government standards (UX4G / GIGW 3.0 — §6A)
- [ ] Stated conformance target published at `/accessibility`, with a review date
- [ ] Known accessibility limitations listed truthfully, not omitted
- [ ] GIGW 3.0 self-assessment completed across all four pillars
- [ ] WCAG 2.1 AA floor demonstrably met (satisfied via the 2.2 AA target)
- [ ] CERT-In / OWASP security chapter handed to the backend and deployment owner
- [ ] **"LexGraph is not a government service" visible in the footer and on `/how-it-works`**
- [ ] Visual identity remains distinct from an official `.gov.in` portal (§0.4)
- [ ] Web Information Manager named; lifecycle policy documented
- [ ] Audit 360 and UX Health Self-Check run, findings triaged
- [ ] §6A.8 V1–V6 resolved or explicitly closed as not-applicable
- [ ] No UX4G asset shipped without a confirmed licence (§6A.8 V2)
- [ ] `#4a2bc2` appears nowhere in the codebase

### Security & privacy
- [ ] No secrets in the repository or the built bundle
- [ ] CSP deployed and verified; no `unsafe-eval`, no wildcard `connect-src`
- [ ] No `dangerouslySetInnerHTML` anywhere (lint-enforced)
- [ ] All rendered content sanitised; link schemes validated
- [ ] No message content in `localStorage`; sign-out clears storage and the Query cache
- [ ] PII hint works without blocking or logging
- [ ] `npm audit` clean of high/critical
- [ ] No third-party requests at runtime

### Performance
- [ ] Initial JS < 180 KB gzipped
- [ ] Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility
- [ ] LCP < 2.5 s on Slow 4G / low-end Android
- [ ] No CLS from fonts or images
- [ ] Route-level code splitting and locale lazy-loading verified in the build output

### Engineering
- [ ] `tsc --noEmit` clean in strict mode; no `any` in `src/`
- [ ] Lint clean including a11y and i18n rules
- [ ] Unit + component + integration + E2E suites green
- [ ] Production build succeeds and is deployed to staging
- [ ] `README`, `.env.example`, and a `CONTRIBUTING` note are current
- [ ] `/styleguide` route documents every token and primitive

---

## 26. Future Enhancements

Deliberately out of scope for v1. Listed so they are not accidentally built early.

| # | Enhancement | Why later | Prerequisite |
|---|---|---|---|
| 1 | **Voice input & TTS** | Highest-value addition for low-literacy users — arguably the single biggest reach unlock. But it is a substantial backend dependency. | ASR/TTS backend (Bhashini or equivalent) |
| 2 | More languages (Marathi, Gujarati, Malayalam, Punjabi, Odia, Urdu) | Architecture already supports it; needs translation capacity and content | Translators; RTL work for Urdu (§17.7) |
| 3 | PWA + offline knowledge cache | Real value on patchy connections | Service worker, cache strategy |
| 4 | Document upload & analysis | Notice/agreement analysis is a natural fit | Upload + parsing backend |
| 5 | SSR/SSG for `/knowledge` | Organic search is a real acquisition channel (§13.2) | Next.js or `vite-plugin-ssg` migration of that route group |
| 6 | Dark mode | Token structure is already reserved (§7.4) | ~25 variable overrides + QA |
| 7 | Save / bookmark articles | Needs accounts | Phase 5 |
| 8 | Export conversation as PDF | Users want to show a printed answer to a family member or paralegal | Backend render or client library |
| 9 | Deadline reminders (limitation periods) | Genuinely useful, genuinely risky — a missed reminder is real harm | Legal review + notification backend |
| 10 | Structured intake for common problems | Better answers for well-defined situations | Backend flow support |
| 11 | Feedback loop into content gaps | Improves the corpus over time | Analytics + editorial process |
| 12 | Accessibility: font-size and high-contrast user controls | Beyond WCAG, real for older users | Small; could pull into v1 |
| 13 | Regional / state-specific answers | Much of Indian law varies by state | Backend jurisdiction handling |
| 14 | WhatsApp entry point | Where this user base already is | Separate integration entirely |

---

## 27. Backend Information Required

**This is the section that unblocks the build.** Every item is `TO BE CONFIRMED WITH BACKEND`.
Answering Q1–Q4 alone removes most of the guesswork.

### Critical — blocks Phase 3

| # | Question | Why the frontend needs it | Blocked if unanswered |
|---|---|---|---|
| **Q1** | **What is the AI endpoint — path, method, request body, response body?** Is the answer structured (5 blocks / sections) or a single prose string? | Determines `StructuredAnswer` vs prose fallback, and the entire API layer | All of Phase 3 |
| **Q2** | **Is streaming supported?** SSE, WebSocket, chunked, or not at all? What is the event schema? | Streaming vs single-request is a fundamentally different UI. Determines `VITE_FEATURE_STREAMING` | Streaming UI, perceived latency |
| **Q3** | **How is response language specified and reported?** What is the field name, what codes (`ta` vs `ta-IN`)? Are all six supported, or only some? What happens if unsupported? | §8.4 mismatch handling; the entire multilingual promise | Language-aware AI |
| **Q4** | **Is there authentication?** If yes: what flow, what token type, what lifetime, cookie or header, is there a refresh endpoint? | §12.7 token strategy; whether Phase 5 exists at all | Phase 5, history |
| **Q5** | **Do anonymous conversations persist?** Is there a session/anonymous id, or does an unauthenticated user lose their thread on refresh? | Whether `/chat/:id` is meaningful when logged out — a core UX decision | History UX, routing |
| **Q6** | **Base URLs** for local, staging, and production? | `VITE_API_BASE_URL`; CORS config | Any integration |

### High — shapes Phase 3/4 quality

| # | Question | Why |
|---|---|---|
| **Q7** | Does the backend store user preferences (language)? Or is `localStorage` the only source of truth? | Cross-device consistency |
| **Q8** | **Does the response include a risk/escalation signal?** What categories? | §11.7. If not, the frontend heuristic is the only safety net — which is weak and must be flagged as a known gap |
| **Q9** | Are AI answers and knowledge articles **Markdown or HTML**? | Markdown → `react-markdown`, safe. HTML → DOMPurify and more risk (§19.4). **Markdown is strongly preferred.** |
| **Q10** | Is there a **machine-readable error code taxonomy**, or only HTTP status + prose? | §12.5. Prose-only errors cannot be localised |
| **Q11** | What are the rate limits? Does the response include `Retry-After`? Is there a captcha/abuse flow the frontend must render? | 429 UX |
| **Q12** | What **data-rights endpoints** exist (export, delete)? What is the retention policy for conversations? Is consent recorded server-side? | §9.8 DPDP obligations; the account area |
| **Q13** | Is there a **legal-aid / DLSA directory** endpoint, or should `/find-help` ship static data? Who maintains the helpline numbers? | §9.9 — and numbers must be correctable without a frontend deploy |
| **Q14** | Who is drafting `/privacy` and `/terms`, and in which languages will they be legally reviewed? | Not a frontend deliverable, but a launch blocker |

### Medium — shapes Phase 4/5

| # | Question |
|---|---|
| **Q15** | Search: endpoint, query params, filter options, pagination model, does it return highlighted snippets or spelling suggestions? |
| **Q16** | Knowledge content: how are categories and articles identified (id vs slug)? Is content per-locale? What does a missing translation return — 404 or an English fallback? |
| **Q17** | Are `suggested_questions` returned by the backend, and in which language? |
| **Q18** | Citations: what shape, and are there stable public URLs to link to? |
| **Q19** | Is feedback (👍/👎) collected? Endpoint and payload? |
| **Q20** | File upload: does it exist? Accepted types, size limit, direct or pre-signed? |
| **Q21** | Is there a health/status endpoint the frontend can use for the degradation ladder (§21.3)? |
| **Q22** | CORS: which origins are allowlisted? Is `credentials` enabled? Which headers are permitted on preflight? |
| **Q23** | Is there an OpenAPI/Swagger spec? *(If yes, most of Q1–Q21 answer themselves and types can be generated — ask for this first.)* |
| **Q24** | Are there API versioning conventions the frontend should pin to? |
| **Q25** | Should the frontend send a correlation/request id, and in which header? |
| **Q26** | Is LexGraph intended to be **endorsed, adopted, or co-branded by any government body or State/District Legal Services Authority**? This single answer flips the entire §6A Tier 3 decision — from "build to the standard, look distinct" to "conform fully". Answer it early. |
| **Q27** | Is a **formal GIGW 3.0 audit** anticipated? If so, by whom, and does the auditor accept WCAG 2.2 AA in place of 2.1 AA (§6A.8 V5)? |
| **Q28** | Does the backend already implement **DPDP consent recording** in a form matching UX4G's published consent-flow pattern? Aligning the frontend consent UI to a pattern the backend does not record is wasted work. |

> **Fastest path:** ask for the OpenAPI spec (Q23) and the backend's own README. If either
> exists, it collapses fifteen of these questions into one afternoon.

---

## 28. Final Implementation Checklist

Working order for the developer who picks this up.

### Before writing any component
- [ ] Read the backend repository; answer as much of §27 as possible
- [ ] Record answers directly into §12.2 and §27 — **this README is a living document**
- [ ] Confirm the derived palette (§7.3) is accepted, given the §0.1 contrast finding
- [ ] Confirm the language-modal modifications in §0.2 are accepted
- [ ] Confirm `/find-help` (§9.9) is in scope for Phase 3
- [ ] Confirm the §6A three-tier UX4G decision: standards adopted, component library and
      indigo theme declined, reversal trigger understood
- [ ] Answer §27 Q26 (government endorsement) — it is the one answer that could rewrite §6A and §7
- [ ] Resolve §6A.8 V1–V3 before any UX4G dependency is added

### Setup
- [ ] `npm create vite@latest -- --template react-ts`
- [ ] Tailwind + tokens as CSS variables; mirror into `tailwind.config.ts`
- [ ] ESLint + Prettier + `jsx-a11y` + `i18next` + `react/no-danger`
- [ ] Vitest + RTL + MSW + Playwright + `@axe-core/playwright`
- [ ] `.env.example` with every variable and every feature flag
- [ ] Install the UX4G agent skill at `.claude/skills/ux4g-design/` and **write the
      project-level override** pinning §7 as the authoritative token source (§6A.5)
- [ ] CI: lint · typecheck · test · key parity · bundle size · axe · build
- [ ] Deploy an empty shell to staging **on day one** — never leave deployment to the end

### Build order
- [ ] Design tokens → `ui/` primitives → `/styleguide` route
- [ ] Layouts, routing, Navbar, Footer, `<noscript>` helpline block
- [ ] i18n scaffold + `LanguageModal` + `LanguageSwitcher`
- [ ] API client + Zod schemas + MSW fixtures (**before any chat UI**)
- [ ] Chat: composer → message list → bubbles → streaming → errors → escalation
- [ ] `/find-help`
- [ ] Knowledge + search
- [ ] Auth + account (flagged)
- [ ] Hardening (§24 Phase 6)

### Never do these
- [ ] Never hardcode a user-facing string
- [ ] Never hardcode a hex value or a pixel value in a component
- [ ] Never use `dangerouslySetInnerHTML`
- [ ] Never store message content in `localStorage`
- [ ] Never put a secret in a `VITE_*` variable
- [ ] Never machine-translate an AI legal response client-side
- [ ] Never render an AI answer without its disclaimer
- [ ] Never invent a legal citation, a helpline number, an endpoint, or a package name
- [ ] Never let LexGraph present itself as an official or government service
- [ ] Never ship a state with no next action for the user
- [ ] Never let a `catch` block swallow an error silently

---

## Appendix A — Quick Token Reference

```css
/* Source swatches (exact, from the supplied reference image) */
--cream-400:  #EECE95;   --navy-800: #18304A;   --navy-700: #264468;
--gray-700:   #595959;   --gray-300: #D3D3D3;

/* Derived — required because #18304A vs #264468 is only 1.35:1 */
--navy-600:   #2F5C8A;   /* resting interactive — 6.96:1 on white */
--navy-500:   #3A6EA5;   /* focus ring */
--cream-100:  #FAF6EE;   /* page background */

/* Semantic */
--color-primary: #18304A;   --color-secondary: #2F5C8A;   --color-accent: #EECE95;
--color-bg:      #FAF6EE;   --color-surface:   #FFFFFF;   --color-text:   #3F3F3F;
--color-text-muted: #6E6E6E; --color-border:   #D3D3D3;   --color-text-link: #2F5C8A;

/* Status */
--error: #B3261E;  --warning: #8A5A00;  --success: #1B7A4B;  --info: #264468;
```

---

## Document Control

| | |
|---|---|
| **Version** | 1.1 — planning baseline + government-standards alignment (§6A) |
| **Status** | Awaiting backend contract (§27) |
| **Scope** | Frontend only. Backend lives in a separate repository. |
| **Code** | None written. This document is the specification. |
| **Palette** | Five swatches sampled exactly from the supplied reference image; interactive scale derived (§0.1, §7.2) |
| **Standards** | Built to **GIGW 3.0** / WCAG 2.2 AA, informed by **UX4G 3.0** (§6A). Not a government service, and does not present as one (§0.4). |
| **Open items** | 28 backend questions (§27) · 6 UX4G verification items (§6A.8) · legal review of disclaimer, privacy, terms · helpline verification · Web Information Manager unassigned |
| **Next action** | Answer §27 Q1–Q6 and **Q26**, update §12.2, resolve §6A.8 V1–V3, begin Phase 1 |

> **Keep this document alive.** As backend answers arrive, replace the
> `TO BE CONFIRMED WITH BACKEND` markers in place rather than starting a separate spec.
> A README that drifts from reality is worse than no README.
