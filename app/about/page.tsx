import Image from "next/image";
import { StaticPageView } from "@/components/pages/StaticPageView";
import { KimPhoto } from "@/components/ui/KimPhoto";
import { ApplyBand } from "@/components/ui/ApplyBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { loadPage } from "@/lib/pages";
import { personSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import yachtingUnplugged from "@/public/brand/yachting-unplugged.png";

const page = loadPage("about");

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/about" });

// The authority anchor every author box links to (spec §7 About). Person schema lives here.
export default function AboutPage() {
  return (
    <>
      <StaticPageView
        page={page}
        aside={
          <div className="mt-8 grid gap-4 sm:grid-cols-[3fr_2fr] sm:items-end">
            <KimPhoto className="aspect-[16/10] w-full" sizes="(min-width: 768px) 480px, 100vw" />
            <div className="bg-black p-4">
              <Image src={yachtingUnplugged} alt="Yachting Unplugged" className="h-auto w-full" sizes="300px" />
            </div>
          </div>
        }
      />
      <ApplyBand headline="Ready to shop like a Boss?" />
      <JsonLd data={personSchema()} />
    </>
  );
}
