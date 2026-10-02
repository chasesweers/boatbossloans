import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { GuideDoc } from "@/lib/content";
import { AUTHOR_NAME, AUTHOR_TITLE } from "@/lib/site";
import { KimPhoto } from "@/components/ui/KimPhoto";

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-grey">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.path ? (
              <Link href={item.path} className="underline-offset-2 hover:text-ink hover:underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// "Kim's insider take" callout (spec §7 guide item 4). Used inside MDX as <InsiderTake>.
export function InsiderTake({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-10 border-l-4 border-red bg-black p-6 text-white md:p-8">
      <p className="font-display text-2xl uppercase text-white">
        Kim&apos;s <span className="text-red">insider take</span>
      </p>
      <div className="mt-3 text-lg leading-relaxed text-white [&>p+p]:mt-3">{children}</div>
    </aside>
  );
}

// Links in MDX to guide pages that aren't published yet render as plain text instead of 404ing.
export function makeGuideLink(visibleSlugs: Set<string>) {
  return function GuideLink({ href = "", children, ...rest }: ComponentProps<"a">) {
    const m = href.match(/^\/guide\/([a-z0-9-]+)\/?$/);
    if (m && !visibleSlugs.has(m[1])) return <>{children}</>;
    if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
    return (
      <a href={href} rel="noopener" {...rest}>
        {children}
      </a>
    );
  };
}

export function AuthorBox() {
  return (
    <section aria-label="About the author" className="flex flex-col gap-5 border-y border-ink/15 py-8 sm:flex-row sm:items-center">
      <KimPhoto className="h-24 w-24 shrink-0 rounded-full" sizes="96px" />
      <div>
        <p className="font-display text-2xl uppercase text-ink">
          {AUTHOR_NAME}, {AUTHOR_TITLE}
        </p>
        <p className="mt-1 text-grey">
          Years arranging boat loans across the F&amp;I desk. Host of the BOAT BOSS Podcast and Yachting Unplugged.
        </p>
        <Link href="/about" className="mt-2 inline-block font-semibold text-ink underline decoration-red decoration-2 underline-offset-4">
          More about Kim
        </Link>
      </div>
    </section>
  );
}

export function RelatedQuestions({ guides }: { guides: GuideDoc[] }) {
  if (guides.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-3xl text-red">
        Related questions
      </h2>
      <ul className="mt-4 border-t border-ink/15">
        {guides.map((g) => (
          <li key={g.slug} className="border-b border-ink/15">
            <Link href={`/guide/${g.slug}`} className="flex items-center justify-between gap-4 py-4 text-lg font-semibold text-ink hover:text-red">
              {g.title}
              <span aria-hidden="true" className="text-red">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/guide" className="mt-6 inline-block font-semibold text-ink underline decoration-red decoration-2 underline-offset-4">
        Back to the full guide
      </Link>
    </section>
  );
}

export function DraftBanner() {
  return (
    <div role="note" className="bg-red px-4 py-2 text-center text-sm font-semibold text-white">
      Draft: awaiting Vantage compliance approval. This page will not appear on the live site until approved.
    </div>
  );
}

export function formatUpdated(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
