// Boat cost-of-ownership math (spec §7 Calculator). Pure functions, fully client-side, nothing stored.
// HARD RULE: no loan payment, interest rate, APR, term or down payment here. Those trigger
// Truth in Lending disclosures and need a separate, Vantage-specified project.

export const STORAGE_TYPES = {
  slip: { label: "Marina slip", examplePerMonth: 450 },
  dry: { label: "Dry storage", examplePerMonth: 300 },
  trailer: { label: "Trailer storage", examplePerMonth: 100 },
} as const;

export type StorageType = keyof typeof STORAGE_TYPES;

export interface CostInputs {
  price: number;
  insurancePerYear: number;
  storageType: StorageType;
  storagePerMonth: number;
  maintenancePercent: number; // percent of purchase price per year
  engineHoursPerYear: number;
  fuelGallonsPerHour: number;
  fuelPricePerGallon: number;
  registrationPerYear: number;
  towingPerYear: number;
  cleaningPerYear: number;
  otherPerYear: number;
}

// Example values shown in the form. Labeled as examples in the UI; users replace them.
export const DEFAULT_INPUTS: CostInputs = {
  price: 85_000,
  insurancePerYear: 1_500,
  storageType: "slip",
  storagePerMonth: STORAGE_TYPES.slip.examplePerMonth,
  maintenancePercent: 2,
  engineHoursPerYear: 100,
  fuelGallonsPerHour: 10,
  fuelPricePerGallon: 4.75,
  registrationPerYear: 500,
  towingPerYear: 175,
  cleaningPerYear: 600,
  otherPerYear: 0,
};

export type CostKey = "fuel" | "storage" | "maintenance" | "insurance" | "registration" | "towing" | "cleaning" | "other";

export interface CostLine {
  key: CostKey;
  label: string;
  amount: number;
}

export interface CostResult {
  totalPerYear: number;
  monthlyEquivalent: number;
  costPerHour: number | null;
  breakdown: CostLine[];
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculateOwnershipCost(input: CostInputs): CostResult | null {
  const price = clean(input.price);
  if (price === 0) return null;

  const hours = clean(input.engineHoursPerYear);
  const lines: CostLine[] = [
    { key: "fuel", label: "Fuel", amount: hours * clean(input.fuelGallonsPerHour) * clean(input.fuelPricePerGallon) },
    { key: "storage", label: STORAGE_TYPES[input.storageType].label, amount: clean(input.storagePerMonth) * 12 },
    { key: "maintenance", label: "Maintenance", amount: (price * clean(input.maintenancePercent)) / 100 },
    { key: "insurance", label: "Insurance", amount: clean(input.insurancePerYear) },
    { key: "registration", label: "Registration, taxes and fees", amount: clean(input.registrationPerYear) },
    { key: "towing", label: "Towing membership", amount: clean(input.towingPerYear) },
    { key: "cleaning", label: "Cleaning and detailing", amount: clean(input.cleaningPerYear) },
    { key: "other", label: "Other", amount: clean(input.otherPerYear) },
  ];

  const breakdown = lines.filter((l) => l.amount > 0).sort((a, b) => b.amount - a.amount);
  const totalPerYear = breakdown.reduce((sum, l) => sum + l.amount, 0);

  return {
    totalPerYear,
    monthlyEquivalent: totalPerYear / 12,
    costPerHour: hours > 0 ? totalPerYear / hours : null,
    breakdown,
  };
}

export const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
