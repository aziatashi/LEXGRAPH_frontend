/* LexGraph — implementation with profiles + multilingual support.
   Static page, no build step, no dependencies. */

var LANGS = [
  { code: "en", native: "English", latin: "English", font: "Inter,sans-serif", cta: "Get Started" },
  { code: "hi", native: "हिन्दी", latin: "Hindi", font: "'Noto Sans Devanagari',Inter,sans-serif", cta: "शुरू करें" },
  { code: "mr", native: "मराठी", latin: "Marathi", font: "'Noto Sans Devanagari',Inter,sans-serif", cta: "सुरू करा" },
  { code: "kn", native: "ಕನ್ನಡ", latin: "Kannada", font: "'Noto Sans Kannada',Inter,sans-serif", cta: "ಪ್ರಾರಂಭಿಸಿ" },
  { code: "ta", native: "தமிழ்", latin: "Tamil", font: "'Noto Sans Tamil',Inter,sans-serif", cta: "தொடங்குங்கள்" }
];

var PROFILES = [
  {
    id: "student", icon: "📚",
    name: { en: "Law Student", hi: "विधि छात्र", mr: "विधी विद्यार्थी", kn: "ಕಾನೂನು ವಿದ್ಯಾರ್ಥಿ", ta: "சட்ட மாணவர்" },
    desc: { en: "Learn and understand legal concepts.", hi: "कानूनी अवधारणाएँ सीखें और समझें।", mr: "कायदेशीर संकल्पना शिका.", kn: "ಕಾನೂನು ಪರಿಕಲ್ಪನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", ta: "சட்டக் கருத்துக்களைக் கற்றுக்கொள்ளுங்கள்." },
    hero: { en: "Understand the law behind the document.", hi: "दस्तावेज़ के पीछे के कानून को समझें।", mr: "दस्तऐवजामागील कायदा समजून घ्या.", kn: "ದಾಖಲೆಯ ಹಿಂದಿನ ಕಾನೂನನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", ta: "ஆவணத்தின் பின்னணி சட்டத்தைப் புரிந்துகொள்ளுங்கள்." },
    cta: { en: "Explain a document", hi: "एक दस्तावेज़ समझाएँ", mr: "एक दस्तऐवज समजावून सांगा", kn: "ಒಂದು ದಾಖಲೆಯನ್ನು ವಿವರಿಸಿ", ta: "ஒரு ஆவணத்தை விளக்குங்கள்" },
    heroDesc: { en: "Trace explanations back to the source. Learn legal concepts with AI grounded in actual documents.", hi: "स्पष्टीकरणों को स्रोत तक ट्रेस करें। वास्तविक दस्तावेज़ों पर आधारित AI से कानूनी अवधारणाएँ सीखें।", mr: "स्पष्टीकरणे स्रोतापर्यंत शोधा. प्रत्यक्ष दस्तऐवजांवर आधारित AI सह कायदेशीर संकल्पना शिका.", kn: "ವಿವರಣೆಗಳನ್ನು ಮೂಲಕ್ಕೆ ಹಿಂಬಾಲಿಸಿ.", ta: "விளக்கங்களை மூலத்திற்குத் தொடர்புபடுத்துங்கள்." }
  },
  {
    id: "lawyer", icon: "⚖️",
    name: { en: "Lawyer", hi: "वकील", mr: "वकील", kn: "ವಕೀಲ", ta: "வழக்கறிஞர்" },
    desc: { en: "Research matters and verify legal sources.", hi: "मामलों पर शोध करें और कानूनी स्रोतों को सत्यापित करें।", mr: "प्रकरणांवर संशोधन करा आणि कायदेशीर स्रोत सत्यापित करा.", kn: "ವಿಷಯಗಳನ್ನು ಸಂಶೋಧಿಸಿ ಮತ್ತು ಕಾನೂನು ಮೂಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.", ta: "வழக்குகளை ஆராய்ந்து சட்ட ஆதாரங்களைச் சரிபாருங்கள்." },
    hero: { en: "Research your matter. Verify every claim.", hi: "अपने मामले पर शोध करें। हर दावे को सत्यापित करें।", mr: "तुमच्या प्रकरणावर संशोधन करा. प्रत्येक दावा सत्यापित करा.", kn: "ನಿಮ್ಮ ವಿಷಯವನ್ನು ಸಂಶೋಧಿಸಿ. ಪ್ರತಿ ಹಕ್ಕನ್ನು ಪರಿಶೀಲಿಸಿ.", ta: "உங்கள் வழக்கை ஆராயுங்கள். ஒவ்வொரு கூற்றையும் சரிபாருங்கள்." },
    cta: { en: "Start legal research", hi: "कानूनी शोध शुरू करें", mr: "कायदेशीर संशोधन सुरू करा", kn: "ಕಾನೂನು ಸಂಶೋಧನೆ ಪ್ರಾರಂಭಿಸಿ", ta: "சட்ட ஆய்வைத் தொடங்குங்கள்" },
    heroDesc: { en: "Inspect clauses, verify claims, and trace every answer to its legal source with full citation provenance.", hi: "धाराओं का निरीक्षण करें, दावों को सत्यापित करें, और पूर्ण उद्धरण प्रमाण के साथ प्रत्येक उत्तर को उसके कानूनी स्रोत तक ट्रेस करें।", mr: "कलमांचे परीक्षण करा, दावे सत्यापित करा.", kn: "ಷರತ್ತುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಹಕ್ಕುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.", ta: "பிரிவுகளை ஆய்வு செய்யுங்கள், கூற்றுகளைச் சரிபாருங்கள்." }
  },
  {
    id: "msme", icon: "🏢",
    name: { en: "MSME Owner", hi: "MSME मालिक", mr: "MSME मालक", kn: "MSME ಮಾಲೀಕ", ta: "MSME உரிமையாளர்" },
    desc: { en: "Understand compliance, obligations and deadlines.", hi: "अनुपालन, दायित्वों और समय-सीमाओं को समझें।", mr: "अनुपालन, दायित्वे आणि मुदती समजून घ्या.", kn: "ಅನುಸರಣೆ, ಕಟ್ಟುಪಾಡುಗಳು ಮತ್ತು ಅಂತಿಮ ದಿನಾಂಕಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", ta: "இணக்கம், கடமைகள் மற்றும் காலக்கெடுவைப் புரிந்துகொள்ளுங்கள்." },
    hero: { en: "Know your obligations before they become problems.", hi: "अपने दायित्वों को समस्या बनने से पहले जानें।", mr: "तुमच्या दायित्वांना समस्या होण्यापूर्वी जाणून घ्या.", kn: "ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಸಮಸ್ಯೆಯಾಗುವ ಮೊದಲು ತಿಳಿಯಿರಿ.", ta: "உங்கள் கடமைகளைப் பிரச்சனையாவதற்கு முன்பே அறிந்துகொள்ளுங்கள்." },
    cta: { en: "Check compliance", hi: "अनुपालन जाँचें", mr: "अनुपालन तपासा", kn: "ಅನುಸರಣೆ ಪರಿಶೀಲಿಸಿ", ta: "இணக்கத்தைச் சரிபாருங்கள்" },
    heroDesc: { en: "Understand what your contracts and regulatory changes require you to do. Turn legal information into actionable business decisions.", hi: "समझें कि आपके अनुबंध और नियामक परिवर्तन आपसे क्या करने की अपेक्षा रखते हैं।", mr: "तुमचे करार आणि नियामक बदल तुम्हाला काय करायला सांगतात ते समजून घ्या.", kn: "ನಿಮ್ಮ ಒಪ್ಪಂದಗಳು ಮತ್ತು ನಿಯಂತ್ರಕ ಬದಲಾವಣೆಗಳು ನಿಮ್ಮಿಂದ ಏನನ್ನು ಅಪೇಕ್ಷಿಸುತ್ತವೆ.", ta: "உங்கள் ஒப்பந்தங்கள் மற்றும் ஒழுங்குமுறை மாற்றங்கள் உங்களிடம் என்ன எதிர்பார்க்கின்றன." }
  },
  {
    id: "citizen", icon: "👤",
    name: { en: "Citizen", hi: "नागरिक", mr: "नागरिक", kn: "ನಾಗರಿಕ", ta: "குடிமகன்" },
    desc: { en: "Understand legal documents in simple language.", hi: "सरल भाषा में कानूनी दस्तावेज़ समझें।", mr: "सोप्या भाषेत कायदेशीर दस्तऐवज समजून घ्या.", kn: "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", ta: "எளிய மொழியில் சட்ட ஆவணங்களைப் புரிந்துகொள்ளுங்கள்." },
    hero: { en: "Legal documents, explained simply.", hi: "कानूनी दस्तावेज़, सरल भाषा में।", mr: "कायदेशीर दस्तऐवज, सोप्या भाषेत.", kn: "ಕಾನೂನು ದಾಖಲೆಗಳು, ಸರಳವಾಗಿ ವಿವರಿಸಲಾಗಿದೆ.", ta: "சட்ட ஆவணங்கள், எளிமையாக விளக்கப்பட்டவை." },
    cta: { en: "Explain my document", hi: "मेरा दस्तावेज़ समझाएँ", mr: "माझा दस्तऐवज समजावून सांगा", kn: "ನನ್ನ ದಾಖಲೆಯನ್ನು ವಿವರಿಸಿ", ta: "என் ஆவணத்தை விளக்குங்கள்" },
    heroDesc: { en: "Understand a legal document or government decision in plain language. No jargon, just what it means for you.", hi: "किसी कानूनी दस्तावेज़ या सरकारी निर्णय को सरल भाषा में समझें। कोई जटिल शब्द नहीं, बस आपके लिए इसका क्या मतलब है।", mr: "कायदेशीर दस्तऐवज किंवा सरकारी निर्णय सोप्या भाषेत समजून घ्या.", kn: "ಕಾನೂನು ದಾಖಲೆ ಅಥವಾ ಸರ್ಕಾರಿ ನಿರ್ಧಾರವನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", ta: "சட்ட ஆவணம் அல்லது அரசாணையை எளிய மொழியில் புரிந்துகொள்ளுங்கள்." }
  }
];

