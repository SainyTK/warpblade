import { glow, hairline, place, polygon } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import { shake, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";

const ID = "br_falling";
/** how hard the blade throws foes up from its sixth level */
const LAUNCH = -220;
/** the phantom blade drops from this high in this long, is this wide and long, and stays planted this long after */
const BLADE = { from: 90, fall: 0.22, half: 3, length: 34, stay: 0.3, rainEvery: 0.3 } as const;

/** a phantom greatsword falling point first onto the floor under `foe`, striking every foe round where it lands */
function createBlade(foe: Enemy): Effect {
  const v = skillValues(ID);
  const x = foe.x;
  const y = surfaceBelow(foe.x, foe.y - 4);
  let t = 0;
  let landed = false;
  return {
    update(dt) {
      t += dt;
      if (!landed && t >= BLADE.fall) {
        landed = true;
        const reach = withCharms("area", v.reach);
        game.fx.push(createFloorRing(x, y, reach, CRIMSON, 0.35));
        shake(0.12, 1.6);
        for (const e of game.enemies) {
          if (e.hp <= 0 || Math.abs(e.x - x) > reach || Math.abs(e.y - y) > 40) continue;
          dealDamage(e, progress.stats.ad * v.power, {
            fromX: x,
            kx: Math.sign(e.x - x) * 50,
            stun: v.stun,
            launch: v.launch ? LAUNCH : undefined,
            heavy: true,
            source: ID,
          });
          game.fx.push(createImpact(e.x, e.y - 10, Math.sign(e.x - x) || 1, false, CRIMSON_SPARKS));
        }
      }
      return t < BLADE.fall + BLADE.stay;
    },
    draw() {
      place();
      const u = Math.min(1, t / BLADE.fall);
      const tip = y - BLADE.from * (1 - u * u) + 4;
      const k = landed ? 1 - (t - BLADE.fall) / BLADE.stay : 0.85;
      const top = tip - BLADE.length;
      polygon(
        [
          [x - BLADE.half, top],
          [x + BLADE.half, top],
          [x + BLADE.half, tip - 3],
          [x, tip],
          [x - BLADE.half, tip - 3],
        ],
        CRIMSON[3],
        0.7 * k,
      );
      hairline(x - BLADE.half + 0.5, top, x - BLADE.half + 0.5, tip - 3, CRIMSON[5], k);
      hairline(x - 5, top, x + 5, top, CRIMSON[4], k);
      hairline(x, top - 5, x, top, CRIMSON[2], k);
      if (!landed) hairline(x, top - 14, x, top - 4, CRIMSON[4], (w) => w * 0.6);
      glow(x, tip - 6, 14, CRIMSON[4], 0.4 * k);
      if (landed) glow(x, tip, 8, WHITE, 0.3 * k);
    },
  };
}

/** drop blades on up to `count` foes on screen, nearest first */
function drop(count: number): void {
  const foes = foesOnScreen()
    .filter((e) => e.hp > 0)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, count);
  for (const foe of foes) game.fx.push(createBlade(foe));
}

/** Falling Blade: a kill may call phantom greatswords down onto the nearest foes; Blade Rain keeps them falling a while */
export const fallingBlade: SkillBehavior = {
  create: () => ({ cd: 0, rain: 0, next: 0 }),
  update(memory: SkillMemory, _state, dt) {
    memory.cd = Math.max(0, (memory.cd as number) - dt);
    if ((memory.rain as number) <= 0) return;
    memory.rain = (memory.rain as number) - dt;
    memory.next = (memory.next as number) - dt;
    if ((memory.next as number) > 0) return;
    memory.next = BLADE.rainEvery;
    drop(1);
  },
  on: {
    kill(memory) {
      const v = skillValues(ID);
      if ((memory.cd as number) > 0 || !rng.chance(v.chance)) return;
      memory.cd = v.cooldown;
      drop(Math.round(withCharms("amount", v.count)));
      if (skillEvolved(ID)) memory.rain = withCharms("duration", v.rain);
    },
  },
};
