// Builds the printed QR code (`npm run qr`). It encodes our own /qr link, not a vendor's, so it
// never expires and scans show up in Plausible under Campaigns via the redirect in lib/redirects.ts.
// Change where scans land there; re-run this only if the URL itself changes.
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// Keep in sync with CANONICAL_ORIGIN and QR_PATH in lib/redirects.ts.
const URL = "https://boatbossloans.com/qr";
const OUT = "assets/qr";
fs.mkdirSync(OUT, { recursive: true });

// Level M survives scuffs and glare; margin 4 is the standard quiet zone printers need.
const opts = { errorCorrectionLevel: "M", margin: 4, color: { dark: "#000000", light: "#ffffff" } };

const svg = path.join(OUT, "boatbossloans-qr.svg");
const png = path.join(OUT, "boatbossloans-qr.png");
await QRCode.toFile(svg, URL, { ...opts, type: "svg" });
await QRCode.toFile(png, URL, { ...opts, type: "png", width: 2000 });
console.log(`QR for ${URL} -> ${svg}, ${png}`);
