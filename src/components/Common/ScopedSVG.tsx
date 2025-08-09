/*

<ScopedSVG>

Renders a raw inline SVG with scoped CSS and ID references to avoid conflicts
when multiple identical SVGs are used on the same page.

- Injects a unique ID into the <svg> root
- Prefixes all CSS selectors inside <style> with that ID
- Renames all id="..." attributes and updates references (e.g., url(#...), mask, href)

Common alternatives:
1. Shadow DOM - The "proper" solution, but limited React support
2. SVG symbols with <use> - Good for simple icons, but doesn't support internal CSS
3. react-inlinesvg or SVGR - Popular libraries that handle this automatically

*/
import { useId, useMemo } from "react";

interface ScopedSVGProps {
  svg: string;
  className?: string;
  svgClass?: string;
}

export default function ScopedSVG({ svg, className, svgClass }: ScopedSVGProps) {
  const uniqueId = useId().replace(/:/g, "");
  const scopedId = `svg-${uniqueId}`;

  const scopedSvg = useMemo(() => {
    let result = svg;

    // 1. Inject an ID into the root <svg> tag
    result = result.replace(/<svg\b([^>]*)>/, `<svg id="${scopedId}" class="${svgClass}"$1>`);

    // 2. Collect all IDs that will be renamed
    const idRegex = /id="([\w:-]+)"/g;
    const ids = new Set<string>();
    let match;
    while ((match = idRegex.exec(result)) !== null) {
      ids.add(match[1]);
    }

    // 3. Prefix all CSS selectors in <style> with #scopedId and update ID references
    result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (_: string, css: string) => {
      let scopedCss = css;

      // First, rename all ID references in the CSS
      ids.forEach((id) => {
        const scoped = `${id}-${uniqueId}`;
        // Update ID selectors in CSS
        scopedCss = scopedCss.replace(new RegExp(`#${id}\\b`, "g"), `#${scoped}`);
      });

      // Then handle other selector scoping
      scopedCss = scopedCss.replace(
        /(^|\n)\s*([^{\n]+)\s*\{/g,
        (_match: string, p1: string, selector: string) => {
          const scopedSelector = selector
            .split(",")
            .map((sel: string) => {
              const trimmedSel = sel.trim();
              // dont trim keyframe definitions
              if (["@keyframes", "from", "to"].some((prefix) => trimmedSel.startsWith(prefix))) {
                return trimmedSel;
              }
              // If selector starts with a parent class/pseudo selector (like .colorful or .group:hover)
              // and contains an ID reference, it's already been updated above, so leave it as is
              if (trimmedSel.match(/^(\.[^\s]+|\S+:hover)\s+#/)) {
                return trimmedSel;
              }
              // If selector is just an ID selector, it's already been updated
              if (/^#/.test(trimmedSel)) {
                return trimmedSel;
              }
              // If selector is just "svg" or starts with "svg." or "svg[" or "svg:", replace with svg#scopedId
              if (/^svg(\.|:|#|\[|$)/.test(trimmedSel)) {
                return trimmedSel.replace(/^svg/, `svg#${scopedId}`);
              }
              // Otherwise, prefix with #scopedId
              return `#${scopedId} ${trimmedSel}`;
            })
            .join(", ");
          return `${p1}${scopedSelector} {`;
        },
      );
      return `<style>${scopedCss}</style>`;
    });

    // 4. Scope all IDs and their references in the HTML (e.g., url(#id), mask, href)
    ids.forEach((id) => {
      const scoped = `${id}-${uniqueId}`;
      result = result
        .replace(new RegExp(`id="${id}"`, "g"), `id="${scoped}"`)
        .replace(new RegExp(`url\\(#${id}\\)`, "g"), `url(#${scoped})`)
        .replace(new RegExp(`mask="url\\(#${id}\\)"`, "g"), `mask="url(#${scoped})"`)
        .replace(new RegExp(`href="#${id}"`, "g"), `href="#${scoped}"`);
    });

    return result;
  }, [svg, uniqueId, scopedId]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: scopedSvg }} />;
}
