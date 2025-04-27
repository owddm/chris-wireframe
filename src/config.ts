const name = "OKWireframe";

export const SITE = {
  name,
  title: {
    default: name,
    template: "%s - " + name,
  },
} as const;

export const MENU = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Events",
    href: "/events",
  },
] as const;

export const SOCIALS = [
  {
    icon: "cib:twitter",
    href: "https://x.com/owddm",
    label: "X (Twitter)",
  },
  {
    icon: "cib:github",
    href: "https://github.com/owddm/owddm.comm",
    label: "GitHub",
  },
  {
    icon: "cib:discord",
    href: "https://discord.com/invite/k8xj8d75f6",
    label: "Discord",
  },
  {
    icon: "cib:meetup",
    href: "https://www.meetup.com/ja-JP/osaka-web-designers-and-developers-meetup/",
    label: "Meetup",
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
