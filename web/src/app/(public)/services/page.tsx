import type { Metadata } from "next";
import NextLink from "next/link";
import { STITCH } from "@/lib/stitch/assets";
import { FadeUp } from "@/components/motion/fade-up";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive architectural and design solutions delivered with precision and structural integrity.",
};

const SERVICES = [
  {
    id: "architecture",
    title: "Architecture",
    body: "Site-responsive residences and selective commercial work — from concept through permit-ready documentation.",
    doList: [
      "Site Analysis & Conceptualization",
      "Schematic Design & Development",
      "Technical Documentation",
    ],
    deliverables: [
      "Complete Blueprint Sets",
      "Structural Engineering Plans",
      "Permit Documentation",
    ],
    image: STITCH.services[0],
  },
  {
    id: "interior-design",
    title: "Interior Design",
    body: "Material palettes, joinery, and spatial sequences composed for calm, lasting interiors.",
    doList: [
      "Spatial Planning & Flow",
      "Material & Palette Curation",
      "Custom Millwork Design",
    ],
    deliverables: [
      "Interior Elevations",
      "Finish & Fixture Schedules",
      "Furniture Layouts",
    ],
    image: STITCH.services[1],
  },
  {
    id: "construction",
    title: "Construction",
    body: "Build quality that protects design intent — sequenced trades, site discipline, and finish control.",
    doList: [
      "Site Preparation & Foundation",
      "Structural Framing",
      "Envelope & Systems Integration",
    ],
    deliverables: [
      "Turnkey Structural Build",
      "Systems Commissioning",
      "Final Inspections",
    ],
    image: STITCH.services[2],
  },
  {
    id: "renovation",
    title: "Renovation",
    body: "Thoughtful interventions that honor existing structure while introducing contemporary clarity.",
    doList: [
      "Structural Assessment",
      "Preservation Strategy",
      "Modern Integration Design",
    ],
    deliverables: [
      "Retrofitting Plans",
      "Phased Construction Sets",
      "Heritage Coordination",
    ],
    image: STITCH.services[3],
  },
  {
    id: "project-management",
    title: "Project Management",
    body: "Transparent milestones, budgets, and decisions — so clients stay in control throughout delivery.",
    doList: [
      "Schedule & Budget Control",
      "Vendor Coordination",
      "Client Reporting Cadence",
    ],
    deliverables: [
      "Master Programme",
      "Cost Reports",
      "Decision Logs",
    ],
    image: STITCH.services[4],
  },
  {
    id: "3d-visualization",
    title: "3D Visualization",
    body: "Cinematic stills and sequences that communicate atmosphere before construction begins.",
    doList: [
      "Still Renders",
      "Walkthrough Sequences",
      "Material Studies",
    ],
    deliverables: [
      "Hero Imagery",
      "Scene Sets",
      "Presentation Boards",
    ],
    image: STITCH.services[5],
  },
  {
    id: "smart-home",
    title: "Smart Home",
    body: "Discreet automation integrated with architecture — lighting, climate, and security without visual noise.",
    doList: [
      "Systems Architecture",
      "Vendor Selection",
      "Commissioning",
    ],
    deliverables: [
      "Control Schematics",
      "User Guides",
      "Scene Presets",
    ],
    image: STITCH.services[6],
  },
  {
    id: "construction-monitoring",
    title: "Construction Monitoring",
    body: "Live site visibility with secure camera access and progress storytelling for stakeholders.",
    doList: [
      "Live CCTV Access",
      "Progress Stage Tracking",
      "Client Dashboards",
    ],
    deliverables: [
      "Secured Streams",
      "Weekly Updates",
      "Archive Snapshots",
    ],
    image: STITCH.services[7],
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="bg-bg pt-[calc(var(--header-h)+1rem)]">
      <FadeUp className="mx-auto max-w-3xl px-6 py-16 text-center md:px-12 md:py-24">
        <h1 className="mb-6 font-display text-5xl font-light tracking-tight text-graphite md:text-6xl lg:text-7xl">
          Services
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-text/70">
          Comprehensive architectural and design solutions delivered with
          precision and structural integrity. A built-to-last approach for
          enduring environments.
        </p>
      </FadeUp>

      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 md:pb-32">
        {SERVICES.map((service, index) => {
          const reverse = index % 2 === 1;
          return (
            <FadeUp key={service.id} delay={(index % 2) * 40}>
              <section
                id={service.id}
                className="flex flex-col items-center gap-10 border-t border-border py-16 md:flex-row md:gap-16 md:py-24"
              >
                <div
                  className={cn("w-full md:w-1/2", reverse && "md:order-2")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-[420px] w-full rounded object-cover transition-transform duration-700 hover:scale-[1.02] md:h-[600px] motion-reduce:hover:scale-100"
                  />
                </div>
                <div
                  className={cn(
                    "w-full md:w-1/2",
                    reverse ? "md:order-1 md:pr-12" : "md:pl-12",
                  )}
                >
                  <h2 className="mb-6 font-display text-3xl text-graphite md:text-4xl">
                    {service.title}
                  </h2>
                  <p className="mb-8 text-base font-light leading-relaxed text-text/70">
                    {service.body}
                  </p>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="mb-3 font-sans text-xs uppercase tracking-widest text-text/50">
                        What we do
                      </p>
                      <ul className="space-y-2 text-sm text-graphite">
                        {service.doList.map((item) => (
                          <li key={item}>— {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-3 font-sans text-xs uppercase tracking-widest text-text/50">
                        Deliverables
                      </p>
                      <ul className="space-y-2 text-sm text-graphite">
                        {service.deliverables.map((item) => (
                          <li key={item}>— {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <NextLink
                    href="/contact"
                    className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-accent transition-colors hover:text-accent-hover"
                  >
                    Discuss This Service <span aria-hidden>→</span>
                  </NextLink>
                </div>
              </section>
            </FadeUp>
          );
        })}
      </div>
    </div>
  );
}
