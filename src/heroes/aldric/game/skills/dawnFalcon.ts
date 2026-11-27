import { glow, hairline, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { addStacks, markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress, rng } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";
import { FALCON } from "../../constants/skillNumbers";
import "../../types/events";
import { aldricFx } from "../fx";

const ID = "al_falcon";

/** a falcon of light that swoops ahead from Aldric's shoulder along a shallow dip and back, striking each foe it passes
 *  once a pass */
function createFalcon(x0: number, y0: number, face: number, passes: number, delay: number, evolved: boolean): Effect {
  const v = skillValues(ID);
  const o = { x: x0, y: y0, t: -delay, dir: face, travelled: 0, pass: 0 };
  let struck = new Set<Enemy>();
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      const step = FALCON.speed * dt;
      o.travelled += step;
      o.x += o.dir * step;
      const u = o.travelled / FALCON.reach;
      o.y = y0 + Math.sin(u * Math.PI) * 14;
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e)) continue;
        if (!boxHit([o.x - 4, o.y - FALCON.half, o.x + 4, o.y + FALCON.half], enemyBox(e))) continue;
        struck.add(e);
        dealDamage(e, progress.stats.ad * v.power, { source: ID, fromX: o.x - o.dir * 6, kx: o.dir * 30, ky: -20 });
        game.fx.push(createImpact(o.x, o.y, o.dir, false, DAWN_SPARKS));
        const swoop = { x: o.x - o.dir * 30, y: o.y - 4, face: o.dir, toX: o.x + o.dir * 6, toY: o.y };
        aldricFx(ID, "trail", swoop, {
          damage: progress.stats.ad * v.power,
          quiet: struck.size > 1 || o.pass > 0,
          sigil: "sun",
          lift: 2,
        });
        if (v.mark) markFoe(e, ID, withBuild("duration", FALCON.mark), v.mark);
        if (evolved)
          addStacks(e, ID, {
            stacks: 1,
            max: 3,
            damage: progress.stats.ad * v.burn,
            every: 0.5,
            duration: FALCON.burnTime,
          });
      }
      if (o.travelled >= FALCON.reach || o.x < stageLeft() - 8 || o.x > stageRight() + 8) {
        o.pass++;
        o.travelled = 0;
        o.dir = -o.dir;
        struck = new Set();
      }
      return o.pass < passes;
    },
    draw() {
      if (o.t < 0) return;
      place();
      const flap = Math.sin(o.t * 30) * 3;
      const { x, y, dir: f } = o;
      polygon(
        [
          [x + 4 * f, y],
          [x - 2 * f, y - 4 - flap],
          [x - 1 * f, y],
          [x - 2 * f, y + 3 + flap * 0.4],
        ],
        DAWN_RAMP[5],
        0.9,
      );
      hairline(x + 4 * f, y, x - 4 * f, y, WHITE);
      hairline(x - 3 * f, y, x - 14 * f, y, DAWN_RAMP[4], (q) => 0.7 * (1 - q));
      glow(x, y, 8, DAWN_RAMP[4], 0.4);
    },
  };
}

/** falcons go, if the chance and the wait allow */
function send(m: SkillMemory, evolved: boolean): void {
  const v = skillValues(ID);
  if ((m.cd as number) > 0 || !rng.chance(v.chance)) return;
  m.cd = withBuild("cooldown", v.cooldown);
  const count = withBuild("amount", v.count ?? 1);
  for (let i = 0; i < count; i++)
    game.fx.push(createFalcon(hero.x, hero.y - 30 - i * 6, hero.face, v.passes ?? 1, i * 0.12, evolved));
}

/** Dawn Falcon: an ability cast (and from its seventh level a parry or a Counterbash) may send falcons of light through the foes
 *  ahead; as Sunbird they swoop three times and set foes burning */
export const dawnFalcon: SkillBehavior = {
  create: () => ({ cd: 0 }),
  update(m, _s, dt) {
    m.cd = Math.max(0, (m.cd as number) - dt);
  },
  on: {
    cast(m, _ev, { evolved }) {
      send(m, evolved);
    },
    parry(m, _ev, { evolved }) {
      if (skillValues(ID).counter) send(m, evolved);
    },
    guardBash(m, ev, { evolved }) {
      if (ev.counter && skillValues(ID).counter) send(m, evolved);
    },
  },
};
