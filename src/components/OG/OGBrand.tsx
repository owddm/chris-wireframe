import { themeColorsHex } from "@/utils/og/theme-colors";

interface OGBrandProps {
  size?: number;
  showText?: boolean;
  theme?: "light" | "dark";
}

// TODO replace this!

export default function OGBrand({ size = 32, showText = true, theme = "light" }: OGBrandProps) {
  const colors = themeColorsHex[theme];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: showText ? "12px" : "0",
      }}
    >
      {/* OKTech Logo SVG - inline for Satori compatibility */}
      <svg width={size} height={size} viewBox="0 0 157 157" style={{ display: "block" }}>
        <g stroke="none" strokeWidth="1" fillRule="evenodd">
          {/* Ring */}
          <path
            fill={colors.primary}
            d="M78.6416999,0.775587316 C121.250957,0.775587316 155.792584,35.3172147 155.792584,77.9264714 C155.792584,120.535728 121.250957,155.077355 78.6416999,155.077355 C36.0324432,155.077355 1.49081583,120.535728 1.49081583,77.9264714 C1.49081583,35.3172147 36.0324432,0.775587316 78.6416999,0.775587316 Z M78.64,13.78 C43.2109333,13.78 14.49,42.5009333 14.49,77.93 C14.49,113.359067 43.2109333,142.08 78.64,142.08 C114.069067,142.08 142.79,113.359067 142.79,77.93 C142.79,42.5009333 114.069067,13.78 78.64,13.78 Z"
          />
          {/* Base section */}
          <path
            fill={colors.baseContent}
            d="M72.9991041,25.5786396 L72.9991041,130.28136 C46.5737967,127.466701 25.99,105.102152 25.99,77.93 C25.99,50.7578479 46.5737967,28.3932991 72.9991041,25.5786396 Z"
          />
          {/* Color sections - using accent colors */}
          <path
            fill={colors.error}
            d="M83.9998895,25.5494683 C98.8013796,27.0460241 111.792182,34.6734268 120.393653,45.853032 L83.9998895,66.805 L83.9998895,25.5494683 Z"
          />
          <path
            fill={colors.success}
            d="M126.157195,55.2270193 C129.447457,62.101115 131.29,69.800383 131.29,77.93 C131.29,85.9462097 129.498505,93.5439933 126.294045,100.344821 L87.043,77.746 L126.157195,55.2270193 Z"
          />
          <path
            fill={colors.info}
            d="M83.9998895,88.686 L120.589014,109.751447 C111.989547,121.070277 98.9138761,128.802602 83.9998895,130.310532 L83.9998895,88.686 Z"
          />
        </g>
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 700,
            fontSize: size * 0.75,
            color: colors.baseContent,
          }}
        >
          OKTech
        </span>
      )}
    </div>
  );
}
