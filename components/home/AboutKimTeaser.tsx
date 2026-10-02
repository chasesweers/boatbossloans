import Link from "next/link";
import { aboutKim } from "@/content/home";
import { KimPhoto } from "@/components/ui/KimPhoto";
import { NeonLine } from "@/components/ui/NeonLine";

export function AboutKimTeaser() {
  return (
    <section aria-labelledby="kim-heading" className="bg-panel py-16 md:py-24">
      <div className="container-site grid items-center gap-10 md:grid-cols-[2fr_3fr]">
        <div className="relative">
          <KimPhoto className="aspect-[4/5] w-full" />
          <NeonLine orientation="vertical" className="absolute -right-4 bottom-8 top-8 hidden md:block" />
        </div>
        <div>
          <h2 id="kim-heading" className="text-[clamp(2.25rem,5vw,3.75rem)]">
            Meet the Boat Boss
          </h2>
          <blockquote className="mt-6 border-l-4 border-red pl-5 text-2xl leading-snug text-white">
            “{aboutKim.quote}”
          </blockquote>
          <ul className="mt-8 space-y-3 text-lg text-smoke">
            {aboutKim.credentials.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-3 h-0.5 w-4 shrink-0 bg-red" />
                {c}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn btn-outline mt-8">
            Kim&apos;s story
          </Link>
        </div>
      </div>
    </section>
  );
}
