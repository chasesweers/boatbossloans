import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { NeonLine } from "@/components/ui/NeonLine";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Newsletter",
  description: "Straight talk on buying and financing a boat from Kim Sweers, The Boat Boss. Free, about twice a month, unsubscribe anytime.",
  path: "/newsletter",
});

// The form swaps itself for the thank-you state after a successful signup (spec §4).
export default function NewsletterPage() {
  return (
    <section className="bg-black py-16 md:py-28">
      <div className="container-site max-w-3xl">
        <h1 className="text-[clamp(2.8rem,8vw,5.5rem)]">Get the Boss&apos;s notes</h1>
        <p className="mt-6 text-xl text-white">
          What to ask before you sign, how lenders really look at a deal, and the boat-buying lessons Kim learned across the F&amp;I desk.
        </p>
        <NeonLine className="my-10" />
        <NewsletterForm />
      </div>
    </section>
  );
}
