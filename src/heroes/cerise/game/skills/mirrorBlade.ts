import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { foeAt } from "../abilities/spells";
import { createGlassRapier } from "../effects/glassRapier";
import { roseMark } from "../mark";
import { gainPoints } from "../points";

const SOURCE = "ce_mirror";
/** seconds before the rapiers can be called again, so a flurry of parries cannot stack them */
const COOLDOWN = 0.6;

/** what a glass rapier does past its damage: the mark and a Point, from their levels */
function struck(e: Enemy): void {
  const v = skillValues(SOURCE);
  if (v.mark) roseMark(e);
  if (v.points) gainPoints(v.points);
}

/** call the rapiers on a foe: from behind it, then back through it with the third level */
function call(m: SkillMemory, foe: Enemy | null): void {
  if (!foe || (m.cd as number) > 0) return;
  const v = skillValues(SOURCE);
  if (!rng.chance(v.chance)) return;
  m.cd = COOLDOWN;
  const behind = Math.sign(foe.x - hero.x) || hero.face;
  const damage = progress.stats.ad * v.power;
  for (let i = 0; i < v.blades; i++) {
    game.fx.push(createGlassRapier(foe, i % 2 ? -behind : behind, i * 0.1, damage, SOURCE, struck));
    if (v.twice) game.fx.push(createGlassRapier(foe, i % 2 ? behind : -behind, 0.2 + i * 0.1, damage, SOURCE, struck));
  }
  if (skillEvolved(SOURCE)) Object.assign(m, { foe, hold: v.hold, next: v.every });
}

/** Mirror Blade: a parry or a perfect dodge can call a glass rapier that lunges through the foe; evolved, they keep
 *  coming for a while */
export const mirrorBlade: SkillBehavior = {
  create: () => ({ cd: 0, foe: null, hold: 0, next: 0 }),
  update(m, _state, dt) {
    m.cd = Math.max(0, (m.cd as number) - dt);
    if ((m.hold as number) <= 0) return;
    m.hold = (m.hold as number) - dt;
    m.next = (m.next as number) - dt;
    const foe = m.foe as Enemy | null;
    if (!foe || foe.hp <= 0 || (m.next as number) > 0) return;
    const v = skillValues(SOURCE);
    m.next = v.every;
    game.fx.push(
      createGlassRapier(foe, rng.chance(0.5) ? 1 : -1, 0, progress.stats.ad * v.power * 0.5, SOURCE, struck),
    );
  },
  on: {
    parry(m, { fromX }) {
      call(m, foeAt(fromX));
    },
    perfectDodge(m) {
      call(m, nearestFoe(hero.x, hero.y - 18));
    },
  },
};
