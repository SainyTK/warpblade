import { BRAZIERS, GROUND, H, PLATFORMS, W } from "../../../constants/stage";
import { glow, place, putScreen, toScreenX, toScreenY } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { hex, mix } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { ridgeTopAt } from "../../terrain";

/** The broken ruins of the abyss: tower tops torn off and floating, and glowing cracks through the floor and slabs. */

/** the towers of the shared layout: left x, width, top */
const TOWERS: readonly (readonly [number, number, number])[] = [
  [14, 22, 70],
  [58, 14, 92],
  [96, 18, 60],
  [150, 26, 54],
  [196, 12, 88],
  [232, 20, 66],
  [292, 18, 80],
];
/** the towers that break first, in order */
const BREAK_ORDER = [3, 0, 5, 2, 6];

const CRIMSON = { hot: hex("#ff8aa8"), lit: hex("#d8325a"), body: hex("#7a1434"), glow: hex("#c02048") };
const VIOLET = { hot: hex("#e8b8ff"), lit: hex("#9a4ad8"), body: hex("#44186a"), glow: hex("#7a36c8") };
const CRACK_EDGE = hex("#06020a");
const CHUNK_RIM = hex("#9a3a6a");
const LIFT_GLOW = hex("#8a2a6a");
const FLAME = [hex("#f4dcff"), hex("#c48af0"), hex("#7a3cc0"), hex("#3e1a70")];
const FLAME_GLOW = hex("#8a4ad8");

interface Chunk {
  xs: Int16Array;
  ys: Int16Array;
  cs: Uint32Array;
  lift: number;
  phase: number;
  cx: number;
  bottom: number;
}
interface Glint {
  x: number;
  y: number;
  c: Color;
  p: number;
}

const chunks: Chunk[] = [];
const glints: Glint[] = [];
/** the sky as it was before the towers were drawn, to paint back where a tower top broke away */
const skySnap = new Uint32Array(W * H);

export function saveSky(bg: Uint32Array): void {
  skySnap.set(bg);
}

function addChunk(px: number[], lift: number, phase: number): void {
  if (px.length < 3) return;
  const n = px.length / 3;
  const xs = new Int16Array(n);
  const ys = new Int16Array(n);
  const cs = new Uint32Array(n);
  let sx = 0;
  let bottom = 0;
  const key = new Set<number>();
  for (let i = 0; i < n; i++) key.add(px[i * 3 + 1] * W + px[i * 3]);
  for (let i = 0; i < n; i++) {
    xs[i] = px[i * 3];
    ys[i] = px[i * 3 + 1];
    // the underside catches the glow that holds it up
    cs[i] = key.has((ys[i] + 1) * W + xs[i]) ? px[i * 3 + 2] : CHUNK_RIM;
    sx += xs[i];
    bottom = Math.max(bottom, ys[i]);
  }
  chunks.push({ xs, ys, cs, lift, phase, cx: sx / n, bottom });
}

/** tear the tops off more towers as k grows; each top splits in two pieces that float above the stump */
function breakTowers(bg: Uint32Array, r: Rng, k: number, stumpTop: Color): void {
  chunks.length = 0;
  const count = 2 + Math.round(k * 3);
  for (const ti of BREAK_ORDER.slice(0, count)) {
    const [tx, tw] = TOWERS[ti];
    let roof = H;
    for (let x = tx; x < tx + tw; x++)
      for (let y = 0; y < GROUND; y++)
        if (bg[y * W + x] !== skySnap[y * W + x]) {
          roof = Math.min(roof, y);
          break;
        }
    if (roof >= GROUND) continue;
    const depth = r.range(9, 15) + k * 6;
    const split = tx + Math.round(tw * r.range(0.35, 0.65));
    const parts: number[][] = [[], []];
    for (let x = tx; x < tx + tw && x < W; x++) {
      const cut = Math.min(ridgeTopAt(x) - 2, Math.floor(roof + depth + Math.sin(x * 1.7 + ti) * 2 + r.range(-1, 1)));
      for (let y = roof; y < cut; y++) {
        const i = y * W + x;
        if (bg[i] === skySnap[i]) continue;
        parts[x < split ? 0 : 1].push(x, y, bg[i]);
        bg[i] = skySnap[i];
      }
      if (bg[cut * W + x] !== skySnap[cut * W + x]) bg[cut * W + x] = stumpTop;
    }
    const lift = 5 + k * 10 + r.range(0, 4);
    addChunk(parts[0], lift, r.range(0, 6));
    addChunk(parts[1], lift + r.range(2, 6), r.range(0, 6));
  }
}

