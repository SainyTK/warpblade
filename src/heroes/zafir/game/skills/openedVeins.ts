import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { WOUND_SOURCE } from "../../constants/wounds";
import { sandBurst } from "../effects/spout";
import { zafirFx } from "../skillFx";
import { STRING_SPINS } from "../stringSkills";
import { openWounds } from "../wounds";

const ID = "za_veins";
/** how far a torn wound's spray and a felled foe's wounds reach the foes beside it */
const BESIDE = 30;

/** foes standing beside `e` */
const beside = (e: Enemy): Enemy[] => foesOnScreen().filter((f) => f !== e && Math.abs(f.x - e.x) <= BESIDE);

/** tear `n` of a foe's wounds open: each deals `power` at once, and from level 7 a share of it cuts the foes beside */
function tear(e: Enemy, n: number, power: number): void {
  if (!n) return;
  const v = skillValues(ID);
  const damage = progress.stats.ad * power * n;
  dealDamage(e, damage, { fromX: hero.x, source: ID });
  if (v.splash) for (const f of beside(e)) dealDamage(f, damage * v.splash, { fromX: e.x, source: ID });
  const [x, y] = enemyCenter(e);
  sandBurst(x, y, 4 + n);
  zafirFx(ID, "slash", { x, y, face: hero.face, reach: 10 + n * 1.5 }, { mark: "bleed", damage });
}

/** Opened Veins: the cyclone tears every wound open, a foe it fells passes its wounds on, and evolved as Red Wind every
 *  spin tears one */
export const openedVeins: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_memory, ev, state) {
      if (ev.source !== "attacks" || !ev.move || !STRING_SPINS.has(ev.move)) return;
      const v = skillValues(ID);
      if (ev.move === "duneCyclone" && v.tear) {
        tear(ev.foe, consumeStacks(ev.foe, WOUND_SOURCE), v.tear);
        return;
      }
      if (ev.move === "duneCyclone" && stacksOf(ev.foe, WOUND_SOURCE)) {
        const [x, y] = enemyCenter(ev.foe);
        zafirFx(ID, "slash", { x, y, face: hero.face, reach: 12 }, { mark: "bleed", damage: ev.damage });
      }
      if (!state.evolved || !stacksOf(ev.foe, WOUND_SOURCE)) return;
      const n = consumeStacks(ev.foe, WOUND_SOURCE);
      tear(ev.foe, 1, v.red);
      openWounds(ev.foe, n - 1);
    },
    kill(_memory, ev) {
      if (!skillValues(ID).spread || hero.move !== "duneCyclone") return;
      const n = stacksOf(ev.foe, WOUND_SOURCE);
      for (const f of beside(ev.foe)) openWounds(f, n);
    },
  },
};
