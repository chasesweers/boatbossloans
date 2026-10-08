import { test, expect } from "@playwright/test";
import { VANTAGE_APPLY_URL } from "../../lib/apply";

test("visitor reads the guide and reaches Apply", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/finance your boat like a boss/i);

  // Every Apply button goes straight to Vantage's tracked application (spec §5).
  const heroApply = page.getByRole("link", { name: /start your application/i }).first();
  await expect(heroApply).toHaveAttribute("href", VANTAGE_APPLY_URL);
  await expect(heroApply).toHaveAttribute("rel", "noopener");

  await page.getByRole("link", { name: /read the guide first/i }).click();
  await expect(page).toHaveURL(/\/guide$/);

  await page.getByRole("link", { name: /can i finance a boat from a private seller/i }).click();
  await expect(page).toHaveURL(/\/guide\/private-party-boat-loan$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/can i finance a boat from a private seller/i);

  // Guide template pieces (spec §7)
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.getByText(/insider take/i)).toBeVisible();
  await expect(page.getByText(/last updated/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Related questions" })).toBeVisible();
  await expect(page.getByRole("link", { name: /start your application/i }).first()).toHaveAttribute("href", VANTAGE_APPLY_URL);
});

test("draft guide pages are clearly marked while awaiting compliance approval", async ({ page }) => {
  await page.goto("/guide/finance-used-boat");
  await expect(page.getByRole("note").filter({ hasText: /awaiting vantage compliance approval/i })).toBeVisible();
});

test("unknown pages return 404 with a way back", async ({ page }) => {
  const res = await page.goto("/guide/not-a-real-question");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /browse the guide/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /start your application/i })).toBeVisible();
});

test("newsletter signup confirms double opt-in", async ({ page }) => {
  await page.goto("/newsletter");
  await page.getByLabel(/email/i).fill("skipper@example.com");
  await page.getByRole("button", { name: /sign me up/i }).click();
  await expect(page.getByText(/check your inbox to confirm/i)).toBeVisible();
});

test("calculator estimates yearly cost live and leads to Apply", async ({ page }) => {
  await page.goto("/calculator");
  const total = page.getByTestId("total-per-year");
  const before = await total.textContent();
  await page.getByLabel(/^purchase price/i).fill("250000");
  await expect(total).not.toHaveText(before!);
  await page.getByLabel(/^purchase price/i).fill("");
  await expect(page.getByText(/enter a purchase price/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /apply with vantage/i })).toHaveAttribute("href", VANTAGE_APPLY_URL);
});
