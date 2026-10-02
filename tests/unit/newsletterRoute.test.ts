import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { newsletterSchema } from "@/lib/newsletter/schema";
import { createNewsletterHandler } from "@/lib/newsletter/handler";
import { createRateLimiter } from "@/lib/rateLimit";
import type { NewsletterProvider } from "@/lib/newsletter/provider";

const req = (body: unknown, ip = "1.2.3.4") =>
  new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

let subscribe: ReturnType<typeof vi.fn<NewsletterProvider["subscribe"]>>;
let handler: (r: NextRequest) => Promise<Response>;

beforeEach(() => {
  subscribe = vi.fn<NewsletterProvider["subscribe"]>().mockResolvedValue(undefined);
  handler = createNewsletterHandler({
    provider: { name: "test", subscribe },
    limiter: createRateLimiter({ limit: 5, windowMs: 600_000 }),
  });
});

describe("newsletterSchema", () => {
  it("requires a valid email and trims an optional first name", () => {
    expect(newsletterSchema.safeParse({ email: "nope" }).success).toBe(false);
    const ok = newsletterSchema.parse({ email: " Skipper@Example.com ", firstName: "  Kim " });
    expect(ok).toMatchObject({ email: "skipper@example.com", firstName: "Kim" });
  });
});

describe("POST /api/newsletter", () => {
  it("subscribes a valid signup through the provider", async () => {
    const res = await handler(req({ email: "skipper@example.com", firstName: "Sam", sourcePage: "/guide/x" }));
    expect(res.status).toBe(200);
    expect(subscribe).toHaveBeenCalledWith({ email: "skipper@example.com", firstName: "Sam", sourcePage: "/guide/x" });
  });

  it("rejects invalid input with 400", async () => {
    expect((await handler(req({ email: "nope" }))).status).toBe(400);
    expect((await handler(req("not json"))).status).toBe(400);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("silently accepts but drops honeypot submissions", async () => {
    const res = await handler(req({ email: "bot@example.com", company: "Spam Inc" }));
    expect(res.status).toBe(200);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("rate limits by IP with 429", async () => {
    for (let i = 0; i < 5; i++) await handler(req({ email: `a${i}@example.com` }));
    const res = await handler(req({ email: "a6@example.com" }));
    expect(res.status).toBe(429);
    expect((await handler(req({ email: "b@example.com" }, "9.9.9.9"))).status).toBe(200);
  });

  it("returns 502 with a friendly message when the provider fails", async () => {
    subscribe.mockRejectedValueOnce(new Error("provider down"));
    const res = await handler(req({ email: "skipper@example.com" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: expect.stringMatching(/try again/i) });
  });
});
