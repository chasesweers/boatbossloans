import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo-white.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-end gap-2 sm:gap-3 ${className}`} aria-label="BOAT BOSS Loans home">
      <Image src={logo} alt="" priority className="h-8 w-auto sm:h-10 md:h-12" sizes="120px" />
      <span className="font-display text-2xl leading-none text-red sm:text-3xl md:text-4xl" aria-hidden="true">
        Loans
      </span>
    </Link>
  );
}