var PROFILE_EXAMPLES = {
  student: {
    en: ["Explain this clause", "What legal principle is being applied here?", "Explain this judgment in simple terms", "What does this section mean?"],
    hi: ["इस धारा को समझाएँ", "यहाँ कौन सा कानूनी सिद्धांत लागू हो रहा है?", "इस फैसले को सरल शब्दों में समझाएँ", "इस अनुभाग का क्या अर्थ है?"],
    mr: ["ही कलम समजावून सांगा", "येथे कोणते कायदेशीर तत्त्व लागू होत आहे?", "हा निकाल सोप्या शब्दांत सांगा", "या विभागाचा अर्थ काय?"],
    kn: ["ಈ ಷರತ್ತನ್ನು ವಿವರಿಸಿ", "ಇಲ್ಲಿ ಯಾವ ಕಾನೂನು ತತ್ವ ಅನ್ವಯವಾಗುತ್ತಿದೆ?", "ಈ ತೀರ್ಪನ್ನು ಸರಳ ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ", "ಈ ವಿಭಾಗದ ಅರ್ಥವೇನು?"],
    ta: ["இந்தப் பிரிவை விளக்குங்கள்", "இங்கு எந்தச் சட்டக் கொள்கை பொருந்துகிறது?", "இந்தத் தீர்ப்பை எளிய சொற்களில் விளக்குங்கள்", "இந்தப் பகுதியின் பொருள் என்ன?"]
  },
  lawyer: {
    en: ["Is this indemnity cap enforceable?", "Find all clauses affected by this amendment", "Show the authority supporting this claim", "Compare this clause with the applicable law"],
    hi: ["क्या यह क्षतिपूर्ति सीमा लागू करने योग्य है?", "इस संशोधन से प्रभावित सभी धाराएँ खोजें", "इस दावे का समर्थन करने वाला प्राधिकरण दिखाएँ", "इस धारा की लागू कानून से तुलना करें"],
    mr: ["ही नुकसानभरपाई मर्यादा अंमलबजावणीयोग्य आहे का?", "या दुरुस्तीने प्रभावित सर्व कलमे शोधा", "या दाव्याचे समर्थन करणारे प्राधिकरण दाखवा", "या कलमाची लागू कायद्याशी तुलना करा"],
    kn: ["ಈ ನಷ್ಟಪರಿಹಾರ ಮಿತಿ ಜಾರಿಗೊಳಿಸಬಹುದೇ?", "ಈ ತಿದ್ದುಪಡಿಯಿಂದ ಪ್ರಭಾವಿತವಾದ ಎಲ್ಲಾ ಷರತ್ತುಗಳನ್ನು ಹುಡುಕಿ", "ಈ ಹಕ್ಕನ್ನು ಬೆಂಬಲಿಸುವ ಪ್ರಾಧಿಕಾರವನ್ನು ತೋರಿಸಿ", "ಈ ಷರತ್ತನ್ನು ಅನ್ವಯವಾಗುವ ಕಾನೂನಿನೊಂದಿಗೆ ಹೋಲಿಸಿ"],
    ta: ["இந்த இழப்பீட்டு வரம்பு நடைமுறைப்படுத்தக்கூடியதா?", "இந்தத் திருத்தத்தால் பாதிக்கப்பட்ட அனைத்துப் பிரிவுகளையும் கண்டறியுங்கள்", "இந்தக் கூற்றை ஆதரிக்கும் அதிகாரத்தைக் காட்டுங்கள்", "இந்தப் பிரிவை பொருந்தும் சட்டத்துடன் ஒப்பிடுங்கள்"]
  },
  msme: {
    en: ["What do I need to comply with?", "Does this new RBI circular affect my contract?", "What deadlines do I need to know?", "Which clauses are affected?"],
    hi: ["मुझे किसका अनुपालन करना होगा?", "क्या यह नया RBI परिपत्र मेरे अनुबंध को प्रभावित करता है?", "मुझे कौन सी समय-सीमाएँ जानने की आवश्यकता है?", "कौन सी धाराएँ प्रभावित हैं?"],
    mr: ["मला कशाचे अनुपालन करायचे आहे?", "हा नवीन RBI परिपत्रक माझ्या करारावर परिणाम करतो का?", "मला कोणत्या मुदती माहीत असणे आवश्यक आहे?", "कोणत्या कलमांवर परिणाम झाला?"],
    kn: ["ನಾನು ಯಾವುದನ್ನು ಅನುಸರಿಸಬೇಕು?", "ಈ ಹೊಸ RBI ಸುತ್ತೋಲೆ ನನ್ನ ಒಪ್ಪಂದದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆಯೇ?", "ನಾನು ಯಾವ ಅಂತಿಮ ದಿನಾಂಕಗಳನ್ನು ತಿಳಿದಿರಬೇಕು?", "ಯಾವ ಷರತ್ತುಗಳು ಪ್ರಭಾವಿತವಾಗಿವೆ?"],
    ta: ["நான் எதை இணக்கமாகப் பின்பற்ற வேண்டும்?", "இந்தப் புதிய RBI சுற்றறிக்கை என் ஒப்பந்தத்தைப் பாதிக்குமா?", "நான் என்ன காலக்கெடுவை அறிந்திருக்க வேண்டும்?", "எந்தப் பிரிவுகள் பாதிக்கப்பட்டுள்ளன?"]
  },
  citizen: {
    en: ["My landlord sent me a notice on WhatsApp", "Police won't register my FIR", "My employer hasn't paid my salary", "I bought a defective product"],
    hi: ["मेरे मकान मालिक ने WhatsApp पर नोटिस भेजा", "पुलिस मेरी FIR दर्ज नहीं कर रही", "मेरे नियोक्ता ने वेतन नहीं दिया", "मैंने एक खराब उत्पाद खरीदा"],
    mr: ["माझ्या घरमालकाने WhatsApp वर नोटीस पाठवली", "पोलिस माझा FIR नोंदवत नाहीत", "माझ्या मालकाने पगार दिला नाही", "मी एक सदोष उत्पादन विकत घेतले"],
    kn: ["ನನ್ನ ಮನೆ ಮಾಲೀಕ WhatsApp ನಲ್ಲಿ ನೋಟಿಸ್ ಕಳುಹಿಸಿದ್ದಾರೆ", "ಪೊಲೀಸರು ನನ್ನ FIR ದಾಖಲಿಸುತ್ತಿಲ್ಲ", "ನನ್ನ ಉದ್ಯೋಗದಾತ ಸಂಬಳ ಕೊಟ್ಟಿಲ್ಲ", "ನಾನು ದೋಷಪೂರಿತ ಉತ್ಪನ್ನ ಖರೀದಿಸಿದೆ"],
    ta: ["என் வீட்டு உரிமையாளர் WhatsApp-ல் நோட்டீஸ் அனுப்பினார்", "காவல்துறை என் FIR-ஐ பதிவு செய்யவில்லை", "என் முதலாளி சம்பளம் கொடுக்கவில்லை", "நான் குறைபாடுள்ள பொருள் வாங்கினேன்"]
  }
};

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

