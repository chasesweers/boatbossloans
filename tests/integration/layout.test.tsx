import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DISCLOSURE } from "@/lib/site";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Footer", () => {
  it("shows the full required disclosure on every page (spec §10)", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-disclosure")).toHaveTextContent(DISCLOSURE);
  });

  it("links to Kim's social profiles from the footer", () => {
    render(<Footer />);
    const social = screen.getByRole("list", { name: "Social media" });
    expect(within(social).getByRole("link", { name: /instagram/i })).toHaveAttribute("href", "https://www.instagram.com/theboatboss/");
    expect(within(social).getByRole("link", { name: /facebook/i })).toHaveAttribute("href", "https://www.facebook.com/theboatboss/");
    expect(within(social).getByRole("link", { name: /youtube/i })).toHaveAttribute("href", "https://www.youtube.com/channel/UCWrEEyBk87dAwQOibwJ4Q2g");
  });

  it("links to disclosures, privacy and terms", () => {
    render(<Footer />);
    for (const name of ["Disclosures", "Privacy", "Terms"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });
});

describe("Header", () => {
  it("has the guide and about links and an Apply button", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Financing guide" })).toHaveAttribute("href", "/guide");
    expect(within(nav).getByRole("link", { name: "Calculator" })).toHaveAttribute("href", "/calculator");
    expect(within(nav).getByRole("link", { name: "About Kim" })).toHaveAttribute("href", "/about");
    expect(within(nav).getByRole("link", { name: "Apply" })).toHaveAttribute("href", "#apply");
  });

  it("opens and closes the mobile menu from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});
