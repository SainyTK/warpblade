import { HERO_GUARD } from "../../../../constants/combat";
import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter, walks } from "../../../../game/enemies/enemy";
import { createPayoff, payoffLands } from "../../../../game/skills/payoff";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";
import { OATHSWORN } from "../../constants/skillNumbers";
import { raiseBarrier } from "../barrier";
import { drawLightKnight } from "../effects/lightKnight";
import "../../types/events";

const ID = "al_oathsworn";
const CUT = { cx: 4, cy: -18, R: 18, sy: 0.6, rot: -0.3, a0: -2.4, a1: 0.9, W: 6, ramp: DAWN_RAMP } as const;

/** a knight of light beside `foe`, on the side away from Aldric, who cuts it `cuts` times, the last knocking it down */
function createKnight(foe: Enemy, side: number): Effect {
  const v = skillValues(ID);
  const cuts = v.cuts ?? 1;
  const payoff = createPayoff();
  const [fx] = enemyCenter(foe);
  const x = clampStageX(fx + side * 14, 8);
  const y = walks(foe) ? foe.y : Math.min(GROUND, foe.y + 18);
  const face = -side;
  let t = 0;
  let done = 0;
  const end = OATHSWORN.first + (cuts - 1) * OATHSWORN.gap + OATHSWORN.linger;
  return {
    update(dt) {
      t += dt;
      while (done < cuts && t >= OATHSWORN.first + done * OATHSWORN.gap) {
        done++;
        game.fx.push(createSlash(x, y, face, CUT));
        if (foe.hp <= 0 || !payoffLands(payoff, foe)) continue;
        const last = done === cuts;
        dealDamage(foe, progress.stats.ad * v.power, {
          source: ID,
          fromX: x,
          kx: face * 40,
          ky: last ? -40 : -10,
          stun: last ? v.stun : 0,
          heavy: last,
        });
        game.fx.push(createImpact(...enemyCenter(foe), face, last, DAWN_SPARKS));
      }
      return t < end;
    },
    draw() {
      const k = Math.min(1, t / 0.08, (end - t) / 0.15);
      const phase = ((t - OATHSWORN.first) / OATHSWORN.gap) % 1;
      drawLightKnight(x, y, face, k, t < OATHSWORN.first ? 0 : Math.min(1, phase * 3));
    },
  };
}

/** the foe nearest where a blow came from */
function attackerAt(fromX: number): Enemy | null {
  let best: Enemy | null = null;
  let gap: number = HERO_GUARD.attackerReach;
  for (const e of game.enemies) {
    const d = Math.abs(enemyCenter(e)[0] - fromX);
    if (e.hp > 0 && d < gap) {
      best = e;
      gap = d;
    }
  }
  return best;
}

/** knights answer on this foe if the chance and the wait allow; `sure` skips both (Twin Bulwark's arrival) */
function answer(m: SkillMemory, foe: Enemy | null, sure = false): void {
  const v = skillValues(ID);
  if (!foe || foe.hp <= 0) return;
  if (!sure && ((m.cd as number) > 0 || !rng.chance(v.chance))) return;
  m.cd = withCharms("cooldown", v.cooldown);
  const knights = withCharms("amount", v.knights ?? 1);
  const away = Math.sign(foe.x - hero.x) || hero.face;
  for (let i = 0; i < knights; i++) game.fx.push(createKnight(foe, i % 2 === 0 ? away : -away));
  if (v.barrier) raiseBarrier(OATHSWORN.barrier, 1);
}

/** Oathsworn: a parry (and from its fourth level a Counterbash) may call a knight of light who cuts the attacker; as
 *  Honour Guard two answer, and with Twin Bulwark every warp arrival calls them */
export const oathsworn: SkillBehavior = {
  create: () => ({ cd: 0 }),
  update(m, _s, dt) {
    m.cd = Math.max(0, (m.cd as number) - dt);
  },
  on: {
    parry(m, ev) {
      answer(m, attackerAt(ev.fromX));
    },
    guardBash(m, ev) {
      if (ev.counter && skillValues(ID).counter) answer(m, ev.foe);
    },
    warp(m, ev) {
      if (skillEvolved("al_bulwark")) answer(m, ev.foe, true);
    },
  },
};