// MULTILINGUAL ANSWER CORPUS — keyed by topic then locale.
// Legal terms (Act names, section numbers, court names) are preserved in English form
// per the glossary rules in the architectural spec.
var ANSWERS = {
  tenancy: {
    en: {
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
      suggestions: ["What if I only got it on WhatsApp?", "How much notice must they give me?", "Can they cut off my water or power?"],
      verification: "verified"
    },
    hi: {
      simple: "मकान मालिक का नोटिस बेदखली नहीं है। यह एक औपचारिक माँग है, और इससे एक समय-सीमा शुरू होती है — लेकिन उचित कानूनी प्रक्रिया के बिना आपको आपके घर से नहीं हटाया जा सकता।",
      means: "किरायेदारी मुख्य रूप से राज्य का विषय है, इसलिए सटीक नियम इस पर निर्भर करते हैं कि आप कहाँ रहते हैं और आपका समझौता क्या कहता है। अधिकांश राज्यों में खाली करने के नोटिस में कारण बताना, न्यूनतम अवधि देना और कानूनी रूप से मान्य तरीके से आपको मिलना आवश्यक है। WhatsApp पर भेजा गया संदेश मान्य सेवा के रूप में गिना जाएगा या नहीं, यह आपके राज्य और आपके समझौते पर निर्भर करता है।",
      steps: [
        "संदेश को सुरक्षित करें। तारीख और भेजने वाले के नंबर के साथ स्क्रीनशॉट लें और फोन से अलग बैकअप रखें।",
        "अपना किराया समझौता खोजें और उसमें लिखी नोटिस अवधि की जाँच करें।",
        "लिखित में उत्तर दें कि आपने नोटिस प्राप्त कर लिया है और कारण तथा अवधि पूछ रहे हैं। प्रति अपने पास रखें।",
        "किराया बैंक ट्रांसफर या UPI से भरते रहें, नकद नहीं, ताकि रिकॉर्ड रहे।",
        "मुफ्त कानूनी सहायता हेल्पलाइन 15100 पर कॉल करें और अपने जिला विधिक सेवा प्राधिकरण (DLSA) के किरायेदारी डेस्क से बात करें।"
      ],
      law: "जहाँ कोई राज्य किराया नियंत्रण कानून लागू नहीं है, वहाँ पट्टा समाप्त करने की नोटिस अवधि Transfer of Property Act से आती है। अधिकांश राज्यों में अपना Rent Control Act भी है, जो इसे ओवरराइड कर सकता है और आम तौर पर किरायेदार के लिए अधिक सुरक्षात्मक है। बेदखली के लिए आदेश आवश्यक है — बिना आदेश के कार्रवाई करने वाला मकान मालिक कानून के बाहर है।",
      citations: [
        { section: "s. 106", title: "Transfer of Property Act, 1882 — पट्टे की अवधि और नोटिस द्वारा समाप्ति" },
        { section: "State Act", title: "आपके राज्य का Rent Control Act — बेदखली के आधार और नोटिस आवश्यकताएँ" }
      ],
      lawyer: "अभी किसी वकील से बात करें यदि नोटिस में किराया बकाया का दावा है जिससे आप असहमत हैं, यदि आपको अदालत से कुछ मिला है, या यदि आप पर कुछ दिनों में जाने का दबाव डाला जा रहा है। 15100 पर मुफ्त कानूनी सहायता उपलब्ध है।",
      suggestions: ["अगर सिर्फ WhatsApp पर मिला तो?", "उन्हें कितना नोटिस देना होगा?", "क्या वे मेरा पानी या बिजली काट सकते हैं?"],
      verification: "verified"
    },
    mr: {
      simple: "घरमालकाची नोटीस म्हणजे बेदखल करणे नाही. ही एक औपचारिक मागणी आहे आणि यातून एक कालमर्यादा सुरू होते — पण योग्य कायदेशीर प्रक्रियेशिवाय तुम्हाला तुमच्या घरातून काढता येत नाही.",
      means: "भाडेकरू कायदा हा मुख्यतः राज्य विषय आहे, त्यामुळे अचूक नियम तुम्ही कुठे राहता आणि तुमचा करार काय सांगतो यावर अवलंबून असतात. बहुतेक राज्यांमध्ये घर रिकामे करण्याच्या नोटीसमध्ये कारण सांगणे, किमान कालावधी देणे आणि कायद्याने मान्य पद्धतीने तुम्हाला पोहोचणे आवश्यक आहे. WhatsApp वरील संदेश वैध बजावणी म्हणून गणला जाईल की नाही हे तुमच्या राज्यावर आणि तुमच्या करारावर अवलंबून आहे.",
      steps: [
        "संदेश सुरक्षित ठेवा. तारीख आणि पाठवणाऱ्याचा नंबर दिसेल असा स्क्रीनशॉट घ्या आणि फोनबाहेर बॅकअप ठेवा.",
        "तुमचा भाडे करार शोधा आणि त्यात लिहिलेला नोटीस कालावधी तपासा.",
        "लेखी उत्तर द्या की तुम्ही नोटीस प्राप्त केली आहे आणि कारण व कालावधी विचारत आहात. प्रत सोबत ठेवा.",
        "भाडे बँक ट्रान्सफर किंवा UPI ने भरत राहा, रोख नाही, जेणेकरून नोंद राहील.",
        "मोफत कायदेशीर मदत हेल्पलाइन 15100 वर कॉल करा आणि तुमच्या जिल्हा विधी सेवा प्राधिकरणाच्या (DLSA) भाडेकरू डेस्कशी बोला."
      ],
      law: "जेथे राज्य भाडे नियंत्रण कायदा लागू नाही, तेथे भाडेपट्टी संपवण्यासाठी नोटीस कालावधी Transfer of Property Act मधून येतो. बहुतेक राज्यांचा स्वतःचा Rent Control Act आहे, जो ते ओव्हरराइड करू शकतो आणि सामान्यतः भाडेकरूसाठी अधिक संरक्षणात्मक असतो. बेदखलीसाठी आदेश आवश्यक आहे — आदेशाशिवाय कारवाई करणारा घरमालक कायद्याबाहेर आहे.",
      citations: [
        { section: "s. 106", title: "Transfer of Property Act, 1882 — भाडेपट्टीचा कालावधी आणि नोटीसद्वारे समाप्ती" },
        { section: "State Act", title: "तुमच्या राज्याचा Rent Control Act — बेदखलीचे आधार आणि नोटीस आवश्यकता" }
      ],
      lawyer: "जर नोटीसमध्ये तुम्ही असहमत असलेला भाडे थकबाकीचा दावा असेल, तुम्हाला न्यायालयातून काही मिळाले असेल, किंवा काही दिवसांत जाण्यासाठी दबाव असेल तर आत्ताच वकिलाशी बोला. 15100 वर मोफत कायदेशीर मदत उपलब्ध आहे.",
      suggestions: ["फक्त WhatsApp वर आली तर?", "त्यांना किती नोटीस द्यावी लागते?", "ते माझे पाणी किंवा वीज तोडू शकतात का?"],
      verification: "verified"
    },
    kn: {
      simple: "ಮನೆ ಮಾಲೀಕರ ನೋಟಿಸ್ ಎಂದರೆ ಹೊರಹಾಕುವಿಕೆ ಅಲ್ಲ. ಇದು ಒಂದು ಔಪಚಾರಿಕ ಬೇಡಿಕೆ, ಮತ್ತು ಇದರಿಂದ ಒಂದು ಸಮಯ ಮಿತಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ — ಆದರೆ ಸರಿಯಾದ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆ ಇಲ್ಲದೆ ನಿಮ್ಮನ್ನು ನಿಮ್ಮ ಮನೆಯಿಂದ ತೆಗೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      means: "ಬಾಡಿಗೆ ಕಾನೂನು ಮುಖ್ಯವಾಗಿ ರಾಜ್ಯ ವಿಷಯ, ಆದ್ದರಿಂದ ನಿಖರ ನಿಯಮಗಳು ನೀವು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ ಮತ್ತು ನಿಮ್ಮ ಒಪ್ಪಂದ ಏನು ಹೇಳುತ್ತದೆ ಎಂಬುದರ ಮೇಲೆ ಅವಲಂಬಿಸಿದೆ. WhatsApp ನಲ್ಲಿ ಕಳುಹಿಸಿದ ಸಂದೇಶ ಮಾನ್ಯ ಜಾರಿ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆಯೇ ಎಂಬುದು ನಿಮ್ಮ ರಾಜ್ಯ ಮತ್ತು ನಿಮ್ಮ ಒಪ್ಪಂದದ ಮೇಲೆ ಅವಲಂಬಿಸಿದೆ.",
      steps: [
        "ಸಂದೇಶವನ್ನು ಉಳಿಸಿ. ದಿನಾಂಕ ಮತ್ತು ಕಳುಹಿಸಿದವರ ಸಂಖ್ಯೆ ಕಾಣುವಂತೆ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ತೆಗೆಯಿರಿ.",
        "ನಿಮ್ಮ ಬಾಡಿಗೆ ಒಪ್ಪಂದ ಹುಡುಕಿ ಮತ್ತು ಅದರಲ್ಲಿ ಬರೆದ ನೋಟಿಸ್ ಅವಧಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
        "ನೀವು ನೋಟಿಸ್ ಸ್ವೀಕರಿಸಿದ್ದೀರಿ ಎಂದು ಬರವಣಿಗೆಯಲ್ಲಿ ಉತ್ತರಿಸಿ.",
        "ಬಾಡಿಗೆಯನ್ನು ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಅಥವಾ UPI ಮೂಲಕ ಪಾವತಿಸಿ, ನಗದಲ್ಲ.",
        "ಉಚಿತ ಕಾನೂನು ನೆರವು ಸಹಾಯವಾಣಿ 15100 ಗೆ ಕರೆ ಮಾಡಿ."
      ],
      law: "ರಾಜ್ಯ ಬಾಡಿಗೆ ನಿಯಂತ್ರಣ ಕಾನೂನು ಅನ್ವಯವಾಗದಿದ್ದರೆ, ಗುತ್ತಿಗೆ ಅಂತ್ಯಗೊಳಿಸಲು ನೋಟಿಸ್ ಅವಧಿ Transfer of Property Act ನಿಂದ ಬರುತ್ತದೆ. ಹೊರಹಾಕುವಿಕೆಗೆ ಆದೇಶ ಅಗತ್ಯ — ಆದೇಶವಿಲ್ಲದೆ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಮನೆ ಮಾಲೀಕ ಕಾನೂನಿನ ಹೊರಗಿದ್ದಾರೆ.",
      citations: [
        { section: "s. 106", title: "Transfer of Property Act, 1882 — ಗುತ್ತಿಗೆ ಅವಧಿ ಮತ್ತು ನೋಟಿಸ್ ಮೂಲಕ ಸಮಾಪ್ತಿ" },
        { section: "State Act", title: "ನಿಮ್ಮ ರಾಜ್ಯದ Rent Control Act" }
      ],
      lawyer: "ನೋಟಿಸ್‌ನಲ್ಲಿ ನೀವು ಒಪ್ಪದ ಬಾಡಿಗೆ ಬಾಕಿ ಹಕ್ಕು ಇದ್ದರೆ, ನ್ಯಾಯಾಲಯದಿಂದ ಏನಾದರೂ ಬಂದಿದ್ದರೆ ಈಗಲೇ ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ. 15100 ನಲ್ಲಿ ಉಚಿತ ಕಾನೂನು ನೆರವು ಲಭ್ಯ.",
      suggestions: ["WhatsApp ನಲ್ಲಿ ಮಾತ್ರ ಬಂದರೆ?", "ಅವರು ಎಷ್ಟು ನೋಟಿಸ್ ಕೊಡಬೇಕು?", "ಅವರು ನನ್ನ ನೀರು ಅಥವಾ ವಿದ್ಯುತ್ ಕಡಿಯಬಹುದೇ?"],
      verification: "verified"
    },
    ta: {
      simple: "வீட்டு உரிமையாளரின் நோட்டீஸ் என்பது வெளியேற்றம் அல்ல. இது ஒரு முறையான கோரிக்கை, இதன் மூலம் ஒரு கால அளவு தொடங்குகிறது — ஆனால் சரியான சட்ட நடவடிக்கை இல்லாமல் உங்களை உங்கள் வீட்டிலிருந்து அகற்ற முடியாது.",
      means: "குத்தகை சட்டம் முக்கியமாக மாநில விஷயம், எனவே சரியான விதிகள் நீங்கள் எங்கு வசிக்கிறீர்கள் மற்றும் உங்கள் ஒப்பந்தம் என்ன சொல்கிறது என்பதைப் பொறுத்தது. WhatsApp-ல் அனுப்பிய செய்தி சரியான தகவல் அளிப்பாகக் கருதப்படுமா என்பது உங்கள் மாநிலம் மற்றும் உங்கள் ஒப்பந்தத்தைப் பொறுத்தது.",
      steps: [
        "செய்தியைச் சேமியுங்கள். தேதி மற்றும் அனுப்பியவரின் எண் தெரியும்படி ஸ்கிரீன்ஷாட் எடுங்கள்.",
        "உங்கள் வாடகை ஒப்பந்தத்தைக் கண்டுபிடித்து, அதில் எழுதப்பட்ட நோட்டீஸ் காலத்தைச் சரிபாருங்கள்.",
        "நோட்டீஸ் பெற்றுக்கொண்டதாக எழுத்துப்பூர்வமாக பதில் அளியுங்கள்.",
        "வாடகையை வங்கி பரிமாற்றம் அல்லது UPI மூலம் செலுத்துங்கள், ரொக்கமாக அல்ல.",
        "இலவச சட்ட உதவி ஹெல்ப்லைன் 15100-க்கு அழைக்கவும்."
      ],
      law: "மாநில வாடகை கட்டுப்பாட்டு சட்டம் பொருந்தாத இடத்தில், குத்தகை முடிவுக்கான நோட்டீஸ் காலம் Transfer of Property Act-இலிருந்து வருகிறது. வெளியேற்றத்திற்கு உத்தரவு தேவை — உத்தரவு இல்லாமல் செயல்படும் வீட்டு உரிமையாளர் சட்டத்திற்கு அப்பாற்பட்டவர்.",
      citations: [
        { section: "s. 106", title: "Transfer of Property Act, 1882 — குத்தகை காலம் மற்றும் நோட்டீஸ் மூலம் முடிவு" },
        { section: "State Act", title: "உங்கள் மாநிலத்தின் Rent Control Act" }
      ],
      lawyer: "நோட்டீஸில் நீங்கள் ஏற்காத வாடகை நிலுவை உள்ளது, நீதிமன்றத்திலிருந்து ஏதாவது வந்துள்ளது என்றால் இப்போதே ஒரு வழக்கறிஞரிடம் பேசுங்கள். 15100-ல் இலவச சட்ட உதவி கிடைக்கும்.",
      suggestions: ["WhatsApp-ல் மட்டும் வந்தால்?", "அவர்கள் எவ்வளவு நோட்டீஸ் கொடுக்க வேண்டும்?", "அவர்கள் என் தண்ணீர் அல்லது மின்சாரத்தை துண்டிக்க முடியுமா?"],
      verification: "verified"
    }
  },
  police: {
    en: {
      simple: "A person in police custody has rights that apply from the moment they are picked up — including being told the reason, informing a family member, and meeting a lawyer. The most useful thing you can do right now is get legal aid on the phone.",
      means: "The police must record an arrest, inform a relative or friend, and produce the person before a magistrate within 24 hours. Free legal representation is a right, not a favour, and the legal aid authority can send an advocate to the station.",
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
      suggestions: ["Can I meet him at the station?", "What is an arrest memo?", "What happens after 24 hours?"],
      verification: "verified"
    },
    hi: {
      simple: "पुलिस हिरासत में किसी व्यक्ति के अधिकार उसके पकड़े जाने के क्षण से लागू होते हैं — जिसमें कारण बताना, परिवार के सदस्य को सूचित करना और वकील से मिलना शामिल है। अभी सबसे उपयोगी काम फोन पर कानूनी सहायता प्राप्त करना है।",
      means: "पुलिस को गिरफ्तारी दर्ज करनी होगी, किसी रिश्तेदार या मित्र को सूचित करना होगा, और 24 घंटे के भीतर व्यक्ति को मजिस्ट्रेट के समक्ष पेश करना होगा। मुफ्त कानूनी प्रतिनिधित्व एक अधिकार है, कृपा नहीं।",
      steps: [
        "अभी 15100 पर कॉल करें और कहें कि परिवार का सदस्य पुलिस हिरासत में है। ड्यूटी वकील माँगें।",
        "स्टेशन का नाम, अधिकारी का नाम और पकड़े जाने का समय लिख लें।",
        "स्टेशन पर गिरफ्तारी मेमो और केस या FIR नंबर माँगें, और नोट करें कि कौन मना करता है।",
        "बिना पढ़े कुछ भी साइन न करें, और उन्हें खाली पन्ने पर साइन न करने दें।",
        "गिरफ्तारी के समय से मजिस्ट्रेट के समक्ष पेशी की 24 घंटे की समय-सीमा नोट करें।"
      ],
      law: "संविधान गारंटी देता है कि गिरफ्तार व्यक्ति को गिरफ्तारी के आधार बताए जाएँ और 24 घंटे के भीतर मजिस्ट्रेट के समक्ष पेश किया जाए, और वकील से परामर्श का अधिकार। सर्वोच्च न्यायालय के गिरफ्तारी दिशानिर्देश पुलिस पर विशिष्ट कर्तव्य लगाते हैं।",
      citations: [
        { section: "Art. 22", title: "भारत का संविधान — गिरफ्तारी और निरोध के विरुद्ध संरक्षण" },
        { section: "Guidelines", title: "D.K. Basu v. State of West Bengal (1997) — अनिवार्य गिरफ्तारी प्रक्रिया" }
      ],
      lawyer: "यह स्थिति आज वकील के लिए है, पढ़ने के लिए नहीं। 15100 पर कानूनी सहायता मुफ्त है और आज रात कार्रवाई कर सकती है।",
      suggestions: ["क्या मैं उनसे स्टेशन पर मिल सकता हूँ?", "गिरफ्तारी मेमो क्या है?", "24 घंटे बाद क्या होता है?"],
      verification: "verified"
    },
    mr: {
      simple: "पोलीस कोठडीतील व्यक्तीचे अधिकार पकडल्याच्या क्षणापासून लागू होतात — ज्यात कारण सांगणे, कुटुंबातील सदस्याला कळवणे आणि वकिलाला भेटणे यांचा समावेश आहे.",
      means: "पोलिसांना अटक नोंदवावी लागते, नातेवाईक किंवा मित्राला कळवावे लागते आणि 24 तासांत व्यक्तीला दंडाधिकाऱ्यांसमोर हजर करावे लागते. मोफत कायदेशीर प्रतिनिधित्व हा अधिकार आहे.",
      steps: [
        "आत्ता 15100 वर कॉल करा आणि सांगा की कुटुंबातील सदस्य पोलीस कोठडीत आहे. ड्यूटी वकील मागा.",
        "स्टेशनचे नाव, अधिकाऱ्याचे नाव आणि पकडण्याची वेळ लिहून ठेवा.",
        "स्टेशनवर अटक मेमो आणि केस किंवा FIR नंबर मागा.",
        "न वाचता काहीही सही करू नका.",
        "अटकेपासून दंडाधिकाऱ्यांसमोर हजेरीची 24 तासांची मुदत लक्षात ठेवा."
      ],
      law: "संविधान हमी देतो की अटक झालेल्या व्यक्तीला अटकेची कारणे सांगितली जातील आणि 24 तासांत दंडाधिकाऱ्यांसमोर हजर केले जाईल. सर्वोच्च न्यायालयाच्या अटक मार्गदर्शक तत्त्वांनी पोलिसांवर विशिष्ट कर्तव्ये लादली आहेत.",
      citations: [
        { section: "Art. 22", title: "भारतीय संविधान — अटक आणि स्थानबद्धतेविरुद्ध संरक्षण" },
        { section: "Guidelines", title: "D.K. Basu v. State of West Bengal (1997) — अनिवार्य अटक प्रक्रिया" }
      ],
      lawyer: "ही परिस्थिती आज वकिलासाठी आहे. 15100 वर मोफत कायदेशीर मदत उपलब्ध आहे आणि आज रात्री कारवाई करू शकते.",
      suggestions: ["मी त्यांना स्टेशनवर भेटू शकतो का?", "अटक मेमो म्हणजे काय?", "24 तासांनंतर काय होते?"],
      verification: "verified"
    },
    kn: {
      simple: "ಪೊಲೀಸ್ ಕಸ್ಟಡಿಯಲ್ಲಿರುವ ವ್ಯಕ್ತಿಗೆ ಅವರನ್ನು ಹಿಡಿದ ಕ್ಷಣದಿಂದಲೇ ಹಕ್ಕುಗಳು ಅನ್ವಯವಾಗುತ್ತವೆ — ಕಾರಣ ತಿಳಿಸುವುದು, ಕುಟುಂಬ ಸದಸ್ಯರಿಗೆ ತಿಳಿಸುವುದು ಮತ್ತು ವಕೀಲರನ್ನು ಭೇಟಿಯಾಗುವುದು ಸೇರಿದಂತೆ.",
      means: "ಪೊಲೀಸರು ಬಂಧನವನ್ನು ದಾಖಲಿಸಬೇಕು, ಸಂಬಂಧಿಕರಿಗೆ ತಿಳಿಸಬೇಕು ಮತ್ತು 24 ಗಂಟೆಗಳಲ್ಲಿ ವ್ಯಕ್ತಿಯನ್ನು ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಮುಂದೆ ಹಾಜರುಪಡಿಸಬೇಕು.",
      steps: [
        "ಈಗಲೇ 15100 ಗೆ ಕರೆ ಮಾಡಿ ಮತ್ತು ಕುಟುಂಬ ಸದಸ್ಯ ಪೊಲೀಸ್ ಕಸ್ಟಡಿಯಲ್ಲಿದ್ದಾರೆ ಎಂದು ಹೇಳಿ.",
        "ಠಾಣೆ ಹೆಸರು, ಅಧಿಕಾರಿ ಹೆಸರು ಮತ್ತು ಕರೆದೊಯ್ಯಲಾದ ಸಮಯ ಬರೆದಿಡಿ.",
        "ಠಾಣೆಯಲ್ಲಿ ಬಂಧನ ಮೆಮೊ ಮತ್ತು ಕೇಸ್ ಅಥವಾ FIR ಸಂಖ್ಯೆ ಕೇಳಿ.",
        "ಓದದೆ ಏನನ್ನೂ ಸಹಿ ಮಾಡಬೇಡಿ.",
        "ಬಂಧನದ ಸಮಯದಿಂದ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಮುಂದೆ ಹಾಜರಾಗಲು 24 ಗಂಟೆ ಅಂತಿಮ ಗಡುವನ್ನು ಗಮನಿಸಿ."
      ],
      law: "ಸಂವಿಧಾನವು ಬಂಧಿತ ವ್ಯಕ್ತಿಗೆ ಬಂಧನದ ಕಾರಣಗಳನ್ನು ತಿಳಿಸಲಾಗುತ್ತದೆ ಮತ್ತು 24 ಗಂಟೆಗಳಲ್ಲಿ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಮುಂದೆ ಹಾಜರುಪಡಿಸಲಾಗುತ್ತದೆ ಎಂದು ಖಾತ್ರಿ ನೀಡುತ್ತದೆ.",
      citations: [
        { section: "Art. 22", title: "ಭಾರತ ಸಂವಿಧಾನ — ಬಂಧನ ಮತ್ತು ಬಂಧಿತವಾಗುವುದರ ವಿರುದ್ಧ ರಕ್ಷಣೆ" },
        { section: "Guidelines", title: "D.K. Basu v. State of West Bengal (1997) — ಕಡ್ಡಾಯ ಬಂಧನ ಪ್ರಕ್ರಿಯೆ" }
      ],
      lawyer: "ಇದು ಈ ದಿನ ವಕೀಲರಿಗೆ ಸೇರಿದ ಸಂದರ್ಭ. 15100 ನಲ್ಲಿ ಉಚಿತ ಕಾನೂನು ನೆರವು ಲಭ್ಯ.",
      suggestions: ["ನಾನು ಅವರನ್ನು ಠಾಣೆಯಲ್ಲಿ ಭೇಟಿಯಾಗಬಹುದೇ?", "ಬಂಧನ ಮೆಮೊ ಎಂದರೇನು?", "24 ಗಂಟೆ ನಂತರ ಏನಾಗುತ್ತದೆ?"],
      verification: "verified"
    },
    ta: {
      simple: "காவல் நிலையத்தில் உள்ள நபருக்கு பிடிக்கப்பட்ட தருணத்திலிருந்தே உரிமைகள் பொருந்தும் — காரணம் தெரிவிப்பது, குடும்ப உறுப்பினருக்கு தகவல் அளிப்பது மற்றும் வழக்கறிஞரைச் சந்திப்பது உட்பட.",
      means: "காவல்துறை கைதை பதிவு செய்ய வேண்டும், உறவினருக்கு தெரிவிக்க வேண்டும், 24 மணி நேரத்திற்குள் நீதிமன்றத்தில் ஆஜர்படுத்த வேண்டும்.",
      steps: [
        "இப்போதே 15100-க்கு அழைக்கவும், குடும்ப உறுப்பினர் காவல்துறை காவலில் உள்ளார் என்று சொல்லுங்கள்.",
        "நிலையத்தின் பெயர், அதிகாரியின் பெயர் மற்றும் பிடிக்கப்பட்ட நேரம் எழுதுங்கள்.",
        "நிலையத்தில் கைது குறிப்பு மற்றும் வழக்கு அல்லது FIR எண் கேளுங்கள்.",
        "படிக்காமல் எதிலும் கையெழுத்திடாதீர்கள்.",
        "கைது செய்யப்பட்ட நேரத்திலிருந்து நீதிமன்றத்தில் ஆஜர்படுத்துவதற்கான 24 மணி நேர காலக்கெடுவைக் கவனியுங்கள்."
      ],
      law: "அரசியலமைப்பு கைது செய்யப்பட்ட நபருக்கு கைதின் காரணங்கள் தெரிவிக்கப்படும் என்றும் 24 மணி நேரத்திற்குள் நீதிமன்றத்தில் ஆஜர்படுத்தப்படும் என்றும் உத்தரவாதம் அளிக்கிறது.",
      citations: [
        { section: "Art. 22", title: "இந்திய அரசியலமைப்பு — கைது மற்றும் தடுப்புக்காவலுக்கு எதிரான பாதுகாப்பு" },
        { section: "Guidelines", title: "D.K. Basu v. State of West Bengal (1997) — கட்டாய கைது நடைமுறை" }
      ],
      lawyer: "இது வழக்கறிஞருக்கான சூழ்நிலை, படிப்பதற்கல்ல. 15100-ல் இலவச சட்ட உதவி கிடைக்கும்.",
      suggestions: ["நான் அவரை நிலையத்தில் சந்திக்கலாமா?", "கைது குறிப்பு என்றால் என்ன?", "24 மணி நேரத்திற்குப் பிறகு என்ன நடக்கும்?"],
      verification: "verified"
    }
  },
  wages: {
    en: {
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
      suggestions: ["I have no appointment letter", "How long do I have to file?", "Can they fire me for complaining?"],
      verification: "partial"
    },
    hi: {
      simple: "बकाया वेतन वसूल किया जा सकता है, और इसके लिए एक विशेष प्राधिकरण है — आपको पहले सामान्य अदालत में जाने की आवश्यकता नहीं है। जितना अधिक आप प्रतीक्षा करेंगे, दावा उतना कठिन होगा।",
      means: "वेतन दावे श्रम अधिकारियों द्वारा वेतन और औद्योगिक विवाद कानून के तहत संभाले जाते हैं, और यह प्रक्रिया वकील के बिना काम करने के लिए डिज़ाइन की गई है। आपको सबसे अधिक रोज़गार संबंध और बकाया राशि का प्रमाण चाहिए: नियुक्ति पत्र, ID कार्ड, रोस्टर, बैंक क्रेडिट, या सुपरवाइज़र के साथ WhatsApp थ्रेड भी।",
      steps: [
        "सटीक महीने और बकाया राशियाँ सूचीबद्ध करें, और कुछ भी इकट्ठा करें जो दिखाता है कि आपने वहाँ काम किया।",
        "नियोक्ता को एक लिखित माँग भेजें — WhatsApp संदेश ठीक है — और डिलीवरी रिकॉर्ड रखें।",
        "अपने क्षेत्र के श्रम आयुक्त कार्यालय में दावा दाखिल करें। कोई शुल्क नहीं है।",
        "यदि आप चाहते हैं कि एक मुफ्त वकील आपके साथ दावा तैयार करे तो 15100 पर कॉल करें।"
      ],
      law: "वेतन भुगतान की समय-सीमा और कटौतियाँ Code on Wages और Payment of Wages Act द्वारा शासित हैं। बकाया वेतन पर विवाद उस कानून के तहत नियुक्त प्राधिकरण के समक्ष उठाए जा सकते हैं।",
      citations: [
        { section: "Code, 2019", title: "Code on Wages, 2019 — वेतन का समय पर भुगतान और दावा प्रक्रिया" },
        { section: "s. 15", title: "Payment of Wages Act, 1936 — कटौती या विलंबित वेतन के दावे" }
      ],
      lawyer: "यदि नियोक्ता यह नकारता है कि आपने कभी वहाँ काम किया, यदि आप घायल या बर्खास्त भी हुए, या राशि इतनी बड़ी है कि दावा ठीक से तैयार करना चाहेंगे, तो वकील से बात करें।",
      suggestions: ["मेरे पास नियुक्ति पत्र नहीं है", "दाखिल करने की समय सीमा कितनी है?", "क्या शिकायत करने पर वे मुझे निकाल सकते हैं?"],
      verification: "partial"
    },
    mr: {
      simple: "थकित वेतन वसूल करता येते, आणि त्यासाठी एक विशिष्ट प्राधिकरण आहे — तुम्हाला आधी सामान्य न्यायालयात जाण्याची गरज नाही.",
      means: "वेतन दावे श्रम अधिकाऱ्यांकडून वेतन आणि औद्योगिक विवाद कायद्याअंतर्गत हाताळले जातात. तुम्हाला सर्वात जास्त रोजगार संबंध आणि थकित रकमेचा पुरावा हवा आहे.",
      steps: [
        "अचूक महिने आणि थकित रकमा सूचीबद्ध करा.",
        "मालकाला एक लिखित मागणी पाठवा — WhatsApp संदेश चालेल.",
        "तुमच्या भागातील कामगार आयुक्त कार्यालयात दावा दाखल करा. शुल्क नाही.",
        "मोफत वकील हवा असल्यास 15100 वर कॉल करा."
      ],
      law: "वेतन भरण्याच्या मुदती आणि कपाती Code on Wages आणि Payment of Wages Act द्वारे नियंत्रित आहेत.",
      citations: [
        { section: "Code, 2019", title: "Code on Wages, 2019 — वेतनाचे वेळेवर भरणा आणि दावा प्रक्रिया" },
        { section: "s. 15", title: "Payment of Wages Act, 1936 — कपात किंवा विलंबित वेतनाचे दावे" }
      ],
      lawyer: "जर मालक तुम्ही तिथे कधीच काम केले नाही असे नाकारत असेल, तुम्ही जखमीही झाला असाल किंवा रक्कम मोठी असेल तर वकिलाशी बोला.",
      suggestions: ["माझ्याकडे नियुक्ती पत्र नाही", "दाखल करण्याची मुदत किती आहे?", "तक्रार केल्यावर ते मला काढू शकतात का?"],
      verification: "partial"
    },
    kn: {
      simple: "ಪಾವತಿಸದ ವೇತನ ವಸೂಲಿ ಮಾಡಬಹುದು, ಮತ್ತು ಅದಕ್ಕಾಗಿ ನಿರ್ದಿಷ್ಟ ಪ್ರಾಧಿಕಾರವಿದೆ — ನೀವು ಮೊದಲು ಸಾಮಾನ್ಯ ನ್ಯಾಯಾಲಯಕ್ಕೆ ಹೋಗಬೇಕಾಗಿಲ್ಲ.",
      means: "ವೇತನ ಹಕ್ಕುಗಳನ್ನು ಕಾರ್ಮಿಕ ಪ್ರಾಧಿಕಾರಿಗಳು ನಿರ್ವಹಿಸುತ್ತಾರೆ. ನಿಮಗೆ ಅತ್ಯಂತ ಅಗತ್ಯವಿರುವುದು ಉದ್ಯೋಗ ಸಂಬಂಧ ಮತ್ತು ಬಾಕಿ ಮೊತ್ತದ ಪುರಾವೆ.",
      steps: [
        "ನಿಖರ ತಿಂಗಳುಗಳು ಮತ್ತು ಬಾಕಿ ಮೊತ್ತಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ.",
        "ಉದ್ಯೋಗದಾತರಿಗೆ ಒಂದು ಲಿಖಿತ ಬೇಡಿಕೆ ಕಳುಹಿಸಿ.",
        "ನಿಮ್ಮ ಪ್ರದೇಶದ ಕಾರ್ಮಿಕ ಆಯುಕ್ತರ ಕಚೇರಿಯಲ್ಲಿ ಹಕ್ಕು ಸಲ್ಲಿಸಿ. ಶುಲ್ಕವಿಲ್ಲ.",
        "ಉಚಿತ ವಕೀಲರು ಬೇಕಾದರೆ 15100 ಗೆ ಕರೆ ಮಾಡಿ."
      ],
      law: "ವೇತನ ಪಾವತಿ ಸಮಯ ಮಿತಿಗಳು Code on Wages ಮತ್ತು Payment of Wages Act ಮೂಲಕ ನಿಯಂತ್ರಿಸಲ್ಪಡುತ್ತವೆ.",
      citations: [
        { section: "Code, 2019", title: "Code on Wages, 2019 — ವೇತನ ಸಮಯಕ್ಕೆ ಪಾವತಿ ಮತ್ತು ಹಕ್ಕು ಪ್ರಕ್ರಿಯೆ" },
        { section: "s. 15", title: "Payment of Wages Act, 1936 — ಕಡಿತ ಅಥವಾ ವಿಳಂಬಿತ ವೇತನ ಹಕ್ಕುಗಳು" }
      ],
      lawyer: "ಉದ್ಯೋಗದಾತ ನೀವು ಎಂದೂ ಕೆಲಸ ಮಾಡಿಲ್ಲ ಎಂದು ನಿರಾಕರಿಸಿದರೆ ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ.",
      suggestions: ["ನನ್ನ ಬಳಿ ನೇಮಕಾತಿ ಪತ್ರ ಇಲ್ಲ", "ಸಲ್ಲಿಸಲು ಎಷ್ಟು ಸಮಯವಿದೆ?", "ದೂರು ನೀಡಿದರೆ ಅವರು ನನ್ನನ್ನು ವಜಾ ಮಾಡಬಹುದೇ?"],
      verification: "partial"
    },
    ta: {
      simple: "செலுத்தப்படாத ஊதியத்தை வசூலிக்கலாம், அதற்கென ஒரு குறிப்பிட்ட அதிகாரம் உள்ளது — நீங்கள் முதலில் வழக்கமான நீதிமன்றத்திற்குச் செல்ல வேண்டியதில்லை.",
      means: "ஊதிய கோரிக்கைகள் தொழிலாளர் அதிகாரிகளால் கையாளப்படுகின்றன. உங்களுக்கு அதிகமாகத் தேவை வேலை உறவு மற்றும் நிலுவைத் தொகையின் ஆதாரம்.",
      steps: [
        "சரியான மாதங்கள் மற்றும் நிலுவைத் தொகைகளைப் பட்டியலிடுங்கள்.",
        "முதலாளிக்கு ஒரு எழுத்துப்பூர்வ கோரிக்கை அனுப்புங்கள்.",
        "உங்கள் பகுதியின் தொழிலாளர் ஆணையர் அலுவலகத்தில் கோரிக்கை தாக்கல் செய்யுங்கள். கட்டணம் இல்லை.",
        "இலவச வழக்கறிஞர் வேண்டுமென்றால் 15100-க்கு அழைக்கவும்."
      ],
      law: "ஊதிய செலுத்தும் கால அளவுகள் Code on Wages மற்றும் Payment of Wages Act மூலம் நிர்வகிக்கப்படுகின்றன.",
      citations: [
        { section: "Code, 2019", title: "Code on Wages, 2019 — ஊதியத்தின் நேரடி செலுத்தல் மற்றும் கோரிக்கை நடைமுறை" },
        { section: "s. 15", title: "Payment of Wages Act, 1936 — கழிக்கப்பட்ட அல்லது தாமதமான ஊதிய கோரிக்கைகள்" }
      ],
      lawyer: "முதலாளி நீங்கள் அங்கு வேலை செய்யவில்லை என்று மறுத்தால் வழக்கறிஞரிடம் பேசுங்கள்.",
      suggestions: ["என்னிடம் நியமன கடிதம் இல்லை", "தாக்கல் செய்ய எவ்வளவு நேரம் உள்ளது?", "புகார் அளித்தால் அவர்கள் என்னை நீக்க முடியுமா?"],
      verification: "partial"
    }
  }
};

