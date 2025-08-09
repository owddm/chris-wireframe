import { themeColorsHex } from "@/utils/og/theme-colors";
import { twMerge, twStyle } from "@/utils/og/tw";

import OGLayout from "./OGLayout";

export default function OGDefault() {
  const colors = themeColorsHex.light;

  return (
    <OGLayout title="OKTech" subtitle="Osaka Kansai Tech Community">
      <div style={twStyle("flex flex-col gap-4")}>
        <p
          style={twMerge("text-xl leading-relaxed", {
            color: colors.baseContent,
            opacity: 0.7,
          })}
        >
          Join our vibrant tech community for meetups, workshops, and events in Osaka and Kansai.
        </p>
      </div>
    </OGLayout>
  );
}
