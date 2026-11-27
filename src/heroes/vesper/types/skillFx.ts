import type { ElementKit, FxAt, FxCast, FxShape } from "../../../types/skillFx";

export type VesperFxLayer = "none" | "crescent" | "spiral" | "swallows" | "sigil" | "phantoms" | "ward" | "stars";

export interface VesperFxLook {
  shape: FxShape;
  reach: number;
  lift: number;
  layer: VesperFxLayer;
}

export interface FxPoint {
  x: number;
  y: number;
}

export type VesperLayerDraw = (
  cast: FxCast,
  kit: ElementKit,
  progress: number,
  fade: number,
  center: FxPoint,
  at: FxAt,
) => void;