var HIGH_RISK = ["police", "arrest", "detain", "custody", "bail", "fir", "violence", "beat", "hit me", "threat", "danger", "abuse", "minor", "harm myself",
  "पुलिस", "गिरफ्तार", "हिरासत", "हिंसा", "धमकी", "पोलीस", "अटक", "ಪೊಲೀಸ್", "ಬಂಧನ", "காவல்", "கைது"];

var LADDER = [
  { at: 0, copy: "Reading your question…" },
  { at: 2600, copy: "Looking through the relevant law…" },
  { at: 7000, copy: "Still working — this one's taking a moment." }
];

/* ---------- state ---------- */

var S = {
  view: "landing",
  locale: "en",
  highlighted: "en",
  profile: null, // null | "student" | "lawyer" | "msme" | "citizen"
  profileMenu: false,
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
  seq: 0,
  
  // NEW STATE
  wsTab: "chat", // chat, graph, compliance
  activeClause: null,
  uploadState: 0, // 0: none, 1: reading, 2: extracting, 3: graph, 4: ready
  tourStep: 0, // 0 = off, 1-10
  tourDemoMode: false,
  docName: "Bank X v. Meridian Textiles — Facility Agreement",
  docType: "Commercial Contract",
  attachedDoc: null,
  attachError: null,
  translating: {},
  draftOrigLocale: "en"
};

