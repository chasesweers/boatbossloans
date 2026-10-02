import { describe, it, expect } from "vitest";
import { findComplianceViolations } from "@/lib/compliance";
import { DISCLOSURE } from "@/lib/site";

const violates = (text: string) => findComplianceViolations(text).length > 0;

describe("findComplianceViolations", () => {
  it.each([
    "Rates as low as 6.99% APR",
    "Our APR is competitive",
    "Put 10% down",
    "a down payment of $5,000",
    "Payments from $299/mo",
    "only $450 per month",
    "monthly payments of just a few hundred dollars",
    "terms up to 20 years",
    "loans for 15 years are common",
    "stretch it to 240 months",
    "a 20-year loan",
    "We find the best rates",
    "the lowest rate in Florida",
    "Guaranteed approval!",
    "Everyone qualifies",
    "same-day approval",
    "instant approval",
  ])("flags %j", (text) => {
    expect(violates(text)).toBe(true);
  });

  it.each([
    DISCLOSURE,
    "Your rate depends on your credit, the boat, and the loan amount.",
    "Lenders look at your down payment, your credit, and the boat's age.",
    "Ask your lending specialist how the term affects the total cost.",
    "I spent years arranging boat loans across the F&I desk.",
    "Kim has spent more than 25 years in the marine industry.",
  ])("allows %j", (text) => {
    expect(findComplianceViolations(text)).toEqual([]);
  });

  it("reports which rule matched and the matching text", () => {
    const [v] = findComplianceViolations("Rates as low as you would hope");
    expect(v.rule).toMatch(/as low as/i);
    expect(v.match.toLowerCase()).toBe("as low as");
  });
});
