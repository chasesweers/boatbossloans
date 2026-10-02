import Link from "next/link";
import { BoatCostCalculator } from "@/components/calculator/BoatCostCalculator";
import { Breadcrumbs } from "@/components/guide/GuideParts";
import { NeonLine } from "@/components/ui/NeonLine";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Boat Cost of Ownership Calculator",
  description:
    "Estimate what it really costs to own a boat each year: insurance, storage, maintenance, fuel and fees. Free, private, and nothing you enter is stored.",
  path: "/calculator",
});

export default function CalculatorPage() {
  return (
    <section className="bg-black py-10 md:py-16">
      <div className="container-site">
        <Breadcrumbs tone="dark" items={[{ name: "Home", path: "/" }, { name: "Calculator" }]} />
        <h1 className="mt-6 text-[clamp(2.6rem,7vw,5rem)]">What will this boat really cost?</h1>
        <p className="mt-4 max-w-3xl text-lg text-white">
          The price tag is only the start. Estimate your yearly cost of owning a boat, from insurance and storage to fuel and upkeep. This
          calculator leaves out the loan itself. Nothing you enter leaves your browser.
        </p>
        <NeonLine className="my-10" />
        <BoatCostCalculator />
        <p className="mt-12 text-smoke">
          Wondering how financing fits in? Start with{" "}
          <Link href="/guide" className="font-semibold text-white underline decoration-red decoration-2 underline-offset-4">
            the financing guide
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
