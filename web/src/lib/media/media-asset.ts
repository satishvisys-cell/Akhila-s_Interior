/**
 * Akhila Video-First Media Engine
 * First-Class Media Asset abstraction & adaptive video delivery helpers.
 */

export type VideoQualityLevel = "4k" | "1080p" | "720p" | "mobile";

export type VideoCategory =
  | "hero"
  | "walkthrough"
  | "room-transformation"
  | "before-after"
  | "construction"
  | "material"
  | "technical"
  | "exploded"
  | "project-film"
  | "journal";

export interface VideoStreamSources {
  master4k?: string;
  desktop1080?: string;
  tablet720?: string;
  mobileCrop?: string;
  webm?: string;
  mp4?: string;
}

export interface VideoPromptSpec {
  startFrame: string;
  cameraPath: string;
  roomGeometry: string;
  materials: string;
  lighting: string;
  transformation: string;
  endFrame: string;
  durationSec: number;
  aspectRatio: string;
  negativeConstraints?: string;
}

export interface VideoAsset {
  id: string;
  title: string;
  category: VideoCategory;
  sources: VideoStreamSources;
  poster: string;
  mobilePoster?: string;
  durationSec: number;
  width: number;
  height: number;
  alt: string;
  promptSpec?: VideoPromptSpec;
  generationId?: string;
  provider?: "runway" | "luma" | "pika" | "sora" | "manual_production";
  metadata?: Record<string, unknown>;
}

/** Resolves optimal video stream URL based on device hint or screen width */
export function getAdaptiveVideoStream(
  asset: VideoAsset,
  widthHint = 1440,
): { src: string; poster: string; quality: VideoQualityLevel } {
  const { sources, poster, mobilePoster } = asset;

  if (widthHint <= 640 && sources.mobileCrop) {
    return {
      src: sources.mobileCrop,
      poster: mobilePoster ?? poster,
      quality: "mobile",
    };
  }

  if (widthHint <= 1024 && sources.tablet720) {
    return {
      src: sources.tablet720,
      poster: poster,
      quality: "720p",
    };
  }

  if (sources.desktop1080) {
    return {
      src: sources.desktop1080,
      poster: poster,
      quality: "1080p",
    };
  }

  const defaultSrc =
    sources.master4k ?? sources.mp4 ?? sources.webm ?? asset.poster;
  return {
    src: defaultSrc,
    poster: poster,
    quality: sources.master4k ? "4k" : "1080p",
  };
}

/** Standard sample architectural video library with 4K/1080p fallback streams */
export const ARCHITECTURAL_VIDEOS: Record<string, VideoAsset> = {
  heroSequence: {
    id: "v-hero-01",
    title: "Atelier Casa Horizon — Architectural Ouverture",
    category: "hero",
    sources: {
      master4k: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      desktop1080: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      mobileCrop: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    poster: "https://lh3.googleusercontent.com/aida/AEtjO1UOS1oPbFVEZsZbBTNR3SkfKEBYlZmw2Vg9WgKKE1hHQG7OTsG5P74zJrjtB7LQ193Wo0JJcnXhhaL0ARQcqZxf18UFOPIMM2KHoKkQp9LLrwPQ932z9XTZLsvv3YipuBam_ZW3tnqJDk2t1B5KeVxQ65NZFM2dcx4zgeha48QR5zCOfv_d_pZ5-khANfZn7LWzu5B-F7R4t6DmtUbipWth8Lwggr0bfYV2dq-6dZpKnwzqTR5zP1YlQfR2",
    durationSec: 8,
    width: 3840,
    height: 2160,
    alt: "Exterior twilight drone sweep across cantilevered travertine villa",
  },
  livingTransformation: {
    id: "v-living-trans",
    title: "Living Pavilion — Concrete & Timber Transformation",
    category: "room-transformation",
    sources: {
      desktop1080: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    poster: "https://lh3.googleusercontent.com/aida/AEtjO1XiBDOgkH3kNLdFL6npu8GhWsgb6mbnDp8_YAgQyjuJ3vTi_jpmsMXhWHq5wiO3R43zb5Ix__xMhbi5lNis1XmxQndYEVW9dfFo1kl8-XY0KfmxqTF8L-gGeoHSmYhVKA4gylR3ZACBZtru_ZazMELjL5pBca3OaHQM_DIYbhU-SsZ4bh1iMOUA6MSp6Jbx0MmrPs-BrnBkc1ZSyIsm1IRq7orEKwgkmQa7BFeSDuq8nzvp28sxznP8Zk-A",
    durationSec: 7,
    width: 1920,
    height: 1080,
    alt: "Sequential AI video transformation from rough concrete frame to warm luxury interior",
  },
  kitchenExploded: {
    id: "v-kitchen-exp",
    title: "Monolithic Titanium Island — Assembly Sequence",
    category: "exploded",
    sources: {
      desktop1080: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    poster: "https://lh3.googleusercontent.com/aida/AEtjO1X-gkC-v7SJ36Ciss2pp3o4qOGCAy8MYl9FmX7yaeSG29vwkFF9BmV6E0Nuh6U8T0bhtPjkfSC53ZxlmMhtR6Csc3t0OipklYfv_P2fDGVeEoeknmmOHYpTZEm3X57_BAAX4BhEpIikO1Z6EkOKdZ3PTJ9YvWRK2ABdbDlhbNVBQ38rDt2gaXcZxc0tNNvMcXJamZ2eaSBP_GLRxvAGhz6AfOueWZHSUs7l6nGaZGoA53L1N1JuomhSzXI2",
    durationSec: 6,
    width: 1920,
    height: 1080,
    alt: "Architectural video highlighting titanium counter assembly and millwork joinery",
  },
};
