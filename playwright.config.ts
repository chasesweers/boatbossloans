import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Set E2E_BASE_URL to run the suite against a deployed site (e.g. the Vercel demo) instead of a local build.
// Empty counts as unset (CI passes an empty string when the workflow input is left blank).
const REMOTE = process.env.E2E_BASE_URL || undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "html",
  use: { baseURL: REMOTE ?? `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // E2E runs against the production build so the compliance gate behaves as it will live.
  // Mirrors the Vercel demo deployment: production build on the production URL with DEMO_MODE on,
  // so the golden paths can exercise draft guide pages before Vantage approval.
  webServer: REMOTE
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        env: { DEMO_MODE: "true", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "boatbossloans-five.vercel.app" },
      },
});
