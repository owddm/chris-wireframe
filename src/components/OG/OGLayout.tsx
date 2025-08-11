import React from "react";

import { twj } from "tw-to-css";

import { themeColorsHex } from "@/utils/og/theme-colors";

import { OKTechLogoIcon, OKTechLogoText } from "../Common/OKTechLogo";

interface OGLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

function scale(scale: number, type: "icon" | "text"): { width: number; height: number } {
  const dimensions = {
    icon: { width: 100, height: 100 },
    text: { width: 274.88, height: 70.53 },
  };
  return {
    width: Math.round(dimensions[type].width * scale),
    height: Math.round(dimensions[type].height * scale),
  };
}

export default function OGLayout({}: OGLayoutProps) {
  // Use light theme colors for OG images
  // TODO use theme
  // const colors = themeColorsHex.light;

  return (
    <div
      style={{
        ...twj("h-full w-full flex flex-col justify-center items-center gap-10 text-slate-800"),
        background: "linear-gradient(to bottom, #ffe, #dde)",
      }}
    >
      {/* Header with Brand component */}
      <div style={twj("flex items-center justify-center")}>
        <div style={twj("flex justify-start items-center")}>
          <OKTechLogoIcon active style={scale(2.35, "icon")} />
          <OKTechLogoText style={scale(2.35, "text")} />
        </div>
      </div>
      {/* Content area */}

      {/* Simple footer */}
      <div style={twj("flex flex-col items-center justify-between ")}>
        <div style={twj("flex text-5xl")}>Technology Meetup Group in Kansai</div>
      </div>
    </div>
  );
}

// Common icon components for reuse
export const CalendarIcon = ({ color = themeColorsHex.light.baseContent }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <g>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </g>
  </svg>
);

export const LocationIcon = ({
  size = 24,
  color = themeColorsHex.light.baseContent,
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <g>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </g>
  </svg>
);

export const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={twj("flex items-center gap-3")}>{children}</div>
);
