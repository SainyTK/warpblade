import { frame } from "../../../constants/hero";
import { PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { SMOKE_KNOT } from "../../../constants/tallis/abilities";
import { KNIFE_BLOWS } from "../../../constants/tallis/knives";
import { SINK } from "../../../constants/tallis/sink";
import { VEIL } from "../../../constants/tallis/veil";
import { bayerAt, blendScreen, glow, place, px, toScreenX, toScreenY } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import type { SmokeCloud } from "../../../types/tallis";
import { hex } from "../../../utils/color";
import { bladeAngle } from "../../../utils/poseFrame";
import { enemyBox } from "../../enemies/enemy";
import { game, hero } from "../../state";
import { backOpenFoe } from "./backOpen";
import { dimLights } from "./dark";
import { tallis, tallisHost } from "./memory";

const G = PAL.gloam;
/** the lost cue's grey and its dark outline */
const LOST_GREY = hex("#b4b0bc");
const LOST_EDGE = hex("#16141c");

/** the question mark of the lost cue, 5 by 5 */
const QUESTION = [".###.", "#...#", "..##.", ".....", "..#.."] as const;

/** a small glyph from rows, with a 1 px dark outline round it, its top left at (x, y) */
function glyph(rows: readonly string[], x: number, y: number, c: Color, edge: Color): void {
  const on = (i: number, j: number): boolean => rows[j]?.[i] === "#";
  for (let j = -1; j <= rows.length; j++)
    for (let i = -1; i <= rows[0].length; i++) {
      if (on(i, j)) continue;
      if (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1)) px(x + i, y + j, edge);
    }
  for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[0].length; i++) if (on(i, j)) px(x + i, y + j, c);
}

/** how far the pool has spread, 0 to 1: it grows as his body pours down and shrinks as he rises */
function poolShare(): number {
  if (hero.state === "sink") return Math.min(1, tallis.sinkT / SINK.pour);
  if (hero.state === "rise") return Math.max(0, 1 - hero.st / SINK.rise);
  return 0;
}

/** the ink pool on the surface he stands on: a dithered oval in the gloam ramp, a rose rim along its top, two rose eyes */
function drawPool(k: number): void {
  if (k <= 0) return;
  const half = (SINK.width / 2) * k;
  const x = hero.x;
  const y = hero.y;
  for (let dx = -Math.ceil(half); dx <= Math.ceil(half); dx++) {
    const u = Math.abs(dx) / Math.max(1, half);
    if (u > 1) continue;
    const ripple = Math.sin(game.t * 9 + dx * 0.7);
    const ix = Math.round(toScreenX(x + dx) * RES);
    px(x + dx, y, G[0]);
    px(x + dx, y - 1, u < 0.6 ? G[0] : G[1]);
    if (u < 0.85) px(x + dx, y - 2, u < 0.5 ? G[1] : G[2]);
    if (u < 0.6 && bayerAt(ix, Math.round(toScreenY(y - 3) * RES)) < 0.75 - u) px(x + dx, y - 3, G[2]);
    const rim = u < 0.6 ? y - 3 : u < 0.85 ? y - 2 : y - 1;
    if (ripple > 0.35) px(x + dx, rim, G[4], 0.7);
  }
  if (k >= 1) {
    const look = hero.face;
    px(x + look * 1, y - 2, G[5]);
    px(x + look * 3, y - 2, G[5]);
  }
  glow(x, y - 2, 12 * k, G[4], 0.14);
}

/** the puffs a cloud is made of: where each sits across the cloud and up it, its size, and how fast it curls */
const PUFFS = [
  [-0.62, 0.22, 0.34, 1.3],
  [-0.3, 0.3, 0.42, 0.9],
  [0.05, 0.25, 0.46, 1.1],
  [0.4, 0.3, 0.4, 0.8],
  [0.66, 0.2, 0.32, 1.4],
  [-0.4, 0.62, 0.34, 1],
  [0.1, 0.66, 0.38, 1.2],
  [0.48, 0.58, 0.3, 0.9],
  [-0.08, 0.9, 0.26, 1.5],
] as const;

/** one Smoke Knot: soft, truly blended puffs of smoke rolling out over its first moment, curling, and thinning over its
 *  last, lit rose along their tops */
