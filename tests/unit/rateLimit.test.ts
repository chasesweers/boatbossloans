import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/rateLimit";

describe("createRateLimiter", () => {
  it("allows up to the limit within the window, then blocks", () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => now });
    expect([1, 2, 3].map(() => limiter.check("ip-a"))).toEqual([true, true, true]);
    expect(limiter.check("ip-a")).toBe(false);
  });

  it("resets after the window passes", () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => now });
    expect(limiter.check("ip-a")).toBe(true);
    expect(limiter.check("ip-a")).toBe(false);
    now = 1001;
    expect(limiter.check("ip-a")).toBe(true);
  });

  it("tracks each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    expect(limiter.check("ip-a")).toBe(true);
    expect(limiter.check("ip-b")).toBe(true);
  });
});
