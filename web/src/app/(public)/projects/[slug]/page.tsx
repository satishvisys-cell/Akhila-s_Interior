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
import { EditorialCard } from "@/components/sections/editorial-card";
import { EDITORIAL } from "@/lib/editorial";

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
    "Casa Horizon stands as a testament to restrained elegance. Situated on a dramatic coastal bluff, the interiors yield to light and landscape, using stone, timber, and glass to blur the boundary between sanctuary and horizon.",
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
    : "Interiors with intent";
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
        <div className="absolute bottom-16 left-8 max-w-3xl text-white md:left-16">
          <FadeUp>
            <span className="mb-3 block font-editorial text-sm text-white/70">
              Interior Case Study
            </span>
            <h1 className="mb-4 font-editorial text-5xl font-extrabold tracking-tight md:text-7xl">
              {project.name}
            </h1>
            <p className="font-editorial text-lg text-white/85 md:text-xl">
              {heroSub}
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="canvas-sky px-3 py-3 font-editorial md:px-5 md:py-5">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:gap-5">
      <EditorialCard>
      <section className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <FadeUp className="md:col-span-7">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            {overviewTitle}
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-text-secondary">
            {overviewParas.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </FadeUp>
        <FadeUp
          delay={80}
          className="grid grid-cols-2 gap-8 border-t border-black/10 pt-8 md:col-span-5 md:border-l md:border-t-0 md:pl-12 md:pt-0"
        >
          {stats.map(([label, value]) => (
            <div key={label}>
              <span className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
                {label}
              </span>
              <span className="font-semibold capitalize text-ink-button">
                {value}
              </span>
            </div>
          ))}
        </FadeUp>
      </section>
      </EditorialCard>

      <EditorialCard>
          <BeforeAfterVideo
            title={`Interior Transformation — ${project.name}`}
            subtitle="Drag to compare the original room with its reimagined finish"
            before={{
              type: "image",
              src: EDITORIAL.compare.reimagine,
              label: "Reimagine",
            }}
            after={{
              type: "image",
              src: EDITORIAL.compare.original,
              label: "Original",
            }}
          />
      </EditorialCard>

      <EditorialCard>
      <InteractiveFloorPlan projectSlug={project.slug} />
      </EditorialCard>

      <EditorialCard>
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-ink-button md:text-5xl">
            Ready to realize your vision?
          </h2>
          <p className="mb-8 text-lg text-text-secondary">
            Schedule a private consultation to discuss your next interior project.
          </p>
          <NextLink
            href="/contact"
            className="inline-flex rounded-md bg-ink-button px-8 py-4 text-sm font-semibold text-white hover:bg-black"
          >
            Contact Our Studio
          </NextLink>
        </FadeUp>
      </EditorialCard>
        </div>
      </div>
    </>
  );
}
