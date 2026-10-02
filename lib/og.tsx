// Branded Open Graph card (spec §9): black, BOAT BOSS logo, red neon rule, the page's headline.
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const OG_SIZE = { width: 1200, height: 630 };

const logoDataUrl = () =>
  `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", "brand", "logo-white.png")).toString("base64")}`;

export function renderOgImage({ eyebrow, headline }: { eyebrow: string; headline: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", padding: 72, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={logoDataUrl()} width={190} height={100} alt="" />
          <span style={{ color: "#E3170A", fontSize: 56, fontWeight: 800 }}>Loans</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#B4B4B4", fontSize: 28, textTransform: "uppercase", letterSpacing: 2 }}>{eyebrow}</span>
          <span style={{ fontSize: headline.length > 48 ? 64 : 80, fontWeight: 800, textTransform: "uppercase", lineHeight: 1.05, marginTop: 16 }}>{headline}</span>
        </div>
        <div style={{ height: 6, width: "100%", background: "#E3170A", boxShadow: "0 0 24px rgba(255,30,20,.8)" }} />
      </div>
    ),
    OG_SIZE,
  );
}
