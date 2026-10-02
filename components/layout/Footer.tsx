import Link from "next/link";
import { DISCLOSURE, LEGAL_ENTITY, LEGAL_LINKS, NAV_LINKS, SOCIAL_LINKS } from "@/lib/site";
import { NeonLine } from "@/components/ui/NeonLine";
import { Logo } from "./Logo";

export function Footer() {
  const socials = SOCIAL_LINKS.filter((s) => s.href);

  return (
    <footer className="mt-auto bg-black text-smoke">
      <NeonLine />
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Logo />
          <nav aria-label="Footer">
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/newsletter" className="text-white hover:underline">
                  Newsletter
                </Link>
              </li>
            </ul>
          </nav>
          {socials.length > 0 && (
            <ul className="flex gap-4" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} rel="noopener" className="text-white hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-6">
          <p className="text-sm leading-relaxed" data-testid="footer-disclosure">
            {DISCLOSURE}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white underline underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            © {new Date().getFullYear()} {LEGAL_ENTITY}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
