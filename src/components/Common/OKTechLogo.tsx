import logoRoundSvg from "@/assets/oktech-logo-round.svg?raw";
import ScopedSVG from "@/components/Common/ScopedSVG";

interface OKTechLogoProps {
  className?: string;
  svgClass?: string;
}
export function OKTechLogoRound({ className, svgClass }: OKTechLogoProps) {
  return <ScopedSVG svg={logoRoundSvg} className={className} svgClass={svgClass} />;
}
