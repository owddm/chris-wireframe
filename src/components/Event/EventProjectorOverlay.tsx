import { useEffect } from "react";

import { LuCalendar } from "react-icons/lu";

import Brand from "@/components/Common/Brand";
import type { EventEnriched } from "@/content";
import { formatDate, formatTime } from "@/utils/formatDate";

interface EventProjectorOverlayProps {
  event: EventEnriched;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventProjectorOverlay({
  event,
  isOpen,
  onClose,
}: EventProjectorOverlayProps) {
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const elem = document.getElementById("projector-overlay");
        if (elem && !document.fullscreenElement) {
          await elem.requestFullscreen();
        }
      } catch (err) {
        console.error("Error attempting to enter fullscreen:", err);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleFullscreenChange = () => {
      // If we're no longer in fullscreen, close the overlay
      if (!document.fullscreenElement && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      enterFullscreen();
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedDate = formatDate(event.data.dateTime, "long");
  const formattedTime = formatTime(event.data.dateTime);

  return (
    <div
      id="projector-overlay"
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black"
      data-theme="night"
      data-testid="projector-overlay"
    >
      <div
        className="from-primary to-secondary text-base-100 relative flex bg-gradient-to-br"
        style={{
          width: "100vw",
          height: "calc(100vw * 9 / 16)",
          maxHeight: "100vh",
          maxWidth: "calc(100vh * 16 / 9)",
          padding: "4vw",
          fontSize: "1vw",
        }}
      >
        {/* Left Column */}
        <div className="flex flex-1 flex-col justify-between" style={{ paddingRight: "2vw" }}>
          {/* Top: Title and Description */}
          <div className="flex flex-col" style={{ gap: "2vw" }}>
            <h1
              className="line-clamp-3 leading-tight font-bold"
              style={{ fontSize: "5vw" }}
              data-testid="projector-title"
            >
              {event.data.title}
            </h1>

            {event.data.topics && event.data.topics.length > 0 && (
              <p
                className="line-clamp-2 opacity-80"
                style={{ fontSize: "2vw" }}
                data-testid="projector-topics"
              >
                {event.data.topics.join(" • ")}
              </p>
            )}
          </div>

          {/* Bottom: Date/Time */}
          <div className="flex items-center" style={{ gap: "1.5vw" }}>
            <div
              className="bg-base-100/20 rounded-box flex flex-shrink-0 items-center justify-center"
              style={{ padding: "1vw" }}
            >
              <LuCalendar className="text-base-100" style={{ width: "2vw", height: "2vw" }} />
            </div>
            <span
              className="overflow-hidden font-medium text-ellipsis whitespace-nowrap"
              style={{ fontSize: "2vw" }}
              data-testid="projector-datetime"
            >
              {formattedDate} • {formattedTime}
              {event.data.duration && (
                <span className="opacity-70" style={{ fontSize: "1.5vw" }}>
                  {" "}
                  ({event.data.duration / 60} hours)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-shrink-0 flex-col justify-between" style={{ width: "25vw" }}>
          {/* Top: Branding */}
          <div className="flex justify-end">
            <div className="transform" style={{ scale: "calc(3vw / 48)" }}>
              <Brand />
            </div>
          </div>

          {/* Bottom: Venue Info */}
          {event.venue && (
            <div className="self-end" style={{ width: "20vw" }}>
              <div className="bg-base-100/20 rounded-box shadow-2xl" style={{ padding: "1.5vw" }}>
                <h3
                  className="font-bold"
                  style={{ fontSize: "1.5vw", marginBottom: "0.5vw" }}
                  data-testid="projector-venue-title"
                >
                  {event.venue.title}
                </h3>
                {event.venue.address && (
                  <p
                    className="opacity-80"
                    style={{ fontSize: "1.2vw" }}
                    data-testid="projector-venue-address"
                  >
                    {event.venue.address}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
