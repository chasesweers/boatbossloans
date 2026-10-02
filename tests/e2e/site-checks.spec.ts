// Checks that run over every public page: launch gate, compliance, accessibility, layout.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { findComplianceViolations } from "../../lib/compliance";

const PAGES = [
  "/",
  "/guide",
  "/guide/credit-score-for-boat-loan",
  "/guide/boat-loan-less-than-perfect-credit",
  "/guide/private-party-boat-loan",
  "/guide/finance-used-boat",
  "/guide/get-pre-approved",
  "/calculator",
  "/apply",
  "/about",
  "/newsletter",
  "/disclosures",
  "/privacy",
  "/terms",
];

for (const path of PAGES) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("is noindex until launch (spec §2.3)", async ({ page }) => {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });

    test("is labeled as a demo", async ({ page }) => {
      await expect(page.getByRole("note").filter({ hasText: /demo preview/i })).toBeVisible();
    });

    test("shows the required disclosure (spec §10)", async ({ page }) => {
      await expect(page.getByTestId("footer-disclosure")).toContainText("BOAT BOSS is not a lender");
    });

    test("publishes no lending ad claims (spec §10)", async ({ page }) => {
      const text = await page.locator("body").innerText();
      expect(findComplianceViolations(text)).toEqual([]);
    });

    test("has no WCAG 2.1 AA violations (spec §6)", async ({ page }) => {
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });

    test("has no horizontal scroll", async ({ page }) => {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test("robots.txt blocks all crawlers before launch", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/User-Agent: \*\s+Disallow: \//i);
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  expect(res.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(res.headers()["x-content-type-options"]).toBe("nosniff");
});
