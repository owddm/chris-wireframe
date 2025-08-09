import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { animated, useSpring } from "@react-spring/web";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  maxOffset?: string;
}

export default function Parallax({ children, className = "", maxOffset = "8rem" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [springs, api] = useSpring(() => ({
    y: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 120,
    },
  }));

  useEffect(() => {
    // Reason: Convert CSS units to pixels
    const convertToPixels = (value: string) => {
      const temp = document.createElement("div");
      temp.style.position = "absolute";
      temp.style.height = value;
      document.body.appendChild(temp);
      const pixels = temp.offsetHeight;
      document.body.removeChild(temp);
      return pixels;
    };

    const maxOffsetPx = convertToPixels(maxOffset);

    const handleScroll = () => {
      if (!ref.current) return;

      const scrollY = window.scrollY;

      // Reason: Simple parallax based only on scroll position
      const parallaxSpeed = 0.2;
      const offset = Math.min(scrollY * parallaxSpeed, maxOffsetPx);

      api.start({ y: offset });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Reason: Initial calculation on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [api, maxOffset]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <animated.div
        style={{
          transform: springs.y.to((y) => `translate3d(0, ${y}px, 0)`),
          willChange: "transform",
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}
