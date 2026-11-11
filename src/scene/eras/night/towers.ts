import { FH, FW, RES } from "../../../constants/stage";
import { scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER, type Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { FIRE_EDGE, FIRE_STONE, MOON_EDGE, MOON_STONE, OPENING, WINDOW_FRAME, WINDOW_PANE } from "./colors";
import { valueNoise } from "./noise";

/**
 * The ruined towers and the far ridge at image pixel detail: moonlight on the side that faces the moon, courses of
 * masonry, cracks, dark openings, and firelight on the stone around each lit window.
 */

const TOWER = [LAYER.tower] as const;
const FAR = [LAYER.tower, LAYER.ridge] as const;
/** what a tower's edge stands against when moonlight can reach it */
const OPEN: readonly Layer[] = [LAYER.sky, LAYER.celestial, LAYER.ridge];
/** moonlight wraps this far round a tower from its right edge, in image pixels, and the shadow side is this wide */
const WRAP = { reach: 14, wash: 0.34, edge: 0.6, top: 0.3, shadow: 5, shadowDepth: 0.84 };
/** a course of masonry is this tall and a block this wide, in image pixels */
const COURSE = { tall: 8, wide: 14, joint: 0.8, blockDepth: 0.16, worn: 0.3 };
const CRACKS = { count: 16, steps: [10, 34] as const, depth: 0.62 };
const OPENINGS = { count: 9, tries: 80 };
/** firelight around a lit window reaches this far, in image pixels */
const WINDOW_LIGHT = { reach: 15, strength: 0.42 };

/** a lit window in image pixels: "f" frame, "a" to "d" the pane from top to bottom, "s" the lit sill */
const WINDOW = [".ff.", "faaf", "fbbf", "fbbf", "fccf", "fddf", "ssss"];
/** a dark opening: "o" the dark, "j" the jamb that faces the moon, "s" the sill catching light */
const OPENING_SHAPE = ["..oo..", ".oooo.", "joooo.", "joooo.", "joooo.", "joooo.", "joooo.", "ssssss"];

/** how many image pixels to the right the tower's lit edge is, or -1 when it is out of reach or stands against something near */
function toRightEdge(paint: PlatePaint, ix: number, iy: number): number {
  for (let d = 1; d <= WRAP.reach; d++) {
    const layer = paint.layerAt(ix + d, iy);
    if (layer === LAYER.tower) continue;
    return layer !== undefined && OPEN.includes(layer) ? d - 1 : -1;
  }
  return -1;
}

/** moonlight on the right of each tower and along its top, shadow on its left, and the ridge's lit crest */
function paintMoonlight(paint: PlatePaint): void {
  for (let iy = 0; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++) {
      const layer = paint.layerAt(ix, iy);
      if (layer === LAYER.ridge) {
        const above = paint.layerAt(ix, iy - 1);
        if (above === LAYER.sky || above === LAYER.celestial) paint.blend(ix, iy, MOON_EDGE, 0.22);
        continue;
      }
      if (layer !== LAYER.tower) continue;
      const d = toRightEdge(paint, ix, iy);
      if (d >= 0) {
        const near = 1 - d / WRAP.reach;
        paint.blend(ix, iy, MOON_STONE, WRAP.wash * near * near);
        if (d === 0) paint.blend(ix, iy, MOON_EDGE, WRAP.edge * (0.5 + 0.5 * valueNoise(ix / 7, iy / 14)));
      }
      const above = paint.layerAt(ix, iy - 1);
      if (above !== undefined && OPEN.includes(above)) paint.blend(ix, iy, MOON_EDGE, WRAP.top);
      for (let s = 1; s <= WRAP.shadow; s++) {
        const left = paint.layerAt(ix - s, iy);
        if (left === LAYER.tower) continue;
        if (left !== undefined && OPEN.includes(left)) paint.put(ix, iy, scale(paint.get(ix, iy), WRAP.shadowDepth));
        break;
      }
    }
}

/** courses of blocks, each block a little lighter or darker, the joints worn away in patches */
function paintMasonry(paint: PlatePaint): void {
  for (let iy = 0; iy < FH; iy++) {
    const course = Math.floor(iy / COURSE.tall);
    const shift = course % 2 ? COURSE.wide / 2 : 0;
    for (let ix = 0; ix < FW; ix++) {
      if (!paint.on(ix, iy, TOWER)) continue;
      const block = Math.floor((ix + shift) / COURSE.wide);
      const kept = valueNoise(ix / 36 + 3, iy / 36 + 11) > COURSE.worn;
      const joint = kept && (iy % COURSE.tall === 0 || (ix + shift) % COURSE.wide === 0);
      const tone = 1 + (grain(block * 5 + 1, course * 11 + 3) - 0.5) * COURSE.blockDepth;
      paint.put(ix, iy, scale(paint.get(ix, iy), joint ? COURSE.joint : tone));
    }
  }
}

/** thin cracks wandering down the stone */
function paintCracks(paint: PlatePaint, r: Rng): void {
  for (let i = 0; i < CRACKS.count; i++) {
    let ix = r.int(0, FW - 1);
    let iy = r.int(90, FH - 80);
    const steps = r.int(CRACKS.steps[0], CRACKS.steps[1]);
    const lean = r.chance(0.5) ? 1 : -1;
    for (let s = 0; s < steps && paint.on(ix, iy, TOWER); s++) {
      paint.put(ix, iy, scale(paint.get(ix, iy), CRACKS.depth));
      iy++;
      if (r.chance(0.45)) ix += r.chance(0.75) ? lean : -lean;
    }
  }
}

/** whether a shape's whole box, with a margin, lies on tower stone */
function fits(paint: PlatePaint, x0: number, y0: number, w: number, h: number): boolean {
  for (let y = y0 - 3; y < y0 + h + 3; y++)
    for (let x = x0 - 3; x < x0 + w + 3; x++) if (!paint.on(x, y, TOWER)) return false;
  return true;
}

/** dark arched openings, each with a moonlit jamb and sill, so the walls have depth */
function paintOpenings(paint: PlatePaint, r: Rng): void {
  const w = OPENING_SHAPE[0].length;
  const h = OPENING_SHAPE.length;
  for (let made = 0, tries = 0; made < OPENINGS.count && tries < OPENINGS.tries; tries++) {
    const x0 = r.int(0, FW - w);
    const y0 = r.int(100, FH - 110);
    if (!fits(paint, x0, y0, w, h)) continue;
    made++;
    OPENING_SHAPE.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === "o") paint.put(x0 + i, y0 + j, OPENING);
        else if (row[i] === "j") paint.blend(x0 + i, y0 + j, MOON_EDGE, 0.4);
        else if (row[i] === "s") paint.blend(x0 + i, y0 + j, MOON_EDGE, 0.28);
      }
    });
  }
}

