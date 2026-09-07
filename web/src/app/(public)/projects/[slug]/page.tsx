import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import {
  getMediaMap,
  getPublishedProjectBySlug,
  getPublishedProjects,
  mediaUrl,
} from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { BeforeAfterVideo } from "@/components/media/before-after-video";
import { InteractiveFloorPlan } from "@/components/architecture/interactive-floor-plan";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.seo?.title ?? project.seoTitle ?? project.name,
    description:
      project.seo?.description ?? project.seoDescription ?? project.description,
  };
}

const STITCH_DETAIL = {
  heroSub:
    "A masterclass in coastal minimalism, blending precision engineering with elemental beauty.",
  overviewTitle: "Redefining Coastal Minimalism",
  overview: [
    "Casa Horizon stands as a testament to restrained elegance. Situated on a dramatic coastal bluff, the architecture yields to the landscape, utilizing vast expanses of structural glass and monolithic stone to blur the boundary between interior sanctuary and the infinite horizon.",
    "Every detail, from the cantilevered terraces to the flush-mount hardware, was rigorously detailed to maintain absolute visual silence, allowing the changing light of the coast to become the primary ornamental feature.",
  ],
  stats: [
    ["Location", "Malibu, CA"],
    ["Completion", "2024"],
    ["Interior Area", "8,500 sq ft"],
    ["Sustainability", "LEED Platinum"],
  ] as const,
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const [media] = await Promise.all([getMediaMap()]);

  const cover =
    mediaUrl(media, project.coverMediaId) ?? STITCH_V2.home.casaHorizon;
  const useStitchCopy =
    /casa|horizon|meridian/i.test(project.name) ||
    project.description.length < 80;

  const overviewTitle = useStitchCopy
    ? STITCH_DETAIL.overviewTitle
    : "Architecture with intent";
  const overviewParas = useStitchCopy
    ? STITCH_DETAIL.overview
    : [
        project.description,
        "Every detail is rigorously composed so light, structure, and material remain the primary ornamental features.",
      ];
  const heroSub = useStitchCopy ? STITCH_DETAIL.heroSub : project.description;
  const stats = useStitchCopy
    ? STITCH_DETAIL.stats
    : ([
        ["Location", project.location],
        ["Completion", String(project.year)],
        ["Interior Area", `${project.areaSqm} sqm`],
        ["Status", project.status.replace(/_/g, " ")],
      ] as const);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={project.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-16 left-8 max-w-3xl text-text-inverse md:left-16">
          <FadeUp>
            <span className="mb-3 block font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              ARCHITECTURAL CASE STUDY
            </span>
            <h1 className="mb-4 font-display text-5xl font-light tracking-tight md:text-7xl">
              {project.name}
            </h1>
            <p className="font-sans text-lg font-light opacity-90 md:text-xl">
              {heroSub}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Project Overview */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-8 py-24 md:grid-cols-12 md:px-16">
        <FadeUp className="md:col-span-7">
          <h2 className="mb-6 font-display text-3xl text-charcoal md:text-4xl">
            {overviewTitle}
          </h2>
          <div className="space-y-6 font-sans text-lg font-light leading-relaxed text-text-secondary">
            {overviewParas.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </FadeUp>
        <FadeUp
          delay={80}
          className="grid grid-cols-2 gap-8 border-t border-border pt-12 md:col-span-5 md:border-l md:border-t-0 md:pl-12 md:pt-0"
        >
          {stats.map(([label, value]) => (
            <div key={label}>
              <span className="mb-2 block font-sans text-xs uppercase tracking-widest text-text-muted">
                {label}
              </span>
              <span className="font-sans font-medium capitalize text-charcoal">
                {value}
              </span>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* AI Transformation Reveal */}
      <section className="bg-ivory py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-8">
          <BeforeAfterVideo
            title={`Architectural Transformation — ${project.name}`}
            subtitle="Interactive before/after dual video reveal comparing structural shell with completed pavilion"
            before={{
              type: "image",
              src: STITCH_V2.home.atelier,
              label: "Existing Frame",
            }}
            after={{
              type: "video",
              src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              poster: STITCH_V2.tour.living,
              label: "Luxury Finished",
            }}
          />
        </div>
      </section>

      {/* Interactive Floor Plan */}
      <InteractiveFloorPlan projectSlug={project.slug} />

      {/* Call to Action */}
      <section className="bg-accent px-8 py-24 text-center text-text-inverse">
        <FadeUp className="mx-auto max-w-2xl">
          <h2 className="mb-6 font-display text-4xl md:text-5xl">
            Ready to realize your vision?
          </h2>
          <p className="mb-10 font-sans text-lg font-light opacity-90">
            Schedule a private consultation to discuss your next architectural endeavor.
          </p>
          <NextLink
            href="/contact"
            className="inline-flex rounded bg-ivory px-10 py-4 font-sans text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-white"
          >
            Contact Our Studio
          </NextLink>
        </FadeUp>
      </section>
    </>
  );
}
