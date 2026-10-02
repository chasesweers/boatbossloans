import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs, makeGuideLink, formatUpdated } from "@/components/guide/GuideParts";
import { FaqAccordion } from "@/components/home/FaqAccordion";

describe("guide links inside MDX", () => {
  const GuideLink = makeGuideLink(new Set(["get-pre-approved"]));

  it("links to published guide pages", () => {
    render(<GuideLink href="/guide/get-pre-approved">pre-approval</GuideLink>);
    expect(screen.getByRole("link", { name: "pre-approval" })).toHaveAttribute("href", "/guide/get-pre-approved");
  });

  it("renders unpublished guide pages as plain text instead of a dead link", () => {
    render(<GuideLink href="/guide/marine-survey-for-boat-loan">survey</GuideLink>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("survey")).toBeInTheDocument();
  });
});

describe("Breadcrumbs", () => {
  it("links each ancestor and marks the current page", () => {
    render(<Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guide", path: "/guide" }, { name: "Question?" }]} />);
    expect(screen.getByRole("link", { name: "Guide" })).toHaveAttribute("href", "/guide");
    expect(screen.getByText("Question?")).toHaveAttribute("aria-current", "page");
  });
});

describe("FaqAccordion", () => {
  it("renders each question as a native, keyboard-operable disclosure", () => {
    const { container } = render(<FaqAccordion items={[{ question: "Is BOAT BOSS a lender?", answer: "No." }]} />);
    expect(container.querySelectorAll("details > summary")).toHaveLength(1);
    expect(screen.getByText("Is BOAT BOSS a lender?")).toBeInTheDocument();
  });

  it("emits FAQPage structured data", () => {
    const { container } = render(<FaqAccordion items={[{ question: "Q?", answer: "A." }]} />);
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld["@type"]).toBe("FAQPage");
  });
});

it("formats the last-updated date for readers", () => {
  expect(formatUpdated("2026-10-02")).toBe("October 2, 2026");
});
