"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";

// Lightweight facade (spec §7 Media): show a thumbnail, load YouTube's player only on click.
export function YouTubeFacade({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const pathname = usePathname() ?? "/";

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            track("video_play", { video_id: id, source_page: pathname });
          }}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- third-party thumbnail, sized by the container */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" />
          <span className="absolute inset-0 m-auto flex h-16 w-24 items-center justify-center bg-red group-hover:shadow-[0_0_24px_var(--color-red-glow)]">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
