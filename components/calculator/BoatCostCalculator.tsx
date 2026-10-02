"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  DEFAULT_INPUTS,
  STORAGE_TYPES,
  calculateOwnershipCost,
  formatUSD,
  type CostInputs,
  type CostResult,
  type StorageType,
} from "@/lib/calculator";
import { track } from "@/lib/analytics";
import { ApplyButton } from "@/components/ui/ApplyButton";

type NumericKey = Exclude<keyof CostInputs, "storageType">;
type FormState = Record<NumericKey, string> & { storageType: StorageType };

const toForm = (i: CostInputs): FormState =>
  Object.fromEntries(Object.entries(i).map(([k, v]) => [k, typeof v === "number" ? String(v) : v])) as FormState;

const toInputs = (f: FormState): CostInputs =>
  Object.fromEntries(
    Object.entries(f).map(([k, v]) => [k, k === "storageType" ? v : v === "" ? Number.NaN : Number(v)]),
  ) as unknown as CostInputs;

const USED_KEY = "bb_calculator_used";

// Fire calculator_used once per browser session (spec §11). Storage can throw in private modes.
function markUsedOnce(fired: { current: boolean }) {
  if (fired.current) return;
  fired.current = true;
  try {
    if (sessionStorage.getItem(USED_KEY)) return;
    sessionStorage.setItem(USED_KEY, "1");
  } catch {
    /* storage unavailable: the ref still limits it to once per page view */
  }
  track("calculator_used", {});
}

export function BoatCostCalculator() {
  const [form, setForm] = useState<FormState>(() => toForm(DEFAULT_INPUTS));
  const fired = useRef(false);
  const result = useMemo(() => calculateOwnershipCost(toInputs(form)), [form]);
  const formRef = useRef<HTMLFormElement>(null);
  const [formInView, setFormInView] = useState(false);

  // The mobile total bar only shows while the form is on screen (it would duplicate the results panel otherwise).
  useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { rootMargin: "0px 0px -40% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const update = (key: keyof FormState, value: string) => {
    markUsedOnce(fired);
    setForm((f) => {
      if (key !== "storageType") return { ...f, [key]: value };
      const type = value as StorageType;
      return { ...f, storageType: type, storagePerMonth: String(STORAGE_TYPES[type].examplePerMonth) };
    });
  };

  const field = (key: NumericKey, label: string, opts: FieldOpts = {}) => (
    <NumberField id={`calc-${key}`} label={label} value={form[key]} onChange={(v) => update(key, v)} {...opts} />
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start">
      <form ref={formRef} className="space-y-10" onSubmit={(e) => e.preventDefault()} aria-label="Boat costs">
        <p className="text-lg text-smoke">
          Every field starts with an example value. Replace them with your own quotes for a sharper estimate.
        </p>

        <Fieldset legend="The boat">
          {field("price", "Purchase price", { prefix: "$", step: "1000", required: true })}
          {field("maintenancePercent", "Maintenance, percent of purchase price each year", {
            suffix: "percent",
            step: "0.5",
            hint: "Older boats and bigger engines usually need more.",
          })}
        </Fieldset>

        <Fieldset legend="Insurance and storage">
          {field("insurancePerYear", "Insurance per year", { prefix: "$", step: "100", hint: "Example only. Get a real quote for your boat." })}
          <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="calc-storageType" className="mb-1 block font-semibold">
                Storage type
              </label>
              <select
                id="calc-storageType"
                value={form.storageType}
                onChange={(e) => update("storageType", e.target.value)}
                className="h-12 w-full border border-hairline bg-black px-3 text-white"
              >
                {(Object.keys(STORAGE_TYPES) as StorageType[]).map((t) => (
                  <option key={t} value={t}>
                    {STORAGE_TYPES[t].label}
                  </option>
                ))}
              </select>
            </div>
            {field("storagePerMonth", "Storage cost per month", { prefix: "$", step: "25" })}
          </div>
        </Fieldset>

        <Fieldset legend="Time on the water">
          {field("engineHoursPerYear", "Engine hours per year", { suffix: "hours", step: "10" })}
          {field("fuelGallonsPerHour", "Fuel burn", { suffix: "gal per hour", step: "0.5" })}
          {field("fuelPricePerGallon", "Fuel price per gallon", { prefix: "$", step: "0.05" })}
        </Fieldset>

        <Fieldset legend="Everything else">
          {field("registrationPerYear", "Registration, taxes and fees per year", { prefix: "$", step: "50" })}
          {field("towingPerYear", "Towing membership per year", { prefix: "$", step: "25", hint: "Optional" })}
          {field("cleaningPerYear", "Cleaning and detailing per year", { prefix: "$", step: "50", hint: "Optional" })}
          {field("otherPerYear", "Other per year", { prefix: "$", step: "50", hint: "Optional: gear, electronics, club dues" })}
        </Fieldset>
      </form>

      <Results result={result} />
      {formInView && <MobileTotal result={result} />}
    </div>
  );
}

