import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { FOE } from "../colors";
import { createIceShard } from "../shardling/shard";
import { createFrostBreath } from "./breath";
import { CLAW, CLAW_HITS, CLAW_TIMES } from "./constants";
import { createIcicleDrop } from "./icicleDrop";

export function launchPounce(e: Enemy): void {
  const target = clampStageX(hero.x, 26);
  const T = CLAW_TIMES.flight;
  e.face = Math.sign(target - e.x) || e.face;
  Object.assign(e, { state: "leap", st: 0, vx: (target - e.x) / T, vy: (-CLAW.gravity * T) / 2, n: e.n });
  sfx.lunge();
  dust(e.x, GROUND, 8, -e.face);
}

export function pounceHits(e: Enemy): void {
  eachStanding(() => {
    if (boxHit([e.x - 22, e.y - 32, e.x + 26, e.y], heroBox())) hurtHero(CLAW_HITS.pounce * e.power, e.x);
  });
}

export function land(e: Enemy): void {
  e.y = GROUND;
  e.vx = 0;
  e.vy = 0;
  shake(0.25, 3);
  sfx.boom();
  dust(e.x - 14, GROUND, 6, -1);
  dust(e.x + 14, GROUND, 6, 1);
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SHARD,
      e.x + fxRng.range(-20, 20),
      GROUND - 2,
      fxRng.range(-120, 120),
      -fxRng.range(40, 140),
      0.6,
      {
        col: fxRng.pick(FOE.crystal),
        size: fxRng.range(1, 2.4),
      },
    );
  eachStanding(() => {
    if (Math.abs(hero.x - e.x) < CLAW.landing && hero.y > GROUND - 8) hurtHero(CLAW_HITS.landing * e.power, e.x);
  });
}

export function sweepTail(e: Enemy): void {
  sfx.swing(0.5);
  dust(e.x - e.face * 30, GROUND, 8, -e.face);
  eachStanding(() => {
    const box = [e.x - CLAW.tailReach, GROUND - CLAW.tailHeight, e.x + CLAW.tailReach, GROUND] as const;
    if (boxHit(box, heroBox())) hurtHero(CLAW_HITS.tail * e.power, e.x);
  });
}

export function roar(e: Enemy): void {
  shake(0.5, 3.5);
  sfx.thunder();
  const count = e.phase === 2 ? 7 : 5;
  const gap = 34;
  const first = hero.x - ((count - 1) / 2) * gap + fxRng.range(-6, 6);
  for (let i = 0; i < count; i++) {
    const x = clampStageX(first + i * gap, 10);
    game.fx.push(createIcicleDrop(x, 0.85 + (i % 2) * 0.35, CLAW_HITS.icicle * e.power));
  }
}

export function breathe(e: Enemy): void {
  sfx.cast();
  game.fx.push(createFrostBreath(e, CLAW_HITS.breath * e.power));
}

export function shardRing(e: Enemy): void {
  const n = CLAW.ringShards;
  for (let i = 0; i < n; i++) {
    const a = Math.PI - 0.3 + (i / (n - 1)) * (Math.PI + 0.6);
    game.fx.push(createIceShard(e.x + Math.cos(a) * 12, e.y - 32 + Math.sin(a) * 8, a, CLAW_HITS.shard * e.power, 125));
  }
  sfx.shatter();
  shake(0.2, 2);
}
