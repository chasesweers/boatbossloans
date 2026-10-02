import { getGuide } from "@/lib/content";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "BOAT BOSS Loans financing guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getGuide(slug);
  return renderOgImage({ eyebrow: "The financing guide", headline: doc?.title ?? "Boat financing guide" });
}
