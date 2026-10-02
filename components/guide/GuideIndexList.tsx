import Link from "next/link";
import type { GuideGroup } from "@/lib/content";

// Grouped list of published questions (spec §7 Home section 5 and /guide).
export function GuideIndexList({ groups, tone = "dark" }: { groups: GuideGroup[]; tone?: "dark" | "light" }) {
  if (groups.length === 0) {
    return <p className={tone === "dark" ? "text-smoke" : "text-grey"}>New guide pages are on the way. Check back soon.</p>;
  }
  const heading = tone === "dark" ? "text-white" : "text-red";
  const link = tone === "dark" ? "text-white hover:text-smoke" : "text-ink hover:text-red";
  const rule = tone === "dark" ? "border-hairline" : "border-ink/15";

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`group-${g.id}`}>
          <h3 id={`group-${g.id}`} className={`text-2xl ${heading}`}>
            {g.label}
          </h3>
          <ul className={`mt-4 border-t ${rule}`}>
            {g.guides.map((q) => (
              <li key={q.slug} className={`border-b ${rule}`}>
                <Link href={`/guide/${q.slug}`} className={`flex items-center justify-between gap-4 py-4 text-lg font-semibold ${link}`}>
                  {q.title}
                  <span aria-hidden="true" className="text-red">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
