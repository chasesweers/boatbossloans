import Image from "next/image";
import Link from "next/link";
import heroImg from "@/public/images/hero.jpg";
import { hero } from "@/content/home";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { NeonLine } from "@/components/ui/NeonLine";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <Image
        src={heroImg}
        alt="A white superyacht lit at dusk, reflected in calm marina water"
        priority
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover object-center opacity-80"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/70 to-black/10 md:bg-gradient-to-r md:from-black md:via-black/75 md:to-transparent" />
      <div className="container-site relative flex min-h-[calc(100svh-5rem)] items-end py-12 md:items-center md:py-24">
        <NeonLine orientation="vertical" className="absolute bottom-24 left-0 top-24 hidden md:block" />
        <div className="max-w-2xl md:pl-8">
          <h1 className="text-[clamp(3rem,9vw,6.5rem)] text-white">{hero.headline}</h1>
          <p className="mt-6 text-lg leading-relaxed text-white md:text-xl">{hero.body}</p>
          <p className="mt-4 text-base font-semibold text-smoke">{hero.byline}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ApplyButton location="hero">Start your application</ApplyButton>
            <Link href="/guide" className="btn btn-outline">
              Read the guide first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
