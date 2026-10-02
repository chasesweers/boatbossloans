import { StaticPageView } from "@/components/pages/StaticPageView";
import { loadPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

const page = loadPage("privacy");

export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/privacy" });

export default function Page() {
  return <StaticPageView page={page} />;
}
