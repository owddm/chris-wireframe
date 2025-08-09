import clsx from "clsx";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface CityBadgeProps {
  city: string | undefined;
  className?: string;
}

export default function CityBadge({ city, className }: CityBadgeProps) {
  if (!city) return null;

  const cityLower = city.toLowerCase();
  return (
    <span
      className={clsx(
        cityLower === "osaka" && "badge badge-error",
        cityLower === "kyoto" && "badge badge-warning",
        cityLower === "kobe" && "badge badge-success",
        className,
      )}
    >
      {capitalize(city)}
    </span>
  );
}
