import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo-white.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-end gap-2 sm:gap-3 ${className}`} aria-label="BOAT BOSS Loans home">
      <Image src={logo} alt="" priority className="h-6 w-auto sm:h-8 md:h-12" sizes="120px" />
      {/* Keep at text-2xl or larger: brand red only passes contrast as large text (globals.css). */}
      <span className="font-display text-2xl leading-none text-red md:text-4xl" aria-hidden="true">
        Loans
      </span>
    </Link>
  );
}
