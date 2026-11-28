import { GROUND } from "../../../../constants/stage";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, hero, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { freezeFloor } from "../../hazard";
import { WRAITH_COLORS } from "./colors";
import { WRAITH, WRAITH_HITS } from "./constants";

const DIVE_FLOOR = GROUND - 14;

export function aimDive(e: Enemy): void {
  e.ax = hero.x;
}

export function startDive(e: Enemy): void {
  const dx = e.ax - e.x;
  const dy = DIVE_FLOOR - e.y;
  e.face = Math.sign(dx) || e.face;
  Object.assign(e, { state: "dive", st: 0, n: 0, vx: dx / WRAITH.dive, vy: dy / WRAITH.dive });
  sfx.lunge();
}

export function diveStep(e: Enemy): void {
  eachStanding(() => {
    if (e.n !== 0) return;
    const box = [e.x - 9, e.y - 8, e.x + 9, e.y + 14] as const;
    if (!boxHit(box, heroBox())) return;
    e.n = 1;
    hurtHero(WRAITH_HITS.rake * e.power, e.x - e.face * 6);
  });
  if (e.st < WRAITH.dive) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.15, vy: 0 });
  freezeFloor(e.x - WRAITH.slick, e.x + WRAITH.slick, WRAITH.slickLife);
  sfx.shatter();
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.FLAKE, e.x + fxRng.range(-14, 14), GROUND - 1, fxRng.range(-30, 30), -fxRng.range(10, 40), 0.7, {
      col: WRAITH_COLORS.shroud[4],
    });
}
