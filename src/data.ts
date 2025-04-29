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

const POSSIBLE_ROLES = ["Volunteer", "Speaker", "Organizer"] as const;
export type Role = (typeof POSSIBLE_ROLES)[number];

export type Member = {
  id: string;
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
};

function generateMember(id: string): Member {
  // Seed faker with the member ID to get consistent data
  faker.seed(parseInt(id.replace(/\D/g, "") || "0", 10));

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

  return {
    id,
    name: faker.person.fullName(),
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    department: faker.commerce.department(),
    bio,
    avatar: faker.image.avatar(),
    skills: faker.helpers.arrayElements(PROGRAMMING_LANGUAGES, { min: 2, max: 4 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    email: faker.internet.email(),
    roles: faker.helpers.arrayElements(POSSIBLE_ROLES, { min: 0, max: 2 }),
    theme: faker.helpers.arrayElement(THEMES),
    events: [],
    links: {
      github: faker.helpers.maybe(() => `https://github.com/${faker.internet.username()}`),
      twitter: faker.helpers.maybe(() => `https://twitter.com/${faker.internet.username()}`),
      linkedin: faker.helpers.maybe(() => `https://linkedin.com/in/${faker.internet.username()}`),
    },
  };
}

function generateEvent(id: string): Event {
  // Seed faker with the event ID to get consistent data
  faker.seed(parseInt(id.replace(/\D/g, "") || "0", 10));

  return {
    id,
    title: faker.company.catchPhrase(),
    date: faker.date.future().toISOString(),
    time: faker.date.future().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    location: `${faker.location.city()} Convention Center`,
    description: faker.lorem.paragraph(),
    coverImage: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    speakers: [],
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
    if (!speaker.roles.includes("Speaker")) {
      speaker.roles.push("Speaker");
    }
  });
});
