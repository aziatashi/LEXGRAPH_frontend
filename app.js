/* LexGraph — implementation of LexGraph.dc.html.
   Static page, no build step, no dependencies. */

var LANGS = [
  { code: "en", native: "English", latin: "English", font: "Inter,sans-serif", cta: "Get Started" },
  { code: "hi", native: "हिंदी", latin: "Hindi", font: "'Noto Sans Devanagari',Inter,sans-serif", cta: "शुरू करें" },
  { code: "ta", native: "தமிழ்", latin: "Tamil", font: "'Noto Sans Tamil',Inter,sans-serif", cta: "தொடங்குங்கள்" },
  { code: "te", native: "తెలుగు", latin: "Telugu", font: "'Noto Sans Telugu',Inter,sans-serif", cta: "ప్రారంభించండి" },
  { code: "bn", native: "বাংলা", latin: "Bengali", font: "'Noto Sans Bengali',Inter,sans-serif", cta: "শুরু করুন" },
  { code: "kn", native: "ಕನ್ನಡ", latin: "Kannada", font: "'Noto Sans Kannada',Inter,sans-serif", cta: "ಪ್ರಾರಂಭಿಸಿ" }
];

var EXAMPLES = [
  "My landlord sent me a notice on WhatsApp",
  "Police won't register my FIR",
  "My employer hasn't paid my salary",
  "I bought a defective product",
  "Police detained my brother last night",
  "My landlord is threatening to cut my water"
];

var TOPICS = [
  { title: "Housing & tenancy", count: "24 articles" },
  { title: "Police & FIR", count: "18 articles" },
  { title: "Employment & wages", count: "21 articles" },
  { title: "Consumer complaints", count: "16 articles" },
  { title: "Family & marriage", count: "19 articles" },
  { title: "Women's safety", count: "12 articles" },
  { title: "Cyber fraud & scams", count: "14 articles" },
  { title: "Documents & IDs", count: "9 articles" }
];

