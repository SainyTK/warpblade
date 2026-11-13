import { PAL, SPARKS } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { game, particles, rng } from "../../state";
import { boxHit } from "../../world";
import { createImpact } from "../impact";

/** one crescent of blood along the floor: where it leaves, which way, how far and fast, and what it deals */
export interface BloodCrescentSpec {
  x: number;
  floor: number;
  dir: number;
  reach: number;
  speed: number;
  /** damage to each foe it passes, worked out from his stats */
  damage: number;
  height: number;
  /** the hit's source: the hero's own press when left out */
  source?: SourceId;
  /** told of each foe it lands on */
  struck?: (e: Enemy) => void;
}

/** how far the crescent's horns lean back from its belly, in art pixels */
const LEAN = 5;

/**
 * Red Crescent: a standing crescent of blood that runs along the floor and passes through foes, striking each once: a
 * bright core down its belly, darker horns leaning back, and drips falling off behind it
 */
export function createBloodCrescent(s: BloodCrescentSpec): Effect {
  let travelled = 0;
  let x = s.x;
  const hit = new Set<Enemy>();
  const strike = () => {
    const box: [number, number, number, number] = [
      Math.min(x, x - s.dir * 8),
      s.floor - s.height,
      Math.max(x, x - s.dir * 8),
      s.floor,
    ];
    for (const e of game.enemies) {
      if (e.hp <= 0 || hit.has(e) || !boxHit(box, enemyBox(e))) continue;
      hit.add(e);
      const result = dealDamage(e, s.damage, { fromX: x - s.dir * 6, kx: s.dir * 30, source: s.source ?? "abilities" });
      if (result === "blocked") continue;
      game.fx.push(createImpact(e.x, s.floor - 8, s.dir, false, SPARKS.rage));
      s.struck?.(e);
    }
  };
  return {
    update(dt) {
      const step = s.speed * dt;
      travelled += step;
      x += s.dir * step;
      strike();
      if (rng.chance(0.6))
        particles.spawn(
          PK.SPARK,
          x - s.dir * 3,
          s.floor - rng.range(2, s.height),
          -s.dir * rng.range(10, 30),
          20,
          0.3,
          {
            sparks: SPARKS.rage,
          },
        );
      return travelled < s.reach;
    },
    draw() {
      place();
      const fade = Math.min(1, (s.reach - travelled) / 24);
      for (let i = 0; i <= s.height; i++) {
        const v = i / s.height;
        // the belly bows ahead at its middle; the horns lean back toward the top and bottom
        const bow = Math.sin(v * Math.PI);
        const fx = x + s.dir * (bow * LEAN - LEAN * 0.5);
        const fy = s.floor - i;
        px(fx - s.dir * 2, fy, PAL.rage[1], fade * 0.8 * bow);
        px(fx - s.dir, fy, PAL.rage[3], fade);
        px(fx, fy, bow > 0.6 ? PAL.rage[5] : PAL.rage[4], fade);
      }
      glow(x, s.floor - s.height / 2, s.height * 0.8, PAL.rage[3], 0.22 * fade);
    },
  };
}
