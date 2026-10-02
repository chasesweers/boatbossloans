import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplyButton } from "@/components/ui/ApplyButton";

vi.mock("next/navigation", () => ({ usePathname: () => "/about" }));

afterEach(() => {
  delete window.plausible;
});

describe("ApplyButton", () => {
  it("links to the apply URL in the same tab with rel=noopener", () => {
    render(<ApplyButton location="header">Apply</ApplyButton>);
    const link = screen.getByRole("link", { name: "Apply" });
    expect(link).toHaveAttribute("href", "#apply");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).not.toHaveAttribute("target");
  });

  it("fires apply_click with the current page and button location", async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    render(<ApplyButton location="header">Apply</ApplyButton>);
    await userEvent.click(screen.getByRole("link", { name: "Apply" }));
    expect(plausible).toHaveBeenCalledWith("apply_click", {
      props: { source_page: "/about", button_location: "header" },
    });
  });
});
