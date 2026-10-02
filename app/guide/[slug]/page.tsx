import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getGuide, getGuides, isDraft, resolveRelated } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, personSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { AuthorBox, Breadcrumbs, DraftBanner, InsiderTake, RelatedQuestions, formatUpdated, makeGuideLink } from "@/components/guide/GuideParts";
import { ScrollDepth } from "@/components/guide/ScrollDepth";
import { YouTubeFacade } from "@/components/guide/YouTubeFacade";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { NewsletterStrip } from "@/components/newsletter/NewsletterStrip";

// Only pages that pass the compliance gate are generated; anything else is a 404 (spec §7 build rule).
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const doc = getGuide(slug);
  if (!doc) return {};
  return pageMetadata({ title: doc.title, description: doc.summary, path: `/guide/${doc.slug}`, type: "article", noindex: isDraft(doc) });
}

export default async function GuidePage({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const doc = getGuide(slug);
  if (!doc) notFound();

  const visible = getGuides();
  const related = resolveRelated(doc, visible);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guide", path: "/guide" },
    { name: doc.title, path: `/guide/${doc.slug}` },
  ];
  const components = { InsiderTake, a: makeGuideLink(new Set(visible.map((g) => g.slug))) };

  return (
    <div className="bg-white text-ink">
      {isDraft(doc) && <DraftBanner />}
      <article className="container-site max-w-3xl py-10 md:py-16">
        <Breadcrumbs items={[crumbs[0], crumbs[1], { name: doc.title }]} />
        <h1 className="mt-6 text-[clamp(2.4rem,6vw,4rem)] text-ink">{doc.title}</h1>
        <p className="mt-4 text-sm text-grey">
          By <Link href="/about" className="font-semibold text-ink underline-offset-2 hover:underline">Kim Sweers, The Boat Boss</Link>
          {" · "}
          Last updated <time dateTime={doc.updated}>{formatUpdated(doc.updated)}</time>
        </p>

        <div className="relative">
          <div className="prose-light mt-8">
            <MDXRemote source={doc.body} components={components} />
          </div>
          <ScrollDepth slug={doc.slug} />
        </div>

        {doc.video_id && (
          <div className="mt-10">
            <YouTubeFacade id={doc.video_id} title={doc.title} />
          </div>
        )}

        <section aria-label="Apply" className="mt-12 bg-black p-8 text-white md:p-10">
          <h2 className="text-3xl md:text-4xl">Ready to see your options?</h2>
          <p className="mt-3 text-lg">
            One short application with Vantage Recreational Finance. A lending specialist reviews it across multiple marine lenders and explains your options in plain language.
          </p>
          <ApplyButton location="inline" className="mt-6">
            Start your application
          </ApplyButton>
        </section>

        <div className="mt-12">
          <AuthorBox />
        </div>
        <div className="mt-12">
          <RelatedQuestions guides={related} />
        </div>
      </article>
      <NewsletterStrip tone="light" />
      <JsonLd data={articleSchema(doc)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={personSchema()} />
    </div>
  );
}
