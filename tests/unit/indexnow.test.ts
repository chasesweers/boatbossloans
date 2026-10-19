import { describe, it, expect } from "vitest";
import { isIndexNowKey, keyFileResponse } from "@/lib/indexnow";
import { buildPayload, parseSitemap } from "@/scripts/indexnow.mjs";

const KEY = "a1b2c3d4e5f6a7b8c9d0";

describe("keyFileResponse", () => {
  it("serves the key as plain text at /<key>.txt", async () => {
    const res = keyFileResponse(`${KEY}.txt`, { INDEXNOW_KEY: KEY });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    expect(await res.text()).toBe(KEY);
  });

  it("404s for any other file, and when no valid key is configured", () => {
    expect(keyFileResponse("deadbeefdeadbeef.txt", { INDEXNOW_KEY: KEY }).status).toBe(404);
    expect(keyFileResponse(`${KEY}.txt`, {}).status).toBe(404);
    expect(keyFileResponse("short.txt", { INDEXNOW_KEY: "short" }).status).toBe(404);
  });
});

describe("isIndexNowKey", () => {
  it("accepts 8-128 letters, digits and dashes only", () => {
    expect(isIndexNowKey(KEY)).toBe(true);
    expect(isIndexNowKey("abc-1234")).toBe(true);
    expect(isIndexNowKey("abc1234")).toBe(false);
    expect(isIndexNowKey("a".repeat(129))).toBe(false);
    expect(isIndexNowKey("../etc/passwd")).toBe(false);
    expect(isIndexNowKey(undefined)).toBe(false);
  });
});

describe("indexnow script", () => {
  const SITE = "https://boatbossloans.com";

  it("reads every <loc> from a sitemap", () => {
    const xml = `<?xml version="1.0"?><urlset><url><loc>${SITE}</loc></url>
      <url><loc>${SITE}/guide/finance-used-boat</loc><lastmod>2026-10-02</lastmod></url>
      <url><loc>${SITE}/guide?a=1&amp;b=2</loc></url></urlset>`;
    expect(parseSitemap(xml)).toEqual([SITE, `${SITE}/guide/finance-used-boat`, `${SITE}/guide?a=1&b=2`]);
  });

  it("builds the IndexNow payload for this host only", () => {
    const payload = buildPayload(SITE, KEY, [`${SITE}/`, `${SITE}/about`, "https://boatbossloans-five.vercel.app/about"]);
    expect(payload).toEqual({
      host: "boatbossloans.com",
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: [`${SITE}/`, `${SITE}/about`],
    });
  });
});
