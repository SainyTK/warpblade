import { frame } from "../../../constants/hero";
import { PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { KNIFE_BLOWS } from "../../../constants/tallis/knives";
import { SINK } from "../../../constants/tallis/sink";
import { VEIL } from "../../../constants/tallis/veil";
import { bayerAt, glow, place, px, toScreenX, toScreenY } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import type { SmokeCloud } from "../../../types/tallis";
import { hex } from "../../../utils/color";
import { bladeAngle } from "../../../utils/poseFrame";
import { enemyBox } from "../../enemies/enemy";
import { game, hero } from "../../state";
import { backOpenFoe } from "./backOpen";
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

/** the ink pool on the surface he stands on: a dithered oval in the gloam ramp with two rose eyes */
function drawPool(k: number): void {
  if (k <= 0) return;
  const half = (SINK.width / 2) * k;
  const x = hero.x;
  const y = hero.y;
  for (let dx = -Math.ceil(half); dx <= Math.ceil(half); dx++) {
    const u = Math.abs(dx) / Math.max(1, half);
    if (u > 1) continue;
    const ripple = Math.sin(game.t * 9 + dx * 0.7) * 0.5;
    const ix = Math.round(toScreenX(x + dx) * RES);
    const deep = u < 0.55 ? G[0] : u < 0.85 ? G[1] : G[2];
    px(x + dx, y - 1, deep);
    if (u < 0.8 && bayerAt(ix, Math.round(toScreenY(y - 2) * RES)) < 0.7 - u * 0.5) px(x + dx, y - 2, G[1]);
    if (u > 0.3 && u < 0.95 && ripple > 0.2) px(x + dx, y - 2, G[3], 0.6);
  }
  if (k >= 1) {
    const look = hero.face;
    px(x + look * 2, y - 2, G[5]);
    px(x + look * 4, y - 2, G[5]);
  }
  glow(x, y - 1, 10 * k, G[3], 0.12);
}

/** one Smoke Knot: dithered smoke rolling out over its first moment and thinning over its last */
function drawCloud(c: SmokeCloud): void {
  const grow = Math.min(1, c.t / 0.2);
  const thin = Math.min(1, (c.life - c.t) / 0.5);
  const w = (c.w / 2) * (0.4 + 0.6 * grow);
  const h = c.h * (0.5 + 0.5 * grow);
  for (let dy = 0; dy < h; dy += 1)
    for (let dx = -w; dx <= w; dx += 1) {
      const u = dx / w;
      const v = dy / h;
      const r = u * u + (v - 0.45) ** 2 * 2.2;
      const curl = Math.sin(dx * 0.35 + game.t * 2.4 + dy * 0.2) * 0.12;
      const d = r + curl;
      if (d > 1) continue;
      const x = c.x + dx;
      const y = c.y - dy;
      const a = (1 - d) * 0.9 * thin;
      if (bayerAt(Math.round(toScreenX(x) * RES), Math.round(toScreenY(y) * RES)) > a) continue;
      px(x, y, d < 0.35 ? G[3] : d < 0.7 ? G[2] : G[1]);
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
