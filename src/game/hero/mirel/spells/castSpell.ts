import { sfx } from "../../../../services/audio";
import type { MirelAbility } from "../../../../types/mirel";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { setState } from "../../actions";
import { cutForSharedAction } from "../../sharedCut";
import { mayCast } from "../castCheck";
import { mirel } from "../memory";
import { castForetell } from "./foretell";
import { castHourHand } from "./hourHand";
import { castSundial } from "./sundial";

/** the spell pose: the staff raised forward, the spell leaving it on its frame */
export const SPELL_CAST = { dur: 12 / 30, hit: 5 / 30 } as const;

/** her spell skills on I */
export type SpellId = Exclude<MirelAbility, "stillfield" | "stoppedClock" | "secondHand">;

/** each spell's recharge in her memory */
export const WAIT: Readonly<Record<SpellId, "sundialCd" | "foretellCd" | "sweepCd">> = {
  m_sundial: "sundialCd",
  m_foretell: "foretellCd",
  m_handsweep: "sweepCd",
};

/** what each spell does on the cast's frame */
const SPELLS: Readonly<Record<SpellId, () => void>> = {
  m_sundial: castSundial,
  m_foretell: castForetell,
  m_handsweep: castHourHand,
};

/** I with a spell skill: paid in MP, its recharge started, the spell pose played */
export function castSpell(id: SpellId): boolean {
  if (!mayCast()) return false;
  const v = skillValues(id);
  cutForSharedAction();
  hero.mp -= v.mp ?? 0;
  mirel[WAIT[id]] = v.cooldown ?? 1;
  mirel.casting = id;
  if (hero.ground) hero.vx = 0;
  setState("spellCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: id });
  return true;
}

/** the spell pose plays; the spell leaves the staff on its frame */
export function runSpellCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SPELL_CAST.hit) {
    h.hitDone = true;
    SPELLS[mirel.casting as SpellId]?.();
  }
  if (h.st >= SPELL_CAST.dur) setState(h.ground ? "idle" : "fall");
}
