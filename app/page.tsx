import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FinanceCategories } from "@/components/home/FinanceCategories";
import { HowItWorks } from "@/components/home/HowItWorks";
import { AboutKimTeaser } from "@/components/home/AboutKimTeaser";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { GuideIndexList } from "@/components/guide/GuideIndexList";
import { ApplyBand } from "@/components/ui/ApplyBand";
import { NeonLine } from "@/components/ui/NeonLine";
import { NewsletterStrip } from "@/components/newsletter/NewsletterStrip";
import { faqs } from "@/content/home";
import { getGuides, groupGuides } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = {
  ...pageMetadata({ title: `${SITE_NAME} | Kim Sweers, The Boat Boss`, description: SITE_DESCRIPTION, path: "/" }),
  title: { absolute: `${SITE_NAME} | Kim Sweers, The Boat Boss` },
};

export default function HomePage() {
  const groups = groupGuides(getGuides());

  return (
    <>
      <Hero />
      <NeonLine />
      <FinanceCategories />
      <HowItWorks />
      <AboutKimTeaser />

      <section aria-labelledby="guide-heading" className="bg-black py-16 md:py-24">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="guide-heading" className="text-[clamp(2.25rem,5vw,3.75rem)]">
              The financing guide
            </h2>
            <Link href="/guide" className="font-semibold text-white underline decoration-red decoration-2 underline-offset-4">
              See every question
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-smoke">Straight answers to the questions boat buyers ask most.</p>
          <div className="mt-10">
            <GuideIndexList groups={groups} />
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="bg-panel py-16 md:py-24">
        <div className="container-site max-w-4xl">
          <h2 id="faq-heading" className="text-[clamp(2.25rem,5vw,3.75rem)]">
            Quick answers
          </h2>
          <div className="mt-8">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <ApplyBand />
      <NewsletterStrip />
    </>
  );
}
