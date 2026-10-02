import { NextResponse, type NextRequest } from "next/server";
import { newsletterSchema } from "./schema";
import type { NewsletterProvider } from "./provider";
import type { RateLimiter } from "../rateLimit";

const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export function createNewsletterHandler({ provider, limiter }: { provider: NewsletterProvider; limiter: RateLimiter }) {
  return async function POST(req: NextRequest): Promise<Response> {
    const body = await req.json().catch(() => null);

    // Bots that fill the honeypot get a success response so they don't adapt.
    if (body && typeof body === "object" && typeof body.company === "string" && body.company.trim()) {
      return NextResponse.json({ ok: true });
    }

    if (!limiter.check(clientIp(req))) {
      return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const { email, firstName, sourcePage } = parsed.data;
    try {
      await provider.subscribe({ email, firstName, sourcePage });
    } catch (err) {
      console.error("[newsletter] provider error", err instanceof Error ? err.message : err);
      return NextResponse.json({ error: "Something went wrong on our end. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  };
}
