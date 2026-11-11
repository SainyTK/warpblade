import { GROUND, RES } from "../../../constants/stage";
import { glow, place } from "../../../engine/frame";
import { blit } from "../../../engine/sprite";
import type { SpriteBox, SpriteImage } from "../../../types/sprite";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { ridgeTopAt } from "../../terrain";
import { CHUNK } from "./colors";
import { cloud } from "./noise";
import { TOWERS } from "./towers";

/**
 * The tower tops torn loose. Each is lifted off the finished plate as a picture of its own, stone, veins and all,
 * and floats over its stump each frame; the sky behind shows where it was.
 */

/** the towers that break first, in order */
const BREAK_ORDER = [3, 0, 5, 2, 6];
/** how ragged a break is, in image pixels: the height of its broad steps and of its chipped edge */
const RAGGED = { blocks: 14, chips: 4 };
/** how far the break between a top's two pieces leans, in image pixels across per pixel down */
const SPLIT_LEAN = 0.35;
/** how strongly the torn edge of a stump and the underside of a floating piece glow */
const STUMP_GLOW = 0.55;
const UNDER_GLOW = 0.7;

interface Chunk {
  image: SpriteImage & { box: SpriteBox };
  /** the picture's top left corner where the tower top used to sit, in art pixels */
  x: number;
  y: number;
  lift: number;
  phase: number;
  /** where the light under it sits, in art pixels */
  cx: number;
  bottom: number;
}
const chunks: Chunk[] = [];

/** one image pixel taken off the plate */
interface Taken {
  ix: number;
  iy: number;
  c: number;
}

/** build a floating piece from the pixels taken, its underside lit by the glow that holds it up */
function addChunk(taken: readonly Taken[], lift: number, phase: number): void {
  if (taken.length === 0) {
    return;
  }
  let x0 = Number.POSITIVE_INFINITY;
  let y0 = Number.POSITIVE_INFINITY;
  let x1 = 0;
  let y1 = 0;
  for (const t of taken) {
    x0 = Math.min(x0, t.ix);
    y0 = Math.min(y0, t.iy);
    x1 = Math.max(x1, t.ix);
    y1 = Math.max(y1, t.iy);
  }
  // the picture starts on a whole art pixel, so it sits on the plate's own grid when it is not lifted
  x0 -= x0 % RES;
  y0 -= y0 % RES;
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const d = new Uint32Array(w * h);
  for (const t of taken) {
    d[(t.iy - y0) * w + t.ix - x0] = t.c;
  }
  for (let x = 0; x < w; x++) {
    for (let y = h - 1; y >= 0; y--) {
      const i = y * w + x;
      if (!d[i] || (y < h - 1 && d[i + w])) {
        continue;
      }
      d[i] = mix(d[i], grain(x >> 2, y0) > 0.75 ? CHUNK.rimHot : CHUNK.rim, UNDER_GLOW);
      if (y > 0 && d[i - w]) {
        d[i - w] = mix(d[i - w], CHUNK.rim, UNDER_GLOW * 0.5);
      }
      if (y > 1 && d[i - 2 * w]) {
        d[i - 2 * w] = mix(d[i - 2 * w], CHUNK.rim, UNDER_GLOW * 0.2);
      }
    }
  }
  chunks.push({
    image: { w, h, ox: 0, oy: 0, res: RES, d, box: { x0: 0, y0: 0, x1: w - 1, y1: h - 1 } },
    x: x0 / RES,
    y: y0 / RES,
    lift,
    phase,
    cx: (x0 + w / 2) / RES,
    bottom: (y1 + 1) / RES,
  });
}

/** the first row of a column that belongs to a tower, or the floor line when none does */
function roofAt(p: PlatePaint, ix: number): number {
  for (let iy = 0; iy < GROUND * RES; iy++) {
    if (p.layerAt(ix, iy) === LAYER.tower) {
      return iy;
    }
  }
  return GROUND * RES;
}

/**
 * static: tear the tops off more towers as k grows. Each top splits in two pieces; the plate takes the sky's own
 * picture where they were, and the stump's torn edge glows.
 */
export function liftChunks(p: PlatePaint, sky: PlatePaint, r: Rng, k: number): void {
  chunks.length = 0;
  const count = 2 + Math.round(k * 3);
  for (const ti of BREAK_ORDER.slice(0, count)) {
    const [tx, tw] = TOWERS[ti];
    const first = tx * RES;
    const last = (tx + tw) * RES - 1;
    let roof = GROUND * RES;
    for (let ix = first; ix <= last; ix++) {
      roof = Math.min(roof, roofAt(p, ix));
    }
    if (roof >= GROUND * RES) {
      continue;
    }
    const depth = (r.range(9, 15) + k * 6) * RES;
    const split = first + Math.round(tw * RES * r.range(0.35, 0.65));
    const parts: Taken[][] = [[], []];
    for (let ix = first; ix <= last; ix++) {
      const x = ix / RES;
      // the break is ragged: broad steps of fallen blocks with a finer chipped edge
      const ragged = (cloud(ix, ti * 9, 14, 3) - 0.5) * RAGGED.blocks + (cloud(ix, ti * 9, 3, 4) - 0.5) * RAGGED.chips;
      const cut = Math.min((ridgeTopAt(Math.floor(x)) - 2) * RES, Math.floor(roof + depth + ragged));
      for (let iy = roof; iy < cut; iy++) {
        if (p.layerAt(ix, iy) !== LAYER.tower) {
          continue;
        }
        // the two pieces part along a slanted break
        parts[ix + (iy - roof) * SPLIT_LEAN < split ? 0 : 1].push({ ix, iy, c: p.get(ix, iy) });
        p.put(ix, iy, sky.get(ix, iy));
      }
      p.blend(ix, cut, CHUNK.rim, STUMP_GLOW, [LAYER.tower]);
      p.blend(ix, cut + 1, CHUNK.rim, STUMP_GLOW * 0.4, [LAYER.tower]);
    }
    const lift = 5 + k * 10 + r.range(0, 4);
    addChunk(parts[0], lift, r.range(0, 6));
    addChunk(parts[1], lift + r.range(2, 6), r.range(0, 6));
  }
}

/** each frame: the broken tops bob over their stumps on a soft light */
export function drawChunks(t: number): void {
  for (const c of chunks) {
    const dy = -c.lift + Math.sin(t * 0.7 + c.phase) * 1.5;
    blit(c.image, c.x, c.y + dy, false);
    place();
    glow(c.cx, c.bottom + dy + 3, 10, CHUNK.glow, 0.12 + 0.05 * Math.sin(t * 1.3 + c.phase));
  }
}
