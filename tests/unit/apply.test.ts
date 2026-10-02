import { describe, it, expect } from "vitest";
import { buildApplyUrl, pageSlugFromPath } from "@/lib/apply";

describe("pageSlugFromPath", () => {
  it("maps the home page to 'home'", () => {
    expect(pageSlugFromPath("/")).toBe("home");
  });
  it("uses the last path segment", () => {
    expect(pageSlugFromPath("/guide/credit-score-for-boat-loan")).toBe("credit-score-for-boat-loan");
    expect(pageSlugFromPath("/about")).toBe("about");
  });
  it("ignores trailing slashes", () => {
    expect(pageSlugFromPath("/guide/")).toBe("guide");
  });
});

describe("buildApplyUrl", () => {
  it("falls back to #apply when Vantage has not issued the link", () => {
    expect(buildApplyUrl("/", { url: undefined, utm: "true" })).toBe("#apply");
    expect(buildApplyUrl("/", { url: "", utm: undefined })).toBe("#apply");
  });

  it("passes the tracked link through unchanged when UTM is off", () => {
    const url = "https://apply.vantage.example/boatboss?id=123";
    expect(buildApplyUrl("/about", { url, utm: undefined })).toBe(url);
    expect(buildApplyUrl("/about", { url, utm: "false" })).toBe(url);
  });

  it("appends UTM parameters while keeping Vantage's tracking ID", () => {
    const result = new URL(
      buildApplyUrl("/guide/credit-score-for-boat-loan", {
        url: "https://apply.vantage.example/boatboss?id=123",
        utm: "true",
      }),
    );
    expect(result.searchParams.get("id")).toBe("123");
    expect(result.searchParams.get("utm_source")).toBe("boatbossloans");
    expect(result.searchParams.get("utm_medium")).toBe("site");
    expect(result.searchParams.get("utm_campaign")).toBe("credit-score-for-boat-loan");
  });

  it("returns the raw value if the configured URL is malformed", () => {
    expect(buildApplyUrl("/", { url: "not a url", utm: "true" })).toBe("not a url");
  });
});
