import { ORRIN_SKIN } from "../../../../constants/characters/orrin/look";
import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/**
 * Small drawing parts for Orrin's 16 x 16 icons: his steel chain and brass hook, rift tears, anchors, kites, bells,
 * weights and the dancer himself.
 */
type S = SpriteCanvas;
type Point = readonly [number, number];
export const OC = ORRIN_SKIN.colors;
/** his brass, dark to pale: the hook, the trims and every tip flash */
export const BRASS = PAL.brass;
/** the rift tears his hook bites into */
export const VOLT = PAL.volt;
export const RUST_FLAKE = [hex("#5a2a12"), hex("#9a4a1e"), hex("#d0702e"), hex("#f0a060")] as const;
export const BLOOD = hex("#b02a2a");
export const BLOOD_LIGHT = hex("#ff7a6a");

/** the two colours a chain's links alternate in: steel, or bright brass on an evolved icon */
export interface LinkColors {
  light: Color;
  dark: Color;
}
export const STEEL_LINKS: LinkColors = { light: OC.steelLight, dark: OC.steel };
export const BRASS_LINKS: LinkColors = { light: BRASS[4], dark: BRASS[2] };

/**
 * a chain along a path, two pixels thick, its links alternating light and dark every two pixels; the path runs over u
 * from 0 to 1 and is about `length` pixels long
 */
export function links(s: S, at: (u: number) => Point, length: number, c: LinkColors = STEEL_LINKS): void {
  fill(s, () => {
    const n = Math.max(2, Math.ceil(length * 3));
    let [px, py] = at(0);
    let run = 0;
    for (let i = 0; i <= n; i++) {
      const [x, y] = at(i / n);
      run += Math.hypot(x - px, y - py);
      px = x;
      py = y;
      s.dot(x, y, 0.75, Math.floor(run / 2) % 2 ? c.dark : c.light);
    }
  });
}

