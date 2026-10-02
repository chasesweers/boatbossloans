import { GuideIndexList } from "@/components/guide/GuideIndexList";
import { Breadcrumbs } from "@/components/guide/GuideParts";
import { ApplyBand } from "@/components/ui/ApplyBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGuides, groupGuides } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Boat Financing Guide",
  description: "Straight answers to the boat loan questions buyers ask most, from credit and approval to private-party deals, by Kim Sweers, The Boat Boss.",
  path: "/guide",
});

export default function GuideIndexPage() {
  const groups = groupGuides(getGuides());

  return (
    <>
      <div className="bg-white text-ink">
        <div className="container-site py-10 md:py-16">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guide" }]} />
          <h1 className="mt-6 text-[clamp(2.6rem,7vw,5rem)] text-ink">The boat financing guide</h1>
          <p className="mt-4 max-w-2xl text-lg text-grey">
            Every answer is written to stand on its own. Start with the question on your mind, or read a whole section before you shop.
          </p>
          <div className="mt-12">
            <GuideIndexList groups={groups} tone="light" />
          </div>
        </div>
      </div>
      <ApplyBand />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guide", path: "/guide" },
        ])}
      />
    </>
  );
}
