// The 20 questions from spec §7, in their canonical order. Pages are written one at a time;
// this catalog fixes grouping and ordering so the guide index stays stable as pages are added.

export const GUIDE_GROUPS = [
  { id: "getting-started", label: "Getting started" },
  { id: "credit-and-approval", label: "Credit and approval" },
  { id: "the-boat", label: "The boat" },
  { id: "the-deal", label: "The deal" },
  { id: "after-you-buy", label: "After you buy" },
] as const;

export type GuideGroupId = (typeof GUIDE_GROUPS)[number]["id"];

export const GUIDE_CATALOG: { slug: string; question: string; group: GuideGroupId }[] = [
  { slug: "how-boat-loans-work", question: "How do boat loans work?", group: "getting-started" },
  { slug: "get-pre-approved", question: "Should I get pre-approved before I shop for a boat?", group: "getting-started" },
  { slug: "how-much-boat-can-i-afford", question: "How much boat can I afford?", group: "getting-started" },
  { slug: "cost-of-boat-ownership", question: "What does it really cost to own a boat each year?", group: "getting-started" },
  { slug: "credit-score-for-boat-loan", question: "What credit score do I need for a boat loan?", group: "credit-and-approval" },
  { slug: "boat-loan-less-than-perfect-credit", question: "Can I get a boat loan with less-than-perfect credit?", group: "credit-and-approval" },
  { slug: "boat-down-payment", question: "How much down payment do I need for a boat?", group: "credit-and-approval" },
  { slug: "boat-loan-documents", question: "What documents do I need to apply?", group: "credit-and-approval" },
  { slug: "boat-loan-timeline", question: "How long does approval and closing take?", group: "credit-and-approval" },
  { slug: "finance-used-boat", question: "Can I finance a used boat?", group: "the-boat" },
  { slug: "how-old-a-boat-can-i-finance", question: "How old a boat can I finance?", group: "the-boat" },
  { slug: "marine-survey-for-boat-loan", question: "Do I need a marine survey to get a loan?", group: "the-boat" },
  { slug: "finance-engines-electronics-trailer", question: "Can I include engines, electronics, or a trailer in the loan?", group: "the-boat" },
  { slug: "private-party-boat-loan", question: "Can I finance a boat from a private seller?", group: "the-deal" },
  { slug: "dealer-vs-own-financing", question: "Should I finance through the dealer or on my own?", group: "the-deal" },
  { slug: "how-long-can-you-finance-a-boat", question: "How long can you finance a boat?", group: "the-deal" },
  { slug: "boat-insurance-for-loan", question: "Do I need boat insurance to get a loan?", group: "the-deal" },
  { slug: "refinance-boat-loan", question: "Can I refinance my boat loan?", group: "after-you-buy" },
  { slug: "finance-a-repower", question: "Can I finance a repower?", group: "after-you-buy" },
  { slug: "boat-loan-interest-tax-deductible", question: "Is boat loan interest tax deductible?", group: "after-you-buy" },
];

export const catalogIndex = (slug: string): number => {
  const i = GUIDE_CATALOG.findIndex((q) => q.slug === slug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};
