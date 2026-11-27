import type { SayaFxLayer, SayaLayerDraw } from "../../../types/skillFx";
import { drawCranesLayer } from "./cranes";
import { drawDripsLayer } from "./drips";
import { drawMoonLayer } from "./moon";
import { drawPapersLayer } from "./papers";
import { drawRainLayer } from "./rain";
import { drawRingLayer } from "./ring";
import { drawSwirlLayer } from "./swirl";

export const SAYA_LAYERS: Readonly<Record<SayaFxLayer, SayaLayerDraw>> = {
  none: () => {},
  moon: drawMoonLayer,
  drips: drawDripsLayer,
  cranes: drawCranesLayer,
  papers: drawPapersLayer,
  swirl: drawSwirlLayer,
  ring: drawRingLayer,
  rain: drawRainLayer,
};
