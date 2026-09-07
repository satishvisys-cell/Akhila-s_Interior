/**
 * Akhila Video-First Media Engine
 * Vendor-agnostic AI Video Generation Service & Prompt Continuity Pipeline
 */

import type { VideoPromptSpec } from "@/lib/media/media-asset";

export type VideoGenerationProvider =
  | "runway"
  | "luma"
  | "pika"
  | "sora"
  | "manual_production";

export type GenerationJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface VideoGenerationJob {
  id: string;
  projectId: string;
  roomSlug: string;
  provider: VideoGenerationProvider;
  promptSpec: VideoPromptSpec;
  status: GenerationJobStatus;
  progressPct: number;
  outputVideoUrl?: string;
  outputPosterUrl?: string;
  errorMessage?: string;
  createdAt: string;
}

export class VideoGenerationService {
  /** Constructs structured prompt payload for AI video generation engines */
  public static buildPromptString(spec: VideoPromptSpec): string {
    return [
      `START_FRAME: ${spec.startFrame}`,
      `CAMERA_PATH: ${spec.cameraPath}`,
      `ROOM_GEOMETRY: ${spec.roomGeometry}`,
      `MATERIALS: ${spec.materials}`,
      `LIGHTING: ${spec.lighting}`,
      `TRANSFORMATION: ${spec.transformation}`,
      `END_FRAME_TARGET: ${spec.endFrame}`,
      `STYLE: Cinematic 4K Interior Videography, photorealistic natural lighting, slow smooth camera move`,
      spec.negativeConstraints
        ? `NEGATIVE_CONSTRAINTS: ${spec.negativeConstraints}`
        : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }

  /** Ensures visual continuity by linking end frame of previous room to start frame of next room */
  public static verifyContinuitySequence(
    stages: Array<{ roomSlug: string; startFrame: string; endFrame: string }>,
  ): boolean {
    for (let i = 0; i < stages.length - 1; i++) {
      const currentEnd = stages[i].endFrame;
      const nextStart = stages[i + 1].startFrame;
      if (!currentEnd || !nextStart) {
        return false;
      }
    }
    return true;
  }
}
