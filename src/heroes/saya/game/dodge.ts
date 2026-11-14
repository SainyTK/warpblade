import { markFoe } from "../../../game/enemies/skillStatus";
import { skillValues } from "../../../game/skills/query";
import { progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { STEP_MARK_TIME } from "../constants/skillLook";
import { SKILL } from "../constants/skills/ids";
import { cleanSheathe } from "./clean";
import { sheatheFlash } from "./effects/sheatheFlash";
import { STORE_ANGLE } from "./moves/slashes";
import { sayaSound } from "./sound";
import { releaseCuts, storeCut } from "./store";

/** Shadow Step: a foe the dodge passes through takes a stored cut (twice with Ghost Passage) and may be marked */
function passed(e: Enemy): void {
  const v = skillValues(SKILL.step);
  if (!v.store) return;
  const cut = progress.stats.ad * v.store;
  storeCut(e, cut, STORE_ANGLE.line);
  if (v.twice) storeCut(e, cut, -STORE_ANGLE.line);
  if (v.mark) markFoe(e, SKILL.step, STEP_MARK_TIME, v.mark);
}

/** Shadow Step: the dodge ends in a sheathe, a clean one with Ghost Passage */
function ended(): void {
  const v = skillValues(SKILL.step);
  if (!v.sheathe) return;
  sayaSound.click();
  sheatheFlash();
  if (v.twice) cleanSheathe();
  else releaseCuts(true);
}

/** her front dodge, as Shadow Step changes it */
export const SAYA_DODGE = { passed, ended };

/** a dodge in the air, with Shadow Step's sixth level */
export const sayaAirDodge = (): boolean => !!skillValues(SKILL.step).air;
