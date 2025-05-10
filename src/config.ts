const shortName = "OKWireframe";
const longName = "Osaka Kansai Wireframe Meetup Group";
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

export const MENU: { label: string; href: string; header?: boolean }[] = [
  {
    label: "Home",
    href: "/",
    header: false,
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Sitemap",
    href: "/sitemap",
    header: false,
  },
];

export const SOCIALS = [
  // {
  //   icon: "lucide:mail",
  //   href: "mailto:todo@example.com",
  //   label: "Email",
  //   description: "Send us a good old fashioned Email",
  // },
  {
    icon: "cib:twitter",
    href: "https://x.com/owddm",
    label: "X (Twitter)",
    description: "Follow us on X (formally Twitter)",
  },
  {
    icon: "cib:github",
    href: "https://github.com/owddm/owddm.comm",
    label: "GitHub",
    description: "Developers can watch us on Github",
  },
  {
    icon: "cib:discord",
    href: "/discord",
    label: "Discord",
    description: "Chat with us on our Discord Server",
  },
  {
    icon: "cib:meetup",
    href: "https://www.meetup.com/ja-JP/osaka-web-designers-and-developers-meetup/",
    label: "Meetup",
    description: "RSVP our next event on Meetup.com",
  },
] as const;

export const THEMES = [
  "abyss",
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
] as const;
