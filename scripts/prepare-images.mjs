// Turns the curated originals in assets/source into web-ready files in public/.
// Re-run (`npm run images`) whenever Kim supplies new or higher-resolution photos.
// next/image handles WebP/AVIF and responsive sizes at request time; this script only
// crops, orients, caps resolution, and builds the brand marks.
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "assets/source";
const OUT = "public/images";
const BRAND = "public/brand";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(BRAND, { recursive: true });

const src = (f) => path.join(SRC, f);

// --- Photos -------------------------------------------------------------------------------
// Clone-stamp: cover each region with fabric copied from `dy` px below it, feathered so the
// seam disappears. Removes FB Marine Group logos from polos (spec: no FBMG branding anywhere).
async function clonePatches(buffer, patches) {
  const overlays = await Promise.all(
    patches.map(async ({ left, top, width, height, dy }) => {
      const f = Math.round(Math.min(width, height) / 4); // feather width
      const rgb = await sharp(buffer).extract({ left, top: top + dy, width, height }).removeAlpha().raw().toBuffer();
      const rgba = Buffer.alloc(width * height * 4);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = y * width + x;
          const edge = Math.min(x, y, width - 1 - x, height - 1 - y);
          rgb.copy(rgba, i * 4, i * 3, i * 3 + 3);
          rgba[i * 4 + 3] = Math.round(255 * Math.min(1, edge / f));
        }
      }
      const input = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
      return { input, left, top };
    }),
  );
  return sharp(buffer).composite(overlays).toBuffer();
}

async function photo(file, out, { width = 2400, extract, patches } = {}) {
  let buffer = await sharp(src(file)).rotate().toBuffer(); // honor EXIF orientation
  if (patches) buffer = await clonePatches(buffer, patches);
  let img = sharp(buffer);
  if (extract) img = img.extract(extract);
  await img.resize({ width, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, out));
  console.log("  ", out);
}

// --- Logo: black oval mark on white -> white mark on transparent, oval ring removed --------
async function whiteLogo() {
  const { data, info } = await sharp(src("logo-oval-black.png")).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const cx = width / 2, cy = height / 2;
  // Inner edge of the oval ring, measured from the 1920x1080 source.
  const a = 565, b = 315;
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const inside = ((x - cx) / a) ** 2 + ((y - cy) / b) ** 2 < 1;
      const ink = inside ? 255 - data[i] : 0; // dark pixels become opaque
      rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255;
      rgba[i * 4 + 3] = ink;
    }
  }
  const mark = await sharp(rgba, { raw: { width, height, channels: 4 } }).trim().png().toBuffer();
  await sharp(mark).resize({ width: 600 }).png().toFile(path.join(BRAND, "logo-white.png"));
  console.log("   brand/logo-white.png");
  return mark;
}

// --- App icon: white mark centered on black -------------------------------------------------
async function appIcon(mark) {
  const size = 512;
  const resized = await sharp(mark).resize({ width: Math.round(size * 0.8), height: Math.round(size * 0.8), fit: "inside" }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#000000" } })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile("app/icon.png");
  console.log("   app/icon.png");
}

console.log("Preparing images:");
// Placeholder hero until Kim sends the original sportfish photo (spec §6 hero.jpg).
await photo("superyacht-dusk.jpg", "hero.jpg", { width: 2400 });
await photo("bow.jpg", "bow.jpg", { width: 2000 });
// Top of the studio wall only: logo + Yachting Unplugged. Excludes the "Presented by" sponsor line.
await photo("studio-wall.png", "studio-wall.jpg", { extract: { left: 0, top: 0, width: 1614, height: 600 } });
// Kim. Coordinates are in source pixels; patches clone polo fabric over the FBMG chest logo.
await photo("kim-headshot.jpg", "kim-headshot.jpg", { width: 1200 });
await photo("kim-boat-boss-cover.jpg", "kim-boat-boss-cover.jpg", {
  width: 1600,
  patches: [{ left: 732, top: 692, width: 136, height: 72, dy: 100 }],
});
// Cropped above the FBMG chest logo.
await photo("kim-pink-polo.jpg", "kim-pink-polo.jpg", { width: 1500, extract: { left: 0, top: 0, width: 1500, height: 1400 } });
for (const name of ["mercury-v10", "boat-show", "wooden-runabout", "beachfront", "superyacht-spectre", "superyacht-bow"]) {
  await photo(`kim-${name}.jpg`, `kim-${name}.jpg`, { width: 1600 });
}
await sharp(src("yachting-unplugged-logo.png")).extract({ left: 60, top: 455, width: 990, height: 160 }).png().toFile(path.join(BRAND, "yachting-unplugged.png"));
console.log("   brand/yachting-unplugged.png");
const mark = await whiteLogo();
await appIcon(mark);
console.log("Done.");
