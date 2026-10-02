import Image from "next/image";
import studioWall from "@/public/images/studio-wall.jpg";

// Placeholder until Kim supplies kim.jpg (spec §6). Swap the import and alt text when it arrives.
export function KimPhoto({ className = "", sizes = "(min-width: 768px) 40vw, 100vw" }: { className?: string; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <Image
        src={studioWall}
        alt="The BOAT BOSS studio wall with the Yachting Unplugged sign and red neon lights"
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
