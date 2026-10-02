import { isDemoMode } from "@/lib/site";

// Site-wide notice on demo deployments (DEMO_MODE=true). Renders nothing otherwise.
export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <div role="note" className="bg-white px-4 py-2 text-center text-sm font-semibold text-ink">
      Demo preview. This site is not live yet and content is awaiting review.
    </div>
  );
}
