import { describe, it, expect, vi, afterEach } from "vitest";
import { track } from "@/lib/analytics";

afterEach(() => {
  delete window.plausible;
});

describe("track", () => {
  it("sends the event and props to Plausible when it is loaded", () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    track("apply_click", { source_page: "/", button_location: "hero" });
    expect(plausible).toHaveBeenCalledWith("apply_click", {
      props: { source_page: "/", button_location: "hero" },
    });
  });

  it("does nothing when analytics is not configured", () => {
    expect(() => track("newsletter_signup", { source_page: "/" })).not.toThrow();
  });
});
