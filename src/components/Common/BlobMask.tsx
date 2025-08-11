import React, { useMemo } from "react";

interface BlobMaskProps {
  id: string;
  blobPath: string;
  transitionSpeed?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function BlobMask({
  id,
  blobPath,
  transitionSpeed = 300,
  children,
  className = "",
}: BlobMaskProps) {
  const maskId = `blob-mask-${id}`;

  // Create a base64-encoded SVG for iOS Safari fallback
  const maskImage = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path fill="black" d="${blobPath}" transform="scale(0.01 0.01) translate(0 0)"/>
    </svg>`;
    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
  }, [blobPath]);

  // Detect iOS Safari
  const isIOSSafari = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    return iOSSafari;
  }, []);

  return (
    <>
      {!isIOSSafari && (
        <svg
          width="0"
          height="0"
          className="absolute"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
              <rect x="0" y="0" width="1" height="1" fill="black" />
              <path
                fill="white"
                transform="translate(0 0) scale(0.01)"
                d={blobPath}
                style={{
                  transition: `d ${transitionSpeed}ms cubic-bezier(0.68,-0.55,0.265,1.55)`,
                }}
              />
            </mask>
          </defs>
        </svg>
      )}
      <div
        className={className}
        style={
          isIOSSafari
            ? {
                WebkitMaskImage: maskImage,
                WebkitMaskSize: "cover",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
              }
            : {
                mask: `url(#${maskId})`,
                WebkitMask: `url(#${maskId})`,
                maskSize: "cover",
                WebkitMaskSize: "cover",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }
        }
      >
        {children || <div className="absolute inset-0" />}
      </div>
    </>
  );
}