// MOCK ANSWER CORPUS — stands in for the backend until the API contract exists.
// See README §11.2: the frontend needs these fields under *some* name.
var ANSWERS = {
  tenancy: {
    simple: "A notice from your landlord is not an eviction. It is a formal demand, and it starts a clock — but you cannot be removed from your home without a proper legal process.",
    means: "Tenancy is largely a state subject, so the exact rules depend on where you live and on what your agreement says. In most states a notice to vacate has to state a reason, give you a minimum period, and reach you in a way the law recognises. A message on WhatsApp may or may not count as valid service depending on your state and your agreement — that question alone often changes the outcome.",
    steps: [
      "Save the message. Screenshot it with the date and the sender's number visible, and back it up somewhere off the phone.",
      "Find your rent agreement and check the notice period written in it.",
      "Reply in writing that you have received the notice and are asking for the reason and the period. Keep a copy.",
      "Keep paying rent by bank transfer or UPI, not cash, so there is a record.",
      "Call the free legal aid helpline on 15100 and ask for the tenancy desk at your District Legal Services Authority."
    ],
    law: "Where no state rent-control law applies, the notice period for ending a lease comes from the Transfer of Property Act. Most states also have their own Rent Control Act, which can override it and is usually more protective of the tenant. Eviction itself requires an order — a landlord acting without one is acting outside the law.",
    citations: [
      { section: "s. 106", title: "Transfer of Property Act, 1882 — duration and termination of leases by notice" },
      { section: "State Act", title: "Your state's Rent Control Act — grounds for eviction and notice requirements" }
    ],
    lawyer: "Talk to an advocate now if the notice claims rent arrears you disagree with, if you have received anything from a court, or if you are being pressured to leave within days. Free legal aid on 15100 covers this, and there is no income test for the first consultation in most districts.",
    suggestions: ["What if I only got it on WhatsApp?", "How much notice must they give me?", "Can they cut off my water or power?"]
  },
  police: {
    simple: "A person in police custody has rights that apply from the moment they are picked up — including being told the reason, informing a family member, and meeting a lawyer. The most useful thing you can do right now is get legal aid on the phone.",
    means: "The police must record an arrest, inform a relative or friend, and produce the person before a magistrate within 24 hours. Free legal representation is a right, not a favour, and the legal aid authority can send an advocate to the station. Custody questions move fast, which is why the call matters more than the reading.",
    steps: [
      "Call 15100 now and say a family member is in police custody. Ask for a duty advocate.",
      "Write down the station name, the officer's name, and the time he was taken.",
      "Ask at the station for the arrest memo and the case or FIR number, and note who refuses.",
      "Do not sign anything you have not read, and do not let him sign a blank page.",
      "Note the 24-hour deadline for production before a magistrate from the time of arrest."
    ],
    law: "The Constitution guarantees that an arrested person is told the grounds of arrest and is produced before a magistrate within twenty-four hours, and guarantees the right to consult a lawyer. The Supreme Court's arrest guidelines add specific duties on the police, including notifying a relative and preparing an arrest memo.",
    citations: [
      { section: "Art. 22", title: "Constitution of India — protection against arrest and detention" },
      { section: "Guidelines", title: "D.K. Basu v. State of West Bengal (1997) — mandatory arrest procedure" }
    ],
    lawyer: "This is a situation for a lawyer, today, not for reading. Legal aid on 15100 is free and can act tonight. If you are told he cannot meet a lawyer, say so on that call — it is itself a problem.",
    suggestions: ["Can I meet him at the station?", "What is an arrest memo?", "What happens after 24 hours?"]
  },
  wages: {
    simple: "Unpaid wages are recoverable, and there is a specific authority for it — you do not have to go to a regular court first. The claim gets harder the longer you wait, so the date matters.",
    means: "Wage claims are handled by labour authorities under wage and industrial-dispute law, and the process is designed to work without a lawyer. What you need most is proof of the employment relationship and of the amount owed: appointment letter, ID card, roster, bank credits, or even a WhatsApp thread with a supervisor.",
    steps: [
      "List the exact months and amounts owed, and gather anything that shows you worked there.",
      "Send one written demand to the employer — a WhatsApp message is fine — and keep the delivery record.",
      "File a claim with the Labour Commissioner's office for your area. There is no fee.",
      "Call 15100 if you want a free advocate to prepare the claim with you."
    ],
    law: "Wage payment timelines and deductions are governed by the Code on Wages and the Payment of Wages Act it consolidates. Disputes over unpaid wages can be raised before the authority appointed under that law, and there are limitation periods that make delay costly.",
    citations: [
      { section: "Code, 2019", title: "Code on Wages, 2019 — timely payment of wages and claims procedure" },
      { section: "s. 15", title: "Payment of Wages Act, 1936 — claims for deducted or delayed wages" }
    ],
    lawyer: "Talk to a lawyer if the employer denies you ever worked there, if you were also injured or dismissed, or if the amount is large enough that you would want the claim drafted properly.",
    suggestions: ["I have no appointment letter", "How long do I have to file?", "Can they fire me for complaining?"]
  }
};

var HIGH_RISK = ["police", "arrest", "detain", "custody", "bail", "fir", "violence", "beat", "hit me", "threat", "danger", "abuse", "minor", "harm myself"];
var LADDER = [
  { at: 0, copy: "Reading your question…" },
  { at: 2600, copy: "Looking through the relevant law…" },
  { at: 7000, copy: "Still working — this one's taking a moment." }
];

var HERO_PLACEHOLDER = "e.g. My landlord sent me a notice on WhatsApp asking me to leave in 10 days. My rent is paid.";

/* ---------- state ---------- */

var S = {
  view: "landing",
  locale: "en",
  highlighted: "en",
  modalOpen: true,
  consented: false,
  draft: "",
  messages: [],
  thinking: false,
  loadingCopy: LADDER[0].copy,
  sidebarOpen: false,
  isWide: true,
  langMenu: false,
  openLaw: {},
  feedback: {},
  copied: {},
  title: "New conversation",
  seq: 0
};

var timers = [];
var inflight = 0;

