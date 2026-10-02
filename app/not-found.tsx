import Link from "next/link";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { NeonLine } from "@/components/ui/NeonLine";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="bg-black py-24 md:py-32">
      <div className="container-site max-w-3xl">
        <p className="font-display text-7xl text-red">404</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">This page ran aground</h1>
        <p className="mt-6 text-lg text-smoke">The page you were looking for doesn&apos;t exist or has moved.</p>
        <NeonLine className="my-10" />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/guide" className="btn btn-outline">
            Browse the guide
          </Link>
          <ApplyButton location="inline">Start your application</ApplyButton>
        </div>
      </div>
    </section>
  );
}
