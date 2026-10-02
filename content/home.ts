// Home page copy (spec §7 Home). Kept as data so the compliance check can scan it
// (tests/unit/content-integrity.test.ts) and so Kim's edits are one-file changes.
// Hero and category copy is taken verbatim from the approved preview.

export const hero = {
  headline: "Finance your boat like a Boss",
  body: "I spent years arranging boat loans across the F&I desk. I'll help you understand your options before you sign anything, then connect you with my financing partner, Vantage Recreational Finance. They work with multiple marine lenders to find the right fit for your deal.",
  byline: "Kim Sweers, The Boat Boss",
};

export const financeIntro = {
  headline: "New or used. Dealer or private party.",
  body: "One short application. A Vantage lending specialist reviews it, explains your options in plain language, and handles the paperwork through closing.",
};

// Only categories Vantage has confirmed (spec §7: PWC and ATV are unconfirmed).
export const categories = [
  { name: "Boats", note: "Center consoles to yachts" },
  { name: "Engines and repowers", note: "Outboards and upgrades" },
  { name: "Trailers", note: "With the boat or on their own" },
  { name: "Docks", note: "Where your boat lives" },
  { name: "RVs", note: "For life on land, too" },
];

export const steps = [
  {
    title: "Apply online",
    body: "One short application with Vantage Recreational Finance. Your personal financial details go straight to Vantage, never to BOAT BOSS.",
  },
  {
    title: "Review your options",
    body: "A Vantage lending specialist shops your application across multiple marine lenders and walks you through what is available in plain language.",
  },
  {
    title: "Close and launch",
    body: "Vantage handles the paperwork through closing, whether you are buying from a dealer or a private seller. Then the fun part starts.",
  },
];

export const aboutKim = {
  quote: "I've sat on the other side of the desk. My job now is to make sure you walk in knowing more than the person across from you.",
  credentials: [
    "Years arranging boat loans across the F&I desk",
    "Host of the BOAT BOSS Podcast and Yachting Unplugged",
    "530,000+ followers across social media",
  ],
};

// Quick answers (FAQPage schema). Answers stay general: no rates, payments, terms or down payment figures.
export const faqs = [
  {
    question: "Is BOAT BOSS a lender?",
    answer: "No. BOAT BOSS is an education site. Financing is arranged through Vantage Recreational Finance, which handles applications, credit decisions, and closing. BOAT BOSS Enterprises is compensated by Vantage for referred loans.",
  },
  {
    question: "Can I finance a used boat or buy from a private seller?",
    answer: "Yes. Vantage finances new and used boats from dealers and private sellers. Private sales need a little more paperwork, like confirming the title and paying off any existing lien at closing.",
  },
  {
    question: "What credit do I need?",
    answer: "There is no single cutoff. Marine lenders look at your whole profile, including payment history, income, debts, and the boat itself. A lending specialist can tell you where you stand.",
  },
  {
    question: "Should I get pre-approved before I shop?",
    answer: "Yes. Pre-approval tells you what you can comfortably spend, shows sellers you are serious, and gives you something to compare against dealer financing.",
  },
  {
    question: "What information does BOAT BOSS collect about me?",
    answer: "Very little. We never ask for your Social Security number, income, or credit details. Those go directly to Vantage through their secure application.",
  },
];
