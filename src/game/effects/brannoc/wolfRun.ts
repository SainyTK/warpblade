import { SPARKS } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { game, particles, rng } from "../../state";
import { boxHit } from "../../world";
import { createImpact } from "../impact";
import { drawSpiritWolf } from "./spiritWolf";

/** one wolf's run down the lane: where it sets off, which way, how far and fast, and what it deals each foe */
export interface WolfRunSpec {
  x: number;
  floor: number;
  dir: number;
  reach: number;
  speed: number;
  damage: number;
  source: SourceId;
}

/** how tall and long a running wolf's body is, for what it passes */
const BODY = { half: 11, high: 14 } as const;
/** seconds it takes to show and to fade at the end of its run */
const SHOW = 0.08;
const FADE = 0.2;
/** run frames a second */
const STRIDE = 12;

/**
 * Wolf's Road: a red wolf spirit that runs along the floor and strikes each foe it passes once, kicking up blood-red
 * sparks, and fades at the end of its run
 */
export function createWolfRun(s: WolfRunSpec): Effect {
  let travelled = 0;
  let t = 0;
  let x = s.x;
  const hit = new Set<Enemy>();
  const strike = () => {
    const box: [number, number, number, number] = [x - BODY.half, s.floor - BODY.high, x + BODY.half, s.floor];
    for (const e of game.enemies) {
      if (e.hp <= 0 || hit.has(e) || !boxHit(box, enemyBox(e))) continue;
      hit.add(e);
      const result = dealDamage(e, s.damage, { fromX: x - s.dir * 6, kx: s.dir * 25, source: s.source });
      if (result === "blocked") continue;
      const [cx, cy] = enemyCenter(e);
      game.fx.push(createImpact(cx, cy, s.dir, false, SPARKS.rage));
    }
  };
  return {
    update(dt) {
      t += dt;
      if (travelled < s.reach) {
        const step = Math.min(s.reach - travelled, s.speed * dt);
        travelled += step;
        x += s.dir * step;
        strike();
        if (rng.chance(0.5))
          particles.spawn(PK.SPARK, x - s.dir * 5, s.floor - 1, -s.dir * rng.range(10, 40), -rng.range(10, 40), 0.25, {
            sparks: SPARKS.rage,
          });
      }
      return travelled < s.reach || t < s.reach / s.speed + FADE;
    },
    draw() {
      place();
      const end = s.reach / s.speed;
      const show = Math.min(1, t / SHOW) * (t > end ? Math.max(0, 1 - (t - end) / FADE) : 1);
      drawSpiritWolf(x, s.floor, s.dir, Math.floor(t * STRIDE), show * 0.9, Math.abs(Math.sin(t * STRIDE * 1.5)) * 2);
    },
  };
}