// Labels sit above values, and no label after an amount starts with "monthly" or "per month":
// "$1,219 monthly" reads like a loan payment ad, and the compliance check (spec §10) flags it.
function Results({ result }: { result: CostResult | null }) {
  return (
    <section aria-labelledby="estimate-heading" aria-live="polite" className="bg-panel p-6 md:p-8 lg:sticky lg:top-28">
      <h2 id="estimate-heading" className="text-3xl md:text-4xl">
        Your estimate
      </h2>

      {!result ? (
        <p className="mt-6 text-lg text-smoke">Enter a purchase price to see your yearly cost of ownership.</p>
      ) : (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            <div className="col-span-2 border-l-4 border-red pl-4">
              <dt className="text-smoke">Total cost per year</dt>
              <dd data-testid="total-per-year" className="font-display text-5xl md:text-6xl">
                {formatUSD(result.totalPerYear)}
              </dd>
            </div>
            <div>
              <dt className="text-smoke">Averaged per month</dt>
              <dd data-testid="monthly-equivalent" className="font-display text-3xl">
                {formatUSD(result.monthlyEquivalent)}
              </dd>
            </div>
            <div>
              <dt className="text-smoke">Cost per hour on the water</dt>
              <dd data-testid="cost-per-hour" className="font-display text-3xl">
                {result.costPerHour === null ? "—" : formatUSD(result.costPerHour)}
              </dd>
            </div>
          </dl>

          <h3 className="mt-8 text-xl">Where it goes</h3>
          <Breakdown lines={result.breakdown} />
        </>
      )}

      <p className="mt-6 text-sm text-smoke">
        Figures are estimates for planning only and do not include a loan. Actual costs vary by boat, location and use.
      </p>

      <div className="mt-8 border-t border-hairline pt-6">
        <p className="font-display text-2xl uppercase">Ready to finance?</p>
        <ApplyButton location="inline" className="mt-4 w-full sm:w-auto">
          Apply with Vantage
        </ApplyButton>
      </div>
    </section>
  );
}

// Single-series magnitude comparison: sorted horizontal bars, one hue, every bar direct-labeled,
// so no legend and no color-only meaning. The list itself is the table view.
function Breakdown({ lines }: { lines: CostResult["breakdown"] }) {
  const max = Math.max(...lines.map((l) => l.amount), 1);
  return (
    <ul aria-label="Cost breakdown" className="mt-4 space-y-3">
      {lines.map((l) => (
        <li key={l.key}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-white">{l.label}</span>
            <span className="font-semibold tabular-nums text-white">{formatUSD(l.amount)}</span>
          </div>
          <div aria-hidden="true" className="mt-1 h-2 bg-black">
            <div className="h-full rounded-r bg-red transition-[width] duration-300" style={{ width: `${(l.amount / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Phones: the results panel sits below the form, so keep the headline number in view while typing.
function MobileTotal({ result }: { result: CostResult | null }) {
  if (!result) return null;
  return (
    <a
      href="#estimate-heading"
      aria-hidden="true"
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t-2 border-red bg-black/95 px-4 py-3 backdrop-blur lg:hidden"
    >
      <span className="text-sm text-smoke">Total cost per year</span>
      <span className="font-display text-2xl">{formatUSD(result.totalPerYear)}</span>
    </a>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-hairline pt-6">
      <legend className="pr-3 font-display text-2xl uppercase">{legend}</legend>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

interface FieldOpts {
  prefix?: string;
  suffix?: string;
  step?: string;
  hint?: string;
  required?: boolean;
}

function NumberField({ id, label, value, onChange, prefix, suffix, step = "1", hint, required }: FieldOpts & {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="flex h-12 items-center border border-hairline bg-black focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red">
        {prefix && (
          <span aria-hidden="true" className="pl-3 text-smoke">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          required={required}
          aria-describedby={hintId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full min-w-0 bg-transparent px-3 text-white focus:outline-none"
        />
        {suffix && (
          <span aria-hidden="true" className="whitespace-nowrap pr-3 text-sm text-smoke">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-smoke">
          {hint}
        </p>
      )}
    </div>
  );
}
