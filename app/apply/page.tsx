import { redirect } from "next/navigation";
import { buildApplyUrl } from "@/lib/apply";

// Short link (boatbossloans.com/apply) Kim can use in social bios. Apply buttons link to Vantage
// directly; this route redirects there too, tagged utm_campaign=apply when UTM is on (spec §5).
export default function ApplyPage() {
  redirect(buildApplyUrl("/apply"));
}
