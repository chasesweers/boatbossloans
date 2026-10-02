import Link from "next/link";
import { redirect } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { NeonLine } from "@/components/ui/NeonLine";
import { buildApplyUrl } from "@/lib/apply";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apply",
  description: "Apply for boat financing through Vantage Recreational Finance.",
  path: "/apply",
  noindex: true,
});

// Two jobs (spec §5):
// - Before Vantage issues the tracked link, every Apply button lands here instead of doing nothing.
// - After NEXT_PUBLIC_APPLY_URL is set, buttons go straight to Vantage and this route becomes a short
//   redirect link (boatbossloans.com/apply) Kim can use in social bios, tagged utm_campaign=apply.
export default function ApplyPage() {
  if (process.env.NEXT_PUBLIC_APPLY_URL) redirect(buildApplyUrl("/apply"));

  return (
    <section className="bg-black py-16 md:py-28">
      <div className="container-site max-w-3xl">
        <h1 className="text-[clamp(2.6rem,7vw,5rem)]">The application is almost ready</h1>
        <p className="mt-6 text-xl text-white">
          Apply buttons on this site will take you straight to Vantage Recreational Finance&apos;s secure online application. A Vantage
          lending specialist reviews it, explains your options across multiple marine lenders, and handles the paperwork through closing.
        </p>
        <p className="mt-4 text-lg text-smoke">
          We&apos;re putting the finishing touches on that link. In the meantime, read up so you walk in prepared, and get a note from Kim
          the moment applications open.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/guide" className="btn btn-outline">
            Read the guide
          </Link>
          <Link href="/calculator" className="btn btn-outline">
            Estimate ownership costs
          </Link>
        </div>
        <NeonLine className="my-12" />
        <h2 className="text-3xl">Get notified</h2>
        <div className="mt-6">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
