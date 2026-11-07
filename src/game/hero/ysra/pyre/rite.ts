import { PYRE_STATE_CLIPS } from "../../../../constants/clips/ysra/pyre";
import { DENY_FLASH } from "../../../../constants/combat";
import { sfx } from "../../../../services/audio";
import type { RiteDef, RiteId } from "../../../../types/ysra/pyre";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { emitSkillEvent } from "../../../skills/events";
import { hero } from "../../../state";
import { isFree, setState, settle } from "../../actions";
import { blowsDone, endCombo } from "../../combo";
import { afterRite } from "./hearthfire";
import { flashHeat, heat, overheatLeft, spendHeat } from "./heat";
import { letLoose } from "./release";
import { riteCost, selectedRite } from "./riteChoice";

const CLIP = PYRE_STATE_CLIPS.rite;
/** the rite under way, let loose when the glaive is planted */
const rite: { calling: RiteId } = { calling: "flare" };
rememberPerSeat(objectMemory(rite));

/** she plants the glaive and the rite bursts out */
function release(): void {
  letLoose(rite.calling);
  afterRite(rite.calling);
  emitSkillEvent({ type: "cast", ability: rite.calling });
}

/** a rite can start on the floor, standing or out of a string blow that has landed */
const canCall = (): boolean => hero.ground && (isFree() || (hero.state === "move" && blowsDone()));

function begin(chosen: RiteDef): void {
  rite.calling = chosen.id;
  if (hero.state === "move") {
    hero.move = null;
    endCombo(true);
  }
  hero.vx = 0;
  setState("rite");
}

/** I: the selected rite; refused with a tick when Heat is short or Overheat already burns. Overheat spends the whole
 *  bar when it is let loose; every other rite pays its cost now. */
export function pressRite(): boolean {
  if (!canCall()) return false;
  const chosen = selectedRite();
  if (!chosen) return true;
  const cost = riteCost(chosen);
  if (overheatLeft() > 0 || heat() < cost) {
    flashHeat(DENY_FLASH);
    sfx.denied();
    return true;
  }
  if (chosen.id !== "overheat") spendHeat(cost);
  begin(chosen);
  return true;
}

/** the rite pose plays; the rite leaves on its planting frame */
export function runRite(): boolean {
  const h = hero;
  if (h.state !== "rite") return false;
  if (!h.hitDone && h.st >= CLIP.hit) {
    h.hitDone = true;
    release();
  }
  if (h.st >= CLIP.dur) settle();
  return true;
}