/* ---------- mock data ---------- */
var GRAPH_DATA = {
  nodes: [
    { id: "doc1", type: "Document", label: "Facility Agreement", y: 20 },
    { id: "c4", type: "Clause", label: "Clause 4.2 (Indemnity)", y: 100 },
    { id: "c2", type: "Clause", label: "Clause 2.1 (KYC)", y: 100 },
    { id: "law1", type: "Law", label: "Contract Act, s. 73", y: 180 },
    { id: "reg1", type: "Regulation", label: "RBI Master Direction", y: 180 },
    { id: "amend1", type: "Amendment", label: "KYC Update 2024", y: 260 },
    { id: "judg1", type: "Judgment", label: "Hadley v Baxendale", y: 260 }
  ],
  edges: [
    { from: "c4", to: "doc1", label: "PART_OF" },
    { from: "c2", to: "doc1", label: "PART_OF" },
    { from: "c4", to: "law1", label: "REFERENCES" },
    { from: "law1", to: "judg1", label: "INTERPRETED_BY" },
    { from: "c2", to: "reg1", label: "GOVERNED_BY" },
    { from: "amend1", to: "reg1", label: "AMENDS" }
  ]
};

var COMPLIANCE_DATA = [
  {
    req: "Periodic KYC Refresh",
    auth: "RBI Master Direction - KYC (Updated 2024)",
    applies: "Banks & NBFCs",
    date: "Immediate",
    clause: "Clause 2.1",
    status: "Action required",
    action: "Review KYC refresh obligation for Meridian Textiles",
    source: "RBI/DBR/2015-16/18"
  },
  {
    req: "Capping of Indemnity",
    auth: "Indian Contract Act, 1872 (s. 73)",
    applies: "Commercial Contracts",
    date: "Active",
    clause: "Clause 4.2",
    status: "Needs review",
    action: "Verify if cap is reasonable under s.73",
    source: "Contract Act, 1872"
  }
];

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

/* ---------- helpers ---------- */

function profileOf(id) {
  return PROFILES.find(function (p) { return p.id === id; }) || PROFILES[3]; // citizen fallback
}
function langOf(code) {
  return LANGS.find(function (l) { return l.code === code; }) || LANGS[0];
}
function t(obj, locale) {
  if (typeof obj === "string") return obj;
  return obj[locale] || obj["en"] || "";
}
function getExamples() {
  var p = S.profile || "citizen";
  var l = S.locale || "en";
  return (PROFILE_EXAMPLES[p] && PROFILE_EXAMPLES[p][l]) || PROFILE_EXAMPLES[p]["en"] || PROFILE_EXAMPLES.citizen.en;
}

/* ---------- answer pipeline ---------- */

function pickAnswer(text) {
  var txt = text.toLowerCase();
  if (/police|fir|arrest|detain|custody|bail|पुलिस|गिरफ्तार|हिरासत|पोलीस|अटक|ಪೊಲೀಸ್|ಬಂಧನ|காவல்|கைது/.test(txt)) return { key: "police", a: getLocalizedAnswer("police") };
  if (/salary|wage|paid|employer|job|fired|वेतन|नियोक्ता|पगार|मालक|ವೇತನ|ಸಂಬಳ|சம்பளம்|ஊதியம்/.test(txt)) return { key: "wages", a: getLocalizedAnswer("wages") };
  return { key: "tenancy", a: getLocalizedAnswer("tenancy") };
}

function getLocalizedAnswer(topic) {
  var locale = S.locale || "en";
  var base = ANSWERS[topic][locale] || ANSWERS[topic]["en"];
  // Clone to avoid mutation
  var answer = JSON.parse(JSON.stringify(base));
  // Adapt for profile
  var profile = S.profile || "citizen";
  answer._profile = profile;
  answer._locale = locale;
  return answer;
}

/* ---------- verification ---------- */

var VERIF_LABELS = {
  verified: { icon: "✓", text: "Verified", cls: "verif-verified", desc: "Supported by the source document." },
  partial: { icon: "⚠", text: "Partially supported", cls: "verif-partial", desc: "Some of the claim is supported; inspect the source." },
  needs_review: { icon: "?", text: "Needs review", cls: "verif-review", desc: "Could not establish sufficient support." },
  blocked: { icon: "✕", text: "Blocked", cls: "verif-blocked", desc: "Claim withheld because it could not be sufficiently verified." }
};

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

