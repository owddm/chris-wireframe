import React, { useState } from "react";

import clsx from "clsx";
import { PiArrowArcRightBold } from "react-icons/pi";

import BlobMask from "@/components/Common/BlobMask";
import useBloop from "@/hooks/useBloop";
import { BLOBS } from "@/utils/blobs";

interface BlobCardProps {
  children: React.ReactNode;
  preset?: number;
  className?: string;
  bgClass?: string;
  transitionSpeed?: number;
  showTip?: boolean;
}

// Define preset groups with non-repeating blob indices
const BLOB_PRESETS = [
  [1, 2, 0],
  [3, 4, 5],
  [6, 7, 8],
  [2, 3, 4],
  [5, 4, 1],
  [7, 1, 3],
];

export default function BlobCard({
  children,
  preset = 0,
  className = "",
  bgClass = "bg-primary/20 group-hover:bg-primary/40 group-active:bg-primary/60",
  transitionSpeed = 300,
  showTip = false,
}: BlobCardProps) {
  const uniqueId = React.useId();
  const [currentState, setCurrentState] = useState<"default" | "hover" | "active">("default");
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const playBloopHover = useBloop({ preset: 15 }); // Reverse bass for hover
  const playBloopActive = useBloop({ preset: 27 }); // Zap for active/click
  const activeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount
  React.useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Get the preset group, cycling through available presets
  const presetGroup = BLOB_PRESETS[preset % BLOB_PRESETS.length];

  // Get blob indices for each state from the preset group
  const [defaultIndex, hoverIndex, activeIndex] = presetGroup.map((idx) => idx % BLOBS.length);

  const getCurrentPath = () => {
    switch (currentState) {
      case "hover":
        return BLOBS[hoverIndex];
      case "active":
        return BLOBS[activeIndex];
      default:
        return BLOBS[defaultIndex];
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (currentState !== "active") {
      setCurrentState("hover");
      playBloopHover();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (currentState !== "active") {
      setCurrentState("default");
    }
  };

  const handleInteractionStart = () => {
    // Clear any existing timeout
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
    }

    setCurrentState("active");
    playBloopActive();

    // Keep active state for 500ms, then return to hover if still hovering
    activeTimeoutRef.current = setTimeout(() => {
      setCurrentState(isHovering ? "hover" : "default");
    }, 500);
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={clsx("group relative", className)}>
      {/* Tap to boop tip - outside the margin-affected container */}
      {showTip && (
        <div className="text-primary-content/50 pointer-events-none absolute -top-10 -left-12 z-20 animate-bounce">
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap">{isMobile ? "Tap" : "Click"} to Bloop</span>
            <PiArrowArcRightBold className="h-5 w-5 rotate-45" />
          </div>
        </div>
      )}

      {/* Inner container with margin changes */}
      <div
        className={clsx(
          "relative h-full transition-all duration-300",
          currentState === "active" ? "-m-10" : currentState === "hover" ? "-m-8" : "-m-4",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
      >
        {/* Background layer with clipping mask */}
        <BlobMask
          id={uniqueId}
          blobPath={getCurrentPath()}
          transitionSpeed={transitionSpeed}
          className={clsx(
            "pointer-events-none absolute inset-0 z-0 transition-all duration-300",
            bgClass,
          )}
        />

        {/* Content layer */}
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    </div>
  );
}
