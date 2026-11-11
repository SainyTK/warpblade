import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, TAU } from "../../../utils/math";
import { UNB_FLUSH, UNB_GLINT, UNB_IRIS, UNB_PUPIL, UNB_SCLERA, UNB_VEIN, UNB_WATERLINE } from "./unblinkingColors";
import type { Mirrored } from "./unblinkingMirror";
import type { UnblinkingPose } from "./unblinkingPose";
import { BALL, type BodyFrame, IRIS, lidLower, lidUpper, OPENING } from "./unblinkingShape";

/** the light on the wet white, toward the black sun at the top right and a little toward us */
const LIGHT = { x: 0.45, y: -0.55, z: 0.7 } as const;
/** how dark the white goes in the lid's shadow, within this many art pixels of the upper lid, and over the lower lid */
const LID_SHADOW = { near: 1, deep: 0.5, far: 2.2, soft: 0.25, lower: 0.8, lowerDeep: 0.15 } as const;
/** where the white's light falls from one tone to the next, darkest first, and how far the dither blurs those steps */
const SCLERA_STEPS = [0.15, 0.38, 0.6, 0.85] as const;
const DITHER = 0.14;
/** the white flushes toward the corners while it strains, from this share of the opening's half width */
const FLUSH = { from: 0.55, rate: 1.4 } as const;
/** as it glares the white flushes from this share of the half width, up to this much at the corners; its veins burn past that glare */
const GLARE = { from: 0.25, most: 0.55, burns: 0.5 } as const;

/** the iris's fibres: how many around, and how far they make the jagged collar ring wander */
const FIBERS = { count: 30, collar: 0.9 } as const;
/** the inner iris reaches this share of the way from the pupil's ring to the iris's edge */
const COLLAR_AT = 0.3;
/** widths of the pupil's ring of light, the collar's ember ring and the dark ring at the iris's edge */
const RINGS = { limb: 0.55, collar: 0.5, limbal: 0.9 } as const;
/** a pupil this small that burns this hot is a white point */
const HOT_POINT = { pupil: 2, heat: 0.7 } as const;
/** the iris in the lid's shadow, within this many art pixels of the upper lid */
const IRIS_SHADOW = 1.6;

/** the veins over the white, as segments in shares of the opening's half width and of its rest height */
const VEIN_SHARES: readonly (readonly [number, number, number, number])[] = [
  [-1, 0.05, -0.7, 0.15],
  [-0.7, 0.15, -0.52, 0.02],
  [-0.7, 0.15, -0.6, 0.42],
  [-0.95, -0.25, -0.72, -0.32],
  [1, 0.1, 0.74, 0],
  [0.74, 0, 0.55, 0.12],
  [0.74, 0, 0.62, -0.3],
  [0.95, 0.4, 0.72, 0.5],
];
/** the veins that swell into view while it strains */
const STRAIN_VEIN_SHARES: readonly (readonly [number, number, number, number])[] = [
  [-1, 0.4, -0.75, 0.6],
  [-0.75, 0.6, -0.55, 0.55],
  [-0.6, -0.4, -0.45, -0.2],
  [-0.95, -0.25, -0.62, -0.55],
  [1, -0.3, 0.8, -0.45],
  [0.8, -0.45, 0.6, -0.4],
  [0.62, -0.3, 0.48, -0.15],
  [0.95, 0.4, 0.6, 0.7],
];
/** the veins' width in art pixels, calm and strained; no vein comes nearer the middle than this share of the half width */
const VEIN = { calm: 0.28, strained: 0.42, from: 0.45 } as const;

const toArt = (v: readonly (readonly [number, number, number, number])[]) =>
  v.map(([u0, v0, u1, v1]) => [u0 * OPENING.x, v0 * OPENING.up, u1 * OPENING.x, v1 * OPENING.up] as const);
const VEINS = toArt(VEIN_SHARES);
const STRAIN_VEINS = toArt(STRAIN_VEIN_SHARES);

