import { LuCalendar, LuCalendarDays, LuMapPin, LuUsers } from "react-icons/lu";

import BlobSlideshow from "@/components/Common/BlobSlideshow";

interface Stat {
  title: string;
  value: string;
  icon: React.ElementType;
}

interface LandingStatsSlideshowProps {
  totalEvents: number;
  uniqueVenues: number;
}

export default function LandingStatsSlideshow({
  totalEvents,
  uniqueVenues,
}: LandingStatsSlideshowProps) {
  const stats: Stat[] = [
    {
      title: "First Event",
      value: "2014",
      icon: LuCalendar,
    },
    {
      title: "Total Events",
      value: totalEvents.toString(),
      icon: LuCalendarDays,
    },
    {
      title: "Locations",
      value: uniqueVenues.toString() + "+",
      icon: LuMapPin,
    },
    {
      title: "Participants",
      value: "2000+",
      icon: LuUsers,
    },
  ];
  const renderer = (stat: Stat) => {
    const Icon = stat.icon;

    return (
      <div className="bg-primary text-primary-content flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <Icon className="h-20 w-20" />
          <div className="flex flex-col items-center justify-center">
            <div className="font-header text-5xl font-bold">{stat.value}</div>
            <div className="text-lg tracking-wider whitespace-nowrap uppercase">{stat.title}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BlobSlideshow
      data={stats}
      blobOffset={1}
      renderer={renderer}
      slideDelay={1500}
      containerClassName="aspect-square"
    />
  );
}
