import { EDITORIAL } from "@/lib/editorial";

export type ClientTestimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  project: string;
  location: string;
  image: string;
  imageAlt: string;
  href: string;
};

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: "priya-menon",
    quote:
      "The rooms feel as if they had always belonged to us. Every join, every lamp, every quiet corner was considered — nothing decorative for its own sake.",
    author: "Priya Menon",
    role: "Homeowner",
    project: "Meridian Residence",
    location: "Hyderabad",
    image: EDITORIAL.rooms.living,
    imageAlt: "Living room from the Meridian Residence interior",
    href: "/projects/meridian-residence",
  },
  {
    id: "daniel-park",
    quote:
      "We asked for calm, not spectacle. Akhila delivered a house that holds light through the day and still feels intimate after dark.",
    author: "Daniel Park",
    role: "Client",
    project: "Casa Horizon",
    location: "Malibu",
    image: EDITORIAL.rooms.dining,
    imageAlt: "Dining interior from Casa Horizon",
    href: "/projects/meridian-residence",
  },
  {
    id: "ananya-rao",
    quote:
      "The kitchen is the centre of our life now. Storage disappears, the island holds the room, and cooking feels like a daily ritual rather than a task.",
    author: "Ananya Rao",
    role: "Homeowner",
    project: "Atelier House",
    location: "Bengaluru",
    image: EDITORIAL.rooms.kitchen,
    imageAlt: "Kitchen interior from Atelier House",
    href: "/designs",
  },
  {
    id: "james-whitfield",
    quote:
      "During fit-out we always knew where the project stood. Live updates, honest timelines, and a handover that felt as considered as the drawings.",
    author: "James Whitfield",
    role: "Project stakeholder",
    project: "Skyline Villa",
    location: "Bengaluru",
    image: EDITORIAL.rooms.sleep,
    imageAlt: "Bedroom interior from Skyline Villa",
    href: "/live-sites/skyline-villa",
  },
  {
    id: "lila-chen",
    quote:
      "They treated lighting as material. The suite is quieter, warmer, and more precise than we imagined from the first mood boards.",
    author: "Lila Chen",
    role: "Client",
    project: "Lighting Studies",
    location: "Los Angeles",
    image: EDITORIAL.rooms.light,
    imageAlt: "Interior lighting study from the Akhila archive",
    href: "/designs",
  },
];
