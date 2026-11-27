import { addStacks } from "../../../../../game/enemies/skillStatus";
import { game, hero, progress } from "../../../../../game/state";
import type { Side } from "../../../../../types/drill";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { roundBlast } from "../../effects/roundBlast";
import { calderFx } from "../../skillFx";
import { skillStrike } from "../strike";

const ID = "ca_vent";
const VENT_MIN = 48;

function vent(face: Side, values: Readonly<Record<string, number>>, quiet: boolean): void {
  roundBlast(hero.x + face * 16, hero.y - 16, face, false, false);
  const at = {
    x: hero.x + face * 24,
    y: hero.y - 16,
    face,
    toX: hero.x + face * Math.max(values.reach, VENT_MIN),
    toY: hero.y - 16,
  };
  calderFx(ID, "trail", at, { damage: progress.stats.ad * values.vent, quiet });
  for (const foe of game.enemies) {
    const ahead = (foe.x - hero.x) * face;
    if (foe.hp <= 0 || ahead < 0 || ahead > values.reach || Math.abs(foe.y - hero.y) > 30) {
      continue;
    }
    skillStrike(foe, values.vent, ID, { kx: face * (values.knock ? 140 : 40), ky: -30 });
    if (values.burn) {
      addStacks(foe, ID, { stacks: 1, max: 3, damage: progress.stats.ad * values.burn, every: 0.5, duration: 2 });
    }
  }
}

export const VENT_BLAST_DRILL: CalderDrillSkill = {
  id: ID,
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "second" && !(evolved && strike !== "warp")) {
      return;
    }
    const face: Side = hero.face > 0 ? 1 : -1;
    vent(face, values, strike !== "second");
    if (values.behind) {
      vent(face === 1 ? -1 : 1, values, true);
    }
  },
};
