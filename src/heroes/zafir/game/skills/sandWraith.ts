import { skillValues } from "../../../../game/skills/query";
import { hero, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { STRING_SPINS } from "../stringSkills";
import { drawWraith, sendWraith, wraithCut } from "../summons/wraith";

const ID = "za_wraith";
/** Wraith Caravan's wraith walks round him this far out, at this pace, and cuts a foe again after this long */
const ESCORT = { reach: 40, pace: 1.6, again: 0.5 } as const;

interface WraithMemory {
  cd: number;
  t: number;
  escort: Map<Enemy, number>;
}
const memoryOf = (m: SkillMemory): WraithMemory => m as unknown as WraithMemory;

/** where the escort walks now */
const escortAt = (t: number): number => hero.x + Math.sin(t * ESCORT.pace) * ESCORT.reach;

/** Sand Wraith: a spin that lands may call a wraith that whirls through the foes ahead (one each way from level 6); as
 *  Wraith Caravan one walks round him all the time */
export const sandWraith: SkillBehavior = {
  create: () => ({ cd: 0, t: 0, escort: new Map() }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.t += dt;
    if (!state.evolved) return;
    const x = escortAt(m.t);
    const struck = new Set<Enemy>([...m.escort].filter(([, at]) => at > m.t).map(([e]) => e));
    const before = new Set(struck);
    wraithCut(x, hero.y, Math.sign(Math.cos(m.t * ESCORT.pace)) || 1, struck, skillValues(ID).power);
    for (const e of struck) if (!before.has(e)) m.escort.set(e, m.t + ESCORT.again);
  },
  draw(memory, state) {
    if (!state.evolved) return;
    const m = memoryOf(memory);
    drawWraith(escortAt(m.t), hero.y, m.t, Math.sign(Math.cos(m.t * ESCORT.pace)) || 1, 0.9);
  },
  on: {
    blow(memory, ev) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (ev.source !== "attacks" || !ev.move || !STRING_SPINS.has(ev.move) || m.cd > 0 || !rng.chance(v.chance))
        return;
      m.cd = v.cooldown;
      sendWraith(hero.x + hero.face * 8, hero.y, hero.face);
      if (v.pair) sendWraith(hero.x - hero.face * 8, hero.y, -hero.face);
    },
  },
};
