import { useEffect, useState } from "react";

import { LuImageOff } from "react-icons/lu";

import Grid from "@/components/Common/Grid";
import type { EventEnriched } from "@/content";
import { isEventUpcoming } from "@/utils/eventFilters";

import EventImageModal from "./EventImageModalSimple";

interface Props {
  event: EventEnriched;
  class?: string;
}

export default function EventGalleryImages({ event }: Props) {
  const galleryImages = event.galleryImages || [];
  const reversedImages = galleryImages.slice().reverse();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if event is upcoming (using the 30-minute buffer logic)
  const isUpcoming = isEventUpcoming(event);

  if (isUpcoming || galleryImages.length === 0) {
    return (
      <div className="text-base-content/40 m-auto flex items-center gap-3">
        <LuImageOff className="h-6 w-6" />
        <span>
          {isUpcoming
            ? "Gallery will be available after the event"
            : "This event doesn't have a gallery yet"}
        </span>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIndex(null), 300); // Delay to allow fade out
  };

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? reversedImages.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === reversedImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Disable sticky nav keyboard shortcuts when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Dispatch event to disable sticky nav
      const event = new CustomEvent("gallery-modal-toggle", { detail: { open: true } });
      window.dispatchEvent(event);
    } else {
      // Re-enable sticky nav
      const event = new CustomEvent("gallery-modal-toggle", { detail: { open: false } });
      window.dispatchEvent(event);
    }

    return () => {
      // Ensure sticky nav is re-enabled on unmount
      const event = new CustomEvent("gallery-modal-toggle", { detail: { open: false } });
      window.dispatchEvent(event);
    };
  }, [isModalOpen]);

  const selectedImage = selectedIndex !== null ? reversedImages[selectedIndex] : null;

  return (
    <>
      <Grid>
        {reversedImages.map((img, index) => (
          <button
            key={img.id}
            onClick={() => handleImageClick(index)}
            className="glass-border rounded-box w-full overflow-hidden"
            type="button"
            aria-label={`View larger image: ${img.data.caption ?? ""}`}
            data-testid={`gallery-image-${index}`}
          >
            <img
              src={img.thumbnail.src}
              srcSet={img.thumbnail.srcSet}
              sizes={img.thumbnail.sizes}
              alt={img.data.caption ?? ""}
              className="bg-base-300 aspect-[4/3] w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
              loading="lazy"
              width={320}
              height={240}
            />
          </button>
        ))}
      </Grid>
      <EventImageModal
        allImages={galleryImages}
        isOpen={isModalOpen}
        selectedImage={selectedImage}
        event={event}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onDotClick={handleDotClick}
        currentIndex={selectedIndex ?? 0}
        totalImages={reversedImages.length}
      />
    </>
  );
}
