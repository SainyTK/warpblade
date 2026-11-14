import { createImpact } from "../../../../game/effects/impact";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { DUSK_SPARKS } from "../../look/colors";
import { vesperSound } from "../sound";
import { gainTempo, tempoShare, tempoTop } from "../tempo";

const ID = "ve_grace";
/** Dusk Ward turns aside the first blow in each this many seconds at the top of Tempo */
const WARD_EVERY = 4;

/** seconds before Dusk Ward can turn a blow aside again; host-only, since hurt is dealt on the host */
const ward = { cd: 0 };
rememberPerSeat(objectMemory(ward, true));

/** a parry or a perfect dodge heals her a little */
function heal(): void {
  const hp = skillValues(ID).heal;
  if (hp) hero.hp = Math.min(progress.stats.hp, hero.hp + hp);
}

/** Wanderer's Grace: stats from its rows; Tempo from a perfect dodge, a heal on a parry or a perfect dodge */
export const wanderersGrace: SkillBehavior = {
  create: () => ({}),
  on: {
    perfectDodge() {
      const n = skillValues(ID).pdTempo;
      if (n) gainTempo(n);
      heal();
    },
    parry: heal,
  },
};

/** foes deal less to her while her Tempo is above half (Wanderer's Grace) */
export const graceScale = (): number => (tempoShare() > 0.5 ? 1 - (skillValues(ID).guard ?? 0) : 1);

/** Dusk Ward: at the top of Tempo the first blow in each few seconds is turned aside by itself; true when it took the blow */
export function graceWard(): boolean {
  if (!skillEvolved(ID) || !tempoTop() || ward.cd > 0) return false;
  ward.cd = WARD_EVERY;
  hero.inv = Math.max(hero.inv, 0.4);
  game.fx.push(createImpact(hero.x + hero.face * 6, hero.y - 18, hero.face, true, DUSK_SPARKS));
  vesperSound.turn();
  return true;
}

/** the ward's wait runs down */
export function tickWard(dt: number): void {
  ward.cd = Math.max(0, ward.cd - dt);
}
