import { createNewsletterHandler } from "@/lib/newsletter/handler";
import { getNewsletterProvider } from "@/lib/newsletter/provider";
import { createRateLimiter } from "@/lib/rateLimit";

export const POST = createNewsletterHandler({
  provider: getNewsletterProvider(),
  limiter: createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 }),
});
