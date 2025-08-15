import React, { useEffect, useRef } from "react";

import { animate, createScope, createSpring, svg, utils } from "animejs";
import clsx from "clsx";

interface Props {
  id: string;
  blobPath: string; // target path "d" (same command structure for best results)
  className?: string;
  children?: React.ReactNode;
}

export default function BlobMask({ id, blobPath, className = "", children }: Props) {
  const stiffness = 180;
  const damping = 9;
  const mass = 0.8;
  const clipPathUnits = "objectBoundingBox";
  const offset = { x: 0.05, y: 0.05 };
  const maskId = `blob-mask-${id}`;
  const scale = 1 / 110;
  const transform = `translate(${offset.x} ${offset.y}) scale(${scale})`;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const tmpTargetRef = useRef<SVGPathElement | null>(null);
  const initialPathRef = useRef<string | null>(null);

  // Scope Anime to the hidden SVG (no wrapper div)
  useEffect(() => {
    if (!svgRef.current) return;
    const scope = createScope({ root: svgRef });
    return () => {
      scope.revert();
    };
  }, []);

  useEffect(() => {
    if (!pathRef.current || !tmpTargetRef.current) return;

    // Store initial path on first render
    if (initialPathRef.current === null) {
      initialPathRef.current = blobPath;
      return;
    }

    // Update hidden target for morphTo
    utils.set(tmpTargetRef.current, { d: blobPath });

    const spring = createSpring({ stiffness, damping, mass });

    const controls = animate(pathRef.current, {
      d: [{ to: svg.morphTo(tmpTargetRef.current), ease: spring }],
      // You can optionally tweak these to affect stop conditions:
      // restSpeed: 0.001, restDelta: 0.001
    });

    return () => {
      controls.cancel();
    };
  }, [blobPath, stiffness, damping, mass]);

  return (
    <>
      <svg
        ref={svgRef}
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={maskId} clipPathUnits={clipPathUnits}>
            {/* animated path (scaled into 0–1 space) */}
            <path ref={pathRef} d={initialPathRef.current || blobPath} transform={transform} />
          </clipPath>

          {/* hidden morph target with same transform */}
          <path
            ref={tmpTargetRef}
            d={initialPathRef.current || blobPath}
            transform={transform}
            style={{ display: "none" }}
          />
        </defs>
      </svg>

      <div
        className={clsx(className, "-m-8")}
        style={{
          clipPath: `url(#${maskId})`,
          WebkitClipPath: `url(#${maskId})`,
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      >
        {children}
      </div>
    </>
  );
}