function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
function set(patch) { Object.assign(S, patch); render(); }

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------- answers ---------- */

function pickAnswer(text) {
  var t = text.toLowerCase();
  if (/police|fir|arrest|detain|custody|bail/.test(t)) return { key: "police", a: ANSWERS.police };
  if (/salary|wage|paid|employer|job|fired/.test(t)) return { key: "wages", a: ANSWERS.wages };
  return { key: "tenancy", a: ANSWERS.tenancy };
}

// ponytail: mock corpus behind a promise. Swap this one function for the real
// /api/v1/ask call once the answer contract exists (README §11.2) — the failure
// path below is already what the retry UI hangs off.
function fetchAnswer(text) {
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(pickAnswer(text)); }, 2200);
  });
}

/* ---------- actions ---------- */

function pickLocale(code) { set({ highlighted: code }); }

function confirmLocale() {
  var code = S.highlighted;
  try { window.localStorage.setItem("lexgraph.locale", code); } catch (e) {}
  document.documentElement.setAttribute("lang", code);
  set({ locale: code, modalOpen: false });
}

function dismissModal() {
  try { window.localStorage.setItem("lexgraph.locale", "en"); } catch (e) {}
  document.documentElement.setAttribute("lang", "en");
  set({ modalOpen: false, locale: "en", highlighted: "en" });
}

function setLocale(code) {
  try { window.localStorage.setItem("lexgraph.locale", code); } catch (e) {}
  document.documentElement.setAttribute("lang", code);
  set({ locale: code, highlighted: code, langMenu: false });
}

function goHome() { set({ view: "landing", langMenu: false }); }

function startNew() {
  clearTimers(); inflight++;
  set({ view: "chat", messages: [], thinking: false, draft: "", title: "New conversation", langMenu: false });
}

function stop() { clearTimers(); inflight++; set({ thinking: false }); }

function toggleLaw(id) {
  var next = Object.assign({}, S.openLaw); next[id] = !next[id];
  set({ openLaw: next });
}

function rate(id, v) {
  var next = Object.assign({}, S.feedback); next[id] = next[id] === v ? null : v;
  set({ feedback: next });
}

function copyAnswer(id) {
  var m = S.messages.find(function (x) { return x.id === id; });
  if (!m) return;
  var steps = m.answer.steps.map(function (t, i) { return (i + 1) + ". " + t; }).join("\n");
  var text = [
    "In simple terms\n" + m.answer.simple,
    "What this usually means\n" + m.answer.means,
    "What you can do\n" + steps,
    "The law behind this\n" + m.answer.law,
    "When to talk to a lawyer\n" + m.answer.lawyer,
    "— LexGraph gives legal information, not legal advice. It is not a lawyer and not a government service."
  ].join("\n\n");
  try { navigator.clipboard.writeText(text); } catch (e) {}
  var next = Object.assign({}, S.copied); next[id] = true;
  set({ copied: next });
  later(function () {
    var back = Object.assign({}, S.copied); back[id] = false;
    set({ copied: back });
  }, 2200);
}

function send(raw) {
  var text = (raw || "").trim();
  if (!text || S.thinking) return;
  clearTimers();
  var token = ++inflight;
  var n = S.seq + 1;
  var userId = "u" + n;
  var botId = "a" + n;
  var risk = HIGH_RISK.some(function (k) { return text.toLowerCase().indexOf(k) !== -1; });

  set({
    view: "chat",
    seq: n,
    draft: "",
    thinking: true,
    loadingCopy: LADDER[0].copy,
    title: S.messages.length ? S.title : (text.length > 46 ? text.slice(0, 46) + "…" : text),
    messages: S.messages.concat([{ id: userId, role: "user", text: text, failed: false }])
  });

  LADDER.slice(1).forEach(function (step) {
    later(function () { if (token === inflight) set({ loadingCopy: step.copy }); }, step.at);
  });

  fetchAnswer(text).then(function (picked) {
    if (token !== inflight) return;
    set({
      thinking: false,
      messages: S.messages
        .map(function (m) { return m.id === userId ? Object.assign({}, m, { failed: false }) : m; })
        .concat([{
          id: botId, role: "assistant", answer: picked.a, escalate: risk,
          reveal: 1, uncertain: picked.key === "wages", done: false
        }])
    });
    [2, 3, 4, 5].forEach(function (r, i) {
      later(function () {
        if (token !== inflight) return;
        set({
          messages: S.messages.map(function (m) {
            return m.id === botId ? Object.assign({}, m, { reveal: r, done: r === 5 }) : m;
          })
        });
      }, 480 * (i + 1));
    });
  }, function () {
    if (token !== inflight) return;
    set({
      thinking: false,
      messages: S.messages.map(function (m) {
        return m.id === userId ? Object.assign({}, m, { failed: true }) : m;
      })
    });
  });
}

