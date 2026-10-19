// Submits every URL in the live sitemap to IndexNow (Bing, Yandex and other participating
// engines), so new and changed pages are picked up within minutes. Production only:
// run after launch and after publishing or updating a guide.
//
//   INDEXNOW_KEY=<key> npm run indexnow                 # https://boatbossloans.com
//   INDEXNOW_KEY=<key> npm run indexnow -- <site-url>   # another origin
//
// The key must match INDEXNOW_KEY on Vercel Production, which serves it at /<key>.txt.
import { pathToFileURL } from "node:url";

export const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_RE = /^[A-Za-z0-9-]{8,128}$/;

export function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) =>
    m[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'"),
  );
}

export function buildPayload(siteUrl, key, urls) {
  const { host, origin } = new URL(siteUrl);
  // IndexNow rejects URLs on other hosts, and caps a request at 10,000 URLs.
  const urlList = urls.filter((u) => new URL(u).host === host).slice(0, 10_000);
  return { host, key, keyLocation: `${origin}/${key}.txt`, urlList };
}

async function main() {
  const siteUrl = (process.argv[2] ?? "https://boatbossloans.com").replace(/\/$/, "");
  const key = process.env.INDEXNOW_KEY;
  if (!key || !KEY_RE.test(key)) throw new Error("Set INDEXNOW_KEY (8-128 chars: letters, digits, '-').");

  const keyRes = await fetch(`${siteUrl}/${key}.txt`);
  const served = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (served !== key) {
    throw new Error(`${siteUrl}/${key}.txt doesn't serve the key (HTTP ${keyRes.status}). Is INDEXNOW_KEY set on Production?`);
  }

  const mapRes = await fetch(`${siteUrl}/sitemap.xml`);
  if (!mapRes.ok) throw new Error(`Couldn't fetch ${siteUrl}/sitemap.xml (HTTP ${mapRes.status}).`);
  const payload = buildPayload(siteUrl, key, parseSitemap(await mapRes.text()));
  if (payload.urlList.length === 0) throw new Error("The sitemap has no URLs for this host.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  // 200 = accepted, 202 = accepted while the key is still being verified.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow returned HTTP ${res.status}: ${await res.text()}`);
  }
  console.log(`Submitted ${payload.urlList.length} URLs to IndexNow (HTTP ${res.status}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