function retranslateMessages(newLocale) {
  S.locale = newLocale; // mutate first — getLocalizedAnswer() below reads S.locale
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
  set({ locale: newLocale, messages: nextMessages, translating: translatingPatch });

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

function setProfile(id) {
  try { window.localStorage.setItem("lexgraph.profile", id); } catch (e) {}
  set({ profile: id, profileMenu: false });
}

function goHome() { set({ view: "landing", langMenu: false, profileMenu: false }); }

function startNew() {
  clearTimers(); inflight++;
  set({ view: "chat", messages: [], thinking: false, draft: "", title: "New conversation", langMenu: false, profileMenu: false });
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
    m.answer.simple,
    "\n" + m.answer.means,
    "\n" + steps,
    "\n" + m.answer.law,
    "\n" + m.answer.lawyer,
    "\n— LexGraph gives legal information, not legal advice."
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
    messages: S.messages.concat([{ id: userId, role: "user", text: text, failed: false, origText: text, origLocale: S.locale, translations: {} }])
  });

  LADDER.slice(1).forEach(function (step) {
    later(function () { if (token === inflight) set({ loadingCopy: step.copy }); }, step.at);
  });

  sendMessage(text).then(function (picked) {
    if (token !== inflight) return;
    set({
      thinking: false,
      messages: S.messages
        .map(function (m) { return m.id === userId ? Object.assign({}, m, { failed: false }) : m; })
        .concat([{
          id: botId, role: "assistant", answer: picked.a, escalate: risk,
          reveal: 1, uncertain: picked.key === "wages", done: false, topicKey: picked.key
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

function chipsHtml(list, cls) {
  return list.map(function (q) {
    return '<button type="button" class="' + cls + '" data-a="ask" data-q="' + esc(q) + '">' + esc(q) + "</button>";
  }).join("");
}

function headerHtml() {
  var active = langOf(S.locale);
  var prof = S.profile ? profileOf(S.profile) : null;

  return '' +
    '<header class="hdr"><div class="hdr-in">' +
      '<a href="#" class="logo" data-a="home"><span class="logo-mark"><i></i></span>' +
        '<span class="logo-txt">LexGraph</span></a>' +
      '<nav class="nav" aria-label="Main">' +
        '<a href="#" data-a="tour" style="color:var(--amber);font-weight:600">Guided Tour</a>' +
        '<a href="#" data-a="coming-soon">Knowledge</a><a href="#" data-a="coming-soon">Find free legal help</a>' +
      '</nav>' +
      '<div class="hdr-right">' +
        (prof
          ? '<button type="button" class="btn btn-profile" aria-haspopup="true" aria-expanded="' + S.profileMenu + '" data-a="profile-menu">' +
              '<span class="p-icon">' + prof.icon + '</span>' +
              '<span>' + esc(t(prof.name, S.locale)) + '</span></button>'
          : '<button type="button" class="btn btn-ghost" data-a="go-profile">Choose profile</button>'
        ) +
        '<button type="button" class="btn btn-lang" aria-haspopup="true" aria-expanded="' + S.langMenu + '" data-a="lang-menu">' +
          '<i aria-hidden="true"></i><span>' + esc(active.native) + "</span></button>" +
        (S.view === "workspace" ? '' : '<button type="button" class="btn btn-primary" data-a="upload-start">Upload PDF</button>') +
        (S.langMenu ? langMenuHtml() : "") +
        (S.profileMenu ? profileMenuHtml() : "") +
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

function profileMenuHtml() {
  return '<div class="profile-menu" role="menu"><p class="pm-label">Switch profile</p>' +
    PROFILES.map(function (p) {
      return '<button type="button" role="menuitemradio" aria-checked="' + (p.id === S.profile) + '" ' +
        'data-a="set-profile" data-pid="' + p.id + '">' +
        '<span class="pm-icon">' + p.icon + '</span>' +
        '<span><span class="pm-name">' + esc(t(p.name, S.locale)) + '</span><br>' +
        '<span class="pm-desc">' + esc(t(p.desc, S.locale)) + '</span></span></button>';
    }).join("") + "</div>";
}

function welcomeHtml() {
  var locale = S.locale;
  var welcomeTitle = {
    en: "Understand Indian law with AI grounded in real documents.",
    hi: "वास्तविक दस्तावेज़ों पर आधारित AI से भारतीय कानून समझें।",
    mr: "प्रत्यक्ष दस्तऐवजांवर आधारित AI सह भारतीय कायदा समजून घ्या.",
    kn: "ನೈಜ ದಾಖಲೆಗಳ ಆಧಾರದ AI ಮೂಲಕ ಭಾರತೀಯ ಕಾನೂನನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    ta: "உண்மையான ஆவணங்களின் அடிப்படையில் AI மூலம் இந்திய சட்டத்தைப் புரிந்துகொள்ளுங்கள்."
  };
  var whoTitle = {
    en: "Who are you?",
    hi: "आप कौन हैं?",
    mr: "तुम्ही कोण आहात?",
    kn: "ನೀವು ಯಾರು?",
    ta: "நீங்கள் யார்?"
  };

  return '<main style="flex:1 1 auto">' +
    '<section class="welcome">' +
      '<p class="pill">Free · No sign-up · Five languages</p>' +
      '<h1>' + esc(welcomeTitle[locale] || welcomeTitle.en) + '</h1>' +
      '<p class="sub">' + esc({
        en: "LexGraph helps you understand and research Indian legal documents using AI grounded in the actual source documents.",
        hi: "LexGraph वास्तविक स्रोत दस्तावेज़ों पर आधारित AI का उपयोग करके भारतीय कानूनी दस्तावेज़ों को समझने और शोध करने में आपकी मदद करता है।",
        mr: "LexGraph प्रत्यक्ष स्रोत दस्तऐवजांवर आधारित AI वापरून भारतीय कायदेशीर दस्तऐवज समजून घेण्यास आणि संशोधन करण्यास मदत करतो.",
        kn: "LexGraph ನಿಜವಾದ ಮೂಲ ದಾಖಲೆಗಳ ಆಧಾರಿತ AI ಬಳಸಿ ಭಾರತೀಯ ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        ta: "LexGraph உண்மையான மூல ஆவணங்களின் அடிப்படையில் AI பயன்படுத்தி இந்திய சட்ட ஆவணங்களைப் புரிந்துகொள்ள உதவுகிறது."
      }[locale] || "LexGraph helps you understand and research Indian legal documents using AI grounded in the actual source documents.") + '</p>' +
      '<p class="who">' + esc(whoTitle[locale] || whoTitle.en) + '</p>' +
    '</section>' +
    '<section style="max-width:1180px;margin:0 auto;padding:0 20px 40px">' +
      '<div class="profiles">' +
        PROFILES.map(function (p) {
          return '<button type="button" class="profile-card" aria-pressed="false" data-a="set-profile" data-pid="' + p.id + '">' +
            '<span class="icon">' + p.icon + '</span>' +
            '<span class="pname">' + esc(t(p.name, S.locale)) + '</span>' +
            '<span class="pdesc">' + esc(t(p.desc, S.locale)) + '</span>' +
            '<span class="pcta">' + esc(t(p.cta, S.locale)) + '</span>' +
          '</button>';
        }).join("") +
      '</div>' +
    '</section>' +
    footerHtml() +
  '</main>';
}

function profileLandingHtml() {
  var p = profileOf(S.profile);
  var locale = S.locale;
  var examples = getExamples();
  var uploadLabels = {
    student: { en: "Upload a document to study", hi: "अध्ययन के लिए एक दस्तावेज़ अपलोड करें" },
    lawyer: { en: "Upload a matter document", hi: "एक मामले का दस्तावेज़ अपलोड करें" },
    msme: { en: "Upload a contract or notice", hi: "एक अनुबंध या नोटिस अपलोड करें" },
    citizen: { en: "Upload a legal document", hi: "कानूनी दस्तावेज़ अपलोड करें" }
  };
  var uploadLbl = t(uploadLabels[p.id] || uploadLabels.citizen, locale) || uploadLabels.citizen.en;

  return '<main style="flex:1 1 auto">' +
    '<section class="hero-profile">' +
      '<p class="eyebrow">' + p.icon + ' ' + esc(t(p.name, locale)) + '</p>' +
      '<h1>' + esc(t(p.hero, locale)) + '</h1>' +
      '<p class="hero-desc">' + esc(t(p.heroDesc, locale)) + '</p>' +
      '<div class="hero-card" style="margin-bottom:24px;text-align:center;padding:32px 20px;cursor:pointer;background:var(--blue-tint);border-color:var(--blue-edge)" data-a="upload-start">' +
        '<p style="font-size:24px;margin:0 0 12px">📄</p>' +
        '<h3 style="margin:0 0 4px;font-size:18px;color:var(--ink)">' + esc(uploadLbl) + '</h3>' +
        '<p style="margin:0;font-size:14px;color:var(--muted)">LexGraph will analyze the document, extract clauses, and let you ask questions.</p>' +
      '</div>' +
      '<div class="chips">' + chipsHtml(examples, "chip") + '</div>' +
    '</section>' +
    '<section class="sec"><h2>' + esc({ en: "How it works", hi: "यह कैसे काम करता है", mr: "हे कसे काम करते", kn: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", ta: "இது எப்படி செயல்படுகிறது" }[locale] || "How it works") + '</h2><div class="grid g240">' +
      '<div class="step"><p class="n">1</p><p class="t">' + esc({ en: "Describe your situation", hi: "अपनी स्थिति बताएँ", mr: "तुमची परिस्थिती सांगा", kn: "ನಿಮ್ಮ ಸ್ಥಿತಿ ವಿವರಿಸಿ", ta: "உங்கள் நிலையை விவரியுங்கள்" }[locale] || "Describe your situation") + '</p><p class="d">' + esc({ en: "In your own words, in your own language.", hi: "अपने शब्दों में, अपनी भाषा में।", mr: "तुमच्या शब्दांत, तुमच्या भाषेत.", kn: "ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.", ta: "உங்கள் வார்த்தைகளில், உங்கள் மொழியில்." }[locale] || "In your own words, in your own language.") + '</p></div>' +
      '<div class="step"><p class="n">2</p><p class="t">' + esc({ en: "Get a verified answer", hi: "सत्यापित उत्तर प्राप्त करें", mr: "सत्यापित उत्तर मिळवा", kn: "ಪರಿಶೀಲಿತ ಉತ್ತರ ಪಡೆಯಿರಿ", ta: "சரிபார்க்கப்பட்ட பதிலைப் பெறுங்கள்" }[locale] || "Get a verified answer") + '</p><p class="d">' + esc({ en: "Grounded in real legal documents.", hi: "वास्तविक कानूनी दस्तावेज़ों पर आधारित।", mr: "प्रत्यक्ष कायदेशीर दस्तऐवजांवर आधारित.", kn: "ನಿಜವಾದ ಕಾನೂನು ದಾಖಲೆಗಳ ಆಧಾರಿತ.", ta: "உண்மையான சட்ட ஆவணங்களின் அடிப்படையில்." }[locale] || "Grounded in real legal documents.") + '</p></div>' +
      '<div class="step"><p class="n">3</p><p class="t">' + esc({ en: "Check the source", hi: "स्रोत जाँचें", mr: "स्रोत तपासा", kn: "ಮೂಲ ಪರಿಶೀಲಿಸಿ", ta: "மூலத்தைச் சரிபாருங்கள்" }[locale] || "Check the source") + '</p><p class="d">' + esc({ en: "Every claim is linked to its citation.", hi: "हर दावा उसके उद्धरण से जुड़ा है।", mr: "प्रत्येक दावा त्याच्या उद्धरणाशी जोडला आहे.", kn: "ಪ್ರತಿ ಹಕ್ಕು ಅದರ ಉಲ್ಲೇಖಕ್ಕೆ ಲಿಂಕ್ ಆಗಿದೆ.", ta: "ஒவ்வொரு கூற்றும் அதன் மேற்கோளுடன் இணைக்கப்பட்டுள்ளது." }[locale] || "Every claim is linked to its citation.") + '</p></div>' +
    '</div></section>' +
    footerHtml() +
  '</main>';
}

function footerHtml() {
  return '<footer class="ftr"><div class="ftr-in">' +
    '<div><p class="name">LexGraph</p><p>' + esc({ en: "Legal information in five Indian languages. Free, and without an account.", hi: "पाँच भारतीय भाषाओं में कानूनी जानकारी। मुफ्त, बिना खाते के।", mr: "पाच भारतीय भाषांमध्ये कायदेशीर माहिती. मोफत, खात्याशिवाय.", kn: "ಐದು ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಕಾನೂನು ಮಾಹಿತಿ. ಉಚಿತ, ಖಾತೆ ಇಲ್ಲದೆ.", ta: "ஐந்து இந்திய மொழிகளில் சட்டத் தகவல். இலவசம், கணக்கு இல்லாமல்." }[S.locale] || "Legal information in five Indian languages. Free, and without an account.") + '</p></div>' +
    '<div class="links"><a href="#" data-a="coming-soon">Knowledge</a><a href="#" data-a="coming-soon">Find free legal help</a><a href="#" data-a="coming-soon">How it works</a></div>' +
    '<div class="links"><a href="#" data-a="coming-soon">Privacy</a><a href="#" data-a="coming-soon">Terms &amp; disclaimer</a><a href="#" data-a="coming-soon">Accessibility statement</a></div>' +
    '<div><p class="fine">LexGraph provides legal information, not legal advice, and is not a law firm or a government service. AI answers can be incomplete or wrong. For advice on your situation, consult a qualified advocate.</p></div>' +
  '</div></footer>';
}

function landingHtml() {
  if (!S.profile) return welcomeHtml();
  if (S.view === "upload") return uploadHtml();
  return profileLandingHtml();
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
  var line = { en: "This sounds like something a person should help with directly. Free legal aid is available now, at no cost.", hi: "यह ऐसा लगता है जिसमें किसी व्यक्ति को सीधे मदद करनी चाहिए। मुफ्त कानूनी सहायता अभी उपलब्ध है।", mr: "हे असे वाटते ज्यात एखाद्या व्यक्तीने थेट मदत करावी. मोफत कायदेशीर मदत आता उपलब्ध आहे.", kn: "ಇದು ಒಬ್ಬ ವ್ಯಕ್ತಿ ನೇರವಾಗಿ ಸಹಾಯ ಮಾಡಬೇಕಾದ ಸಂಗತಿ. ಉಚಿತ ಕಾನೂನು ನೆರವು ಈಗ ಲಭ್ಯ.", ta: "இது ஒருவர் நேரடியாக உதவ வேண்டிய விஷயம். இலவச சட்ட உதவி இப்போது கிடைக்கிறது." };
  return '<div class="escal" role="alert">' +
    '<p class="k">' + esc({ en: "Get a person on this first", hi: "पहले किसी व्यक्ति से बात करें", mr: "आधी एखाद्या व्यक्तीशी बोला", kn: "ಮೊದಲು ಒಬ್ಬ ವ್ಯಕ್ತಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ", ta: "முதலில் ஒருவரிடம் பேசுங்கள்" }[S.locale] || "Get a person on this first") + '</p>' +
    '<p class="l">' + esc(line[S.locale] || line.en) + "</p>" +
    '<div class="row">' +
      '<a href="tel:15100" class="a-ink">Call legal aid — 15100</a>' +
      '<a href="tel:112" class="a-ink-out">Emergency — 112</a>' +
      '<a href="#" class="a-plain">Free legal aid near you →</a>' +
    "</div>" +
    '<p class="after">' + esc({ en: "The answer below still applies. Reading it can wait until after the call.", hi: "नीचे दिया गया उत्तर अभी भी लागू है। इसे कॉल के बाद पढ़ सकते हैं।", mr: "खालील उत्तर अजूनही लागू आहे. कॉलनंतर वाचता येते.", kn: "ಕೆಳಗಿನ ಉತ್ತರ ಇನ್ನೂ ಅನ್ವಯವಾಗುತ್ತದೆ.", ta: "கீழே உள்ள பதில் இன்னும் பொருந்தும்." }[S.locale] || "The answer below still applies. Reading it can wait until after the call.") + '</p>' +
    "</div>";
}

function verifBadgeHtml(status) {
  var v = VERIF_LABELS[status] || VERIF_LABELS.verified;
  return '<span class="verif ' + v.cls + '" title="' + esc(v.desc) + '">' + v.icon + ' ' + esc(v.text) + '</span>';
}

function answerHtml(m) {
  var a = m.answer;
  var lawOpen = !!S.openLaw[m.id];
  var fb = S.feedback[m.id];
  var isBlocked = a.verification === "blocked";
  var body = "";

  if (m.reveal >= 1) {
    body += '<div><p class="tag">' + esc({ en: "In simple terms", hi: "सरल शब्दों में", mr: "सोप्या शब्दांत", kn: "ಸರಳ ಪದಗಳಲ್ಲಿ", ta: "எளிய சொற்களில்" }[S.locale] || "In simple terms") + '</p><p class="simple">' + esc(a.simple) + "</p></div>";
  }
  if (m.reveal >= 2) {
    body += '<div><h3>' + esc({ en: "What this usually means", hi: "इसका आम तौर पर क्या मतलब है", mr: "याचा साधारणतः काय अर्थ आहे", kn: "ಇದರ ಸಾಮಾನ್ಯ ಅರ್ಥವೇನು", ta: "இது பொதுவாக என்ன அர்த்தம்" }[S.locale] || "What this usually means") + '</h3><p class="prose">' + esc(a.means) + "</p></div>";
  }
  if (m.reveal >= 3) {
    body += '<div><h3 class="steps-h">' + esc({ en: "What you can do", hi: "आप क्या कर सकते हैं", mr: "तुम्ही काय करू शकता", kn: "ನೀವು ಏನು ಮಾಡಬಹುದು", ta: "நீங்கள் என்ன செய்யலாம்" }[S.locale] || "What you can do") + '</h3><ol class="steps">' +
      a.steps.map(function (txt, i) {
        return '<li><span class="n" aria-hidden="true">' + (i + 1) + "</span>" +
          '<span class="t">' + esc(txt) + "</span></li>";
      }).join("") + "</ol></div>";
  }
  if (m.reveal >= 4) {
    body += '<div class="law">' +
      '<button type="button" class="law-toggle" aria-expanded="' + lawOpen + '" data-a="law" data-id="' + m.id + '">' +
        '<span class="t">' + esc({ en: "The law behind this", hi: "इसके पीछे का कानून", mr: "यामागील कायदा", kn: "ಇದರ ಹಿಂದಿನ ಕಾನೂನು", ta: "இதன் பின்னணி சட்டம்" }[S.locale] || "The law behind this") + '</span>' +
        '<span class="h">' + (lawOpen ? (({ en: "Hide", hi: "छिपाएँ", mr: "लपवा", kn: "ಮರೆಮಾಡಿ", ta: "மறை" })[S.locale] || "Hide") : (({ en: "Show Act & section", hi: "Act और धारा दिखाएँ", mr: "Act आणि कलम दाखवा", kn: "Act ಮತ್ತು ವಿಭಾಗ ತೋರಿಸಿ", ta: "Act மற்றும் பிரிவைக் காட்டு" })[S.locale] || "Show Act & section")) + "</span></button>" +
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
    body += '<div class="last"><h3>' + esc({ en: "When to talk to a lawyer", hi: "वकील से कब बात करें", mr: "वकिलाशी कधी बोलावे", kn: "ವಕೀಲರೊಂದಿಗೆ ಯಾವಾಗ ಮಾತನಾಡಬೇಕು", ta: "வழக்கறிஞரிடம் எப்போது பேச வேண்டும்" }[S.locale] || "When to talk to a lawyer") + '</h3><p class="prose">' + esc(a.lawyer) + "</p></div>";
  }

  var answerCls = isBlocked ? "answer answer-blocked" : "answer";
  return '<article class="' + answerCls + '">' +
    (m.uncertain
      ? '<div class="uncertain"><p>' + esc({ en: "This one is less clear than usual. Please check with a lawyer or your local legal aid office before you act on it.", hi: "यह सामान्य से कम स्पष्ट है। कार्रवाई करने से पहले वकील या स्थानीय कानूनी सहायता से जाँच करें।", mr: "हे नेहमीपेक्षा कमी स्पष्ट आहे. कारवाई करण्यापूर्वी वकिलाशी किंवा स्थानिक कायदेशीर मदतीशी तपासा.", kn: "ಇದು ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆ ಸ್ಪಷ್ಟ. ಕ್ರಮ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ವಕೀಲರ ಬಳಿ ಪರಿಶೀಲಿಸಿ.", ta: "இது வழக்கத்தைவிட குறைவாக தெளிவாக உள்ளது. நடவடிக்கை எடுக்கும் முன் வழக்கறிஞரிடம் சரிபாருங்கள்." }[S.locale] || "This one is less clear than usual.") + '</p></div>'
      : "") +
    '<div class="answer-body">' + body + "</div>" +
    '<div class="answer-foot">' +
      '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<p style="margin:0;font-size:12px;font-weight:500;color:var(--dim)">' + esc({ en: "Information, not legal advice", hi: "जानकारी, कानूनी सलाह नहीं", mr: "माहिती, कायदेशीर सल्ला नाही", kn: "ಮಾಹಿತಿ, ಕಾನೂನು ಸಲಹೆ ಅಲ್ಲ", ta: "தகவல், சட்ட ஆலோசனை அல்ல" }[S.locale] || "Information, not legal advice") + '</p>' +
        verifBadgeHtml(a.verification || "verified") +
      '</div>' +
      '<div class="acts">' +
      '<button type="button" class="act" data-a="copy" data-id="' + m.id + '">' +
        (S.copied[m.id] ? "Copied ✓" : "Copy") + "</button>" +
      '<button type="button" class="act' + (fb === "up" ? " up-on" : "") + '" aria-label="This helped" aria-pressed="' + (fb === "up") + '" data-a="rate" data-id="' + m.id + '" data-v="up">👍</button>' +
      '<button type="button" class="act' + (fb === "down" ? " down-on" : "") + '" aria-label="This did not help" aria-pressed="' + (fb === "down") + '" data-a="rate" data-id="' + m.id + '" data-v="down">👎</button>' +
    "</div></div></article>";
}

function messageHtml(m) {
  if (m.role === "user") {
    return '<div class="msg"><div class="user">' +
      '<div class="bubble">' + esc(m.text) + "</div>" +
      (S.translating[m.id] ? '<p class="translating">' + esc({ en: "Translating…", hi: "अनुवाद हो रहा है…" }[S.locale] || "Translating…") + '</p>' : "") +
      (m.failed
        ? '<div class="fail"><span>' + esc({ en: "We could not reach the assistant. Your message is safe.", hi: "हम सहायक तक नहीं पहुँच सके। आपका संदेश सुरक्षित है।", mr: "आम्ही सहाय्यकापर्यंत पोहोचू शकलो नाही. तुमचा संदेश सुरक्षित आहे.", kn: "ಸಹಾಯಕನನ್ನು ತಲುಪಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ನಿಮ್ಮ ಸಂದೇಶ ಸುರಕ್ಷಿತ.", ta: "உதவியாளரை அணுக முடியவில்லை. உங்கள் செய்தி பாதுகாப்பாக உள்ளது." }[S.locale] || "We could not reach the assistant. Your message is safe.") + '</span>' +
          '<button type="button" data-a="retry" data-id="' + m.id + '">' + esc({ en: "Retry", hi: "पुनः प्रयास", mr: "पुन्हा प्रयत्न", kn: "ಮರುಪ್ರಯತ್ನ", ta: "மீண்டும் முயற்சி" }[S.locale] || "Retry") + '</button></div>'
        : "") +
      "</div></div>";
  }
  return '<div class="msg"><div class="bot">' +
    (m.escalate ? escalationHtml(m) : "") +
    answerHtml(m) +
    (m.done
      ? '<div class="next"><p>' + esc({ en: "People usually ask next", hi: "लोग आम तौर पर आगे पूछते हैं", mr: "लोक साधारणतः पुढे विचारतात", kn: "ಜನರು ಸಾಮಾನ್ಯವಾಗಿ ಮುಂದೆ ಕೇಳುತ್ತಾರೆ", ta: "மக்கள் பொதுவாக அடுத்ததாகக் கேட்பார்கள்" }[S.locale] || "People usually ask next") + '</p><div class="next-chips">' +
        chipsHtml(m.answer.suggestions, "next-chip") + "</div></div>"
      : "") +
    "</div></div>";
}

function uploadHtml() {
  return '<main style="flex:1 1 auto;display:flex;align-items:center;justify-content:center;background:var(--bg)">' +
    '<div class="upload-modal">' +
      '<h2>' + esc({ en: "Upload your PDF", hi: "अपना PDF अपलोड करें", mr: "तुमची PDF अपलोड करा", kn: "ನಿಮ್ಮ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", ta: "உங்கள் PDF-ஐ பதிவேற்றவும்" }[S.locale] || "Upload your PDF") + '</h2>' +
      '<p style="color:var(--muted)">' + esc({ en: "LexGraph will analyse the document, identify relevant clauses and allow you to ask questions about it.", hi: "LexGraph दस्तावेज़ का विश्लेषण करेगा, प्रासंगिक धाराओं की पहचान करेगा और आपको इसके बारे में प्रश्न पूछने की अनुमति देगा।", mr: "LexGraph दस्तऐवजाचे विश्लेषण करेल, संबंधित कलमे ओळखेल आणि तुम्हाला त्याबद्दल प्रश्न विचारण्याची अनुमती देईल.", kn: "LexGraph ಡಾಕ್ಯುಮೆಂಟ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ, ಸಂಬಂಧಿತ ಷರತ್ತುಗಳನ್ನು ಗುರುತಿಸುತ್ತದೆ ಮತ್ತು ಅದರ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ನಿಮಗೆ ಅನುಮತಿಸುತ್ತದೆ.", ta: "LexGraph ஆவணத்தை ஆய்வு செய்து, தொடர்புடைய பிரிவுகளை அடையாளம் கண்டு, அதைப் பற்றிய கேள்விகளைக் கேட்க உங்களை அனுமதிக்கும்." }[S.locale] || "LexGraph will analyse the document, identify relevant clauses and allow you to ask questions about it.") + '</p>' +
      (S.uploadState === 0 
        ? '<div class="dropzone" data-a="upload-do">' +
            '<div class="dz-icon">📄</div>' +
            '<div class="dz-t">' + esc({ en: "Click to upload or drag and drop", hi: "अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें", mr: "अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग आणि ड्रॉप करा", kn: "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಎಳೆದು ಬಿಡಿ", ta: "பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்" }[S.locale] || "Click to upload or drag and drop") + '</div>' +
            '<div class="dz-d">' + esc({ en: "Supports PDF, DOCX, and scanned images (OCR)", hi: "PDF, DOCX और स्कैन की गई छवियों (OCR) का समर्थन करता है", mr: "PDF, DOCX आणि स्कॅन केलेल्या प्रतिमा (OCR) चे समर्थन करते", kn: "PDF, DOCX ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಚಿತ್ರಗಳನ್ನು (OCR) ಬೆಂಬಲಿಸುತ್ತದೆ", ta: "PDF, DOCX மற்றும் ஸ்கேன் செய்யப்பட்ட படங்களை (OCR) ஆதரிக்கிறது" }[S.locale] || "Supports PDF, DOCX, and scanned images (OCR)") + '</div>' +
            '<input type="file" id="pdf-upload" accept=".pdf,.docx,image/*" style="display:none">' +
          '</div>'
        : '<div class="upload-state">' +
            '<div class="up-step ' + (S.uploadState >= 1 ? (S.uploadState > 1 ? "done" : "active") : "") + '">' + (S.uploadState > 1 ? "✓" : (S.uploadState === 1 ? '<div class="spinner"></div>' : "○")) + ' ' + esc({ en: "Reading document...", hi: "दस्तावेज़ पढ़ रहा है...", mr: "दस्तऐवज वाचत आहे...", kn: "ದಾಖಲೆ ಓದುತ್ತಿದೆ...", ta: "ஆவணத்தைப் படிக்கிறது..." }[S.locale] || "Reading document...") + '</div>' +
            '<div class="up-step ' + (S.uploadState >= 2 ? (S.uploadState > 2 ? "done" : "active") : "") + '">' + (S.uploadState > 2 ? "✓" : (S.uploadState === 2 ? '<div class="spinner"></div>' : "○")) + ' ' + esc({ en: "Extracting clauses...", hi: "धाराएँ निकाल रहा है...", mr: "कलमे काढत आहे...", kn: "ಷರತ್ತುಗಳನ್ನು ತೆಗೆಯುತ್ತಿದೆ...", ta: "பிரிவுகளைப் பிரித்தெடுக்கிறது..." }[S.locale] || "Extracting clauses...") + '</div>' +
            '<div class="up-step ' + (S.uploadState >= 3 ? (S.uploadState > 3 ? "done" : "active") : "") + '">' + (S.uploadState > 3 ? "✓" : (S.uploadState === 3 ? '<div class="spinner"></div>' : "○")) + ' ' + esc({ en: "Building legal relationships...", hi: "कानूनी संबंध बना रहा है...", mr: "कायदेशीर संबंध बनवत आहे...", kn: "ಕಾನೂನು ಸಂಬಂಧಗಳನ್ನು ನಿರ್ಮಿಸುತ್ತಿದೆ...", ta: "சட்ட உறவுகளை உருவாக்குகிறது..." }[S.locale] || "Building legal relationships...") + '</div>' +
          '</div>'
      ) +
      '<button class="btn btn-ghost" data-a="home">' + esc({ en: "Cancel", hi: "रद्द करें", mr: "रद्द करा", kn: "ರದ್ದುಮಾಡಿ", ta: "ரத்து செய்" }[S.locale] || "Cancel") + '</button>' +
    '</div></main>';
}

function graphHtml() {
  var prof = S.profile || "citizen";
  var filteredEdges = GRAPH_DATA.edges;
  
  return '<div class="graph-pane">' +
    '<div class="graph-canvas">' +
      '<div style="position:relative;width:400px;height:400px">' +
        GRAPH_DATA.nodes.map(function(n) {
          var yOff = prof === "citizen" && n.y > 100 ? 500 : 0; // hide deep for citizen
          var isActive = S.activeClause === n.id ? " active" : "";
          return '<div class="graph-node' + isActive + '" style="position:absolute;left:130px;top:' + (n.y + yOff) + 'px" data-a="node" data-id="' + n.id + '">' +
            '<span class="type">' + esc(n.type) + '</span><span class="lbl">' + esc(n.label) + '</span>' +
          '</div>';
        }).join("") +
        GRAPH_DATA.edges.map(function(e, i) {
          var n1 = GRAPH_DATA.nodes.find(function(x){return x.id === e.from});
          var n2 = GRAPH_DATA.nodes.find(function(x){return x.id === e.to});
          if (!n1 || !n2) return "";
          var yOff = prof === "citizen" && (n1.y > 100 || n2.y > 100) ? 500 : 0;
          return '<div class="graph-edge-lbl" style="left:210px;top:' + ((n1.y + n2.y)/2 + yOff) + 'px">' + esc(e.label) + '</div>' +
            '<div class="graph-edge" style="width:2px;height:' + Math.abs(n2.y - n1.y) + 'px;left:200px;top:' + (Math.min(n1.y, n2.y) + yOff + 20) + 'px"></div>';
        }).join("") +
      '</div>' +
    '</div>' +
    '<div class="node-panel">' +
      '<div class="node-panel-hdr"><h3 class="title">Knowledge Graph</h3><span class="src" data-a="tab" data-tab="chat">Switch to Chat →</span></div>' +
      '<p class="desc">Trace the connections between your document, laws, and judicial precedents. Showing depth appropriate for ' + esc(profileOf(prof).name.en) + '.</p>' +
    '</div>' +
  '</div>';
}

function complianceHtml() {
  return '<div class="comp-pane">' +
    COMPLIANCE_DATA.map(function(c) {
      return '<div class="comp-card">' +
        '<div class="comp-card-hdr">' +
          '<div><p class="req">' + esc(c.req) + '</p><p class="auth">' + esc(c.auth) + '</p></div>' +
          verifBadgeHtml(c.status === "Action required" ? "partial" : (c.status === "Needs review" ? "review" : "verified")) +
        '</div>' +
        '<div class="comp-grid">' +
          '<div class="comp-field"><span class="lbl">Applies to</span><span class="val">' + esc(c.applies) + '</span></div>' +
          '<div class="comp-field"><span class="lbl">Effective Date</span><span class="val">' + esc(c.date) + '</span></div>' +
          '<div class="comp-field"><span class="lbl">Affected Document</span><span class="val">' + esc(c.clause) + '</span></div>' +
          '<div class="comp-field"><span class="lbl">Source</span><span class="val" style="color:var(--blue);cursor:pointer">' + esc(c.source) + '</span></div>' +
        '</div>' +
        '<div class="comp-act"><strong>Action:</strong> ' + esc(c.action) + '</div>' +
      '</div>';
    }).join("") +
  '</div>';
}

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
      (standalone && S.attachedDoc
        ? '<div class="attach-chip">📄 <span class="name">' + esc(S.attachedDoc.name) + '</span> — ' +
            esc({ en: "Uploaded successfully", hi: "सफलतापूर्वक अपलोड किया गया" }[S.locale] || "Uploaded successfully") +
            ' <button type="button" data-a="remove-attach">' + esc({ en: "Remove", hi: "हटाएँ" }[S.locale] || "Remove") + '</button></div>'
        : "") +
      (standalone && S.attachError ? '<div class="attach-err">' + esc(S.attachError) + '</div>' : "") +
      '<div class="box">' +
        '<textarea id="composer" rows="2" placeholder="' + esc({ en: "Analyze this clause, research this matter...", hi: "इस धारा का विश्लेषण करें, इस मामले पर शोध करें..." }[S.locale] || "Analyze this clause, research this matter...") + '"></textarea>' +
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

function modalHtml() {
  var hi = langOf(S.highlighted);
  return '<div class="scrim"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="lang-title">' +
    '<button type="button" class="modal-x" aria-label="' + esc({ en: "Close", hi: "बंद करें", mr: "बंद करा", kn: "ಮುಚ್ಚಿ", ta: "மூடு" }[S.locale] || "Close") + '" data-a="dismiss">✕</button>' +
    '<h2 id="lang-title">' + esc({ en: "Choose your language", hi: "अपनी भाषा चुनें", mr: "तुमची भाषा निवडा", kn: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", ta: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" }[S.locale] || "Choose your language") + '</h2>' +
    '<div class="lang-grid" role="radiogroup" aria-labelledby="lang-title" style="margin-top:20px">' +
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
    '<p class="after">' + esc({ en: "You can change this any time from the top of the page.", hi: "आप इसे पृष्ठ के शीर्ष से किसी भी समय बदल सकते हैं।", mr: "तुम्ही हे पृष्ठाच्या वरून कधीही बदलू शकता.", kn: "ನೀವು ಇದನ್ನು ಪುಟದ ಮೇಲ್ಭಾಗದಿಂದ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಬದಲಾಯಿಸಬಹುದು.", ta: "இதை எந்த நேரத்திலும் பக்கத்தின் மேலிருந்து மாற்றலாம்." }[S.locale] || "You can change this any time from the top of the page.") + '</p>' +
    "</div></div>";
}

function tourHtml() {
  if (S.tourStep === 0) return "";
  var t = "";
  if (S.tourStep === 1) t = "<h3>1. Choose your profile</h3><p>LexGraph changes how it presents legal info based on who you are. We'll simulate the Lawyer profile.</p>";
  if (S.tourStep === 2) t = "<h3>2. Select a Document</h3><p>We've uploaded a Facility Agreement. The Legal Workbench separates the document from analysis.</p>";
  if (S.tourStep === 3) t = "<h3>3. Understand the Document</h3><p>Clauses, obligations, and parties are automatically extracted in the left pane.</p>";
  if (S.tourStep === 4) t = "<h3>4. Inspect a Clause</h3><p>Clicking a clause brings it into focus and primes the context for analysis.</p>";
  if (S.tourStep === 5) t = "<h3>5. The Legal Graph</h3><p>LexGraph traces exactly how this clause connects to underlying laws and judgments.</p>";
  if (S.tourStep === 6) t = "<h3>6. Ask a Question</h3><p>You can ask questions grounded in the selected context and verified by the system.</p>";
  if (S.tourStep === 7) t = "<h3>7. Check Compliance</h3><p>LexGraph automatically maps regulatory changes and guidelines to your active document.</p>";
  
  return '<div class="tour-overlay"></div>' +
    '<div class="tour-box" style="top:70px;right:40px">' +
      t +
      '<div class="tour-box-foot">' +
        '<span class="tour-step-counter">Step ' + S.tourStep + ' of 7</span>' +
        '<div>' +
          '<button type="button" class="tour-skip" data-a="tour-end">End Tour</button>' +
          (S.tourStep < 7 ? '<button type="button" class="tour-btn" style="margin-left:8px" data-a="tour-next">Next</button>' : '<button type="button" class="tour-btn" style="margin-left:8px" data-a="tour-end">Finish</button>') +
        '</div>' +
      '</div>' +
    '</div>';
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

  // Set font family based on locale
  var font = langOf(S.locale).font;
  document.body.style.fontFamily = font;

  app.className = "app";
  app.innerHTML = headerHtml() +
    (S.view === "workspace" ? workspaceHtml() : S.view === "chat" ? chatPaneHtml() : landingHtml()) +
    (S.modalOpen ? modalHtml() : "") +
    tourHtml();

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
  var wasEmpty = !S.draft;
  S.draft = e.target.value;
  if (wasEmpty && S.draft) S.draftOrigLocale = S.locale;
  var pii = document.getElementById("pii");
  if (pii) pii.hidden = !/\d{6,}/.test(S.draft);
});

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

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && S.modalOpen) { dismissModal(); return; }
  if (e.key === "Escape" && S.langMenu) { set({ langMenu: false }); return; }
  if (e.key === "Escape" && S.profileMenu) { set({ profileMenu: false }); return; }
  if (e.target.tagName === "TEXTAREA" && e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send(S.draft);
  }
});

document.addEventListener("click", function (e) {
  var el = e.target.closest("[data-a]");
  if (!el) {
    if (S.langMenu && !e.target.closest(".hdr-right")) set({ langMenu: false });
    if (S.profileMenu && !e.target.closest(".hdr-right")) set({ profileMenu: false });
    return;
  }
  var a = el.getAttribute("data-a");
  if (el.tagName === "A") e.preventDefault();

  if (a === "home") set({ view: "landing", uploadState: 0, tourStep: 0 });
  else if (a === "new") startNew();
  else if (a === "lang-menu") set({ langMenu: !S.langMenu, profileMenu: false });
  else if (a === "profile-menu") set({ profileMenu: !S.profileMenu, langMenu: false });
  else if (a === "set-lang") setLocale(el.getAttribute("data-code"));
  else if (a === "set-profile") setProfile(el.getAttribute("data-pid"));
  else if (a === "go-profile") set({ view: "landing" });
  else if (a === "pick-lang") pickLocale(el.getAttribute("data-code"));
  else if (a === "confirm") confirmLocale();
  else if (a === "dismiss") dismissModal();
  else if (a === "submit") send(S.draft);
  else if (a === "ask") send(el.getAttribute("data-q"));
  else if (a === "stop") stop();
  else if (a === "consent") set({ consented: true });
  else if (a === "law") toggleLaw(el.getAttribute("data-id"));
  else if (a === "copy") copyAnswer(el.getAttribute("data-id"));
  else if (a === "rate") rate(el.getAttribute("data-id"), el.getAttribute("data-v"));
  else if (a === "retry") retry(el.getAttribute("data-id"));
  else if (a === "upload-start") set({ view: "upload", uploadState: 0 });
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
  else if (a === "coming-soon") {
    alert({ en: "This feature is coming soon!", hi: "यह सुविधा जल्द आ रही है!", mr: "ही सुविधा लवकरच येत आहे!", kn: "ಈ ವೈಶಿಷ್ಟ್ಯವು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ!", ta: "இந்த அம்சம் விரைவில் வரும்!" }[S.locale] || "This feature is coming soon!");
  }
  else if (a === "tab") set({ wsTab: el.getAttribute("data-tab") });
  else if (a === "clause") set({ activeClause: el.getAttribute("data-id") });
  else if (a === "node") {
    // highlight logic
  }
  else if (a === "tour") {
    set({ tourStep: 1, view: "landing" });
  }
  else if (a === "tour-next") {
    var step = S.tourStep + 1;
    if (step === 2) set({ profile: "lawyer", view: "workspace", wsTab: "chat" });
    if (step === 4) set({ activeClause: "c4" });
    if (step === 5) set({ wsTab: "graph" });
    if (step === 6) { set({ wsTab: "chat" }); send("Is the indemnity cap enforceable?"); }
    if (step === 7) set({ wsTab: "compliance" });
    set({ tourStep: step });
  }
  else if (a === "tour-end") set({ tourStep: 0 });
});

/* ---------- boot ---------- */

var wide = window.matchMedia("(min-width:1024px)");
S.isWide = wide.matches;
wide.addEventListener("change", function (ev) { set({ isWide: ev.matches }); });

// Restore locale
var stored = null;
try { stored = window.localStorage.getItem("lexgraph.locale"); } catch (e) { stored = null; }
if (stored && LANGS.some(function (l) { return l.code === stored; })) {
  S.locale = stored; S.highlighted = stored; S.modalOpen = false;
  document.documentElement.setAttribute("lang", stored);
}

// Restore profile — independently of locale
var storedProfile = null;
try { storedProfile = window.localStorage.getItem("lexgraph.profile"); } catch (e) { storedProfile = null; }
if (storedProfile && PROFILES.some(function (p) { return p.id === storedProfile; })) {
  S.profile = storedProfile;
}

render();