function drawCloud(c: SmokeCloud): void {
  const grow = Math.min(1, c.t / SMOKE_KNOT.roll);
  const thin = Math.min(1, (c.life - c.t) / SMOKE_KNOT.thin);
  const half = c.w / 2;
  const x0 = Math.floor(c.x - half - 4);
  const x1 = Math.ceil(c.x + half + 4);
  const y0 = Math.floor(c.y - c.h * 1.25);
  const puffs = PUFFS.map(([u, v, size, curl], i) => ({
    x: c.x + u * half * (0.35 + 0.65 * grow) + Math.sin(game.t * curl + i * 1.7) * 2,
    y: c.y - v * c.h * (0.4 + 0.6 * grow) - (1 - thin) * 6,
    r: size * c.h * (0.5 + 0.5 * grow) * (0.85 + 0.15 * thin),
  }));
  for (let y = y0; y <= c.y; y++)
    for (let x = x0; x <= x1; x++) {
      let a = 0;
      let top = 0;
      for (const p of puffs) {
        const d = Math.hypot(x - p.x, (y - p.y) * 1.15) / p.r;
        if (d >= 1) continue;
        a += (1 - d * d) * 0.55;
        if (y < p.y - p.r * 0.4) top = Math.max(top, 1 - d);
      }
      if (a <= 0.02) continue;
      a = Math.min(0.85, a) * thin;
      const c = top > 0.35 ? G[4] : top > 0.1 || a < 0.35 ? G[3] : G[2];
      blendScreen(toScreenX(x), toScreenY(y), c, a);
    }
}

/** the rose glint sliding along his near knife for two frames after a blow lands */
function drawGlint(): void {
  const st = hero.state;
  if (st !== "knife" && st !== "risingCut") return;
  const b = KNIFE_BLOWS[tallis.current];
  const u = (hero.st - b.hit) / frame(2);
  if (u < 0 || u > 1) return;
  const a = bladeAngle(hero.pose);
  const [hx, hy] = hero.hand;
  const d = 2 + u * 5;
  px(hx + Math.cos(a) * d, hy + Math.sin(a) * d, G[5]);
}

/** behind him: the pool he melts into */
export function drawTallisBack(): void {
  place();
  drawPool(poolShare());
}

/** over him: his smoke, and his knife's glint, placed on him the way the hero layer leaves it */
export function drawTallis(): void {
  drawGlint();
  place();
  for (const c of tallisHost.clouds) drawCloud(c);
}

/** the rose chevron on the back of the foe whose back is open to his string */
function drawChevron(e: Enemy): void {
  const [x0, y0, x1, y1] = enemyBox(e);
  const back = e.face > 0 ? x0 - 2 : x1 + 2;
  const y = Math.round((y0 + y1) / 2) - 2;
  const point = e.face > 0 ? 1 : -1;
  const bob = Math.round(Math.sin(game.t * 8));
  const x = Math.round(back) + bob * -point;
  for (const [dx, dy] of [
    [0, 0],
    [point, 1],
    [0, 2],
  ] as const) {
    px(x + dx - point, y + dy, G[1]);
    px(x + dx, y + dy, G[5]);
  }
}

/** a dusk rose tick over a foe Mark of Dusk marks */
function drawDuskMark(e: Enemy): void {
  const [x0, y0, x1] = enemyBox(e);
  const x = Math.round((x0 + x1) / 2);
  const y = Math.round(y0) - 6 + Math.round(Math.sin(game.t * 5));
  px(x, y, G[5]);
  px(x - 1, y - 1, G[4]);
  px(x + 1, y - 1, G[4]);
  px(x, y - 2, G[3]);
  glow(x, y - 1, 5, G[4], 0.3);
}

/**
 * Over the whole scene, past the damage numbers: the grey question marks of foes that lost him, the chevron on an open
 * back, and the marks of Mark of Dusk, so each reads in a crowd.
 */
export function drawTallisOver(): void {
  if (tallisHost.dark) dimLights(tallisHost.dark);
  if (hero.state === "dead") return;
  place();
  for (const l of tallisHost.lost) {
    const [x0, y0, x1] = enemyBox(l.foe);
    const rise = Math.round((1 - l.left / 0.6) * 2);
    glyph(QUESTION, Math.round((x0 + x1) / 2) - 2, Math.round(y0) - 9 - rise, LOST_GREY, LOST_EDGE);
  }
  for (const m of tallisHost.marks) drawDuskMark(m.foe);
  const open =
    hero.ground && (hero.state === "idle" || hero.state === "walk" || hero.state === "run" || hero.state === "knife");
  const foe = open ? backOpenFoe(game.enemies) : null;
  if (foe) drawChevron(foe);
}

/** how much of him shows: faded in the Veil, poured away in the pool, coming back as he rises */
export function tallisAlpha(): number {
  const pool =
    hero.state === "sink"
      ? Math.max(0, 1 - tallis.sinkT / SINK.pour)
      : hero.state === "rise"
        ? Math.min(1, hero.st / SINK.rise)
        : 1;
  return pool * (tallis.veil ? VEIL.alpha : 1);
}

/** the Veil's shimmering outline round his sprite */
export const tallisRing = (): Color | null => (tallis.veil ? (Math.floor(game.t * 12) % 3 === 0 ? G[5] : G[4]) : null);
