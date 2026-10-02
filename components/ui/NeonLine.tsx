// The one decorative motif (spec §6): a 3px red rule with a glow.
export function NeonLine({ orientation = "horizontal", className = "" }: { orientation?: "horizontal" | "vertical"; className?: string }) {
  return <div aria-hidden="true" className={`${orientation === "horizontal" ? "neon-h w-full" : "neon-v"} ${className}`} />;
}
