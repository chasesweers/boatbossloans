// Spec §10: lending ad claims that must never be published. Enforced by unit tests over the
// content files and by an E2E check over every rendered page. Not legal advice — this is a net,
// not a substitute for Vantage compliance review.

interface Rule {
  rule: string;
  pattern: RegExp;
}

const RULES: Rule[] = [
  // Rates (Truth in Lending triggers)
  { rule: "APR", pattern: /\bAPRs?\b/ },
  { rule: "percentage figure (rate or down payment)", pattern: /\d+(?:\.\d+)?\s?%|\d+(?:\.\d+)?\s?percent\b/i },
  { rule: "'as low as' rate claim", pattern: /\bas low as\b/i },

  // Payments
  { rule: "payment amount", pattern: /\$\s?[\d,]+(?:\.\d+)?\s*(?:\/\s*mo\b|\/\s*month|per month|a month|monthly)/i },
  { rule: "monthly payment example", pattern: /\bmonthly payments? (?:of|from|starting|as)\b/i },

  // Loan terms
  {
    rule: "loan term length",
    pattern: /\b(?:up to|terms? (?:of|up to)|loans? (?:of|for|up to)|financ\w* (?:for|up to)|stretch\w* (?:it )?(?:to|out to))\s+\d+\s*(?:years?|months?|yrs?)\b/i,
  },
  { rule: "loan term in months", pattern: /\b\d{2,3}\s*months?\b/i },
  { rule: "loan term in years", pattern: /\b\d+[- ]year (?:loans?|terms?|financing|note)\b/i },

  // Down payments
  { rule: "down payment amount", pattern: /\bdown payments? (?:of|is|as little as|starting at|from)\s*(?:\$|\d)/i },
  { rule: "amount down", pattern: /(?:\$\s?[\d,]+|\d+\s?%)\s*down\b/i },

  // Unprovable claims
  { rule: "best/lowest rate claim", pattern: /\b(?:best|lowest|cheapest) (?:rates?|financing|loan)\b/i },
  { rule: "guaranteed approval", pattern: /\bguaranteed approval\b|\bapproval (?:is )?guaranteed\b/i },
  { rule: "everyone qualifies", pattern: /\beveryone (?:qualifies|is approved|gets approved)\b/i },
  { rule: "same-day/instant approval", pattern: /\b(?:same[- ]day|instant|immediate) approvals?\b/i },
  { rule: "no credit check", pattern: /\bno credit check\b/i },
];

export interface ComplianceViolation {
  rule: string;
  match: string;
}

export function findComplianceViolations(text: string): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];
  for (const { rule, pattern } of RULES) {
    const m = text.match(pattern);
    if (m) violations.push({ rule, match: m[0] });
  }
  return violations;
}