/** one crack: a jagged run that forks, glowing hot at its heart and dark at its lips */
function crack(
  bg: Uint32Array,
  r: Rng,
  x: number,
  y: number,
  len: number,
  ymin: number,
  ymax: number,
  hue: typeof CRIMSON,
): void {
  let cx = x;
  let cy = y;
  let dir = r.chance(0.5) ? 1 : -1;
  for (let i = 0; i < len; i++) {
    const ix = Math.round(cx);
    const iy = Math.round(cy);
    if (ix < 1 || ix >= W - 1 || iy < ymin || iy > ymax) break;
    const u = i / len;
    bg[iy * W + ix] = u < 0.35 ? hue.hot : u < 0.7 ? hue.lit : hue.body;
    if (iy + 1 <= ymax && bg[(iy + 1) * W + ix] !== hue.lit && bg[(iy + 1) * W + ix] !== hue.hot)
      bg[(iy + 1) * W + ix] = mix(bg[(iy + 1) * W + ix], CRACK_EDGE, 0.6);
    cx += dir * r.range(0.6, 1.4);
    cy += r.range(0.1, 0.9);
    if (r.chance(0.2)) dir = -dir;
    if (r.chance(0.12) && len > 6) crack(bg, r, cx, cy, Math.floor((len - i) * 0.5), ymin, ymax, hue);
  }
}

/** static: the floor and slabs split by glowing cracks, more and longer toward the era's end */
function crackFloor(bg: Uint32Array, r: Rng, k: number): void {
  glints.length = 0;
  const n = 6 + Math.round(k * 7);
  for (let i = 0; i < n; i++) {
    const x = Math.round(((i + r.range(0.1, 0.9)) / n) * W);
    const hue = i % 3 === 1 ? VIOLET : CRIMSON;
    crack(bg, r, x, GROUND + 2, Math.round(r.range(6, 12) + k * 8), GROUND + 2, H - 1, hue);
    glints.push({ x, y: GROUND + 4, c: hue.glow, p: r.range(0, 6) });
  }
  for (const p of PLATFORMS) {
    const m = 1 + Math.round(k * 2);
    for (let i = 0; i < m; i++) {
      const x = Math.round(r.range(p.x0 + 6, p.x1 - 6));
      const hue = i % 2 ? CRIMSON : VIOLET;
      crack(bg, r, x, p.y + 2, Math.round(r.range(4, 7) + k * 3), p.y + 2, p.y + 7, hue);
      glints.push({ x, y: p.y + 4, c: hue.glow, p: r.range(0, 6) });
    }
  }
}

/** static: what the abyss breaks after the shared layout is drawn */
export function breakRuins(bg: Uint32Array, r: Rng, k: number, stumpTop: Color): void {
  breakTowers(bg, r, k, stumpTop);
  crackFloor(bg, r, k);
}

/** each frame: the broken tops bob over their stumps and the cracks breathe a slow glow */
export function drawRuinLight(t: number, k: number): void {
  place();
  for (const c of chunks) {
    const dy = Math.round(-c.lift + Math.sin(t * 0.7 + c.phase) * 1.5);
    for (let i = 0; i < c.xs.length; i++) putScreen(toScreenX(c.xs[i]), toScreenY(c.ys[i] + dy), c.cs[i]);
    glow(c.cx, c.bottom + dy + 3, 10, LIFT_GLOW, 0.12 + 0.05 * Math.sin(t * 1.3 + c.phase));
  }
  for (const g of glints) glow(g.x, g.y, 9, g.c, (0.1 + 0.1 * (0.5 + 0.5 * Math.sin(t * 1.1 + g.p))) * (0.8 + k * 0.4));
}

/** each frame: the dead braziers burn with a low sickly violet flame */
export function drawVoidFlames(t: number): void {
  place();
  for (const b of BRAZIERS) {
    const top = b.y - 7;
    for (let j = 0; j < 4; j++) {
      const sway = Math.round(Math.sin(t * 7 + j * 1.3 + b.x) * (j * 0.4));
      const w = j < 2 ? 2 : 1;
      for (let x = -w + 1; x < w; x++)
        putScreen(toScreenX(b.x + x + sway), toScreenY(top - j), FLAME[Math.min(3, j + Math.abs(x))]);
    }
    if (Math.sin(t * 5 + b.x) > 0.3)
      putScreen(toScreenX(b.x + Math.round(Math.sin(t * 3) * 2)), toScreenY(top - 5), FLAME[2]);
    glow(b.x, top - 2, 16, FLAME_GLOW, 0.26 + Math.sin(t * 6 + b.x) * 0.03);
  }
}
