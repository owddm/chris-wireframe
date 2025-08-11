import React from "react";

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

  return (
    <>
      <svg
        width="0"
        height="0"
        className="absolute"
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={maskId} clipPathUnits="objectBoundingBox">
            <path
              transform="translate(0 0) scale(0.01)"
              d={blobPath}
              style={{
                transition: `d ${transitionSpeed}ms cubic-bezier(0.68,-0.55,0.265,1.55)`,
                WebkitTransition: `d ${transitionSpeed}ms cubic-bezier(0.68,-0.55,0.265,1.55)`,
              }}
            />
          </clipPath>
        </defs>
      </svg>
      <div
        className={className}
        style={{
          clipPath: `url(#${maskId})`,
          WebkitClipPath: `url(#${maskId})`,
        }}
      >
        {children}
      </div>
    </>
  );
}
