import { HAMSTRING, SMOKE_KNOT } from "../../../constants/tallis/abilities";
import { SINK } from "../../../constants/tallis/sink";
import { VEIL } from "../../../constants/tallis/veil";
import type { AbilitySlot } from "../../../types/moveset";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { hamstringMp, pressHamstring } from "./hamstring";
import { tallis } from "./memory";
import { pressSink, sinkCost, sinkWait } from "./sink";
import { knotMp, pressSmokeKnot } from "./smokeKnot";
import { pressSpell, SPELL_WAIT, type SpellId } from "./spells/castSpell";
import { pressVeil, veilAffordable, veilCost } from "./veil";

/** his spell skills on I, after his own four, in the order O turns through them */
const SPELLS: readonly { id: SpellId; label: string }[] = [
  { id: "t_needles", label: "NEEDLES" },
  { id: "t_markDusk", label: "MARK" },
  { id: "t_caltrops", label: "CALTROPS" },
];

/** a spell skill on I: held once its skill is, paid in MP, its recharge from its level */
const spellSlot = ({ id, label }: { id: SpellId; label: string }): AbilitySlot => ({
  id,
  label,
  known: () => skillLevel(id) > 0,
  wait: () => tallis[SPELL_WAIT[id]],
  full: () => Math.max(0.01, skillValues(id).cooldown ?? 1),
  affordable: () => hero.mp >= (skillValues(id).mp ?? 0),
  cast: () => pressSpell(id),
  evolved: () => skillEvolved(id),
});

/**
 * Tallis's abilities on I, in the order O turns through them: the Veil (on and off, paid in Gloam), Sink (tapped a dip
 * under the foe ahead, held the pool he stays in while I is held, paid in stamina), Smoke Knot and Hamstring (held, their
 * wide forms), then his spell skills.
 */
export const TALLIS_SLOTS: readonly AbilitySlot[] = [
  {
    id: "veil",
    label: "VEIL",
    tint: "var(--gloam-glint)",
    known: () => true,
    wait: () => (tallis.veil ? 0 : tallis.veilLock),
    full: () => VEIL.lock,
    affordable: veilAffordable,
    cast: pressVeil,
    cost: () => (tallis.veil ? "OFF" : `${veilCost()} GL`),
  },
  {
    id: "sink",
    label: "SINK",
    known: () => true,
    wait: sinkWait,
    full: () => SINK.wait,
    affordable: () => hero.stamina >= sinkCost(),
    cast: pressSink,
    cost: () => `${Math.round(sinkCost())} ST`,
  },
  {
    id: "smokeKnot",
    label: "SMOKE",
    known: () => true,
    wait: () => tallis.knotCd,
    full: () => SMOKE_KNOT.cooldown,
    affordable: () => hero.mp >= knotMp(false),
    cast: pressSmokeKnot,
  },
  {
    id: "hamstring",
    label: "HAMSTRING",
    known: () => true,
    wait: () => tallis.hamCd,
    full: () => HAMSTRING.cooldown,
    affordable: () => hero.mp >= hamstringMp(false),
    cast: pressHamstring,
  },
  ...SPELLS.map(spellSlot),
];

/** the recharges of Smoke Knot, Hamstring and the spells run down */
export function tickAbilities(recharge: number): void {
  tallis.knotCd = Math.max(0, tallis.knotCd - recharge);
  tallis.hamCd = Math.max(0, tallis.hamCd - recharge);
  tallis.needlesCd = Math.max(0, tallis.needlesCd - recharge);
  tallis.markCd = Math.max(0, tallis.markCd - recharge);
  tallis.caltropsCd = Math.max(0, tallis.caltropsCd - recharge);
}
