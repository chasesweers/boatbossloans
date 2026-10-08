import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-black/95 backdrop-blur">
      <div className="container-site flex h-14 items-center md:h-20 justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-display text-lg uppercase tracking-wide text-white hover:text-smoke">
              {l.label}
            </Link>
          ))}
          <ApplyButton location="header" />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ApplyButton location="header" className="!min-h-10 !px-3 sm:!px-4" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