function retry(userId) {
  var m = S.messages.find(function (x) { return x.id === userId; });
  if (!m) return;
  set({ messages: S.messages.filter(function (x) { return x.id !== userId; }) });
  send(m.text);
}

/* ---------- views ---------- */

function langOf(code) {
  return LANGS.find(function (l) { return l.code === code; }) || LANGS[0];
}

function chipsHtml(list, cls) {
  return list.map(function (q) {
    return '<button type="button" class="' + cls + '" data-a="ask" data-q="' + esc(q) + '">' + esc(q) + "</button>";
  }).join("");
}

function headerHtml() {
  var active = langOf(S.locale);
  return '' +
    '<header class="hdr"><div class="hdr-in">' +
      '<a href="#" class="logo" data-a="home"><span class="logo-mark"><i></i></span>' +
        '<span class="logo-txt">LexGraph</span></a>' +
      '<nav class="nav" aria-label="Main">' +
        '<a href="#">Knowledge</a><a href="#">How it works</a><a href="#">Find free legal help</a>' +
      '</nav>' +
      '<div class="hdr-right">' +
        '<button type="button" class="btn btn-lang" aria-haspopup="true" aria-expanded="' + S.langMenu + '" data-a="lang-menu">' +
          '<i aria-hidden="true"></i><span>' + esc(active.native) + "</span></button>" +
        '<button type="button" class="btn btn-primary" data-a="new">Ask a question</button>' +
        (S.langMenu ? langMenuHtml() : "") +
      "</div>" +
    "</div></header>";
}

function langMenuHtml() {
  return '<div class="lang-menu" role="menu"><p>Language</p>' +
    LANGS.map(function (l) {
      return '<button type="button" role="menuitemradio" aria-checked="' + (l.code === S.locale) + '" ' +
        'data-a="set-lang" data-code="' + l.code + '">' +
        '<span class="native" style="font-family:' + l.font + '">' + esc(l.native) + "</span>" +
        '<span class="latin">' + esc(l.latin) + "</span></button>";
    }).join("") + "</div>";
}

