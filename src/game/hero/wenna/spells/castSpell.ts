import { sfx } from "../../../../services/audio";
import type { WennaAbility } from "../../../../types/wenna";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { setState } from "../../actions";
import { wenna } from "../memory";
import { startCasting } from "../startCasting";
import { castEffigy } from "./effigy";
import { castLampVolley } from "./lampVolley";
import { castWaxPool } from "./waxPool";

export type WennaSpell = Exclude<WennaAbility, "light" | "kindle" | "beckon">;

/** each spell's recharge in her memory */
const WAIT: Readonly<Record<WennaSpell, "volleyCd" | "poolCd" | "effigyCd">> = {
  w_lampVolley: "volleyCd",
  w_waxPool: "poolCd",
  w_effigy: "effigyCd",
};

/** what each spell does on the cast's frame */
const SPELLS: Readonly<Record<WennaSpell, () => void>> = {
  w_lampVolley: castLampVolley,
  w_waxPool: castWaxPool,
  w_effigy: castEffigy,
};

/** seconds a spell still waits */
export const spellWait = (id: WennaSpell): number => wenna[WAIT[id]];

/** MP a spell costs */
export const spellMp = (id: WennaSpell): number => skillValues(id).mp ?? 0;

/** I with a spell skill: paid in MP, its recharge started, the spell pose played */
export function castSpell(id: WennaSpell): boolean {
  if (!startCasting()) return false;
  const v = skillValues(id);
  hero.mp -= v.mp ?? 0;
  wenna[WAIT[id]] = v.cooldown ?? 1;
  wenna.casting = id;
  if (hero.ground) hero.vx = 0;
  setState("spellCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: id });
  return true;
}

/** the spell leaves the lamp on its frame */
export function castSpellNow(id: WennaAbility): void {
  if (id === "light" || id === "kindle" || id === "beckon") return;
  SPELLS[id]();
}
