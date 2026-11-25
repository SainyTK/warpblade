import { HERO_CANVAS, POSES } from "../../constants/hero";
import { detailCanvas } from "../../engine/sprite";
import { PK } from "../../types/particle";
import { lerp, TAU } from "../../utils/math";
import { createWarpLine } from "../effects/warpLine";
import { fxRng, game, hero, lights, particles } from "../state";
import { drawHeroSprite } from "./look";
import { skin } from "./skin";

/** afterimages are drawn into their own canvas, then copied */
export const ghostCanvas = detailCanvas(HERO_CANVAS.w, HERO_CANVAS.h, HERO_CANVAS.ox, HERO_CANVAS.oy);

/** where a warp ends: no afterimage stands closer to it than `clear`, and the flare of light there */
const ARRIVAL = { clear: 16, light: 28, strength: 0.3 } as const;

/** a line of fading copies of Kael from where he was to where he is going, and a streak of light between */
export function leaveAfterimages(ox: number, oy: number, nx: number, ny: number): void {
  drawHeroSprite(ghostCanvas, POSES.warpFly, 4);
  const snap = ghostCanvas.snapshot();
  const distance = Math.hypot(nx - ox, ny - oy);
  for (let i = 0; i < 5; i++) {
    const u = i / 5;
    const life = 0.18 + u * 0.18;
    // a copy that would stand on Kael where he arrives is left out, so a short warp does not bury him in light
    if (distance * (1 - u) < ARRIVAL.clear) continue;
    game.ghosts.push({ s: snap, x: lerp(ox, nx, u), y: lerp(oy, ny, u), flip: hero.face < 0, life, max: life });
  }
  game.fx.push(createWarpLine(ox, oy - 18, nx, ny - 18));
  for (let i = 0; i < 12; i++) {
    const a = fxRng.range(0, TAU);
    const sp = fxRng.range(30, 120);
    particles.spawn(PK.MOTE, ox, oy - 18, Math.cos(a) * sp, Math.sin(a) * sp, fxRng.range(0.2, 0.45), {
      col: fxRng.pick(skin.ramp.slice(3)),
      size: 0.6,
    });
  }
  lights.add(nx, ny - 18, ARRIVAL.light, skin.ramp[4], ARRIVAL.strength, 0.25);
}

/** one fading copy in the dash pose, dropped every few frames while dashing */
export function dropDashGhost(): void {
  drawHeroSprite(ghostCanvas, POSES.dodge, 4);
  game.ghosts.push({ s: ghostCanvas.snapshot(), x: hero.x, y: hero.y, flip: hero.face < 0, life: 0.22, max: 0.22 });
  particles.spawn(
    PK.MOTE,
    hero.x,
    hero.y - fxRng.range(6, 26),
    -hero.face * fxRng.range(20, 60),
    fxRng.range(-20, 20),
    fxRng.range(0.2, 0.4),
    {
      col: skin.ramp[fxRng.int(3, 5)],
      size: 0.6,
    },
  );
}

/** one fading copy in the current pose, dropped every few frames while a fast move plays */
export function dropMoveGhost(): void {
  drawHeroSprite(ghostCanvas, hero.pose, 4);
  game.ghosts.push({ s: ghostCanvas.snapshot(), x: hero.x, y: hero.y, flip: hero.face < 0, life: 0.16, max: 0.16 });
}
