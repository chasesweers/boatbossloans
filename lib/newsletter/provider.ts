// The newsletter provider stores subscribers; we never do (spec §7). Kim hasn't picked a provider
// yet (spec §14), so the route talks to this interface and the provider is chosen by env vars.

export interface Subscriber {
  email: string;
  firstName?: string;
  sourcePage?: string;
}

export interface NewsletterProvider {
  name: string;
  subscribe(s: Subscriber): Promise<void>;
}

// Kit (ConvertKit) API v4. Adding a subscriber to a form whose settings have double opt-in
// enabled sends the confirmation email (spec: double opt-in is configured in Kit, not here).
export function kitProvider(apiKey: string, formId: string): NewsletterProvider {
  const call = async (path: string, body: unknown) => {
    const res = await fetch(`https://api.kit.com/v4${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Kit ${path} failed: ${res.status}`);
  };
  return {
    name: "kit",
    async subscribe({ email, firstName, sourcePage }) {
      await call("/subscribers", {
        email_address: email,
        first_name: firstName,
        state: "inactive",
        fields: sourcePage ? { source_page: sourcePage } : undefined,
      });
      await call(`/forms/${formId}/subscribers`, { email_address: email });
    },
  };
}

// Development/CI fallback: logs instead of sending. Never logs in production.
export const consoleProvider: NewsletterProvider = {
  name: "console",
  async subscribe(s) {
    if (process.env.NODE_ENV !== "production") console.info("[newsletter] would subscribe", s.email, s.sourcePage ?? "");
  },
};

const MISSING_KIT = "KIT_API_KEY and KIT_FORM_ID are not set on Production; newsletter signups are failing";

// Launched site without Kit keys: fail every signup so the form shows an error instead of a
// success message for a subscriber nobody stored. The handler turns the throw into a 502.
export const unconfiguredProvider: NewsletterProvider = {
  name: "unconfigured",
  async subscribe() {
    console.error(`[newsletter] ${MISSING_KIT}`);
    throw new Error(MISSING_KIT);
  },
};

type Env = Record<string, string | undefined>;

const isProductionLaunch = (env: Env) => env.VERCEL_ENV === "production" && env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export function getNewsletterProvider(env: Env = process.env): NewsletterProvider {
  if (env.KIT_API_KEY && env.KIT_FORM_ID) return kitProvider(env.KIT_API_KEY, env.KIT_FORM_ID);
  if (isProductionLaunch(env)) {
    console.error(`[newsletter] ${MISSING_KIT}`);
    return unconfiguredProvider;
  }
  // Local, CI, Preview and the pre-launch demo.
  return consoleProvider;
}
