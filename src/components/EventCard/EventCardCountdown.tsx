"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";
import { LuCalendarClock } from "react-icons/lu";

import type { EventEnriched } from "@/content";
import { isEventRecent } from "@/utils/eventFilters";

const BADGE_BASE = "badge";
const DEFAULT_BADGE_CLASS = `${BADGE_BASE} badge-accent`;
const LIVE_BADGE_CLASS = `${BADGE_BASE} badge-info`;

interface EventCardCountdownProps {
  event: EventEnriched;
  className?: string;
  wrapper?: (children: React.ReactNode) => React.ReactNode;
}

export default function EventCardCountdown({
  event,
  className = "badge-lg",
  wrapper,
}: EventCardCountdownProps) {
  const [timeString, setTimeString] = useState<string>("");
  const [badgeClass, setBadgeClass] = useState<string>(DEFAULT_BADGE_CLASS);

  useEffect(() => {
    // Check if event has ended (including buffer)
    if (isEventRecent(event)) {
      setTimeString("");
      return;
    }

    let intervalId: NodeJS.Timeout;

    const calculateTime = () => {
      // Re-check if event has ended
      if (isEventRecent(event)) {
        setTimeString("");
        if (intervalId) clearInterval(intervalId);
        return;
      }

      const now = new Date().getTime();
      const start = new Date(event.data.dateTime).getTime();

      const isUpcoming = now < start;
      const difference = isUpcoming ? start - now : now - start;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeStr = "";
      if (days > 0) {
        timeStr = isUpcoming
          ? `Starts in ${days} ${days === 1 ? "day" : "days"}`
          : `Started ${days} ${days === 1 ? "day" : "days"} ago`;
      } else if (hours > 0) {
        timeStr = isUpcoming
          ? `Starts in ${hours} ${hours === 1 ? "hour" : "hours"}`
          : `Started ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
      } else if (minutes > 0) {
        timeStr = isUpcoming
          ? `Starts in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`
          : `Started ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
      } else {
        timeStr = isUpcoming
          ? `Starts in ${seconds} ${seconds === 1 ? "second" : "seconds"}`
          : `Started ${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
      }

      setTimeString(timeStr);
      setBadgeClass(isUpcoming ? DEFAULT_BADGE_CLASS : LIVE_BADGE_CLASS);

      // Adjust interval based on time remaining/elapsed
      const totalHours = days * 24 + hours;
      const newInterval = totalHours >= 3 ? 60000 : 1000; // 1 minute if 3+ hours, otherwise 1 second

      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(calculateTime, newInterval);
    };

    calculateTime();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [event.data.dateTime, event.data.duration]);

  if (!timeString) return null;

  const content = (
    <div className={clsx(badgeClass, "flex items-center gap-2", className)}>
      <LuCalendarClock />
      {timeString}
    </div>
  );

  return wrapper ? <>{wrapper(content)}</> : content;
}
