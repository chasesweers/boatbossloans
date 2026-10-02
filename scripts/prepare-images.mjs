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
async function photo(file, out, { width = 2400, extract } = {}) {
  let img = sharp(src(file)).rotate(); // honor EXIF orientation
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
await sharp(src("yachting-unplugged-logo.png")).extract({ left: 60, top: 455, width: 990, height: 160 }).png().toFile(path.join(BRAND, "yachting-unplugged.png"));
console.log("   brand/yachting-unplugged.png");
const mark = await whiteLogo();
await appIcon(mark);
console.log("Done.");
