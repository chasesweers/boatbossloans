// Spec §5: every Apply button goes straight to Vantage's tracked application link.

export type ButtonLocation = "header" | "hero" | "inline" | "footer";

// Until Vantage issues the tracked link, Apply buttons land on /apply, which explains what is coming.
export const APPLY_FALLBACK = "/apply";

interface ApplyEnv {
  url: string | undefined;
  utm: string | undefined;
}

// NEXT_PUBLIC_* values are inlined at build time, so read them as literal property accesses.
const defaultEnv = (): ApplyEnv => ({
  url: process.env.NEXT_PUBLIC_APPLY_URL,
  utm: process.env.NEXT_PUBLIC_APPLY_UTM,
});

export function pageSlugFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments.at(-1) ?? "home";
}

export function buildApplyUrl(pathname: string, env: ApplyEnv = defaultEnv()): string {
  if (!env.url) return APPLY_FALLBACK;
  // UTM stays off until Vantage confirms extra parameters don't break their tracking ID.
  if (env.utm !== "true") return env.url;

  try {
    const url = new URL(env.url);
    url.searchParams.set("utm_source", "boatbossloans");
    url.searchParams.set("utm_medium", "site");
    url.searchParams.set("utm_campaign", pageSlugFromPath(pathname));
    return url.toString();
  } catch {
    return env.url;
  }
}
