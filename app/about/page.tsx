import Image from "next/image";
import { StaticPageView } from "@/components/pages/StaticPageView";
import { KimPhoto } from "@/components/ui/KimPhoto";
import { KimGallery } from "@/components/about/KimGallery";
import { ApplyBand } from "@/components/ui/ApplyBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { loadPage } from "@/lib/pages";
import { personSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import yachtingUnplugged from "@/public/brand/yachting-unplugged.png";

export function generateMetadata() {
  const page = loadPage("about");
  return pageMetadata({ title: page.title, description: page.description, path: "/about" });
}

// The authority anchor every author box links to (spec §7 About). Person schema lives here.
export default function AboutPage() {
  const page = loadPage("about");
  return (
    <>
      <StaticPageView
        page={page}
        aside={
          <div className="mt-8 grid gap-4 sm:grid-cols-[2fr_3fr] sm:items-end">
            <KimPhoto photo="headshot" className="aspect-[4/5] w-full" sizes="(min-width: 768px) 300px, 100vw" />
            <div className="bg-black p-4">
              <Image src={yachtingUnplugged} alt="Yachting Unplugged" className="h-auto w-full" sizes="300px" />
            </div>
          </div>
        }
      />
      <KimGallery />
      <ApplyBand headline="Ready to shop like a Boss?" />
      <JsonLd data={personSchema()} />
    </>
  );
}
