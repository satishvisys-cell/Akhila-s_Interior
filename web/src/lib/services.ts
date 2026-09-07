import { EDITORIAL } from "@/lib/editorial";
import { STITCH } from "@/lib/stitch/assets";

export type InteriorService = {
  id: string;
  title: string;
  body: string;
  doList: readonly string[];
  deliverables: readonly string[];
  image: string;
  count: string;
};

export const INTERIOR_SERVICES: readonly InteriorService[] = [
  {
    id: "false-ceiling",
    title: "False Ceiling",
    body: "Ceiling planes composed for light, proportion, and quiet — cove details, acoustic layers, and a finished room that feels complete from above.",
    doList: [
      "Cove & Gypsum Design",
      "Recessed Lighting Integration",
      "Acoustic Layering",
    ],
    deliverables: [
      "Ceiling Layouts",
      "Section Details",
      "Finish Specifications",
    ],
    image: EDITORIAL.rooms.light,
    count: "120 Rooms",
  },
  {
    id: "electrical-works",
    title: "Electrical Works",
    body: "Power, lighting, and switching planned as part of the interior — not added after. Circuits, points, and dimming that disappear into daily use.",
    doList: [
      "Point Layouts & Load Planning",
      "Lighting Circuits",
      "Concealed Wiring Coordination",
    ],
    deliverables: [
      "Electrical Layouts",
      "Switch & Fixture Schedule",
      "On-site Supervision",
    ],
    image: EDITORIAL.hero,
    count: "86 Homes",
  },
  {
    id: "painting",
    title: "Painting",
    body: "Colour as material. Walls, ceilings, and joinery finished with even films, honest edges, and palettes that hold in changing light.",
    doList: [
      "Palette & Sample Boards",
      "Surface Preparation",
      "Premium Interior Finishes",
    ],
    deliverables: [
      "Paint Schedules",
      "Sample Approvals",
      "Final Coat Walkthrough",
    ],
    image: EDITORIAL.rooms.living,
    count: "140 Rooms",
  },
  {
    id: "wallpapers",
    title: "Wallpapers",
    body: "Pattern, texture, and scale chosen for the room — from quiet linens to statement walls — hung with tight seams and lasting adhesion.",
    doList: [
      "Pattern & Scale Selection",
      "Feature Wall Composition",
      "Precision Hanging",
    ],
    deliverables: [
      "Wallpaper Boards",
      "Quantity Take-offs",
      "Installed Finish",
    ],
    image: EDITORIAL.rooms.sleep,
    count: "74 Suites",
  },
  {
    id: "windows",
    title: "Windows",
    body: "Frames, glass, and dressings that control light, privacy, and view — aligned with the interior rather than fighting it.",
    doList: [
      "Frame & Glass Selection",
      "Reveal & Sill Detailing",
      "Treatment Coordination",
    ],
    deliverables: [
      "Window Schedules",
      "Hardware Specs",
      "Installation Oversight",
    ],
    image: EDITORIAL.intro[0],
    count: "95 Openings",
  },
  {
    id: "blinds",
    title: "Blinds",
    body: "Privacy and daylight, tuned. Roller, roman, and venetian systems specified for fabric, drop, and the way the room should feel at noon and at night.",
    doList: [
      "Fabric & Mechanism Selection",
      "Motorisation Options",
      "Measure & Install",
    ],
    deliverables: [
      "Treatment Drawings",
      "Fabric Samples",
      "Fitted Installation",
    ],
    image: STITCH.services[3],
    count: "110 Windows",
  },
] as const;
