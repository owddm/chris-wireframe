import React from "react";

import { themeColorsHex } from "@/utils/og/theme-colors";
import { twMerge, twStyle } from "@/utils/og/tw";

import OGBrand from "./OGBrand";

interface OGLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function OGLayout({ children, title, subtitle }: OGLayoutProps) {
  // Use light theme colors for OG images
  const colors = themeColorsHex.light;

  return (
    <div
      style={twMerge("h-full w-full flex flex-col", {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors["base-100"],
        color: colors.baseContent,
        fontFamily: "'Noto Sans', sans-serif",
      })}
    >
      {/* Main container */}
      <div style={twStyle("flex flex-col flex-1 p-[60px]")}>
        {/* Header */}
        {/* Header with Brand component */}
        <div style={twStyle("flex justify-start items-center mb-8")}>
          <OGBrand size={40} showText={true} theme="light" />
        </div>

        {/* Content area */}
        <div style={twStyle("flex-1 flex flex-col justify-center max-w-[1000px]")}>
          {/* Title if provided */}
          {title && (
            <h1
              style={twMerge(
                `font-bold leading-tight tracking-tight ${
                  title.length > 50 ? "text-[48px]" : "text-[64px]"
                } ${subtitle ? "mb-6" : "mb-8"}`,
                {
                  color: colors.baseContent,
                  fontFamily: "'Lexend', sans-serif",
                  fontWeight: 700,
                },
              )}
            >
              {title}
            </h1>
          )}

          {/* Subtitle if provided */}
          {subtitle && (
            <p
              style={twMerge("text-[24px] leading-relaxed mb-8", {
                color: colors.baseContent,
                opacity: 0.8,
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 400,
              })}
            >
              {subtitle}
            </p>
          )}

          {/* Children content */}
          <div style={twStyle("flex flex-col")}>{children}</div>
        </div>

        {/* Simple footer */}
        <div style={twStyle("flex items-center justify-between mt-auto pt-8")}>
          <span
            style={twMerge("text-sm", {
              color: colors.baseContent,
              opacity: 0.5,
              fontFamily: "'Noto Sans', sans-serif",
            })}
          >
            Technology Meetup Group in Kansai - Osaka, Kyoto, Kobe, Hyogo
          </span>
        </div>
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
  <div style={twStyle("flex items-center gap-3")}>{children}</div>
);
