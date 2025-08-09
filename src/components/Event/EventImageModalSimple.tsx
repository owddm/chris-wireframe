import { useEffect, useMemo, useRef, useState } from "react";

import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";

import type { EventEnriched, GalleryImage } from "@/content";
import { formatDate } from "@/utils/formatDate";

import Container from "../Common/Container";

interface Props {
  isOpen: boolean;
  selectedImage: GalleryImage | null;
  event: EventEnriched;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  currentIndex: number;
  totalImages: number;
  allImages: GalleryImage[];
}

export default function EventImageModal({
  isOpen,
  selectedImage,
  event,
  onClose,
  onPrevious,
  onNext,
  onDotClick,
  currentIndex,
  totalImages,
  allImages,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Calculate previous and next image URLs for prefetching
  const { prevImageUrl, nextImageUrl } = useMemo(() => {
    const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;

    return {
      prevImageUrl: allImages[prevIndex]?.full.src,
      nextImageUrl: allImages[nextIndex]?.full.src,
    };
  }, [currentIndex, totalImages, allImages]);

  // Prefetch previous and next images
  useEffect(() => {
    if (!isOpen) return;

    const preloadedImages: HTMLImageElement[] = [];

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
    };

    if (prevImageUrl) {
      preloadImage(prevImageUrl);
    }

    if (nextImageUrl) {
      preloadImage(nextImageUrl);
    }
  }, [isOpen, prevImageUrl, nextImageUrl]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  // Reset full image loaded state when image changes
  useEffect(() => {
    setIsFullImageLoaded(false);
    if (selectedImage) {
      const img = new Image();
      img.src = selectedImage.full.src;
      img.onload = () => setIsFullImageLoaded(true);
    }
  }, [selectedImage]);

  // Handle both touch and mouse events for swipe/drag navigation
  const handlePointerStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    startX.current = clientX;
    startY.current = clientY;
    isDragging.current = true;

    // Prevent text selection during drag
    if (!("touches" in e)) {
      e.preventDefault();
    }
  };

  const handlePointerEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX.current === null || startY.current === null || !isDragging.current) return;

    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;

    const deltaX = clientX - startX.current;
    const deltaY = clientY - startY.current;

    // Only trigger swipe if horizontal movement is greater than vertical
    // and the swipe distance is significant (more than 50px)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        onPrevious();
      } else {
        // Swipe left - go to next image
        onNext();
      }
    }

    startX.current = null;
    startY.current = null;
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    // Reset if mouse leaves the area while dragging
    startX.current = null;
    startY.current = null;
    isDragging.current = false;
  };

  // Calculate which dots to show (max 10)
  const maxDots = 10;
  const dotsToShow = Math.min(totalImages, maxDots);
  const halfDots = Math.floor(dotsToShow / 2);

  let startDot = 0;
  let endDot = totalImages;

  if (totalImages > maxDots) {
    if (currentIndex < halfDots) {
      // Near the beginning
      startDot = 0;
      endDot = maxDots;
    } else if (currentIndex >= totalImages - halfDots) {
      // Near the end
      startDot = totalImages - maxDots;
      endDot = totalImages;
    } else {
      // In the middle
      startDot = currentIndex - halfDots;
      endDot = currentIndex + halfDots + (dotsToShow % 2);
    }
  }

  if (!isOpen || !selectedImage) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${isOpen ? "modal-open" : ""} transition-opacity duration-300`}
      style={{ opacity: isOpen ? 1 : 0 }}
      data-testid="image-modal"
      onClick={(e) => {
        // Close modal if clicked outside content
        if (e.target === e.currentTarget || e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="bg-black/2- fixed inset-0 z-[9999] flex flex-col">
        {/* Header with title and close button - flexible height */}
        <Container wide>
          <div className="flex min-h-[60px] items-start justify-between p-4 backdrop-blur-sm">
            <div className="flex flex-1 flex-col gap-1 pr-4">
              <h3 className="text-lg font-semibold text-white drop-shadow-lg sm:text-xl">
                {event.data.title}
              </h3>
              <span className="text-sm text-white/80 sm:text-base">
                {formatDate(event.data.dateTime, "long")}
              </span>
            </div>
            <button
              className="cursor-pointer p-2 text-white transition-colors hover:text-white/80"
              onClick={onClose}
              aria-label="Close modal"
            >
              <LuX size={28} />
            </button>
          </div>
        </Container>

        {/* Main content area - takes remaining space */}
        <div className="group relative flex flex-1 items-center justify-center overflow-hidden">
          {/* Left navigation arrow - fixed position */}
          <button
            className="absolute left-2 z-20 cursor-pointer rounded-full bg-black/50 p-3 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70 sm:left-4"
            onClick={onPrevious}
            aria-label="Previous image"
          >
            <LuChevronLeft size={28} />
          </button>

          {/* Right navigation arrow - fixed position */}
          <button
            className="absolute right-2 z-20 cursor-pointer rounded-full bg-black/50 p-3 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70 sm:right-4"
            onClick={onNext}
            aria-label="Next image"
          >
            <LuChevronRight size={28} />
          </button>

          {/* Image container - fills available space */}
          <div
            className="relative h-full w-full cursor-grab active:cursor-grabbing"
            onTouchStart={handlePointerStart}
            onTouchEnd={handlePointerEnd}
            onMouseDown={handlePointerStart}
            onMouseUp={handlePointerEnd}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={isFullImageLoaded ? selectedImage.full.src : selectedImage.thumbnail.src}
              srcSet={
                isFullImageLoaded ? selectedImage.full.srcSet : selectedImage.thumbnail.srcSet
              }
              sizes={isFullImageLoaded ? selectedImage.full.sizes : selectedImage.thumbnail.sizes}
              alt={selectedImage.data.caption ?? ""}
              className="pointer-events-none h-full w-full object-contain select-none"
              data-testid="modal-main-image"
              draggable={false}
            />
            {/* Hidden preloader for full image */}
            {!isFullImageLoaded && (
              <img
                src={selectedImage.full.src}
                srcSet={selectedImage.full.srcSet}
                sizes={selectedImage.full.sizes}
                alt=""
                className="absolute h-0 w-0 opacity-0"
                onLoad={() => setIsFullImageLoaded(true)}
                aria-hidden="true"
              />
            )}

            {/* Caption overlay */}
            {selectedImage.data.caption && (
              <div className="absolute bottom-20 left-1/2 max-w-[90%] -translate-x-1/2 transform rounded-lg bg-black/80 px-4 py-2 backdrop-blur-sm sm:bottom-24">
                <p
                  data-testid="modal-image-caption"
                  className="text-center text-sm text-white sm:text-base"
                >
                  {selectedImage.data.caption}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom navigation dots - fixed height */}
        <div className="flex h-[60px] items-center justify-center gap-2 bg-black/90 backdrop-blur-sm">
          {totalImages > maxDots && startDot > 0 && (
            <span className="text-sm text-white/50">...</span>
          )}
          {Array.from({ length: endDot - startDot }).map((_, i) => {
            const index = startDot + i;
            return (
              <button
                key={index}
                onClick={() => onDotClick(index)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-white" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            );
          })}
          {totalImages > maxDots && endDot < totalImages && (
            <span className="text-sm text-white/50">...</span>
          )}
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={onClose}
          className="h-full w-full cursor-pointer"
          aria-label="Close modal"
        >
          <span className="sr-only">close</span>
        </button>
      </form>
    </dialog>
  );
}