function landingHtml() {
  return '' +
    '<main style="flex:1 1 auto">' +

    '<section class="hero">' +
      '<p class="pill">Free · No sign-up · Six languages</p>' +
      "<h1>Describe your legal problem. Get clear answers in your language.</h1>" +
      '<p class="hero-sub">Write it the way you would tell a friend — no legal words needed. LexGraph explains what is going on, what usually happens next, and where to get free human help.</p>' +
      '<div class="hero-card">' +
        '<label for="hero-input">What happened?</label>' +
        '<textarea id="hero-input" class="ta" rows="3" placeholder="' + esc(HERO_PLACEHOLDER) + '"></textarea>' +
        '<div class="hero-foot">' +
          "<p>Please leave out names, Aadhaar and account numbers. You do not need them for an answer.</p>" +
          '<button type="button" class="btn-send" data-a="submit"><span>Get an answer</span><span aria-hidden="true">→</span></button>' +
        "</div>" +
      "</div>" +
      '<div class="chips">' + chipsHtml(EXAMPLES, "chip") + "</div>" +
    "</section>" +

    '<section class="sec"><h2>How it works</h2><div class="grid g240">' +
      '<div class="step"><p class="n">Step 1</p><p class="t">Tell us what happened</p><p class="d">In your own words, in your own language.</p></div>' +
      '<div class="step"><p class="n">Step 2</p><p class="t">Read a structured answer</p><p class="d">Summary first, steps next, law last.</p></div>' +
      '<div class="step"><p class="n">Step 3</p><p class="t">Ask again, or get help</p><p class="d">Keep asking, or reach free legal aid.</p></div>' +
    "</div></section>" +

    '<section class="band"><div class="band-in">' +
      "<div><h2>What LexGraph is — and is not</h2>" +
        '<p class="lede">We are honest about the line, because the difference matters when you are deciding what to do next.</p></div>' +
      '<div class="col">' +
        '<div class="note"><p class="t">It is legal information</p><p class="d">Explanations of what a situation usually means, which law applies, and what people normally do next.</p></div>' +
        '<div class="note warn"><p class="t">It is not a lawyer</p><p class="d">No advocate reviews your situation here, nothing you write is filed anywhere, and an AI answer can be incomplete or wrong. For anything with a deadline or a court date, talk to a qualified advocate.</p></div>' +
        '<p class="fine">LexGraph is an independent project. It is not a government service. <a href="#">Read the full terms</a></p>' +
      "</div>" +
    "</div></section>" +

    '<section class="sec"><h2 class="tight">Browse by topic</h2>' +
      '<p class="lede">If you would rather read than ask.</p>' +
      '<div class="grid g210">' +
        TOPICS.map(function (t) {
          return '<a href="#" class="topic"><span class="t">' + esc(t.title) + "</span>" +
            '<span class="c">' + esc(t.count) + "</span></a>";
        }).join("") +
      "</div></section>" +

    '<section class="cta-wrap"><div class="cta">' +
      "<div>" +
        '<p class="eyebrow">Need a real person?</p>' +
        "<h2>Free legal aid exists, and you may qualify</h2>" +
        '<p class="d">District Legal Services Authorities provide free lawyers to crores of people who qualify. Most people have never been told this.</p>' +
      "</div>" +
      '<div class="cta-actions">' +
        '<a href="tel:15100" class="a-gold">Call 15100 — free</a>' +
        '<a href="#" class="a-outline">Find help near you</a>' +
      "</div>" +
    "</div></section>" +

    '<footer class="ftr"><div class="ftr-in">' +
      '<div><p class="name">LexGraph</p><p>Legal information in six Indian languages. Free, and without an account.</p></div>' +
      '<div class="links"><a href="#">Knowledge</a><a href="#">Find free legal help</a><a href="#">How it works</a></div>' +
      '<div class="links"><a href="#">Privacy</a><a href="#">Terms &amp; disclaimer</a><a href="#">Accessibility statement</a></div>' +
      '<div><p class="fine">LexGraph provides legal information, not legal advice, and is not a law firm or a government service. AI answers can be incomplete or wrong. For advice on your situation, consult a qualified advocate.</p></div>' +
    "</div></footer>" +

    "</main>";
}

var HISTORY = [
  { title: "Landlord notice on WhatsApp", when: "Just now", on: true },
  { title: "Salary unpaid for two months", when: "Yesterday", on: false },
  { title: "Defective phone, shop refuses", when: "Last week", on: false }
];

function sidebarHtml() {
  return '<aside class="side" aria-label="Your conversations">' +
    '<button type="button" class="side-new" data-a="new">+ New conversation</button>' +
    "<h2>On this device</h2>" +
    '<div class="side-list">' +
      HISTORY.map(function (h) {
        return '<button type="button" class="' + (h.on ? "on" : "") + '">' +
          '<span class="t">' + esc(h.title) + "</span>" +
          '<span class="w">' + esc(h.when) + "</span></button>";
      }).join("") +
    "</div>" +
    '<p class="keep">Kept on this device only. If you share this phone, <a href="#">clear it</a> when you are done.</p>' +
    "</aside>";
}

