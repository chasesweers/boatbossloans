import { StaticPageView } from "@/components/pages/StaticPageView";
import { loadPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata() {
  const page = loadPage("terms");
  return pageMetadata({ title: page.title, description: page.description, path: "/terms" });
}

export default function Page() {
  return <StaticPageView page={loadPage("terms")} />;
}