function nearVein(veins: typeof VEINS, u: number, v: number, width: number): boolean {
  for (const [u0, v0, u1, v1] of veins) {
    if (u < Math.min(u0, u1) - width || u > Math.max(u0, u1) + width) continue;
    if (v < Math.min(v0, v1) - width || v > Math.max(v0, v1) + width) continue;
    const du = u1 - u0;
    const dv = v1 - v0;
    const k = clamp(((u - u0) * du + (v - v0) * dv) / (du * du + dv * dv));
    if (Math.hypot(u - u0 - du * k, v - v0 - dv * k) < width) return true;
  }
  return false;
}

/** the iris's tones from its dark edge inward, stepped through by fibre, light and heat */
const OUTER_TONES: readonly Color[] = [
  UNB_IRIS.limbal,
  UNB_IRIS.outerDark,
  UNB_IRIS.outer,
  UNB_IRIS.outerLight,
  UNB_IRIS.inner,
];
const INNER_TONES: readonly Color[] = [UNB_IRIS.outerLight, UNB_IRIS.inner, UNB_IRIS.innerHot, UNB_IRIS.core];

/** the pupil's ring of light for how bright it burns */
const limbColor = (limb: number): Color =>
  limb > 0.75
    ? UNB_PUPIL.limbHot
    : limb > 0.45
      ? UNB_PUPIL.limbWarm
      : limb > 0.15
        ? UNB_PUPIL.limbDim
        : UNB_IRIS.outerDark;

/** one point of the iris, dx and dy from its middle (dx already foreshortened), or 0 outside it */
function irisColor(dx: number, dy: number, p: UnblinkingPose, shadowed: boolean): Color {
  const r = Math.hypot(dx, dy);
  if (r >= IRIS.r) return 0;
  if (r < p.pupil) {
    if (p.pupil < HOT_POINT.pupil && p.heat > HOT_POINT.heat) return r < p.pupil * 0.5 ? UNB_GLINT : UNB_IRIS.core;
    // a dull red glint deep in the pupil, low on the side away from the sun
    return Math.hypot(dx + p.pupil * 0.4, dy - p.pupil * 0.4) < 0.6 ? UNB_PUPIL.depth : UNB_PUPIL.disc;
  }
  if (r < p.pupil + RINGS.limb) return limbColor(p.limb);
  const sector = Math.floor((Math.atan2(dy, dx) / TAU + 0.5) * FIBERS.count);
  const fibre = grain(sector, 3);
  const collar = p.pupil + RINGS.limb + (IRIS.r - p.pupil) * COLLAR_AT + (fibre - 0.5) * FIBERS.collar;
  const shade = shadowed ? 1 : 0;
  if (r < collar) {
    const h = p.heat + (dy > 0 ? 0.15 : 0) + (fibre - 0.5) * 0.3;
    const tone = h > 0.85 ? 3 : h > 0.55 ? 2 : h > 0.25 ? 1 : 0;
    return INNER_TONES[Math.max(0, tone - shade)];
  }
  if (r < collar + RINGS.collar) return p.heat > 0.3 && !shadowed ? UNB_IRIS.collar : UNB_IRIS.outerLight;
  if (r > IRIS.r - RINGS.limbal) return UNB_IRIS.limbal;
  // the iris glows brighter low on the side away from the light, as light through a wet lens does
  const glowing = dy - dx * 0.3 > IRIS.r * 0.35 ? 1 : 0;
  const streak = fibre > 0.62 ? 1 : fibre < 0.25 ? -1 : 0;
  const tone = 2 + streak + glowing + (p.heat > 0.6 ? 1 : 0) - shade;
  return OUTER_TONES[clamp(tone, 1, OUTER_TONES.length - 1)];
}

