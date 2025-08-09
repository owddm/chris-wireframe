import React from "react";

import { twj } from "tw-to-css";

// Helper function to convert Tailwind classes to style object
export function twStyle(className: string): React.CSSProperties {
  return twj(className);
}

// Helper to merge tw styles with custom styles
export function twMerge(className: string, style?: React.CSSProperties): React.CSSProperties {
  return { ...twj(className), ...style };
}
