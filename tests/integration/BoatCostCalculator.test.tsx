import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoatCostCalculator } from "@/components/calculator/BoatCostCalculator";
import { DEFAULT_INPUTS, STORAGE_TYPES } from "@/lib/calculator";

vi.mock("next/navigation", () => ({ usePathname: () => "/calculator" }));

beforeEach(() => sessionStorage.clear());
afterEach(() => {
  delete window.plausible;
});

const results = () => screen.getByRole("region", { name: /your estimate/i });
const total = () => within(results()).getByTestId("total-per-year").textContent;

describe("BoatCostCalculator", () => {
  it("shows example defaults and live results", () => {
    render(<BoatCostCalculator />);
    expect(screen.getByLabelText(/^purchase price/i)).toHaveValue(DEFAULT_INPUTS.price);
    expect(total()).toMatch(/^\$[\d,]+$/);
    expect(within(results()).getByTestId("monthly-equivalent")).toHaveTextContent(/^\$[\d,]+$/);
    expect(within(results()).getByTestId("cost-per-hour")).toHaveTextContent(/^\$[\d,]+$/);
    expect(within(results()).getByRole("list", { name: /breakdown/i })).toBeInTheDocument();
  });

  it("updates results as the price changes", async () => {
    const user = userEvent.setup();
    render(<BoatCostCalculator />);
    const before = total();
    const price = screen.getByLabelText(/^purchase price/i);
    await user.clear(price);
    await user.type(price, "250000");
    expect(total()).not.toBe(before);
  });

  it("asks for a purchase price when it is cleared", async () => {
    const user = userEvent.setup();
    render(<BoatCostCalculator />);
    await user.clear(screen.getByLabelText(/^purchase price/i));
    expect(within(results()).getByText(/enter a purchase price/i)).toBeInTheDocument();
    expect(within(results()).queryByTestId("total-per-year")).not.toBeInTheDocument();
  });

  it("switches the storage amount to the chosen type's example", async () => {
    const user = userEvent.setup();
    render(<BoatCostCalculator />);
    await user.selectOptions(screen.getByLabelText(/storage type/i), "trailer");
    expect(screen.getByLabelText(/storage cost/i)).toHaveValue(STORAGE_TYPES.trailer.examplePerMonth);
  });

  it("has no loan payment, rate, APR, term or down payment fields (spec §7 hard rule)", () => {
    render(<BoatCostCalculator />);
    for (const forbidden of [/payment/i, /interest/i, /\bapr\b/i, /\bterm\b/i, /down payment/i, /\brate\b/i]) {
      expect(screen.queryByLabelText(forbidden)).not.toBeInTheDocument();
    }
  });

  it("fires calculator_used once per session, on the first change", async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    const user = userEvent.setup();
    render(<BoatCostCalculator />);
    expect(plausible).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText(/insurance/i), "0");
    await user.type(screen.getByLabelText(/insurance/i), "0");
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith("calculator_used", { props: {} });
  });

  it("says figures are estimates and offers Apply", () => {
    render(<BoatCostCalculator />);
    expect(screen.getByText(/estimates for planning only/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apply/i })).toHaveAttribute("href", "/apply");
  });
});
