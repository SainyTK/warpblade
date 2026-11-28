import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT_SPARKS } from "../../colors";
import { createPoisonCloud } from "../../spores";
import { BEAR } from "./colors";
import { BEAR_HITS, BEAR_MOVE, BEAR_TIMES, ROAR_CLOUDS } from "./constants";
import { createBearShockwave } from "./shockwave";

export const pawsX = (e: Enemy): number => e.x + e.face * 20;

export function startRear(e: Enemy): void {
  Object.assign(e, { state: "wind", st: 0, n: 0 });
  const mark = BEAR_TIMES.rear * waveScale(game.wave).windup;
  game.fx.push(createBearShockwave(e, pawsX(e), mark, BEAR_HITS.wave * e.power));
  sfx.swingHeavy(0.6);
}

export function slam(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0, n: 1 });
  const front = e.x + e.face * 2;
  const reach = e.x + e.face * BEAR_MOVE.slamReach;
  const box = [Math.min(front, reach), GROUND - BEAR_MOVE.slamHeight, Math.max(front, reach), GROUND] as const;
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(BEAR_HITS.slam * e.power, e.x);
  });
  const x = pawsX(e);
  dust(x, GROUND, 10);
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SHARD, x, GROUND - 2, fxRng.range(-110, 110), -fxRng.range(60, 170), fxRng.range(0.3, 0.6), {
      col: fxRng.pick(BLIGHT_SPARKS.bark),
      size: fxRng.range(1, 2.4),
    });
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.MOTE, x, GROUND - 3, fxRng.range(-60, 60), -fxRng.range(20, 70), fxRng.range(0.4, 0.8), {
      col: fxRng.pick(BEAR.glow),
      size: 0.6,
    });
  shake(0.3, 3.5);
  sfx.boom();
}

export function startHowl(e: Enemy): void {
  Object.assign(e, { state: "charge", st: 0, n: 0 });
  sfx.swing(0.4);
}

export function roar(e: Enemy): void {
  Object.assign(e, { state: "shoot", st: 0 });
  for (const offset of ROAR_CLOUDS.offsets) {
    const x = clampStageX(e.x + offset, 8);
    game.fx.push(
      createPoisonCloud(x, GROUND - ROAR_CLOUDS.rise, ROAR_CLOUDS.radius, ROAR_CLOUDS.life, BEAR_HITS.roar * e.power),
    );
  }
  for (let i = 0; i < 18; i++) {
    const a = fxRng.range(0, TAU);
    const v = fxRng.range(40, 90);
    particles.spawn(
      PK.MOTE,
      e.x + e.face * 14,
      e.y - 22,
      Math.cos(a) * v,
      Math.sin(a) * v * 0.6,
      fxRng.range(0.3, 0.7),
      {
        col: fxRng.pick(BEAR.glow),
        size: 0.6,
      },
    );
  }
  shake(0.12, 1.2);
  sfx.swingHeavy(0.45);
}
