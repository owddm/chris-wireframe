import { faker } from "@faker-js/faker";
import { THEMES } from "./config";

export const FAKER_COUNT = 99;

// Predefined lists
const PROGRAMMING_LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Rust",
  "Go",
  "Ruby",
  "PHP",
  "Swift",
];

export const ROLE_CONFIGS = {
  volunteer: {
    label: "Volunteer",
    plural: "Volunteers",
    description: "Supporting events with hands-on help",
    color: "badge-accent",
    icon: "lucide:hand",
  },
  speaker: {
    label: "Speaker",
    plural: "Speakers",
    description: "Sharing knowledge through engaging presentations",
    color: "badge-error",
    icon: "lucide:mic",
  },
  organizer: {
    label: "Organizer",
    plural: "Organizers",
    description: "Leading and coordinating community initiatives",
    color: "badge-warning",
    icon: "lucide:users",
  },
} as const;

export type Role = keyof typeof ROLE_CONFIGS;
export const POSSIBLE_ROLES = Object.keys(ROLE_CONFIGS) as Role[];

export type Member = {
  id: string;
  gender: ReturnType<typeof faker.person.sexType>;
  name: string;
  jobTitle: string;
  company: string;
  department: string;
  bio: string;
  avatar: string;
  skills: string[];
  location: string;
  email: string;
  roles: Role[];
  theme: string;
  events: Event[];
  links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  coverImage: string;
  speakers: Member[];
  url?: string;
  gallery?: {
    src: string;
    description: string;
  }[];
};

function generateMember(id: string): Member {
  // Seed faker with the member ID to get consistent data
  faker.seed(parseInt(id.replace(/\D/g, "") || "0", 10));

  // Determine if this should be an anonymous/GitHub-style user (roughly 20% chance)
  const isAnonymous = faker.number.int(100) < 20;

  // Generate username once to use consistently across profile
  const username = faker.internet.username().toLowerCase();

  // First determine gender for consistency using the type-safe method
  const gender = faker.person.sexType();

  // Generate 2-3 paragraphs of text
  const paragraphs = faker.helpers.multiple(() => faker.lorem.paragraph(), {
    count: { min: 2, max: 3 },
  });

  // Format the bio with markdown
  const bio =
    paragraphs.map((p) => `${p}\n\n`).join("") +
    `### Skills & Interests\n\n` +
    `* ${faker.lorem.words(3)}\n` +
    `* ${faker.lorem.words(2)}\n` +
    `* ${faker.lorem.words(4)}\n\n` +
    `> ${faker.lorem.sentence()}`;

  // For anonymous users, use generic avatar
  const avatar = isAnonymous
    ? faker.image.avatarGitHub()
    : faker.image.personPortrait({ sex: gender });

  // For anonymous users, use username as display name
  const name = isAnonymous ? username : faker.person.fullName({ sex: gender });

  return {
    id,
    gender,
    name,
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    department: faker.commerce.department(),
    bio,
    avatar,
    skills: faker.helpers.arrayElements(PROGRAMMING_LANGUAGES, { min: 0, max: 8 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    email: faker.internet.email(),
    roles: faker.helpers.arrayElements(POSSIBLE_ROLES, { min: 0, max: 3 }),
    theme: faker.helpers.arrayElement(THEMES),
    events: [],
    links: {
      github: faker.helpers.maybe(() => `https://github.com/${username}`),
      twitter: faker.helpers.maybe(() => `https://twitter.com/${username}`),
      linkedin: faker.helpers.maybe(() => `https://linkedin.com/in/${username}`),
      website: faker.helpers.maybe(() => `https://${username}.dev`),
    },
  };
}

function generateEvent(id: string): Event {
  // Seed faker with the event ID to get consistent data
  faker.seed(parseInt(id.replace(/\D/g, "") || "0", 10));

  // Generate gallery with 0 or 4-20 images
  const hasGallery = faker.number.int(100) < 80; // 80% chance of having a gallery
  const galleryCount = hasGallery ? faker.number.int({ min: 4, max: 20 }) : 0;
  const gallery = hasGallery
    ? Array.from({ length: galleryCount }, () => ({
        src: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
        description: faker.lorem.sentence(),
      }))
    : undefined;

  return {
    id,
    title: faker.company.catchPhrase(),
    date: faker.date.future().toISOString(),
    time: faker.date.future().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    location: `${faker.location.city()} Convention Center`,
    description: faker.lorem.paragraph(),
    coverImage: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    speakers: [],
    gallery,
  };
}

export const members: Member[] = Array.from({ length: FAKER_COUNT }, (_, index) =>
  generateMember(index.toString()),
);

export const events: Event[] = Array.from({ length: FAKER_COUNT }, (_, index) =>
  generateEvent(index.toString()),
);

// for each event, atttach 1-4 random members, and add this event to the member's events array
events.forEach((event) => {
  event.speakers = faker.helpers.arrayElements(members, { min: 1, max: 4 });
  event.speakers.forEach((speaker) => {
    speaker.events.push(event);
    if (!speaker.roles.includes("speaker")) {
      speaker.roles.push("speaker");
    }
  });
});
