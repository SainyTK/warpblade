import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { CRIMSON } from "../../constants/colors";
import { addHeft } from "../heft";

const ID = "br_fault";
const CRACK = { feet: 6, halt: 0.4, rings: 4 } as const;

export function createCrack(x0: number, x1: number, y: number): Effect {
  const v = skillValues(ID);
  const life = withBuild("duration", v.time);
  const a = Math.min(x0, x1);
  const b = Math.max(x0, x1);
  const seed = Math.floor(a * 7 + y);
  let t = 0;
  let tick = 0;
  const onIt = () => game.enemies.filter((e) => e.hp > 0 && e.x >= a && e.x <= b && Math.abs(e.y - y) < CRACK.feet);
  return {
    update(dt) {
      t += dt;
      tick -= dt;
      if (tick <= 0) {
        tick = v.every;
        for (const e of onIt()) {
          dealDamage(e, progress.stats.ad * v.damage, { fromX: e.x, dot: true, source: ID });
          if (v.halt) e.halt = Math.max(e.halt, CRACK.halt);
          if (v.chill) e.chill = Math.max(e.chill, v.chill);
          addHeft(v.heft ?? 0);
        }
      }
      if (t < life) return true;
      if (skillEvolved(ID)) {
        for (const e of onIt()) dealDamage(e, progress.stats.ad * v.erupt, { fromX: e.x, launch: -200, source: ID });
        for (let i = 0; i < CRACK.rings; i++)
          game.fx.push(createFloorRing(a + ((b - a) * (i + 0.5)) / CRACK.rings, y, 16, CRIMSON, 0.35));
      }
      return false;
    },
    draw() {},
    drawBack() {
      place();
      const k = Math.min(1, (life - t) / 0.5);
      for (let x = a; x <= b; x += 0.5) {
        const g = grain(Math.floor(x * 2), seed);
        const flicker = grain(Math.floor(x * 2), seed + Math.floor(t * 12));
        fleck(x, y + (g - 0.5) * 0.8, CRIMSON[g > 0.7 ? 5 : g > 0.35 ? 4 : 3], k * (0.5 + 0.5 * flicker));
      }
      glow((a + b) / 2, y, Math.min(40, (b - a) / 2 + 6), CRIMSON[3], 0.15 * k);
    },
  };
}
