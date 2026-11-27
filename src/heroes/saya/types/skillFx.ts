import type { ElementKit, FxAt, FxCast, FxShape } from "../../../types/skillFx";

export type SayaFxLayer = "none" | "moon" | "drips" | "cranes" | "papers" | "swirl" | "ring" | "rain";

export interface SayaFxLook {
  shape: FxShape;
  reach: number;
  lift: number;
  layer: SayaFxLayer;
}

export interface FxPoint {
  x: number;
  y: number;
}

export type SayaLayerDraw = (
  cast: FxCast,
  kit: ElementKit,
  progress: number,
  fade: number,
  center: FxPoint,
  at: FxAt,
) => void;
