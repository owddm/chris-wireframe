import { OKTechLogoRound } from "@/components/Common/OKTechLogo";
import { SITE } from "@/constants";

interface BrandProps {
  fullText?: boolean;
  neutral?: boolean;
}

export default function Brand({ fullText = false }: BrandProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <OKTechLogoRound
          className={
            "h-6 w-6 transition-transform duration-[1000ms] ease-in-out group-hover:-rotate-12 sm:h-8 sm:w-8"
          }
        />
        <h1 className="text-lg font-bold tracking-tighter sm:text-2xl">OKTech</h1>
      </div>
      {fullText && <span className="font-header text-sm">{SITE.longName}</span>}
    </div>
  );
}
