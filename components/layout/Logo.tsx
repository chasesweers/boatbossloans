import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo-white.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-end gap-3 ${className}`} aria-label="BOAT BOSS Loans home">
      <Image src={logo} alt="" priority className="h-10 w-auto md:h-12" sizes="120px" />
      <span className="font-display text-3xl leading-none text-red uppercase md:text-4xl" aria-hidden="true">
        Loans
      </span>
    </Link>
  );
}
