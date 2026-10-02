import { describe, it, expect } from "vitest";
import { calculateOwnershipCost, DEFAULT_INPUTS, STORAGE_TYPES, type CostInputs } from "@/lib/calculator";

const base: CostInputs = {
  price: 100_000,
  insurancePerYear: 1_500,
  storageType: "slip",
  storagePerMonth: 500,
  maintenancePercent: 2,
  engineHoursPerYear: 100,
  fuelGallonsPerHour: 10,
  fuelPricePerGallon: 4,
  registrationPerYear: 400,
  towingPerYear: 200,
  cleaningPerYear: 600,
  otherPerYear: 300,
};

describe("calculateOwnershipCost", () => {
  it("adds up each yearly cost", () => {
    const r = calculateOwnershipCost(base)!;
    const byKey = Object.fromEntries(r.breakdown.map((b) => [b.key, b.amount]));
    expect(byKey).toEqual({
      fuel: 4_000, // 100 h × 10 gal/h × $4
      storage: 6_000, // $500 × 12
      maintenance: 2_000, // 2 percent of $100,000
      insurance: 1_500,
      cleaning: 600,
      registration: 400,
      other: 300,
      towing: 200,
    });
    expect(r.totalPerYear).toBe(15_000);
  });

  it("derives the monthly equivalent and cost per hour on the water", () => {
    const r = calculateOwnershipCost(base)!;
    expect(r.monthlyEquivalent).toBe(1_250);
    expect(r.costPerHour).toBe(150);
  });

  it("sorts the breakdown largest first and drops zero lines", () => {
    const r = calculateOwnershipCost({ ...base, otherPerYear: 0 })!;
    const amounts = r.breakdown.map((b) => b.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
    expect(r.breakdown.find((b) => b.key === "other")).toBeUndefined();
  });

  it("has no cost per hour when the boat is never used", () => {
    expect(calculateOwnershipCost({ ...base, engineHoursPerYear: 0 })!.costPerHour).toBeNull();
  });

  it("treats blank, negative or non-numeric inputs as zero", () => {
    const r = calculateOwnershipCost({ ...base, insurancePerYear: -50, towingPerYear: Number.NaN, cleaningPerYear: Number.POSITIVE_INFINITY })!;
    expect(r.breakdown.map((b) => b.key)).not.toContain("insurance");
    expect(r.breakdown.map((b) => b.key)).not.toContain("towing");
    expect(r.breakdown.map((b) => b.key)).not.toContain("cleaning");
  });

  it("requires a purchase price", () => {
    expect(calculateOwnershipCost({ ...base, price: 0 })).toBeNull();
    expect(calculateOwnershipCost({ ...base, price: Number.NaN })).toBeNull();
  });

  it("labels storage by the chosen type", () => {
    const r = calculateOwnershipCost({ ...base, storageType: "dry" })!;
    expect(r.breakdown.find((b) => b.key === "storage")!.label).toBe(STORAGE_TYPES.dry.label);
  });
});

describe("DEFAULT_INPUTS", () => {
  it("produces a result out of the box", () => {
    expect(calculateOwnershipCost(DEFAULT_INPUTS)).not.toBeNull();
  });

  it("uses the selected storage type's example amount", () => {
    expect(DEFAULT_INPUTS.storagePerMonth).toBe(STORAGE_TYPES[DEFAULT_INPUTS.storageType].examplePerMonth);
  });
});
