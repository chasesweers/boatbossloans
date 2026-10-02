import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

// Native <details>/<summary>: keyboard-accessible with no JavaScript (spec §6, §7 Home section 6).
export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <>
      <div className="border-t border-hairline">
        {items.map((f) => (
          <details key={f.question} className="group border-b border-hairline">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-xl font-semibold [&::-webkit-details-marker]:hidden">
              {f.question}
              <span aria-hidden="true" className="font-display text-3xl text-red transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-6 text-lg text-smoke">{f.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </>
  );
}
