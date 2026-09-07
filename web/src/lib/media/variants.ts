import type { MediaAsset, MediaDerivativeKey } from "@/domain/types";

export type ResponsiveBreakpoint = "mobile" | "tablet" | "desktop";

export interface ResponsiveImageSource {
  src: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface ResponsiveImageSources {
  thumb?: ResponsiveImageSource;
  mobile: ResponsiveImageSource;
  tablet: ResponsiveImageSource;
  desktop: ResponsiveImageSource;
  original?: ResponsiveImageSource;
  srcSet: string;
  sizes: string;
  defaultSrc: string;
}

const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px";

const DERIVATIVE_FALLBACK_ORDER: Record<
  ResponsiveBreakpoint,
  MediaDerivativeKey[]
> = {
  mobile: ["mobile", "thumb", "tablet", "desktop"],
  tablet: ["tablet", "mobile", "desktop", "thumb"],
  desktop: ["desktop", "tablet", "mobile", "thumb"],
};

function pickDerivative(
  asset: MediaAsset,
  keys: MediaDerivativeKey[],
): ResponsiveImageSource | undefined {
  for (const key of keys) {
    const derivative = asset.derivatives[key];
    if (derivative?.url) {
      return {
        src: derivative.url,
        width: derivative.width,
        height: derivative.height,
        mimeType: derivative.mimeType,
      };
    }
  }
  return undefined;
}

function buildSrcSet(
  sources: Partial<Record<MediaDerivativeKey, ResponsiveImageSource>>,
): string {
  const entries: string[] = [];
  const seen = new Set<string>();

  for (const key of ["mobile", "tablet", "desktop", "thumb"] as const) {
    const source = sources[key];
    if (source && !seen.has(source.src)) {
      seen.add(source.src);
      entries.push(`${source.src} ${source.width}w`);
    }
  }

  return entries.join(", ");
}

/**
 * Map a MediaAsset to responsive image sources.
 * Mobile never defaults to original — falls back through smaller derivatives.
 */
export function getResponsiveImageSources(
  asset: MediaAsset,
  sizes: string = DEFAULT_SIZES,
): ResponsiveImageSources | null {
  const thumb = pickDerivative(asset, ["thumb"]);
  const mobile = pickDerivative(asset, DERIVATIVE_FALLBACK_ORDER.mobile);
  const tablet = pickDerivative(asset, DERIVATIVE_FALLBACK_ORDER.tablet);
  const desktop = pickDerivative(asset, DERIVATIVE_FALLBACK_ORDER.desktop);

  if (!mobile || !tablet || !desktop) {
    return null;
  }

  const originalDerivative = asset.derivatives.original;
  const original = originalDerivative?.url
    ? {
        src: originalDerivative.url,
        width: originalDerivative.width,
        height: originalDerivative.height,
        mimeType: originalDerivative.mimeType,
      }
    : undefined;

  const srcSet = buildSrcSet({ thumb, mobile, tablet, desktop });

  return {
    thumb,
    mobile,
    tablet,
    desktop,
    original,
    srcSet,
    sizes,
    defaultSrc: mobile.src,
  };
}

export function getDerivativeUrl(
  asset: MediaAsset,
  key: MediaDerivativeKey,
): string | undefined {
  return asset.derivatives[key]?.url;
}

export function getBestDerivativeForWidth(
  asset: MediaAsset,
  viewportWidth: number,
): ResponsiveImageSource {
  if (viewportWidth <= 640) {
    return (
      pickDerivative(asset, DERIVATIVE_FALLBACK_ORDER.mobile) ??
      fallbackFromAsset(asset)
    );
  }
  if (viewportWidth <= 1024) {
    return (
      pickDerivative(asset, DERIVATIVE_FALLBACK_ORDER.tablet) ??
      fallbackFromAsset(asset)
    );
  }
  return (
    pickDerivative(asset, DERIVATIVE_FALLBACK_ORDER.desktop) ??
    fallbackFromAsset(asset)
  );
}

function fallbackFromAsset(asset: MediaAsset): ResponsiveImageSource {
  const url = asset.publicUrl ?? asset.derivatives.thumb?.url ?? "";
  return {
    src: url,
    width: asset.width,
    height: asset.height,
    mimeType: "image/jpeg",
  };
}
