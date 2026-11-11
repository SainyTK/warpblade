import { PAL } from "../../../constants/palette";
import { SWAP } from "../../../constants/wenna/swap";
import { glowLine, hairline, place } from "../../../engine/frame";
import type { Wick } from "../../../types/wenna";
import { game, hero } from "../../state";
import { ghostCanvas } from "../afterimages";
import { drawHero } from "../drawHero";
import { heroLook } from "../look";
import { drawWickGhost } from "./drawWick";
import { hookPoint } from "./lantern";

/** an afterimage lasts two frames at 30 a second */
const GHOST = 2 / 30;
/** the lamp's streak lasts a little longer */
const STREAK = 0.1;

/** her copy as she stood at the press, kept for the arrival */
let copy: ReturnType<typeof ghostCanvas.snapshot> | null = null;

/** a violet copy of her where she stood: it holds through the moment both are gone, and fades after she arrives */
function heroGhost(life: number): void {
  drawHero(ghostCanvas, hero.pose, heroLook(4));
  copy = ghostCanvas.snapshot();
  game.ghosts.push({ s: copy, x: hero.x, y: hero.y, flip: hero.face < 0, life, max: life });
}

/** a violet silhouette of the Wick where it stood, fading over its life */
function wickGhost(x: number, y: number, life: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      drawWickGhost(x, y, 0.7 * (1 - t / life));
    },
  });
}

/** the lantern's streak from where it hung to where it will hang */
function lampStreak(x0: number, y0: number, x1: number, y1: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < STREAK;
    },
    draw() {
      place();
      const k = 1 - t / STREAK;
      hairline(x0, y0, x1, y1, PAL.wick[5], k);
      hairline(x0, y0 + 0.5, x1, y1 + 0.5, PAL.wick[4], 0.8 * k);
      hairline(x0, y0 + 1, x1, y1 + 1, PAL.wick[2], 0.5 * k);
      glowLine(x0, y0, x1, y1, 4, PAL.wick[3], 0.25 * k);
    },
  });
}

/** the moment of a Swap: she and the Wick vanish, each leaving a violet afterimage, and her lamp a short streak toward
 *  where she goes */
export function leaveSwapLook(w: Wick): void {
  const hook = hookPoint(hero.pose, hero.hand);
  const lx = hero.x + hook.x * hero.face;
  const ly = hero.y + hook.y;
  heroGhost(SWAP.gone);
  wickGhost(w.x, w.y, SWAP.gone);
  lampStreak(lx, ly, w.x + (lx - hero.x), w.y + (ly - hero.y));
}

/** both arrive: the copies left at the old spots fade over two frames */
export function arriveSwapLook(from: { x: number; y: number }, face: number, wickFrom: { x: number; y: number }): void {
  if (copy) game.ghosts.push({ s: copy, x: from.x, y: from.y, flip: face < 0, life: GHOST, max: GHOST });
  wickGhost(wickFrom.x, wickFrom.y, GHOST);
}
