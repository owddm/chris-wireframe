import GalleryDisclaimer from "@/components/Common/GalleryDisclaimer";
import type { EventEnriched } from "@/content";

import SimpleSection from "../Common/SimpleSection";
import EventGalleryImages from "./EventGalleryImages";

interface Props {
  event: EventEnriched;
  class?: string;
}

export default function EventGallery({ event }: Props) {
  const galleryImages = event.galleryImages || [];

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <SimpleSection wide grid title={"Event Gallery"} element={<GalleryDisclaimer />}>
      <EventGalleryImages event={event} />
    </SimpleSection>
  );
}
