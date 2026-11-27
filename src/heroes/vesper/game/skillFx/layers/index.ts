import type { VesperFxLayer, VesperLayerDraw } from "../../../types/skillFx";
import { drawCrescentLayer } from "./crescent";
import { drawPhantomsLayer } from "./phantoms";
import { drawSigilLayer } from "./sigil";
import { drawSpiralLayer } from "./spiral";
import { drawStarsLayer } from "./stars";
import { drawSwallowsLayer } from "./swallows";
import { drawWardLayer } from "./ward";

export const VESPER_LAYERS: Readonly<Record<VesperFxLayer, VesperLayerDraw>> = {
  none: () => {},
  crescent: drawCrescentLayer,
  spiral: drawSpiralLayer,
  swallows: drawSwallowsLayer,
  sigil: drawSigilLayer,
  phantoms: drawPhantomsLayer,
  ward: drawWardLayer,
  stars: drawStarsLayer,
};
