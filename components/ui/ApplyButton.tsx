"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { buildApplyUrl, type ButtonLocation } from "@/lib/apply";
import { track } from "@/lib/analytics";

interface Props {
  location: ButtonLocation;
  children?: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}

export function ApplyButton({ location, children = "Apply", variant = "solid", className = "" }: Props) {
  const pathname = usePathname() ?? "/";

  return (
    <a
      href={buildApplyUrl(pathname)}
      rel="noopener"
      className={`btn ${variant === "solid" ? "btn-solid" : "btn-outline"} ${className}`}
      onClick={() => track("apply_click", { source_page: pathname, button_location: location })}
    >
      {children}
    </a>
  );
}
