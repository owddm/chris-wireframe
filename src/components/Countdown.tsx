import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-5">
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.days } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.days} days`}
          >
            {timeLeft.days}
          </span>
        </span>
        days
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.hours } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.hours} hours`}
          >
            {timeLeft.hours}
          </span>
        </span>
        hours
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.minutes } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.minutes} minutes`}
          >
            {timeLeft.minutes}
          </span>
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.seconds } as React.CSSProperties}
            aria-live="polite"
            aria-label={`${timeLeft.seconds} seconds`}
          >
            {timeLeft.seconds}
          </span>
        </span>
        sec
      </div>
    </div>
  );
}
