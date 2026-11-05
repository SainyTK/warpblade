import { POSES } from "../../constants/hero";
import { PK } from "../../types/particle";
import { lerp, TAU } from "../../utils/math";
import { createWarpLine } from "../effects/warpLine";
import { game, hero, lights, particles, rng } from "../state";
import { drawHero } from "./drawHero";
import { heroCanvas } from "./heroCanvas";
import { heroLook } from "./look";
import { skin } from "./skin";

/** afterimages are drawn into their own canvas, then copied */
export const ghostCanvas = heroCanvas(80, 76, 40, 62);

/** a line of fading copies of Kael from where he was to where he is going, and a streak of light between */
export function leaveAfterimages(ox: number, oy: number, nx: number, ny: number): void {
  drawHero(ghostCanvas, POSES.warpFly, heroLook(4));
  const snap = ghostCanvas.snapshot();
  for (let i = 0; i < 5; i++) {
    const u = i / 5;
    const life = 0.18 + u * 0.18;
    game.ghosts.push({ s: snap, x: lerp(ox, nx, u), y: lerp(oy, ny, u), flip: hero.face < 0, life, max: life });
  }
  game.fx.push(createWarpLine(ox, oy - 18, nx, ny - 18));
  for (let i = 0; i < 12; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(30, 120);
    particles.spawn(PK.MOTE, ox, oy - 18, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.2, 0.45), {
      col: rng.pick(skin.ramp.slice(3)),
      size: 0.6,
    });
  }
  lights.add(nx, ny - 18, 44, skin.ramp[4], 0.9, 0.25);
}

/** one fading copy in the dash pose, dropped every few frames while dashing */
export function dropDashGhost(): void {
  drawHero(ghostCanvas, POSES.dodge, heroLook(4));
  game.ghosts.push({ s: ghostCanvas.snapshot(), x: hero.x, y: hero.y, flip: hero.face < 0, life: 0.22, max: 0.22 });
  particles.spawn(
    PK.MOTE,
    hero.x,
    hero.y - rng.range(6, 26),
    -hero.face * rng.range(20, 60),
    rng.range(-20, 20),
    rng.range(0.2, 0.4),
    {
      col: skin.ramp[rng.int(3, 5)],
      size: 0.6,
    },
  );
}

/** one fading copy in the current pose, dropped every few frames while a fast move plays */
export function dropMoveGhost(): void {
  drawHero(ghostCanvas, hero.pose, heroLook(4));
  game.ghosts.push({ s: ghostCanvas.snapshot(), x: hero.x, y: hero.y, flip: hero.face < 0, life: 0.16, max: 0.16 });
}
