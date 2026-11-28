import { GROUND } from "../../../../constants/stage";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { BOAR } from "./colors";
import { BOAR_HITS, BOAR_MOVE, BOAR_TIMES } from "./moves";

export function startCharge(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, ax: e.x, n: 0, vx: e.face * BOAR_MOVE.speed });
  sfx.lunge();
  dust(e.x, GROUND, 6, -e.face);
}

function bonk(e: Enemy): void {
  Object.assign(e, { state: "recover", st: 0, vx: -e.face * 40, stun: BOAR_TIMES.daze });
  shake(0.12, 1.5);
  sfx.block();
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * 14,
      GROUND - fxRng.range(4, 14),
      -e.face * fxRng.range(30, 90),
      -fxRng.range(40, 110),
      fxRng.range(0.4, 0.7),
      { col: fxRng.pick(BOAR.plate.slice(1, 4)), size: fxRng.range(1, 2) },
    );
}

export function charge(e: Enemy, ts: number): void {
  e.vx = e.face * BOAR_MOVE.speed;
  if (fxRng.chance(0.7 * ts)) dust(e.x - e.face * 10, GROUND, 1, -e.face);
  if (fxRng.chance(0.3 * ts))
    particles.spawn(PK.MOTE, e.x - e.face * 4, e.y - 16, -e.face * 20, -10, 0.4, {
      col: BOAR.pustule[3],
      size: 0.5,
    });
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(BOAR_HITS.charge * e.power, e.x - e.face * 10);
    }
  });
  const stalled = e.st > 0.05 && Math.abs(e.x - e.ay) < 0.2;
  const wall = stalled || (e.face < 0 && e.x <= stageLeft() + 12) || (e.face > 0 && e.x >= stageRight() - 12);
  if (wall || e.pinned > 0) bonk(e);
  else if (Math.abs(e.x - e.ax) >= BOAR_MOVE.reach) Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.8 });
}
