import { SPELL_CAST } from "../../../../constants/tallis/abilities";
import { sfx } from "../../../../services/audio";
import type { TallisAbility } from "../../../../types/tallis";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { setState, settle } from "../../actions";
import { canCast } from "../castCheck";
import { tallis } from "../memory";
import { castCaltrops } from "./caltrops";
import { castMarkDusk } from "./markDusk";
import { castNeedles } from "./needles";

type SpellId = Exclude<TallisAbility, "smokeKnot" | "hamstring">;

/** each spell's recharge in his memory */
const WAIT: Readonly<Record<SpellId, "needlesCd" | "markCd" | "caltropsCd">> = {
  t_needles: "needlesCd",
  t_markDusk: "markCd",
  t_caltrops: "caltropsCd",
};

/** what each spell does on the cast's frame */
const SPELLS: Readonly<Record<SpellId, () => void>> = {
  t_needles: castNeedles,
  t_markDusk: castMarkDusk,
  t_caltrops: castCaltrops,
};

/** I with a spell skill: paid in MP, its recharge started, the spell pose played */
export function pressSpell(id: SpellId): boolean {
  const v = skillValues(id);
  if (!canCast(tallis[WAIT[id]], v.mp ?? 0)) return true;
  hero.mp -= v.mp ?? 0;
  tallis[WAIT[id]] = v.cooldown ?? 1;
  tallis.casting = id;
  if (hero.ground) hero.vx = 0;
  setState("spellCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: id });
  return true;
}

/** the spell pose plays; the spell leaves his hand on its frame */
export function runSpellCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SPELL_CAST.hit) {
    h.hitDone = true;
    SPELLS[tallis.casting as SpellId]?.();
  }
  if (h.st >= SPELL_CAST.dur) settle();
}
