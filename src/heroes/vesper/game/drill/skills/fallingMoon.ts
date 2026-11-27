import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import type { DrillSpell } from "../../../../../types/drill";
import type { Enemy } from "../../../../../types/enemy";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { later } from "../later";
import { moonLift } from "../statuses";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_moon";
const ECLIPSE = [-34, 34, 0] as const;

function dropMoon(spell: DrillSpell, x: number, y: number, radius: number, power: number): void {
  const session = drillSession();
  if (!session) {
    return;
  }
  session.elementImpacts.push({ spell, x, y, face: 1, age: 0, fromSword: true });
  for (const foe of foesNear(x, y, radius)) {
    skillStrike(foe, power, ID);
    moonLift(foe);
  }
}

function pull(x: number, foes: readonly Enemy[]): void {
  for (const foe of foes) {
    foe.vx += (x - foe.x) * 5;
  }
}

export const FALLING_MOON_DRILL: VesperDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "moon") {
      return;
    }
    const [x, y] = enemyCenter(foe);
    const moons = (values.second ?? 0) + (evolved ? (values.eclipse ?? 0) * 3 : 0);
    vesperFx(ID, { x, y, face: hero.face }, { damage: progress.stats.ad * (1 + (values.bonus ?? 0) + moons) });
    skillStrike(foe, values.bonus, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (values.pull) {
      pull(x, foesNear(x, y, values.pull));
    }
    if (values.second) {
      later(0.3, () => dropMoon(spell, x, y, 26, values.second));
    }
    if (evolved) {
      ECLIPSE.forEach((dx, i) => {
        later(0.12 * (i + 1), () => dropMoon(spell, x + dx, y, 24, values.eclipse));
      });
    }
  },
  swordHit(foe, infusion, _strike, { values }) {
    if (infusion?.id === "moon" && values.small) {
      const [x, y] = enemyCenter(foe);
      later(0.1, () => dropMoon(infusion, x, y, 18, values.small));
    }
  },
};
