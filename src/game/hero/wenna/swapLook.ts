import { PAL } from "../../../constants/palette";
import { WICK } from "../../../constants/wenna/wick";
import { glow, line, place, px } from "../../../engine/frame";
import type { Wick } from "../../../types/wenna";
import { game, hero } from "../../state";
import { ghostCanvas } from "../afterimages";
import { drawHero } from "../drawHero";
import { heroLook } from "../look";
import { hookPoint } from "./lantern";

/** an afterimage lasts two frames at 30 a second */
const GHOST = 2 / 30;
/** the lamp's streak lasts a little longer */
const STREAK = 0.1;

/** a violet copy of her where she stood, fading over two frames */
function heroGhost(): void {
  drawHero(ghostCanvas, hero.pose, heroLook(4));
  game.ghosts.push({ s: ghostCanvas.snapshot(), x: hero.x, y: hero.y, flip: hero.face < 0, life: GHOST, max: GHOST });
}

/** a violet silhouette of the Wick where it stood, fading over two frames */
function wickGhost(x: number, y: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < GHOST;
    },
    draw() {
      place();
      const k = 1 - t / GHOST;
      const top = Math.round(y - WICK.height);
      for (let yy = top + 4; yy <= y; yy++) line(x - 3, yy, x + 3, yy, PAL.wick[3], 0.55 * k);
      px(Math.round(x), top + 2, PAL.wick[5], k);
      px(Math.round(x), top + 1, PAL.wick[4], k);
      glow(x, top + 2, 6, PAL.wick[4], 0.3 * k);
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
      line(x0, y0, x1, y1, PAL.wick[4], 0.7 * k);
      line(x0, y0 + 1, x1, y1 + 1, PAL.wick[2], 0.4 * k);
    },
  });
}

/** a Swap leaves her and the Wick each a violet afterimage, and her lamp a short streak toward where she goes */
export function leaveSwapLook(w: Wick): void {
  const hook = hookPoint(hero.pose, hero.hand);
  const lx = hero.x + hook.x * hero.face;
  const ly = hero.y + hook.y;
  heroGhost();
  wickGhost(w.x, w.y);
  lampStreak(lx, ly, w.x + (lx - hero.x), w.y + (ly - hero.y));
}
