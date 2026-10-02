import type { Metadata, Viewport } from "next";
import { Anton, Barlow } from "next/font/google";
import Script from "next/script";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { robotsFor } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_INDEXABLE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// next/font downloads these at build time and serves them from our own domain (spec §6).
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const barlow = Barlow({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Kim Sweers, The Boat Boss`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  robots: robotsFor(SITE_INDEXABLE),
  openGraph: { siteName: SITE_NAME, locale: "en_US", type: "website" },
};

export const viewport: Viewport = { themeColor: "#000000" };

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-red focus:px-4 focus:py-2">
          Skip to content
        </a>
        <DemoBanner />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationSchema()} />
        {plausibleDomain && (
          <>
            <Script id="plausible-queue" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
            </Script>
            <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
