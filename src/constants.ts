import type { ComponentType } from "react";

import type { IconType } from "react-icons";
import { FaDiscord, FaGithub, FaLinkedin, FaMeetup } from "react-icons/fa6";
import { LuCalendar, LuFileText, LuHouse, LuInfo, LuMap } from "react-icons/lu";

// Development mode flag - change this to false for production
export const DEV_MODE = true;

const shortName = "OKTech";
const longName = "Technology Meetup Group in Kansai - Osaka, Kyoto, Kobe, Hyogo";
const name = `${shortName} - ${longName}`;

export const SITE = {
  name,
  shortName,
  longName,
  title: {
    default: name,
    template: "%s - " + name,
  },
} as const;

export const MENU: {
  label: string;
  href: string;
  header?: boolean;
  icon?: IconType;
  footerMajor?: boolean;
  footerMinor?: boolean;
  component?: ComponentType<{ label: string; href: string; icon?: IconType }>;
  target?: string;
}[] = [
  {
    label: "Home",
    href: "/",
    footerMajor: true,
    icon: LuHouse,
  },
  {
    label: "Events",
    href: "/events",
    header: true,
    footerMajor: true,
    icon: LuCalendar,
  },
  {
    label: "About",
    href: "/about",
    header: true,
    footerMajor: true,
    icon: LuInfo,
  },
  {
    label: "Code of Conduct",
    href: "/code-of-conduct",
    icon: LuFileText,
    footerMinor: true,
  },
  {
    label: "Sitemap",
    href: "/sitemap",
    footerMinor: true,
    icon: LuMap,
  },
];

export const SOCIALS = [
  {
    icon: FaDiscord,
    href: "/discord",
    label: "Discord",
    description: "Join our server for real-time discussions - most of the action happens here",
  },
  {
    icon: FaMeetup,
    href: "https://www.meetup.com/osaka-web-designers-and-developers-meetup/",
    label: "Meetup",
    description: "RSVP for upcoming events connect IRL",
  },
  {
    icon: FaGithub,
    href: "https://github.com/owddm/owddm.com",
    label: "GitHub",
    description: "Our open-source projects and this website's source code",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/owddm-kwddm",
    label: "LinkedIn",
    description: "For the professionals to connect and explore career opportunities",
  },
  {
    icon: LuCalendar,
    href: "#",
    label: "Calendar Subscription",
    description: "Subscribe to our event calendar and RSS feeds",
    type: "calendar" as const,
  },
] as const;
