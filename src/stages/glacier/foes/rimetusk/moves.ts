import { GROUND } from "../../../../constants/stage";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { createFloorWarning } from "../rimeclaw/warning";
import { TUSK, TUSK_HITS } from "./constants";
import { recoverFrom } from "./recovery";

export function beginCharge(e: Enemy): void {
  const windup = TUSK.wind * waveScale(game.wave).windup;
  Object.assign(e, { state: "wind", st: 0 });
  game.fx.push(createFloorWarning(e, "wind", 14, TUSK.reach, windup));
  sfx.swing(0.5);
}

export function snort(e: Enemy): void {
  particles.spawn(PK.VAPOUR, e.x + e.face * 26, e.y - 11, e.face * fxRng.range(10, 24), -fxRng.range(2, 8), 0.6, {
    col: FOE.crystal[3],
    size: fxRng.range(1.4, 2.2),
  });
}

function stopCharge(e: Enemy, wall: boolean): void {
  recoverFrom(e, wall ? "dazed" : "skid");
  e.vx = wall ? -e.face * 50 : e.vx * 0.4;
  if (!wall) return;
  shake(0.2, 2.5);
  sfx.boom();
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * 26,
      GROUND - fxRng.range(4, 22),
      -e.face * fxRng.range(30, 110),
      -fxRng.range(30, 120),
      0.55,
      {
        col: fxRng.pick(FOE.crystal),
        size: fxRng.range(1, 2.2),
      },
    );
}

export function charge(e: Enemy): void {
  e.vx = e.face * TUSK.speed;
  if (fxRng.chance(0.7)) dust(e.x - e.face * 16, GROUND, 1, -e.face);
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(TUSK_HITS.charge * e.power, e.x - e.face * 12);
    }
  });
  const stalled = e.st > 0.05 && Math.abs(e.x - e.ay) < 0.2;
  const edge = (e.face < 0 && e.x <= stageLeft() + 14) || (e.face > 0 && e.x >= stageRight() - 14);
  if (stalled || edge) stopCharge(e, true);
  else if (Math.abs(e.x - e.ax) >= TUSK.reach) stopCharge(e, false);
}

export function toss(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const front = e.x + e.face * 6;
  const reach = e.x + e.face * TUSK.tossReach;
  const box = [Math.min(front, reach), GROUND - TUSK.tossHeight, Math.max(front, reach), GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(TUSK_HITS.toss * e.power, e.x);
  });
  sfx.swingHeavy();
  dust(e.x + e.face * 24, GROUND, 5, e.face);
}
