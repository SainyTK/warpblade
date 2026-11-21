import { skillEvolved } from "../../../../../game/skills/query";
import { game, hero } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { SkillBehavior } from "../../../../../types/skillBehavior";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { drillNumbers } from "../numbers";
import { fireRound } from "../round";

const ID = "ca_pointblank";
const LINE_REACH = 160;

function attacker(fromX: number): Enemy | null {
  const near = game.enemies
    .filter((e) => e.hp > 0 && Math.abs(e.y - hero.y) < 40)
    .sort((a, b) => Math.abs(a.x - fromX) - Math.abs(b.x - fromX));
  return near[0] ?? null;
}

export const POINT_BLANK_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.parryWindow *= 1 + values.window;
  },
};

export const pointBlankDrill: SkillBehavior = {
  create: () => ({}),
  on: {
    parry(_m, { fromX }) {
      const values = drillNumbers(ID);
      if (!values.counter) {
        return;
      }
      const foe = attacker(fromX);
      fireRound(foe, {
        power: values.counter,
        kind: "parry",
        hot: !!values.hot,
        big: true,
        stagger: values.stagger,
        source: ID,
      });
      if (skillEvolved(ID)) {
        for (const e of game.enemies.filter(
          (o) =>
            o !== foe &&
            o.hp > 0 &&
            (o.x - hero.x) * hero.face > 0 &&
            (o.x - hero.x) * hero.face < LINE_REACH &&
            Math.abs(o.y - hero.y) < 30,
        )) {
          fireRound(e, { power: values.counter * 0.6, kind: "parry", hot: true, source: ID });
        }
      }
    },
    block(_m, { fromX }) {
      const values = drillNumbers(ID);
      if (values.block) {
        fireRound(attacker(fromX), { power: values.block, kind: "parry", source: ID });
      }
    },
  },
};
