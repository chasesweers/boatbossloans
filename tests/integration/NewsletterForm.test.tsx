import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

vi.mock("next/navigation", () => ({ usePathname: () => "/guide/finance-used-boat" }));

afterEach(() => {
  delete window.plausible;
});

const fill = async (email: string) => {
  const user = userEvent.setup();
  render(<NewsletterForm />);
  await user.type(screen.getByLabelText(/email/i), email);
  await user.click(screen.getByRole("button", { name: /sign me up/i }));
};

describe("NewsletterForm", () => {
  it("shows consent text with a link to the privacy policy", () => {
    render(<NewsletterForm />);
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy");
  });

  it("validates the email before sending", async () => {
    await fill("not-an-email");
    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
  });

  it("confirms the double opt-in and fires newsletter_signup", async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    await fill("skipper@example.com");
    expect(await screen.findByText(/check your inbox to confirm/i)).toBeInTheDocument();
    expect(plausible).toHaveBeenCalledWith("newsletter_signup", {
      props: { source_page: "/guide/finance-used-boat" },
    });
  });

  it("shows the server error and keeps the form usable", async () => {
    await fill("fail@example.com");
    expect(await screen.findByRole("alert")).toHaveTextContent(/try again/i);
    expect(screen.getByRole("button", { name: /sign me up/i })).toBeEnabled();
  });
});
