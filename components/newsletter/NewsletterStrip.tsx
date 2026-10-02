import { NewsletterForm } from "./NewsletterForm";

export function NewsletterStrip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <section aria-labelledby="newsletter-heading" className={dark ? "bg-panel py-14" : "border-t border-ink/10 bg-white py-14 text-ink"}>
      <div className="container-site grid gap-8 md:grid-cols-[2fr_3fr] md:items-start">
        <div>
          <h2 id="newsletter-heading" className={`text-4xl ${dark ? "" : "text-red"}`}>
            Get the Boss&apos;s notes
          </h2>
          <p className={`mt-3 text-lg ${dark ? "text-smoke" : "text-grey"}`}>
            Straight talk on buying and financing a boat, from someone who has sat on both sides of the desk.
          </p>
        </div>
        <NewsletterForm tone={tone} />
      </div>
    </section>
  );
}
