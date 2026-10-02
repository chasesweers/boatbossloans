// Spec §11. Thin wrapper so the provider (Plausible today) can change in one place.
import type { ButtonLocation } from "./apply";

export interface AnalyticsEvents {
  apply_click: { source_page: string; button_location: ButtonLocation };
  newsletter_signup: { source_page: string };
  guide_scroll_75: { slug: string };
  calculator_used: Record<string, never>;
  video_play: { video_id: string; source_page: string };
}

type PlausibleFn = (event: string, options?: { props?: Record<string, unknown> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function track<E extends keyof AnalyticsEvents>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, { props });
}
