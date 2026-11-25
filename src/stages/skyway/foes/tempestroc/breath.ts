import { GROUND } from "../../../../constants/stage";
import { circle, glow, glowLine, hairline, line, place, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { clamp, lerp } from "../../../../utils/math";
import { SKY_FOES as C, SKY_SPARKS } from "../colors";
import { mindOf } from "./mind";
import { ROC_HITS, ROC_TIMES, ROC_WINDUP, stormWindup } from "./moves";

const BEAK = { x: 25, y: -5 } as const;
const STRANDS = 3;

export const beakOf = (e: Enemy): readonly [number, number] => [e.x + e.face * BEAK.x, e.y + BEAK.y];

const breathPoint = (e: Enemy): number => {
  const mind = mindOf(e);
  return lerp(mind.breathFrom, mind.breathTo, clamp(e.st / ROC_TIMES.breath));
};

function scorch(e: Enemy): void {
  const [bx, by] = beakOf(e);
  const fx = breathPoint(e);
  const struck = mindOf(e).struck;
  eachStanding(() => {
    if (struck.has(heroSlot())) return;
    const box = heroBox();
    for (let k = 0; k <= 1; k += 0.04) {
      const x = lerp(bx, fx, k);
      const y = lerp(by, GROUND, k);
      if (!boxHit([x - 2, y - 2, x + 2, y + 2], box)) continue;
      struck.add(heroSlot());
      hurtHero(ROC_HITS.breath * e.power, bx);
      return;
    }
  });
  if (fxRng.chance(0.8))
    particles.spawn(PK.SPARK, fx, GROUND - 1, fxRng.range(-90, 90), -fxRng.range(60, 160), 0.3, {
      sparks: SKY_SPARKS.volt,
    });
}

export function createBreath(e: Enemy): Effect {
  let t = 0;
  const live = () => (e.state === "wind" || e.state === "beam") && e.hp > 0 && e.stagger <= 0;
  return {
    update(dt) {
      t += dt;
      if (!live()) return false;
      if (e.state === "beam") scorch(e);
      return true;
    },
    drawBack() {
      if (e.state !== "wind") return;
      place();
      const mind = mindOf(e);
      const u = clamp(t / (ROC_WINDUP.breath * stormWindup(e)));
      const dir = Math.sign(mind.breathTo - mind.breathFrom) || 1;
      const span = Math.abs(mind.breathTo - mind.breathFrom);
      const shown = span * Math.min(1, u * 1.4);
      for (let d = (game.t * 50) % 8; d < shown; d += 8) {
        const x = mind.breathFrom + dir * d;
        line(x, GROUND, x + dir * 3, GROUND, u > 0.8 ? C.volt[4] : C.volt[3], 0.4 + u * 0.5);
      }
      glow(mind.breathFrom, GROUND - 2, 14, C.volt[2], 0.2 * u);
    },
    draw() {
      if (e.state !== "beam") return;
      place();
      const [bx, by] = beakOf(e);
      const fx = breathPoint(e);
      const seed = Math.floor(game.t * 30);
      for (let s = 0; s < STRANDS; s++) {
        let px0 = bx;
        let py0 = by;
        for (let k = 1; k <= 8; k++) {
          const u = k / 8;
          const jitter = k === 8 ? 0 : (grain(seed + s * 17, k) - 0.5) * 7 * Math.sin(u * Math.PI);
          const nx = lerp(bx, fx, u) + jitter;
          const ny = lerp(by, GROUND, u) + jitter * 0.4;
          if (s === 0) {
            line(px0, py0, nx, ny, C.volt[3]);
            hairline(px0, py0, nx, ny, WHITE);
          } else hairline(px0, py0, nx, ny, s === 1 ? C.volt[4] : C.volt[2], 0.85);
          px0 = nx;
          py0 = ny;
        }
      }
      circle(bx, by, 2.2, WHITE);
      circle(fx, GROUND - 1, 3.2, WHITE);
      for (let k = 0; k < 5; k++) {
        const h = 4 + grain(seed, k) * 12;
        const ox = (grain(k, seed) - 0.5) * 10;
        hairline(fx + ox, GROUND - 1, fx + ox * 1.4, GROUND - h, C.volt[4]);
      }
      const mind = mindOf(e);
      const dir = Math.sign(mind.breathTo - mind.breathFrom) || 1;
      for (let x = mind.breathFrom; (fx - x) * dir > 0; x += dir * 3) {
        px(x, GROUND, C.volt[1], 0.5);
      }
      glowLine(bx, by, fx, GROUND, 10, C.volt[2], 0.45);
      glow(fx, GROUND - 3, 22, C.volt[3], 0.6);
      glow(bx, by, 14, C.volt[3], 0.5);
    },
  };
}