function escalationHtml(m) {
  var line = "This sounds like something a person should help with directly. Free legal aid is available now, at no cost.";
  return '<div class="escal" role="alert">' +
    '<p class="k">Get a person on this first</p>' +
    '<p class="l">' + esc(line) + "</p>" +
    '<div class="row">' +
      '<a href="tel:15100" class="a-ink">Call legal aid — 15100</a>' +
      '<a href="tel:112" class="a-ink-out">Emergency — 112</a>' +
      '<a href="#" class="a-plain">Free legal aid near you →</a>' +
    "</div>" +
    '<p class="after">The answer below still applies. Reading it can wait until after the call.</p>' +
    "</div>";
}

function answerHtml(m) {
  var a = m.answer;
  var lawOpen = !!S.openLaw[m.id];
  var fb = S.feedback[m.id];
  var body = "";

  if (m.reveal >= 1) {
    body += '<div><p class="tag">In simple terms</p><p class="simple">' + esc(a.simple) + "</p></div>";
  }
  if (m.reveal >= 2) {
    body += "<div><h3>What this usually means</h3><p class=\"prose\">" + esc(a.means) + "</p></div>";
  }
  if (m.reveal >= 3) {
    body += '<div><h3 class="steps-h">What you can do</h3><ol class="steps">' +
      a.steps.map(function (t, i) {
        return '<li><span class="n" aria-hidden="true">' + (i + 1) + "</span>" +
          '<span class="t">' + esc(t) + "</span></li>";
      }).join("") + "</ol></div>";
  }
  if (m.reveal >= 4) {
    body += '<div class="law">' +
      '<button type="button" class="law-toggle" aria-expanded="' + lawOpen + '" data-a="law" data-id="' + m.id + '">' +
        '<span class="t">The law behind this</span>' +
        '<span class="h">' + (lawOpen ? "Hide" : "Show Act &amp; section") + "</span></button>" +
      (lawOpen
        ? '<div class="law-open"><p class="prose">' + esc(a.law) + "</p>" +
          '<div class="cites">' + a.citations.map(function (c) {
            return '<div class="cite"><span class="s">' + esc(c.section) + "</span>" +
              '<span class="t">' + esc(c.title) + "</span></div>";
          }).join("") + "</div></div>"
        : "") +
      "</div>";
  }
  if (m.reveal >= 5) {
    body += '<div class="last"><h3>When to talk to a lawyer</h3><p class="prose">' + esc(a.lawyer) + "</p></div>";
  }

  return '<article class="answer">' +
    (m.uncertain
      ? '<div class="uncertain"><p>This one is less clear than usual. Please check with a lawyer or your local legal aid office before you act on it.</p></div>'
      : "") +
    '<div class="answer-body">' + body + "</div>" +
    '<div class="answer-foot"><p>Information, not legal advice</p><div class="acts">' +
      '<button type="button" class="act" data-a="copy" data-id="' + m.id + '">' +
        (S.copied[m.id] ? "Copied, with the disclaimer" : "Copy answer") + "</button>" +
      '<button type="button" class="act' + (fb === "up" ? " up-on" : "") + '" aria-label="This helped" aria-pressed="' + (fb === "up") + '" data-a="rate" data-id="' + m.id + '" data-v="up">Helpful</button>' +
      '<button type="button" class="act' + (fb === "down" ? " down-on" : "") + '" aria-label="This did not help" aria-pressed="' + (fb === "down") + '" data-a="rate" data-id="' + m.id + '" data-v="down">Not helpful</button>' +
    "</div></div></article>";
}

function messageHtml(m) {
  if (m.role === "user") {
    return '<div class="msg"><div class="user">' +
      '<div class="bubble">' + esc(m.text) + "</div>" +
      (m.failed
        ? '<div class="fail"><span>We could not reach the assistant. Your message is safe.</span>' +
          '<button type="button" data-a="retry" data-id="' + m.id + '">Retry</button></div>'
        : "") +
      "</div></div>";
  }
  return '<div class="msg"><div class="bot">' +
    (m.escalate ? escalationHtml(m) : "") +
    answerHtml(m) +
    (m.done
      ? '<div class="next"><p>People usually ask next</p><div class="next-chips">' +
        chipsHtml(m.answer.suggestions, "next-chip") + "</div></div>"
      : "") +
    "</div></div>";
}

