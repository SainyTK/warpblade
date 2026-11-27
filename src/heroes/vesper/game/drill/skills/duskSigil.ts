import { enemyCenter } from "../../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../../game/enemies/skillStatus";
import { nearestFoe } from "../../../../../game/skills/targets";
import { hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { SkillNumbers, VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { skillStrike } from "../strike";

const ID = "ve_hex";
const SIGIL = { every: 0.5, duration: 4, jump: 70 } as const;

function lay(foe: Enemy, n: number, values: SkillNumbers): void {
  const [x, y] = enemyCenter(foe);
  const ticks = SIGIL.duration / SIGIL.every;
  vesperFx(ID, { x, y: y - 14, face: hero.face }, { damage: progress.stats.ad * (values.damage ?? 0) * n * ticks });
  addStacks(foe, ID, {
    stacks: n,
    max: values.max,
    damage: progress.stats.ad * values.damage,
    every: SIGIL.every,
    duration: SIGIL.duration,
  });
}

function bloom(foe: Enemy, power: number): void {
  const n = consumeStacks(foe, ID);
  if (n) {
    const [x, y] = enemyCenter(foe);
    vesperFx(ID, { x, y, face: hero.face }, { damage: progress.stats.ad * power * n });
  }
  skillStrike(foe, power * n, ID);
}

export const DUSK_SIGIL_DRILL: VesperDrillSkill = {
  id: ID,
  swordHit(foe, infusion, strike, { values }) {
    if (strike === "warp") {
      lay(foe, values.warp ?? 1, values);
      return;
    }
    if (strike === "third" && values.bloom) {
      bloom(foe, values.bloom);
      return;
    }
    lay(foe, 1 + (infusion ? (values.infused ?? 0) : 0), values);
    if (values.jump && foe.hp <= 0) {
      const [x, y] = enemyCenter(foe);
      const next = nearestFoe(x, y, [foe]);
      if (next && Math.abs(next.x - x) <= SIGIL.jump) {
        lay(next, Math.max(1, stacksOf(foe, ID)), values);
      }
    }
  },
  spellHit(foe, spell, { values, evolved }) {
    if (evolved && spell.id === "moon") {
      bloom(foe, values.bloom);
    }
  },
};
