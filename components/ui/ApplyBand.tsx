import Image from "next/image";
import bow from "@/public/images/bow.jpg";
import { ApplyButton } from "./ApplyButton";

// Apply CTA band (spec §7 Home section 7, reused at the end of guide pages).
export function ApplyBand({
  headline = "Ready when you are",
  body = "One short application. A Vantage lending specialist reviews your options across multiple marine lenders and explains them in plain language.",
}: {
  headline?: string;
  body?: string;
}) {
  return (
    <section aria-label="Apply" className="relative isolate overflow-hidden bg-black py-20 md:py-28">
      <Image src={bow} alt="" fill sizes="100vw" placeholder="blur" className="-z-10 object-cover object-[30%_40%] opacity-60" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      <div className="container-site">
        <h2 className="max-w-xl text-[clamp(2.5rem,6vw,4.5rem)]">{headline}</h2>
        <p className="mt-4 max-w-xl text-lg text-white">{body}</p>
        <ApplyButton location="footer" className="mt-8">
          Start your application
        </ApplyButton>
      </div>
    </section>
  );
}
