import SimpleSection from "@/components/Common/SimpleSection";
import type { Entry } from "@/utils/sitemap";

import SitemapCard from "./SitemapCard";

interface SitemapSectionProps {
  title: string;
  entries: Entry[];
}

export default function SitemapSection({ title, entries }: SitemapSectionProps) {
  if (!entries || entries.length === 0) return null;

  return (
    <SimpleSection title={title} wide grid>
      {entries.map((entry) => (
        <div key={`${entry.href || entry.title}-${entry.title}`} className="w-full">
          <SitemapCard entry={entry} />
        </div>
      ))}
    </SimpleSection>
  );
}
