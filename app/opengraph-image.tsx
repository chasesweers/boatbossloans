import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "BOAT BOSS Loans: Finance your boat like a Boss";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ eyebrow: "Kim Sweers, The Boat Boss", headline: "Finance your boat like a Boss" });
}