/** one point of the white, fromLid below the upper lid's edge and aboveLid over the lower one */
function scleraColor(
  u: number,
  v: number,
  fromLid: number,
  aboveLid: number,
  p: UnblinkingPose,
  enraged: boolean,
  dither: number,
): Color {
  const nx = u / BALL.r;
  const ny = (v - BALL.y) / BALL.r;
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  let lit = nx * LIGHT.x + ny * LIGHT.y + nz * LIGHT.z;
  if (fromLid < LID_SHADOW.near) lit -= LID_SHADOW.deep;
  else if (fromLid < LID_SHADOW.far) lit -= LID_SHADOW.soft;
  if (aboveLid < LID_SHADOW.lower) lit -= LID_SHADOW.lowerDeep;
  lit += (dither - 0.5) * DITHER;
  let tone = 0;
  while (tone < SCLERA_STEPS.length && lit > SCLERA_STEPS[tone]) tone++;
  const side = Math.abs(u) / OPENING.x;
  if (side > VEIN.from) {
    const width = p.strain ? VEIN.strained : VEIN.calm;
    if (nearVein(VEINS, u, v, width) || (p.strain && nearVein(STRAIN_VEINS, u, v, width)))
      return enraged || p.glare > GLARE.burns ? UNB_VEIN.burning : p.strain ? UNB_VEIN.strained : UNB_VEIN.calm;
  }
  let c: Color = UNB_SCLERA[tone];
  if (p.strain && side > FLUSH.from) c = mix(c, UNB_FLUSH, clamp((side - FLUSH.from) * FLUSH.rate));
  if (p.glare > 0 && side > GLARE.from)
    c = mix(c, UNB_FLUSH, p.glare * GLARE.most * clamp((side - GLARE.from) / (1 - GLARE.from)));
  return c;
}

/** the glints on the wet eye: high on the iris toward the sun, a fleck beside it and a faint one low on the far side */
function paintGlints(m: Mirrored, p: UnblinkingPose, f: BodyFrame, ix: number, iy: number): void {
  const inside = (u: number, v: number) => v > lidUpper(u, p) + 0.6 && v < lidLower(u, p) - 0.4;
  const at = (u: number, v: number): [number, number] => [f.x + u * f.sx, f.y + v * f.sy];
  if (inside(ix + 2.4, iy - 3.6)) m.block(...at(ix + 2.4, iy - 3.6), UNB_GLINT, 1, 1);
  if (inside(ix + 3.9, iy - 2.4)) m.set(...at(ix + 3.9, iy - 2.4), UNB_GLINT);
  if (inside(ix - 3.4, iy + 2.9)) m.set(...at(ix - 3.4, iy + 2.9), UNB_SCLERA[4]);
  const wu = OPENING.x * 0.45;
  const wv = -OPENING.up * 0.32;
  if (inside(wu, wv)) {
    m.set(...at(wu, wv), UNB_GLINT);
    m.set(...at(wu + 0.5, wv - 0.25), UNB_GLINT);
  }
}

/**
 * The wet eyeball, pixel by pixel inside the lids' opening only: a white lit from the top right with the lid's shadow
 * across its top, veins creeping in from the corners, a wet line along the lower lid, and a layered iris (a dark edge,
 * streaked outer fibres, a jagged ember collar and a hot inner ring) around a pupil like a small black sun.
 */
export function paintEyeball(m: Mirrored, p: UnblinkingPose, f: BodyFrame, enraged: boolean): void {
  const ix = p.lookX;
  const iy = BALL.y + p.lookY;
  const squeeze = 1 - IRIS.foreshorten * Math.min(1, Math.abs(ix) / IRIS.r);
  const x0 = (Math.floor((f.x - OPENING.x * f.sx) * 2) + 0.5) / 2;
  const x1 = f.x + OPENING.x * f.sx;
  for (let X = x0; X <= x1; X += 0.5) {
    const u = (X - f.x) / f.sx;
    const top = f.y + lidUpper(u, p) * f.sy;
    const bottom = f.y + lidLower(u, p) * f.sy;
    if (bottom - top < 0.25) continue;
    const waterline = bottom - 0.5;
    for (let Y = (Math.floor(top * 2) + 0.5) / 2; Y < bottom; Y += 0.5) {
      if (Y <= top) continue;
      const v = (Y - f.y) / f.sy;
      const shadowed = Y - top < IRIS_SHADOW;
      let c = irisColor((u - ix) / squeeze, v - iy, p, shadowed);
      if (!c)
        c =
          Y >= waterline
            ? UNB_WATERLINE
            : scleraColor(u, v, (Y - top) / f.sy, (bottom - Y) / f.sy, p, enraged, bayerAt(X * 2 - 0.5, Y * 2 - 0.5));
      m.set(X, Y, c);
    }
  }
  if (p.open > 0.3) paintGlints(m, p, f, ix, iy);
}
