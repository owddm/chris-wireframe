import { FaDiscord } from "react-icons/fa6";
import { LuCalendar, LuFileText } from "react-icons/lu";

import BlobIconGrid, { type BlobIconGridItem } from "@/components/Common/BlobIconGrid";

export default function GetInvolved() {
  const items: BlobIconGridItem[] = [
    {
      type: "a",
      title: "Join the Discord",
      description: "Chat with our community",
      icon: FaDiscord,
      href: "/discord",
      target: "_blank",
      rel: "noopener noreferrer",
      // showTip: true,
    },
    {
      type: "calendar",
      title: "Subscribe to Calendar",
      description: "Never miss an event",
      icon: LuCalendar,
    },
    {
      type: "a",
      title: "Submit a Proposal",
      description: "Share your ideas",
      icon: LuFileText,
      href: "https://github.com/owddm/owddm.com/discussions/new?category=events",
      target: "_blank",
      rel: "noopener noreferrer",
      testId: "proposal-cta",
    },
  ];

  return <BlobIconGrid items={items} />;
}