function chatHtml() {
  var showSidebar = S.isWide && S.sidebarOpen;
  var empty = S.messages.length === 0 && !S.thinking;
  return '<main class="chat">' +
    (showSidebar ? sidebarHtml() : "") +
    '<section class="pane">' +

      '<div class="pane-hdr">' +
        '<button type="button" class="icon-btn" aria-label="Conversations" data-a="sidebar">☰</button>' +
        '<div class="pane-title"><p class="t">' + esc(S.title) + "</p>" +
          '<p class="s">Answers in ' + esc(langOf(S.locale).native) + " · Information, not legal advice</p></div>" +
        '<button type="button" class="btn btn-ghost" data-a="new">New</button>' +
      "</div>" +

      '<div class="stream" id="stream"><div class="stream-in">' +
        (empty
          ? '<div class="blank"><h1>What is going on?</h1>' +
            "<p>Describe it in your own words. You can start anywhere — the middle of the story is fine.</p>" +
            '<div class="chips">' + chipsHtml(EXAMPLES.slice(0, 4), "chip") + "</div></div>"
          : "") +
        S.messages.map(messageHtml).join("") +
        (S.thinking
          ? '<div class="thinking" aria-live="polite"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
            '<span class="c">' + esc(S.loadingCopy) + "</span></div>"
          : "") +
      "</div></div>" +

      '<div class="composer"><div class="composer-in">' +
        (S.consented ? "" :
          '<div class="consent"><p>Before you start: this is an AI assistant that explains the law in plain words. It is not a lawyer, nothing you write is filed anywhere, and it can be wrong. Please do not enter Aadhaar, account or case numbers.</p>' +
          '<button type="button" data-a="consent">I understand</button></div>') +
        '<div class="box">' +
          '<label for="composer" class="sr">Ask a follow-up question</label>' +
          '<textarea id="composer" rows="2" placeholder="Ask a follow-up, or describe something new…"></textarea>' +
          '<div class="box-foot"><p>Enter to send · Shift + Enter for a new line</p>' +
            (S.thinking
              ? '<button type="button" class="btn-stop" data-a="stop">Stop</button>'
              : '<button type="button" class="btn-send-sm" data-a="submit">Send</button>') +
          "</div>" +
        "</div>" +
        '<p class="pii"' + (/\d{6,}/.test(S.draft) ? "" : ' hidden') + " id=\"pii\">That looks like a number you may not want to share. You can remove it — the answer will be the same.</p>" +
        '<p class="legal">LexGraph gives legal information, not legal advice, and is not a government service. <a href="#">Terms</a> · <a href="#">Privacy</a></p>' +
      "</div></div>" +
    "</section></main>";
}

function modalHtml() {
  var hi = langOf(S.highlighted);
  return '<div class="scrim"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="lang-title">' +
    '<button type="button" class="modal-x" aria-label="Close and continue in English" data-a="dismiss">✕</button>' +
    '<h2 id="lang-title">Choose your language</h2>' +
    '<p class="greets">' +
      '<span style="font-family:\'Noto Sans Devanagari\',Inter,sans-serif">अपनी भाषा चुनें</span>' +
      '<span style="font-family:\'Noto Sans Tamil\',Inter,sans-serif">உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</span>' +
      '<span style="font-family:\'Noto Sans Telugu\',Inter,sans-serif">మీ భాషను ఎంచుకోండి</span>' +
      '<span style="font-family:\'Noto Sans Bengali\',Inter,sans-serif">আপনার ভাষা নির্বাচন করুন</span>' +
      '<span style="font-family:\'Noto Sans Kannada\',Inter,sans-serif">ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>' +
    "</p>" +
    '<div class="lang-grid" role="radiogroup" aria-labelledby="lang-title">' +
      LANGS.map(function (l) {
        var on = l.code === S.highlighted;
        return '<button type="button" class="lang-card" role="radio" aria-checked="' + on + '" ' +
          'data-a="pick-lang" data-code="' + l.code + '">' +
          '<span class="col"><span class="native" style="font-family:' + l.font + '">' + esc(l.native) + "</span>" +
          '<span class="latin">' + esc(l.latin) + "</span></span>" +
          '<span class="dot" aria-hidden="true">' + (on ? "✓" : "") + "</span></button>";
      }).join("") +
    "</div>" +
    '<button type="button" class="modal-cta" style="font-family:' + hi.font + '" data-a="confirm">' + esc(hi.cta) + "</button>" +
    '<p class="after">You can change this any time from the top of the page.</p>' +
    "</div></div>";
}

