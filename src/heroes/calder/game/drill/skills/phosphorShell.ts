import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { addStacks, stacksOf } from "../../../../../game/enemies/skillStatus";
import { progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderFx } from "../../skillFx";
import { later } from "../later";
import { skillStrike } from "../strike";
import { foesNear } from "../targets";

const ID = "ca_flare";
const SPREAD_REACH = 34;

function burn(foe: Enemy, stacks: number): void {
  addStacks(foe, ID, { stacks, max: 6, damage: progress.stats.ap * 0.12, every: 0.5, duration: 4 });
}

export const PHOSPHOR_SHELL_DRILL: CalderDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "flare") {
      return;
    }
    skillStrike(foe, values.bonus * 3, "abilities");
    const [cx, cy] = enemyCenter(foe);
    calderFx(
      ID,
      "burst",
      { x: cx, y: cy, reach: 8 },
      { damage: progress.stats.ap * (spell.damage / 10 + values.bonus * 3) },
    );
    burn(foe, 1);
    if (values.spread) {
      for (const near of foesNear(...enemyCenter(foe), SPREAD_REACH * (values.wide ? 1.5 : 1), [foe])) {
        burn(near, 1);
      }
    }
    const session = drillSession();
    if (values.twin && session && !values.echoing) {
      const [x, y] = enemyCenter(foe);
      later(0.12, () =>
        session.elementImpacts.push({ spell, x: x + 8, y, face: session.fighter.face, age: 0, fromSword: true }),
      );
    }
    if (evolved && session) {
      const [x, y] = enemyCenter(foe);
      for (let i = 0; i < values.barrage; i++) {
        later(0.1 + i * 0.07, () => {
          calderFx(ID, "burst", { x: x - 20 + i * 20, y: y + 6, reach: 9 }, { quiet: true, damage: progress.stats.ap });
          session.elementImpacts.push({
            spell,
            x: x - 20 + i * 20,
            y: y + 6,
            face: session.fighter.face,
            age: 0,
            fromSword: true,
          });
        });
      }
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (values.flare && stacksOf(foe, ID) > 0) {
      skillStrike(foe, values.flare, ID);
    }
  },
};
