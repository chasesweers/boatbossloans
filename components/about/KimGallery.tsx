import Image from "next/image";
import cover from "@/public/images/kim-boat-boss-cover.jpg";
import mercury from "@/public/images/kim-mercury-v10.jpg";
import runabout from "@/public/images/kim-wooden-runabout.jpg";
import superyachtBow from "@/public/images/kim-superyacht-bow.jpg";
import boatShow from "@/public/images/kim-boat-show.jpg";
import pinkPolo from "@/public/images/kim-pink-polo.jpg";
import spectre from "@/public/images/kim-superyacht-spectre.jpg";
import beachfront from "@/public/images/kim-beachfront.jpg";

const photos = [
  { src: cover, alt: "Kim at the helm of a center-console boat under a BOAT BOSS headline", position: "object-top" },
  { src: mercury, alt: "Kim in a Mercury V10 cap aboard a boat with twin Mercury Verado outboards" },
  { src: runabout, alt: "Kim in a BOAT BOSS cap aboard a classic varnished wooden runabout flying an American flag" },
  { src: superyachtBow, alt: "Kim smiling on the water in front of the dark bow of a superyacht" },
  { src: boatShow, alt: "Kim and a friend smiling at a boat show" },
  { src: pinkPolo, alt: "Kim underway on a boat with twin outboards and high-rise towers behind her" },
  { src: spectre, alt: "Kim in a BOAT BOSS cap beside a white superyacht" },
  { src: beachfront, alt: "Kim in a BOAT BOSS cap on a palm-lined beachfront promenade" },
];

export function KimGallery() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-black py-16 md:py-24">
      <div className="container-site">
        <h2 id="gallery-heading" className="text-[clamp(2.25rem,5vw,3.75rem)]">
          Kim on the water
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {photos.map(({ src, alt, position = "object-center" }) => (
            <li key={src.src} className="relative aspect-[3/4] overflow-hidden bg-panel">
              <Image src={src} alt={alt} fill sizes="(min-width: 768px) 25vw, 50vw" placeholder="blur" className={`object-cover ${position}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
