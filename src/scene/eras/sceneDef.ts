import type { Color, Ramp } from "../../types/color";
import type { Rng } from "../../utils/rng";

/** the colors of the shared stage layout: sky, far ridge, ruined towers, stone floor, slabs and braziers */
export interface ScenePalette {
  /** top of the sky down to the horizon, in dithered bands */
  sky: Ramp;
  starDim: Color;
  starBright: Color;
  ridgeTop: Color;
  ridge: Color;
  towerRim: Color;
  towerTop: Color;
  tower: Color;
  windowLit: Color;
  windowLow: Color;
  windowDark: Color;
  groundLip: Color;
  groundEdge: Color;
  stone: Color;
  stoneTop: Color;
  mortar: Color;
  moss: Color;
  mossTip: Color;
  vine: Color;
  slabLip: Color;
  slabEdge: Color;
  slab: Color;
  slabUnder: Color;
  ironLip: Color;
  iron: Color;
  ironEdge: Color;
  /** the drifting floor mist, drawn in front of everything */
  mist: Color;
}

/**
 * One era's look. The stage layout (ridge, towers, floor, slabs, braziers) is shared and drawn with the palette;
 * the hooks add what is the era's own. k runs from 0 at the era's first wave to 1 at its last, so an era can change
 * as it goes on. The static background is rebuilt when the wave changes and dissolves in over a couple of seconds.
 */
export interface SceneDef {
  palette: ScenePalette | ((k: number) => ScenePalette);
  /** stars in the sky, 0 for none; the night uses 90 */
  stars: number | ((k: number) => number);
  /** lit window chance in the towers, 0 to 1; the night uses 0.5 */
  windows: number;
  /** static: drawn over the sky, before the ridge and towers (sun, moon, clouds, aurora, a rift in the sky) */
  sky?(bg: Uint32Array, r: Rng, k: number): void;
  /** static: drawn last, over the floor and slabs (puddles, crystals, cracks, roots) */
  decorate?(bg: Uint32Array, r: Rng, k: number): void;
  /** how strongly the braziers burn and glow, 0 for cold ones; the night uses 1 */
  braziers: number;
  /** each frame, light behind the actors: glows, fireflies, twinkling stars. Use engine/frame drawing after place() */
  ambient?(t: number, k: number): void;
  /** each frame, in front of the actors and particles but behind the mist: rain, petals, motes, falling ash */
  weather?(t: number, k: number): void;
  /** each simulation step, also behind the start menu: spawn particles such as rain splashes */
  update?(dt: number, k: number): void;
  /** a whole-screen cold flash, 0 to 1, for lightning */
  flash?(t: number, k: number): number;
  /** how much the floor mist shows, 0 to 1; the night uses 1 */
  mist: number;
}

export const paletteAt = (d: SceneDef, k: number): ScenePalette =>
  typeof d.palette === "function" ? d.palette(k) : d.palette;
export const starsAt = (d: SceneDef, k: number): number => (typeof d.stars === "function" ? d.stars(k) : d.stars);
