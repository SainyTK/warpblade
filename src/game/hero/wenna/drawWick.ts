import { PAL } from "../../../constants/palette";
import { WICK } from "../../../constants/wenna/wick";
import { WICK_LOOK as L, WICK_WAX as X } from "../../../constants/wenna/wickLook";
import { fleck, glow, place } from "../../../engine/frame";
import { blit, detailCanvas } from "../../../engine/sprite";
import type { Wick } from "../../../types/wenna";
import { clamp, ease } from "../../../utils/math";
import { game } from "../../state";
import { paintFlame } from "./wickFlame";
import { loadOfWick, squashOfWick } from "./wickMoves";
import { drawHealthPips, drawPool, drawSmokeCurl } from "./wickParts";

const V = PAL.wick;

/** every Wick is drawn on this one canvas in turn, its feet at the bottom middle so the floor cuts off what sinks */
const figure = detailCanvas(L.canvas.w, L.canvas.h, L.canvas.w / 2, L.canvas.h);

/** what a Wick is doing this frame, read from its fields */
interface WickLook {
  /** its size from the shrink of its last seconds */
  scale: number;
  /** 0 to 1 out of its pool, and 0 to 1 into its puddle */
  risen: number;
  melted: number;
  /** the waddle's frame, or -1 standing */
  waddle: number;
  /** 0 to 1 into a bite's lean */
  lean: number;
  /** 0 to 1 into the wind-up before a bite, a hop or a leap: it sinks and draws its flame back */
  load: number;
  /** 1 the moment it lands from a hop or a fall, easing back to 0 */
  squash: number;
  hurt: boolean;
}

function lookOf(w: Wick): WickLook {
  const walking = w.ground && Math.abs(w.vx) > 1;
  return {
    scale: clamp(w.life / WICK.shrink, L.least, 1),
    risen: w.t < WICK.rise ? ease.outQuad(clamp(w.t / WICK.rise)) : 1,
    melted: w.melt >= 0 ? clamp(w.melt / WICK.melt) : 0,
    waddle: walking ? Math.floor(game.t * 8) % 2 : -1,
    lean: w.lunge > 0 ? Math.sin(clamp(w.lunge / WICK.lunge) * Math.PI * 0.5 + 0.35) : 0,
    load: ease.outQuad(loadOfWick(w)),
    squash: squashOfWick(w),
    hurt: w.hurt > 0,
  };
}

/** a Wick standing still at full size */
const STILL: WickLook = { scale: 1, risen: 1, melted: 0, waddle: -1, lean: 0, load: 0, squash: 0, hurt: false };

/** the body's measures this frame, in art pixels on the canvas: `sink` pushes everything down into the floor */
interface Frame {
  tall: number;
  half: number;
  sink: number;
  /** how far ahead of its feet its crown sits */
  top: number;
}

/**
 * the wax body: a round-topped column with two stubby arms on a skirt of pooled wax, lit from the top left and shaded
 * down its far side; the arms swing with the waddle, and the leading one reaches out and up in a bite
 */
function body(f: Frame, o: WickLook): void {
  const s = figure;
  const skirt = L.skirt + o.melted * 1.5;
  s.begin();
  if (f.tall < f.half * 1.6) {
    const r = f.tall / 2;
    s.stroke(-f.half + r, f.sink - r, f.half - r, f.sink - r, r, X.body);
  } else {
    s.stroke(0, f.sink - f.half * 0.7, f.top, f.sink - f.tall + f.half, f.half, X.body);
    const y = f.sink - f.tall * L.armAt;
    const lead = f.top * L.armAt;
    const swing = o.waddle < 0 ? 0 : o.waddle === 0 ? 0.5 : -0.5;
    const biting = o.lean > 0.4;
    s.taper(
      lead + f.half * 0.6,
      y - swing,
      lead + f.half + (biting ? 2.4 : 1),
      y - swing + (biting ? -1 : 0.7),
      0.9,
      0.6,
      X.body,
    );
    s.taper(lead - f.half * 0.6, y + swing, lead - f.half - 0.9, y + swing + 0.8, 0.9, 0.6, X.body);
  }
  const t = L.skirtThick;
  s.stroke(-f.half - skirt + t, f.sink - t * 0.5, f.half + skirt - t, f.sink - t * 0.5, t, X.mid);
  s.shadeEdges(X.body, X.light, X.mid, 3);
  s.shadeEdges(X.mid, X.body, X.shade);
  s.commit();
}

/** the wax under the flame takes its violet, and one drip runs down the lit side to a bead */
function crownAndDrip(f: Frame): void {
  const s = figure;
  const crown = f.sink - f.tall;
  s.begin();
  s.dot(f.top, crown + 0.8, 0.8, X.crown);
  const lit = f.top * 0.7 - f.half * 0.55;
  s.stroke(lit, crown + 2, lit, crown + 3.4, 0.3, X.light);
  s.dot(lit, crown + 3.8, 0.55, X.light);
  s.commit(false);
}

