import { enemyCenter } from "../../../../../game/enemies/enemy";
import { skillFx } from "../../../../../game/skillFx";
import { game, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { KaelDrillSkill, SkillNumbers } from "../../../types/drillSkill";
import { createLightning } from "../../spells/lightning";

const ID = "k_volt";

function arc(foe: Enemy, values: SkillNumbers, delay: number): void {
  const ap = progress.stats.ap;
  const [x, y] = enemyCenter(foe);
  const damage = ap * ((values.bolt ?? 0) + values.arc * values.arcs);
  skillFx(ID, "bolt", { x, y, reach: y - 6 }, { damage, delay });
  game.fx.push(
    createLightning(foe, enemyCenter(foe), {
      damage: ap * (values.bolt ?? 0),
      arcDamage: ap * values.arc,
      arcs: values.arcs,
      shock: values.shock ?? 0,
      glow: 0.4,
      skyFlash: false,
      source: ID,
      delay,
    }),
  );
}

export const LIGHTNING_DRILL: KaelDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "volt") {
      return;
    }
    arc(foe, values, 0);
    if (evolved) {
      arc(foe, values, values.again);
    }
  },
  swordHit(foe, infusion, { values }) {
    if (values.infused && infusion?.id === "volt") {
      arc(foe, values, 0);
    }
  },
};
