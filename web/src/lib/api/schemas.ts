import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export const projectCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  location: z.string().min(1).max(200),
  category: z.enum(["residential", "commercial", "interior", "renovation"]),
  year: z.number().int().min(1900).max(2100),
  areaSqm: z.number().positive().max(1_000_000),
  description: z.string().max(10_000).default(""),
  status: z.enum(["completed", "in_progress", "planned"]).default("planned"),
  coverMediaId: z.string().optional(),
  publishStatus: z
    .enum(["draft", "published", "archived", "scheduled"])
    .default("draft"),
});

export const projectPatchSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    location: z.string().min(1).max(200).optional(),
    category: z
      .enum(["residential", "commercial", "interior", "renovation"])
      .optional(),
    year: z.number().int().min(1900).max(2100).optional(),
    areaSqm: z.number().positive().max(1_000_000).optional(),
    description: z.string().max(10_000).optional(),
    status: z.enum(["completed", "in_progress", "planned"]).optional(),
    coverMediaId: z.string().optional(),
    galleryMediaIds: z.array(z.string()).optional(),
    videoMediaIds: z.array(z.string()).optional(),
    publishStatus: z
      .enum(["draft", "published", "archived", "scheduled"])
      .optional(),
    seoTitle: z.string().max(200).optional(),
    seoDescription: z.string().max(500).optional(),
    seo: z
      .object({
        title: z.string().max(200).optional(),
        description: z.string().max(500).optional(),
        ogImageMediaId: z.string().optional(),
        canonicalUrl: z.string().url().optional().or(z.literal("")),
        noIndex: z.boolean().optional(),
      })
      .optional(),
    roomIds: z.array(z.string()).optional(),
    tourId: z.string().optional().nullable(),
    progressId: z.string().optional().nullable(),
    liveSiteId: z.string().optional().nullable(),
  })
  .strict();

export const pageCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  publishStatus: z
    .enum(["draft", "published", "archived", "scheduled"])
    .default("draft"),
});

export const pagePatchSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    publishStatus: z
      .enum(["draft", "published", "archived", "scheduled"])
      .optional(),
    seo: z
      .object({
        title: z.string().max(200).optional(),
        description: z.string().max(500).optional(),
        ogImageMediaId: z.string().optional(),
        canonicalUrl: z.string().optional(),
        noIndex: z.boolean().optional(),
      })
      .optional(),
    blocks: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .strict();

export const heroPatchSchema = z
  .object({
    mediaId: z.string().min(1).optional(),
    mobileMediaId: z.string().optional().nullable(),
    eyebrow: z.string().max(120).optional().nullable(),
    heading: z.string().min(1).max(200).optional(),
    subtitle: z.string().max(200).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    primaryCta: z
      .object({
        label: z.string().min(1).max(80),
        href: z.string().min(1).max(500),
        variant: z.enum(["primary", "secondary", "ghost"]).optional(),
      })
      .optional()
      .nullable(),
    secondaryCta: z
      .object({
        label: z.string().min(1).max(80),
        href: z.string().min(1).max(500),
        variant: z.enum(["primary", "secondary", "ghost"]).optional(),
      })
      .optional()
      .nullable(),
    overlayStrength: z.number().min(0).max(1).optional(),
    alignment: z.enum(["left", "center", "right"]).optional(),
    animation: z
      .enum(["none", "fade_up", "fade_in", "scale_in", "parallax"])
      .optional(),
    visibility: z.enum(["public", "private"]).optional(),
    sortOrder: z.number().int().optional(),
  })
  .strict();

export const cameraCreateSchema = z.object({
  name: z.string().min(1).max(200),
  locationLabel: z.string().min(1).max(200),
  status: z.enum(["live", "offline", "maintenance"]).default("offline"),
  visibility: z.enum(["public", "private"]).default("private"),
  sortOrder: z.number().int().default(0),
  projectId: z.string().min(1).max(120).nullable().optional(),
  streamSourceId: z.string().min(1).max(120).optional(),
});

export const cameraPatchSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    locationLabel: z.string().min(1).max(200).optional(),
    status: z.enum(["live", "offline", "maintenance"]).optional(),
    visibility: z.enum(["public", "private"]).optional(),
    sortOrder: z.number().int().optional(),
    projectId: z.string().min(1).max(120).nullable().optional(),
  })
  .strict();

export const cameraSecretSchema = z.object({
  rtspUrl: z.string().max(2000).optional(),
  username: z.string().max(200).optional(),
  password: z.string().max(500).optional(),
  hlsProxyUrl: z.string().max(2000).optional(),
  notes: z.string().max(1000).optional(),
});

export const streamSessionSchema = z.object({
  cameraId: z.string().min(1),
});

export const settingsNavSchema = z.object({
  primaryNav: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1).max(80),
        href: z.string().min(1).max(500),
        sortOrder: z.number().int(),
        visible: z.boolean(),
      }),
    )
    .optional(),
  footerNav: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1).max(80),
        href: z.string().min(1).max(500),
        sortOrder: z.number().int(),
        visible: z.boolean(),
      }),
    )
    .optional(),
  siteName: z.string().min(1).max(200).optional(),
  tagline: z.string().max(300).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  defaultSeo: z
    .object({
      title: z.string().max(200).optional(),
      description: z.string().max(500).optional(),
    })
    .optional(),
});

export const mediaCreateSchema = z.object({
  alt: z.string().min(1).max(500),
  kind: z.enum(["image", "video", "diagram", "snapshot"]).default("image"),
  tags: z.array(z.string()).default([]),
  folder: z.string().max(120).optional(),
});