/* ---------- render ---------- */

var app = document.getElementById("app");

function render() {
  var focusId = document.activeElement && document.activeElement.tagName === "TEXTAREA"
    ? document.activeElement.id : null;
  var caret = focusId ? document.activeElement.selectionStart : 0;
  var stream = document.getElementById("stream");
  var top = stream ? stream.scrollTop : 0;
  var atBottom = stream ? stream.scrollHeight - top - stream.clientHeight < 120 : true;

  app.className = "app";
  app.innerHTML = headerHtml() +
    (S.view === "landing" ? landingHtml() : chatHtml()) +
    (S.modalOpen ? modalHtml() : "");

  // Textareas are uncontrolled (typing must not re-render), so re-seed the draft.
  document.querySelectorAll("textarea").forEach(function (t) { t.value = S.draft; });

  if (focusId) {
    var el = document.getElementById(focusId);
    if (el) { el.focus(); el.setSelectionRange(caret, caret); }
  }
  var s2 = document.getElementById("stream");
  if (s2) s2.scrollTop = atBottom ? s2.scrollHeight : top;
}

/* ---------- events ---------- */

document.addEventListener("input", function (e) {
  if (e.target.tagName !== "TEXTAREA") return;
  S.draft = e.target.value;
  var pii = document.getElementById("pii");
  if (pii) pii.hidden = !/\d{6,}/.test(S.draft);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && S.modalOpen) { dismissModal(); return; }
  if (e.key === "Escape" && S.langMenu) { set({ langMenu: false }); return; }
  if (e.target.tagName === "TEXTAREA" && e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send(S.draft);
  }
});

document.addEventListener("click", function (e) {
  var el = e.target.closest("[data-a]");
  if (!el) {
    if (S.langMenu && !e.target.closest(".hdr-right")) set({ langMenu: false });
    return;
  }
  var a = el.getAttribute("data-a");
  if (el.tagName === "A") e.preventDefault();

  if (a === "home") goHome();
  else if (a === "new") startNew();
  else if (a === "lang-menu") set({ langMenu: !S.langMenu });
  else if (a === "set-lang") setLocale(el.getAttribute("data-code"));
  else if (a === "pick-lang") pickLocale(el.getAttribute("data-code"));
  else if (a === "confirm") confirmLocale();
  else if (a === "dismiss") dismissModal();
  else if (a === "submit") send(S.draft);
  else if (a === "ask") send(el.getAttribute("data-q"));
  else if (a === "stop") stop();
  else if (a === "sidebar") set({ sidebarOpen: !S.sidebarOpen });
  else if (a === "consent") set({ consented: true });
  else if (a === "law") toggleLaw(el.getAttribute("data-id"));
  else if (a === "copy") copyAnswer(el.getAttribute("data-id"));
  else if (a === "rate") rate(el.getAttribute("data-id"), el.getAttribute("data-v"));
  else if (a === "retry") retry(el.getAttribute("data-id"));
});

/* ---------- boot ---------- */

var wide = window.matchMedia("(min-width:1024px)");
S.isWide = wide.matches;
wide.addEventListener("change", function (ev) { set({ isWide: ev.matches }); });

var stored = null;
try { stored = window.localStorage.getItem("lexgraph.locale"); } catch (e) { stored = null; }
if (stored && LANGS.some(function (l) { return l.code === stored; })) {
  S.locale = stored; S.highlighted = stored; S.modalOpen = false;
  document.documentElement.setAttribute("lang", stored);
}

render();
