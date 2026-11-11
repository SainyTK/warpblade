import { frame } from "../../../constants/hero";
import { PAL } from "../../../constants/palette";
import { KNIFE_BLOWS } from "../../../constants/tallis/knives";
import { SINK } from "../../../constants/tallis/sink";
import { VEIL } from "../../../constants/tallis/veil";
import { glow, glowLine, place, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { hex } from "../../../utils/color";
import { bladeAngle } from "../../../utils/poseFrame";
import { enemyBox } from "../../enemies/enemy";
import { game, hero } from "../../state";
import { backOpenFoe } from "./backOpen";
import { dimLights } from "./dark";
import { tallis, tallisHost } from "./memory";
import { drawPool } from "./pool";
import { drawForm, heroForm } from "./shadowForm";
import { drawCloud } from "./smokeLook";

const G = PAL.gloam;
/** the lost cue's grey and its dark outline */
const LOST_GREY = hex("#b4b0bc");
const LOST_EDGE = hex("#16141c");

/** the back-open chevron, pointing down at the open back from over it */
const CHEVRON = ["#...#", "##.##", ".###.", "..#.."] as const;

/** the chevron keeps clear of his own sprite: this near across his middle, and above this height over his feet */
const CHEVRON_CLEAR = { across: 9, head: 31 } as const;

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

/** frames the rose edge stays on Heel Kick's leg after the hit */
const HEEL_TRAIL_FRAMES = 6;

/**
 * Heel Kick's leg lit along its top edge in rose from the hit, brightest at the heel and fading over a few frames, so the
 * straight leg reads against his dark cloak at game scale.
 */
function drawHeelEdge(): void {
  if (hero.state !== "knife" || tallis.current !== "heelKick") return;
  const u = (hero.st - KNIFE_BLOWS.heelKick.hit) / frame(HEEL_TRAIL_FRAMES);
  if (u < 0 || u > 1) return;
  const p = hero.pose;
  const f = hero.face;
  const hipX = hero.x + f * p.hx;
  const hipY = hero.y + p.hy;
  const heelX = hero.x + f * p.ffx;
  const heelY = hero.y + p.ffy - 1;
  const fade = 1 - u;
  glowLine(hipX, hipY, heelX, heelY, 3, G[4], 0.35 * fade);
  const steps = Math.ceil(Math.hypot(heelX - hipX, heelY - hipY));
  for (let i = Math.floor(steps / 3); i <= steps; i++) {
    const k = i / steps;
    px(Math.round(hipX + (heelX - hipX) * k), Math.round(hipY + (heelY - hipY) * k) - 1, k > 0.75 ? G[5] : G[4], fade);
  }
  glow(heelX, heelY, 5, G[5], 0.5 * fade);
}

/** behind him: the pool he melts into */
export function drawTallisBack(): void {
  place();
  drawPool();
}

/** over him: his knife's glint, placed on him the way the hero layer leaves it, Heel Kick's lit leg, his shadow form and
 *  his smoke */
export function drawTallis(): void {
  drawGlint();
  place();
  drawHeelEdge();
  drawShadowForm();
  for (const c of tallisHost.clouds) drawCloud(c);
}

/** the rose chevron over the back of the foe whose back is open to his string, outlined dark so it reads on any scene */
function drawChevron(e: Enemy): void {
  const [x0, y0, x1] = enemyBox(e);
  const back = e.face > 0 ? x0 + 2 : x1 - 2;
  const bob = Math.round(Math.sin(game.t * 8) * 0.8);
  const x = Math.round(back) - 2;
  // over a short foe at knife range the spot falls on his own hood: the chevron lifts clear above his head
  const overHim = Math.abs(x + 2 - hero.x) < CHEVRON_CLEAR.across && y0 - 8 > hero.y - CHEVRON_CLEAR.head;
  const y = Math.round(overHim ? hero.y - CHEVRON_CLEAR.head - 6 : y0 - 8) + bob;
  glow(x + 2, y + 1, 6, G[4], 0.35);
  glyph(CHEVRON, x, y, G[5], LOST_EDGE);
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

/** how far into his shadow form he is, 0 to 1: it comes on over the hood's flicker as the Veil rises and leaves the same way */
function veilInk(): number {
  if (tallis.veil) return Math.min(1, tallis.veilT / VEIL.flicker);
  const since = VEIL.lock - tallis.veilLock;
  return since >= 0 && since < VEIL.flicker ? 1 - since / VEIL.flicker : 0;
}

/** how much of his body still stands over the pool: it pours down as he sinks and comes back as he rises */
function poured(): number {
  if (hero.state === "sink") return Math.max(0, 1 - tallis.sinkT / SINK.pour);
  if (hero.state === "rise") return Math.min(1, hero.st / SINK.rise);
  return 1;
}

/** his shadow form, in place of his sprite: in the Veil, and squashed down into the pool as he sinks or rises */
function drawShadowForm(): void {
  const standing = poured();
  const ink = Math.max(veilInk(), standing < 1 ? Math.min(1, (1 - standing) * 3) : 0);
  if (ink <= 0 || standing <= 0) return;
  drawForm(heroForm(), hero.x, hero.y, hero.face < 0, { ink, squash: standing, show: 1 });
  if (tallis.veil) glow(hero.x, hero.y - 16, 12, G[4], 0.1);
}

/** the hero layer draws his own sprite only while he wears no shadow form */
export const tallisAlpha = (): number => (veilInk() > 0 || poured() < 1 ? 0 : 1);
