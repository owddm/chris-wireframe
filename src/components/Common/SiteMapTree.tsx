import Link from "@/components/Common/LinkReact";
import { getOGImageWithFallback } from "@/utils/og";
import { type Entry, buildSitemapSections } from "@/utils/sitemap";

// The sections promise will resolve once and remain cached for subsequent renders.
const sectionsPromise = buildSitemapSections();
const sections: Entry[] = await sectionsPromise;

interface Props {
  className?: string;
  showOGImages?: boolean;
}

/**
 * Render a section with optional link and children
 */
function SitemapSection({
  section,
  showOGImages = false,
}: {
  section: Entry;
  showOGImages?: boolean;
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-2 text-lg font-semibold">
        {section.href ? (
          <>
            <Link href={section.href} className="link link-hover">
              {section.title}
            </Link>
            <div className="text-base-content/50 ml-2 text-sm">{section.href}</div>
          </>
        ) : (
          <div className="text-base-content/70">{section.title}</div>
        )}
      </h3>
      {showOGImages && section.href && (
        <div className="mb-4">
          <img
            src={getOGImageWithFallback(section.href)}
            alt={`OG image for ${section.title}`}
            className="rounded-box h-auto w-full object-cover shadow-md"
            loading="lazy"
          />
        </div>
      )}
      {section.children.length > 0 && (
        <div
          className={
            showOGImages ? "grid grid-cols-1 gap-4 md:grid-cols-3" : "list-none space-y-1 md:ml-4"
          }
        >
          {section.children.map((child) => (
            <div key={child.href} className={showOGImages ? "flex flex-col" : ""}>
              {showOGImages && (
                <div className="mb-2">
                  <img
                    src={getOGImageWithFallback(child.href)}
                    alt={`OG image for ${child.title}`}
                    className="rounded-box aspect-[1200/630] h-auto w-full object-cover shadow-md"
                    loading="lazy"
                  />
                </div>
              )}
              <div>
                <Link href={child.href} className="link link-hover block text-sm">
                  {child.title}
                </Link>
                <div className="text-base-content/50 text-xs">{child.href}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top-level component that renders organized sections
 */
export default function SiteMapTree({ className = "", showOGImages = false }: Props) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <SitemapSection key={section.title} section={section} showOGImages={showOGImages} />
      ))}
    </div>
  );
}
