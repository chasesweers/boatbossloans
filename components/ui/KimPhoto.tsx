import Image from "next/image";
import cover from "@/public/images/kim-boat-boss-cover.jpg";
import headshot from "@/public/images/kim-headshot.jpg";

const photos = {
  cover: {
    src: cover,
    alt: "Kim Sweers, The Boat Boss, standing at the helm of a center-console boat on open water under a BOAT BOSS headline",
    position: "object-top",
  },
  headshot: {
    src: headshot,
    alt: "Studio portrait of Kim Sweers, The Boat Boss",
    position: "object-[50%_30%]",
  },
};

export function KimPhoto({
  photo = "cover",
  className = "",
  sizes = "(min-width: 768px) 40vw, 100vw",
}: {
  photo?: keyof typeof photos;
  className?: string;
  sizes?: string;
}) {
  const { src, alt, position } = photos[photo];
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" className={`object-cover ${position}`} />
    </div>
  );
}