/** the top left image pixel of each lit window, found by its color before the stone is repainted */
function litWindows(paint: PlatePaint, P: ScenePalette): [number, number][] {
  const lit: [number, number][] = [];
  for (let iy = RES; iy < FH; iy += RES)
    for (let ix = 0; ix < FW; ix += RES)
      if (paint.get(ix, iy) === P.windowLit && paint.get(ix, iy - RES) !== P.windowLit) lit.push([ix, iy]);
  return lit;
}

/** each lit window gets a frame, a pane that is brightest at the top and a sill, and warms the stone around it */
function paintWindows(paint: PlatePaint, lit: readonly (readonly [number, number])[]): void {
  const tones: Record<string, number> = {
    f: WINDOW_FRAME,
    a: WINDOW_PANE[0],
    b: WINDOW_PANE[1],
    c: WINDOW_PANE[2],
    d: WINDOW_PANE[3],
  };
  for (const [wx, wy] of lit) {
    const cx = wx + 1;
    const cy = wy + 2;
    for (let iy = cy - WINDOW_LIGHT.reach; iy <= cy + WINDOW_LIGHT.reach; iy++)
      for (let ix = cx - WINDOW_LIGHT.reach; ix <= cx + WINDOW_LIGHT.reach; ix++) {
        const near = 1 - Math.hypot(ix - cx, (iy - cy) * 0.8) / WINDOW_LIGHT.reach;
        if (near > 0) paint.blend(ix, iy, FIRE_STONE, WINDOW_LIGHT.strength * near * near, TOWER);
      }
    WINDOW.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ix = wx - 1 + i;
        const iy = wy - 1 + j;
        if (row[i] === "s") paint.blend(ix, iy, FIRE_EDGE, 0.55, FAR);
        else if (row[i] !== ".") paint.put(ix, iy, tones[row[i]], FAR);
      }
    });
  }
}

export function paintTowers(paint: PlatePaint, r: Rng, P: ScenePalette): void {
  const lit = litWindows(paint, P);
  paintMasonry(paint);
  paintCracks(paint, r);
  paintMoonlight(paint);
  paintOpenings(paint, r);
  paintWindows(paint, lit);
}
