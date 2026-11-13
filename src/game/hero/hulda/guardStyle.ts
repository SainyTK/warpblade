import { ENEMIES } from "../../../constants/enemies";
import { GRIT } from "../../../constants/hulda/grit";
import { IRON_GUARD } from "../../../constants/hulda/moveset";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { hero } from "../../state";
import { setState } from "../actions";
import { counterCatch, executing } from "./counter";
import { counterHaymaker } from "./fists";
import { gainGrit } from "./grit";
import { canHold, take } from "./hold";
import { hulda } from "./memory";

/** the attacker stands close enough for her hands */
const inReach = (e: Enemy): boolean => Math.abs(enemyCenter(e)[0] - hero.x) <= IRON_GUARD.reach;

/**
 * Iron Catch: the parried attacker is seized. A minion (or a big foe Executioner's Grip holds) is in her hands at once,
 * ready for knees and a throw; a mini boss or boss is answered with a haymaker. Iron Counter lands its hit first.
 */
function ironCatch(fromX: number, foe: Enemy | null): void {
  emitSkillEvent({ type: "armour", kind: "parry", fromX, counter: true });
  if (!foe || foe.hp <= 0 || !inReach(foe)) return;
  counterCatch(foe);
  if (foe.hp <= 0) return;
  if (canHold(foe) || executing()) {
    take(foe);
    setState("hold");
    gainGrit(GRIT.grab);
    emitSkillEvent({ type: "grab", foe });
    sfx.tone(160, 110, 0.08, "square", 0.06);
    return;
  }
  if (!ENEMIES[foe.type].launchable) counterHaymaker(IRON_GUARD.haymaker);
}

/**
 * Her iron guard: the gauntlets stacked before her face let almost nothing through and a block costs little stamina
 * (none for a while after an Iron Counter), and every block earns Grit. Its parry is Iron Catch.
 */
export const HULDA_GUARD: GuardStyle = {
  chip: IRON_GUARD.chip,
  get blockCost(): number {
    return hulda.freeBlock > 0 ? 0 : IRON_GUARD.blockCost;
  },
  blocked(fromX: number) {
    gainGrit(GRIT.block);
    emitSkillEvent({ type: "armour", kind: "block", fromX, counter: false });
  },
  parried: ironCatch,
};
