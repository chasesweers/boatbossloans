import { steps } from "@/content/home";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-black py-16 md:py-24">
      <div className="container-site">
        <h2 id="how-heading" className="text-[clamp(2.25rem,5vw,3.75rem)]">
          How it works
        </h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-red pt-6">
              <span className="font-display text-6xl text-red" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-2xl">{s.title}</h3>
              <p className="mt-3 text-smoke">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
