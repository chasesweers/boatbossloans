import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Breadcrumbs, formatUpdated, makeGuideLink } from "@/components/guide/GuideParts";
import { getGuides } from "@/lib/content";
import { DISCLOSURE } from "@/lib/site";
import type { StaticPage } from "@/lib/pages";

function PendingReview({ children }: { children: ReactNode }) {
  return (
    <p role="note" className="not-prose border-l-4 border-red bg-black/5 px-4 py-3 text-base text-ink">
      <strong>Pending review:</strong> {children}
    </p>
  );
}

function Disclosure() {
  return <p>{DISCLOSURE}</p>;
}

// Long-form light treatment for About and legal pages (spec §6).
export function StaticPageView({ page, aside }: { page: StaticPage; aside?: ReactNode }) {
  const components = {
    PendingReview,
    Disclosure,
    a: makeGuideLink(new Set(getGuides().map((g) => g.slug))),
  };
  return (
    <div className="bg-white text-ink">
      <article className="container-site max-w-3xl py-10 md:py-16">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title }]} />
        <h1 className="mt-6 text-[clamp(2.4rem,6vw,4rem)] text-ink">{page.title}</h1>
        <p className="mt-3 text-sm text-grey">
          Last updated <time dateTime={page.updated}>{formatUpdated(page.updated)}</time>
        </p>
        {aside}
        <div className="prose-light mt-8">
          <MDXRemote source={page.body} components={components} />
        </div>
      </article>
    </div>
  );
}