/** two dark eyes with a spark of the flame in each; shut to slits while it is hurt */
function eyes(f: Frame, hurt: boolean): void {
  const s = figure;
  const x = f.top * 0.8 + L.eyeAhead;
  const y = f.sink - f.tall + L.eyeDrop;
  s.begin();
  for (const ex of [x, x + L.eyeGap]) {
    if (hurt) {
      s.block(ex - 0.25, y + 0.5, X.ink, 1.5, 0.5);
      continue;
    }
    s.block(ex, y, X.ink, 1, 1.5);
    s.set(ex, y, V[4]);
  }
  s.commit(false);
}

/** a spark that climbs off the flame and dies, so a standing Wick is never quite still */
function ember(w: Wick, x: number, y: number): void {
  const phase = (game.t * 1.3 + w.id * 0.37) % 1;
  if (phase > 0.6) return;
  fleck(x + Math.sin(phase * 9 + w.id) * 1.5, y - phase * 9, phase < 0.3 ? V[5] : V[4], 1 - phase / 0.6);
}

/**
 * A Wick in the world, about 12 px tall, drawn at full detail: an ivory wax body on a skirt of pooled wax, lit from the
 * top left with drips down its sides, two stubby arms, two dark eyes and a violet flame for a head with a gold root. It
 * rises out of a pool when lit, rocks as it waddles, leans in with its flame stretched forward to bite, gutters back
 * and shuts its eyes when hurt, shrinks over its last seconds, shows three health pips once hurt, and melts into a
 * puddle with a curl of smoke at its end. A Wick lit past the cap burns a touch paler.
 */
export function drawWick(w: Wick): void {
  place();
  const o = lookOf(w);
  const dir = w.face < 0 ? -1 : 1;
  const crouch = 1 - L.load.sink * o.load - L.land.sink * o.squash;
  const tall = L.tall * o.scale * (1 - o.melted * 0.85) * crouch - (o.waddle === 1 ? 0.5 : 0);
  const half = (L.half * o.scale ** 0.6 + o.melted * 2.2) * (1 + L.load.spread * o.load + L.land.spread * o.squash);
  const flameTall = L.flame.tall * o.scale * clamp(1 - o.melted * 2.5) * (o.lean > 0 ? L.flame.bite : 1);
  const rock = o.waddle < 0 ? 0 : o.waddle === 0 ? L.rock : -L.rock;
  const f: Frame = {
    tall,
    half,
    sink: (1 - o.risen) * (tall + flameTall + 1),
    top: o.lean * L.lean - o.load * L.load.back + rock,
  };
  if (o.risen < 1 || o.melted > 0) drawPool(w.x, w.y, half + 2 + o.melted * 4, o.risen < 1 ? 1 : 1 - o.melted * 0.3);
  const s = figure;
  s.clear();
  body(f, o);
  if (o.melted < 0.5 && tall >= 3) {
    crownAndDrip(f);
    eyes(f, o.hurt);
  }
  s.outline(X.ink);
  const crown = f.sink - tall;
  if (flameTall > 0.5) {
    const flash = o.lean > 0.6 ? 2 : o.lean > 0 ? 1 : 0;
    s.begin();
    paintFlame(s, {
      x: f.top,
      y: crown - 0.2,
      tall: flameTall,
      wide: L.flame.wide * o.scale ** 0.7,
      bend: o.hurt ? -2.4 : o.lean > 0 ? 2.6 * o.lean : o.load > 0 ? -L.load.bend * o.load : o.waddle >= 0 ? -0.8 : 0,
      lift: flash + (w.extra ? 1 : 0),
      t: Math.floor(game.t * L.flicker) / L.flicker,
      seed: w.id * 0.7,
    });
    s.commit(false);
  }
  blit(s, w.x, w.y, dir < 0);
  const fx = w.x + f.top * dir;
  const fy = w.y + crown;
  if (flameTall > 0.5 && o.risen >= 1) {
    const r = (o.lean > 0 ? 12 : 8) * o.scale;
    const k = (o.lean > 0 ? 0.5 : 0.28) * (1 - o.melted);
    glow(fx, fy - flameTall * 0.4, r, w.extra ? V[4] : V[3], k);
    if (o.melted <= 0) ember(w, fx, fy - flameTall);
  }
  if (o.melted > 0.15) drawSmokeCurl(w.x, fy - 1, (o.melted - 0.15) / 0.85, 4, 1);
  if (w.hp < w.max && w.melt < 0 && o.risen >= 1)
    drawHealthPips(Math.round(w.x), Math.round(fy - 8), clamp(w.hp / w.max));
}

/** a still Wick as a violet shape at (x, y), `alpha` strong: the copy a Wick leaves where it stood when a warp moves it */
export function drawWickGhost(x: number, y: number, alpha: number): void {
  place();
  const f: Frame = { tall: L.tall, half: L.half, sink: 0, top: 0 };
  const s = figure;
  s.clear();
  body(f, STILL);
  s.begin();
  paintFlame(s, { x: 0, y: -L.tall - 0.2, tall: L.flame.tall, wide: L.flame.wide, bend: 0, lift: 1, t: 0, seed: 0 });
  s.commit(false);
  blit(s, x, y, false, { alpha, tint: V[3], tintAmount: 0.75 });
  glow(x, y - L.tall, 6, V[4], 0.3 * alpha);
}
