import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, line, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { fxRng, particles } from "../../../../game/state";
import { fieldPace } from "../../../../game/timeFields";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { SKY_FOES as C, SKY_SPARKS } from "../colors";

const STUCK = 0.6;
const LENGTH = 7;

export function createFeather(x: number, y: number, vx: number, vy: number, damage: number): Effect {
  const o = { x, y, stuck: -1 };
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  return {
    update(step) {
      if (o.stuck >= 0) {
        o.stuck += step;
        return o.stuck < STUCK;
      }
      const dt = step * fieldPace(o.x, o.y);
      o.x += vx * dt;
      o.y += vy * dt;
      if (shotWarded(o.x, o.y)) return false;
      let hit = false;
      eachStanding(() => {
        if (hit || !boxHit([o.x - 2.5, o.y - 2.5, o.x + 2.5, o.y + 2.5], heroBox())) return;
        hit = true;
        hurtHero(damage, o.x - ux * 8);
      });
      if (hit) return false;
      if (fxRng.chance(0.35))
        particles.spawn(PK.SPARK, o.x - ux * 5, o.y - uy * 5, -vx * 0.1, -vy * 0.1, 0.15, { sparks: SKY_SPARKS.volt });
      if (o.y >= GROUND - 1) {
        o.y = GROUND - 1;
        o.stuck = 0;
        for (let i = 0; i < 4; i++)
          particles.spawn(PK.SPARK, o.x, GROUND - 1, fxRng.range(-60, 60), -fxRng.range(30, 90), 0.25, {
            sparks: SKY_SPARKS.feather,
          });
        return true;
      }
      return o.x > stageLeft() - 12 && o.x < stageRight() + 12 && o.y > -20;
    },
    draw() {
      place();
      const fade = o.stuck < 0 ? 1 : 1 - clamp(o.stuck / STUCK);
      const tx = o.x - ux * LENGTH;
      const ty = o.y - uy * LENGTH;
      const nx = -uy;
      const ny = ux;
      polygon(
        [
          [o.x - ux * 1.5, o.y - uy * 1.5],
          [o.x - ux * 4 + nx * 1.8, o.y - uy * 4 + ny * 1.8],
          [tx + nx * 0.8, ty + ny * 0.8],
          [tx - nx * 0.8, ty - ny * 0.8],
          [o.x - ux * 4 - nx * 1.4, o.y - uy * 4 - ny * 1.4],
        ],
        C.roc[3],
        fade,
      );
      line(o.x, o.y, tx, ty, C.rocBelly[2], fade);
      hairline(o.x - ux * 2 + nx * 1.2, o.y - uy * 2 + ny * 1.2, tx + nx * 0.4, ty + ny * 0.4, C.rocCrest[1], fade);
      fleck(o.x, o.y, C.volt[4], fade);
      fleck(o.x + ux * 0.5, o.y + uy * 0.5, C.volt[4], fade);
      glow(o.x, o.y, 7, C.volt[2], 0.3 * fade);
    },
  };
}
