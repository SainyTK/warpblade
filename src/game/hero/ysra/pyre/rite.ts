import { PYRE_STATE_CLIPS } from "../../../../constants/clips/ysra/pyre";
import type { RiteId } from "../../../../types/ysra/pyre";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { emitSkillEvent } from "../../../skills/events";
import { hero } from "../../../state";
import { isFree, setState, settle } from "../../actions";
import { blowsDone, endCombo } from "../../combo";
import { afterRite } from "./hearthfire";
import { heat, overheatLeft, spendHeat } from "./heat";
import { hasWideForm, letLoose } from "./release";
import { riteById, riteCost } from "./riteCost";

const CLIP = PYRE_STATE_CLIPS.rite;
/** the rite under way, let loose when the glaive is planted, and whether it is the wide form */
const rite: { calling: RiteId; wide: boolean } = { calling: "flare", wide: false };
rememberPerSeat(objectMemory(rite));

/** she plants the glaive and the rite bursts out */
function release(): void {
  letLoose(rite.calling, rite.wide);
  afterRite(rite.calling);
  emitSkillEvent({ type: "cast", ability: rite.calling });
}

/** a rite can start on the floor, standing or out of a string blow that has landed */
const canCall = (): boolean => hero.ground && (isFree() || (hero.state === "move" && blowsDone()));

/** she can pay for the rite now: Heat covers it, and Overheat is not already burning */
export const riteAffordable = (id: RiteId): boolean => overheatLeft() <= 0 && heat() >= riteCost(riteById(id));

/** I on a rite (held, its wide form where it has one): false when she cannot call it now. Overheat spends the whole bar
 *  when it is let loose; every other rite pays its cost now. */
export function castRite(id: RiteId, wide: boolean): boolean {
  if (!canCall() || !riteAffordable(id)) return false;
  if (id !== "overheat") spendHeat(riteCost(riteById(id)));
  rite.calling = id;
  rite.wide = wide && hasWideForm(id);
  if (hero.state === "move") {
    hero.move = null;
    endCombo(true);
  }
  hero.vx = 0;
  setState("rite");
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