/** a chain hanging in a curve from (x0, y0) to (x1, y1), pulled toward the control point (cx, cy) */
export function chain(
  s: S,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  c?: LinkColors,
): void {
  const at = (u: number): Point => [
    (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * cx + u * u * x1,
    (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * cy + u * u * y1,
  ];
  links(s, at, Math.hypot(cx - x0, cy - y0) + Math.hypot(x1 - cx, y1 - cy), c);
}

/** a chain round an arc of radius r about (cx, cy), from angle a0 to a1 */
export function chainArc(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c?: LinkColors): void {
  links(
    s,
    (u) => [cx + Math.cos(a0 + (a1 - a0) * u) * r, cy + Math.sin(a0 + (a1 - a0) * u) * r],
    Math.abs(a1 - a0) * r,
    c,
  );
}

/** a chain spiralling out from radius r0 to r1 about (cx, cy) over `turns` turns, starting at angle a0 */
export function spiral(
  s: S,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  turns: number,
  a0 = 0,
  c?: LinkColors,
): void {
  const at = (u: number): Point => {
    const a = a0 + u * turns * TAU;
    const r = r0 + (r1 - r0) * u;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  links(s, at, turns * TAU * (r0 + r1) * 0.5, c);
}

/**
 * his brass hook, its eye at (x, y): the shank runs `size` along (ux, uy), bends round to one side (1 turns a hanging
 * hook to the right, -1 to the left) and turns back up to a white point; `bright` lights it pale for an evolved icon, a hook not `thick` is a thin one
 */
export function hook(
  s: S,
  x: number,
  y: number,
  ux: number,
  uy: number,
  size = 5,
  side = 1,
  bright = false,
  thick = true,
): void {
  const L = Math.hypot(ux, uy) || 1;
  const dx = ux / L;
  const dy = uy / L;
  const nx = dy * side;
  const ny = -dx * side;
  const r = thick ? Math.max(1.9, size * 0.4) : Math.max(1.2, size * 0.32);
  const bx = x + dx * size;
  const by = y + dy * size;
  const cx = bx + nx * r;
  const cy = by + ny * r;
  const w = thick ? 0.75 : 0.5;
  const body = bright ? BRASS[4] : BRASS[3];
  const shade = bright ? BRASS[3] : BRASS[2];
  const tipX = cx + nx * r - dx * r * 1.3;
  const tipY = cy + ny * r - dy * r * 1.3;
  fill(s, () => {
    s.stroke(x, y, bx, by, w, body);
    const n = 10;
    for (let i = 0; i <= n; i++) {
      const t = (Math.PI * i) / n;
      s.dot(cx + (-nx * Math.cos(t) + dx * Math.sin(t)) * r, cy + (-ny * Math.cos(t) + dy * Math.sin(t)) * r, w, shade);
    }
    s.stroke(cx + nx * r, cy + ny * r, tipX, tipY, w, body);
    if (thick) seg(s, x - nx * 0.5, y - ny * 0.5, bx - nx * 0.5, by - ny * 0.5, bright ? BRASS[5] : BRASS[4]);
    s.set(x, y, BRASS[1]);
    s.set(tipX, tipY, bright ? WHITE : BRASS[5]);
  });
}

/** a rift tear: a jagged lens of volt light centred on (x, y), w across and h tall, with a white-hot seam */
export function tear(s: S, x: number, y: number, w: number, h: number): void {
  fill(s, () =>
    s.poly(
      [
        [x - w * 0.5, y],
        [x - w * 0.2, y - h * 0.5],
        [x, y - h * 0.3],
        [x + w * 0.25, y - h * 0.5],
        [x + w * 0.5, y],
        [x + w * 0.2, y + h * 0.5],
        [x - w * 0.05, y + h * 0.3],
        [x - w * 0.25, y + h * 0.5],
      ],
      VOLT[1],
    ),
  );
  fill(s, () => {
    seg(s, x - w * 0.35, y, x + w * 0.35, y, VOLT[3]);
    s.set(x, y, WHITE);
  });
}

/** an iron anchor, its ring at (x, y) and its crown h below, the flukes lit brass on an evolved icon */
export function anchor(s: S, x: number, y: number, h = 10, bright = false): void {
  const r = h * 0.42;
  const by = y + h - r;
  const tip = bright ? BRASS[4] : OC.steelLight;
  fill(s, () => {
    s.dot(x, y, 1.2, OC.steelDark);
    s.set(x, y, 0);
  });
  fill(s, () => {
    seg(s, x, y + 1.5, x, y + h, OC.steel);
    seg(s, x - 2, y + 2.5, x + 2, y + 2.5, OC.steel);
    seg(s, x - 0.5, y + 3.5, x - 0.5, y + h - 1, OC.steelLight);
  });
  fill(s, () => {
    for (let a = 0.15 * Math.PI; a <= 0.85 * Math.PI; a += 0.08)
      s.set(x + Math.cos(a) * r, by + Math.sin(a) * r, OC.steel);
    for (const k of [-1, 1]) {
      const fx = x + k * r * Math.cos(0.15 * Math.PI);
      const fy = by + r * Math.sin(0.15 * Math.PI);
      seg(s, fx, fy, fx + k * 0.5, fy - 2, tip);
    }
  });
}

/** a brass bell, its crown at (x, y) and r across its mouth, with a clapper below */
export function bell(s: S, x: number, y: number, r: number, bright = false): void {
  fill(s, () => {
    s.poly(
      [
        [x - r * 0.45, y],
        [x + r * 0.45, y],
        [x + r * 0.6, y + r * 0.9],
        [x + r, y + r * 1.5],
        [x - r, y + r * 1.5],
        [x - r * 0.6, y + r * 0.9],
      ],
      bright ? BRASS[4] : BRASS[3],
    );
    seg(s, x - r * 0.3, y + 1, x - r * 0.5, y + r * 1.2, bright ? BRASS[5] : BRASS[4]);
    seg(s, x - r + 1, y + r * 1.5, x + r - 1, y + r * 1.5, BRASS[2]);
  });
  fill(s, () => s.dot(x, y + r * 1.5 + 1, Math.max(0.7, r * 0.25), BRASS[1]));
}

/** a small diamond kite of brass on a string, its nose at (x, y), r across, the string trailing to (tx, ty) */
export function kite(s: S, x: number, y: number, r: number, tx: number, ty: number, bright = false): void {
  fill(s, () => seg(s, x, y + r * 1.3, tx, ty, OC.steelLight));
  fill(s, () => {
    s.poly(
      [
        [x + 0.5, y],
        [x + r * 0.75 + 0.5, y + r * 0.5],
        [x + 0.5, y + r * 1.4],
        [x - r * 0.75 + 0.5, y + r * 0.5],
      ],
      bright ? BRASS[4] : BRASS[3],
    );
    seg(s, x, y + 1, x - r * 0.5, y + r * 0.5, bright ? WHITE : BRASS[5]);
    seg(s, x, y + 1, x, y + r * 1.2, BRASS[1]);
  });
}

/** a heavy iron ball, spiked on an evolved icon */
export function ball(s: S, x: number, y: number, r: number, spiked = false): void {
  if (spiked)
    fill(s, () => {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + 0.2;
        s.stroke(
          x + Math.cos(a) * r,
          y + Math.sin(a) * r,
          x + Math.cos(a) * (r + 1.8),
          y + Math.sin(a) * (r + 1.8),
          0.4,
          OC.steelLight,
        );
      }
    });
  fill(s, () => {
    s.dot(x, y, r, OC.steel);
    s.dot(x - r * 0.3, y - r * 0.3, r * 0.5, OC.steelLight);
    s.set(x - r * 0.45, y - r * 0.45, OC.steelGlint);
  });
}

/** a brass plumb bob hanging from (x, y), r across, its point down */
export function plumb(s: S, x: number, y: number, r: number): void {
  fill(s, () => {
    s.poly(
      [
        [x + 0.5, y],
        [x + r + 0.5, y + r],
        [x + 0.5, y + r * 2.6],
        [x - r + 0.5, y + r],
      ],
      BRASS[3],
    );
    seg(s, x, y + 1, x - r + 1, y + r, BRASS[5]);
    seg(s, x + 1, y + r * 2.2, x + r - 1, y + r + 1, BRASS[2]);
    s.set(x, y + r * 2.6 - 1, WHITE);
  });
}

/** one of his light boots, sole facing right, the heel at (x, y) */
export function boot(s: S, x: number, y: number, bright = false): void {
  fill(s, () => {
    s.poly(
      [
        [x, y - 6],
        [x + 3, y - 6],
        [x + 3, y - 2],
        [x + 7, y - 1.5],
        [x + 7, y + 1],
        [x, y + 1],
      ],
      OC.bootLight,
    );
    seg(s, x, y - 4, x + 2, y - 4, bright ? BRASS[4] : OC.trim);
  });
  fill(s, () => seg(s, x, y + 1, x + 6, y + 1, OC.bootDark));
}

/** a fence post of dark wood with a brass cap, from (x, y0) down to y1 */
export function post(s: S, x: number, y0: number, y1: number, bright = false): void {
  fill(s, () => s.block(x - 0.5, y0, OC.boot, 2, y1 - y0));
  fill(s, () => s.block(x - 1, y0 - 1, bright ? BRASS[4] : BRASS[3], 3, 1));
}

/** a barb: a short pale spike off the chain at (x, y), pointing along (dx, dy) */
export function barb(s: S, x: number, y: number, dx: number, dy: number, c: Color = OC.steelGlint): void {
  fill(s, () => seg(s, x, y, x + dx, y + dy, c));
}

/** the dancer, eleven pixels tall, facing right with his chain arm raised: copper hair, indigo vest, dark sash */
const DANCER = [
  ".hHH...",
  "hhSSS..",
  ".hSSS..",
  "..SS...",
  ".VVVVK.",
  ".VVVV.K",
  ".VCVV..",
  ".TTTT..",
  ".P..P..",
  ".P...P.",
  ".B...B.",
] as const;
const DANCER_COLORS: Record<string, Color> = {
  h: OC.hair,
  H: OC.hairLight,
  S: OC.skin,
  K: OC.skinLight,
  V: OC.coat,
  C: OC.trim,
  T: OC.scarf,
  P: OC.pants,
  B: OC.boot,
};
/** a shade of him in rift light */
const SHADE_COLORS: Record<string, Color> = {
  h: VOLT[3],
  H: VOLT[4],
  S: VOLT[3],
  K: VOLT[4],
  V: VOLT[2],
  C: VOLT[4],
  T: VOLT[1],
  P: VOLT[2],
  B: VOLT[1],
};

/** the dancer, his feet at (x, y); a shade draws him in rift light */
export function dancer(s: S, x: number, y: number, shade = false): void {
  fill(s, () => s.pixels(DANCER, shade ? SHADE_COLORS : DANCER_COLORS, x - 3, y - 10));
}

/** a reel: a brass drum wound with chain, seen face on, with a crank */
export function reel(s: S, x: number, y: number, r: number): void {
  fill(s, () => {
    s.dot(x, y, r, BRASS[2]);
    s.dot(x, y, r - 1, OC.steel);
  });
  fill(s, () => {
    for (let a = 0; a < TAU; a += 0.5) s.set(x + Math.cos(a) * (r - 1.5), y + Math.sin(a) * (r - 1.5), OC.steelLight);
    s.dot(x, y, 0.9, BRASS[4]);
  });
}

/** flakes of rust flung out round a point */
export function flakes(s: S, pts: readonly Point[]): void {
  fill(s, () => {
    for (const [i, [x, y]] of pts.entries()) {
      s.set(x, y, RUST_FLAKE[1 + (i % 3)]);
      if (i % 2) s.set(x + 1, y, RUST_FLAKE[1]);
    }
  });
}

/** an arc of motion dashes round (cx, cy), every third pixel left out */
export function swingArc(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c: Color): void {
  fill(s, () => {
    const n = Math.ceil(Math.abs(a1 - a0) * r * 1.5);
    for (let k = 0; k <= n; k++) {
      if (k % 3 === 2) continue;
      const a = a0 + ((a1 - a0) * k) / n;
      s.set(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), c);
    }
  });
}

/** a ring lying flat on the floor round (cx, y), rx across and ry deep, its far half dashed */
export function floorRing(s: S, cx: number, y: number, rx: number, ry: number, c: Color): void {
  fill(s, () => {
    const n = Math.ceil(rx * 6);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      if (Math.sin(a) < 0 && k % 2) continue;
      s.set(Math.round(cx + Math.cos(a) * rx), Math.round(y + Math.sin(a) * ry), c);
    }
  });
}
