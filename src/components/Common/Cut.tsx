import clsx from "clsx";

type CutDirection = boolean | "up" | "down";

type BgStyle = "digital" | "wave";

const digitalSvg = `
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="0" width="20" height="20" fill="black" />
  <rect x="0" y="20" width="20" height="20" fill="black" />
</svg>
`;

export default function Cut({
  top = false,
  bottom = false,
  both = true,
  className = "py-4",
  bgClass = "bg-primary/20",
  bgStyle,
  children,
}: {
  top?: CutDirection;
  bottom?: CutDirection;
  both?: CutDirection;
  children: React.ReactNode;
  bgClass?: string;
  className?: string;
  bgStyle?: BgStyle;
}) {
  const cutSize = "5rem"; // Base cut height (32px)

  // Default to both if no props are passed
  const noPropsSpecified = !top && !bottom && !both;
  const showTop = noPropsSpecified || both || top;
  const showBottom = noPropsSpecified || both || bottom;

  // Determine slope directions
  const topDirection = typeof both === "string" ? both : typeof top === "string" ? top : "up";
  const bottomDirection =
    typeof both === "string" ? both : typeof bottom === "string" ? bottom : "down";

  // Build clip-path with fixed height cuts
  const getClipPath = () => {
    const topLeft = showTop && topDirection === "up" ? cutSize : "0";
    const topRight = showTop && topDirection === "down" ? cutSize : "0";
    const bottomRight =
      showBottom && bottomDirection === "down" ? "100%" : `calc(100% - ${cutSize})`;
    const bottomLeft = showBottom && bottomDirection === "up" ? "100%" : `calc(100% - ${cutSize})`;

    return `polygon(0 ${topLeft}, 100% ${topRight}, 100% ${bottomRight}, 0 ${bottomLeft})`;
  };

  const cutClasses = [showTop && `-top-[5rem]`, showBottom && `-bottom-[4rem]`];

  return (
    <div className={clsx("relative", className)}>
      {/* Single background div with clip-path */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 z-0",
          bgClass,
          // Extend div beyond container to accommodate cuts
          ...cutClasses,
        )}
        style={{
          clipPath: getClipPath(),
        }}
      >
        {bgStyle === "digital" && (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 to-white/0"
            style={{
              maskImage: `url("data:image/svg+xml,${encodeURIComponent(digitalSvg)}")`,
              maskSize: "40px 40px",
              maskRepeat: "repeat",
              WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(digitalSvg)}")`,
              WebkitMaskSize: "40px 40px",
              WebkitMaskRepeat: "repeat",
            }}
          />
        )}
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
