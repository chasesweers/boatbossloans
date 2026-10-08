import { categories, financeIntro } from "@/content/home";

export function FinanceCategories() {
  return (
    <section aria-labelledby="finance-heading" className="bg-panel pb-10 pt-16 md:pb-14 md:pt-24">
      <div className="container-site">
        <h2 id="finance-heading" className="text-[clamp(2.25rem,5vw,3.75rem)]">
          {financeIntro.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-smoke">{financeIntro.body}</p>
        <ul className="mt-10 border-t border-hairline">
          {categories.map((c) => (
            <li key={c.name} className="flex flex-col gap-1 border-b border-hairline py-5 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-display text-3xl uppercase md:text-4xl">{c.name}</span>
              <span className="text-lg text-smoke sm:text-right">{c.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
