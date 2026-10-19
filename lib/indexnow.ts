// IndexNow key file (Bing, Yandex). The key is public by design: search engines fetch
// /<key>.txt to confirm we own the host before accepting URL submissions from scripts/indexnow.mjs.

type Env = Record<string, string | undefined>;

// IndexNow's key format: 8–128 characters of a–z, A–Z, 0–9 and "-".
export const INDEXNOW_KEY_PATTERN = "[A-Za-z0-9-]{8,128}";

export function isIndexNowKey(key: string | undefined): key is string {
  return !!key && new RegExp(`^${INDEXNOW_KEY_PATTERN}$`).test(key);
}

// Serves the key as plain text when `file` is exactly "<INDEXNOW_KEY>.txt"; 404 otherwise,
// including when no key is configured (Preview, local).
export function keyFileResponse(file: string, env: Env = process.env): Response {
  const key = env.INDEXNOW_KEY;
  if (!isIndexNowKey(key) || file !== `${key}.txt`) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
