"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires guide_scroll_75 once when the reader reaches 75% of the article (spec §11).
// Render inside a `relative` container; the sentinel sits at 75% of its height.
export function ScrollDepth({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("guide_scroll_75", { slug });
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute left-0 top-3/4 h-px w-px" />;
}
