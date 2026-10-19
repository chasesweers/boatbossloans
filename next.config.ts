import type { NextConfig } from "next";
import { INDEXNOW_KEY_PATTERN } from "./lib/indexnow";
import { buildRedirects } from "./lib/redirects";

// Defense-in-depth headers (playbook §7.6). Third parties allowed: Plausible analytics and
// YouTube's privacy-enhanced player behind the click-to-load facade.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io",
  "frame-src https://www.youtube-nocookie.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return buildRedirects();
  },
  async rewrites() {
    // IndexNow key file at the site root. Runs after real files, so robots.txt and llms.txt win.
    return [{ source: `/:file(${INDEXNOW_KEY_PATTERN}\\.txt)`, destination: "/api/indexnow/:file" }];
  },
  async headers() {
    if (process.env.NODE_ENV === "development") return [];
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Preview deployments must never be indexed (spec §12), whatever the page metadata says.
      ...(process.env.VERCEL_ENV === "preview"
        ? [{ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
        : []),
    ];
  },
};

export default nextConfig;
