import { SNARE } from "../../../../constants/sable/snare";
import type { SableSpellId } from "../../../../types/sable";
import { emitSkillEvent } from "../../../skills/events";
import { skillLevel } from "../../../skills/query";
import { createRotation } from "../../../skills/rotation";
import { hero } from "../../../state";
import { isFree, setState, settle } from "../../actions";
import { deny } from "../../deny";
import { sable } from "../memory";
import { DECOY_SPELL } from "./decoy";
import { KEG_SPELL } from "./keg";
import { NET_SPELL } from "./net";
import { SNARE_SPELL } from "./snare";
import type { SableSpell } from "./spell";

const SPELLS: Readonly<Record<SableSpellId, SableSpell>> = {
  snare: SNARE_SPELL,
  s_net: NET_SPELL,
  s_decoy: DECOY_SPELL,
  s_keg: KEG_SPELL,
};
const ORDER: readonly SableSpellId[] = ["snare", "s_net", "s_decoy", "s_keg"];

/** the snare is in her base kit; the others come with their skills */
const known = (id: string): boolean => id === "snare" || skillLevel(id) > 0;

/** the spells on I; for Sable it turns on its own after each cast, since O is her reload */
const rotation = createRotation(ORDER, known);

/** the spell I casts now */
export function selectedSpell(): { id: SableSpellId; spell: SableSpell } {
  const id = (rotation.selected() ?? "snare") as SableSpellId;
  return { id, spell: SPELLS[id] };
}

/** a spell that can go now: recharged, with room on the floor and MP to pay */
const ready = (s: SableSpell): boolean => s.left() <= 0 && s.room() && hero.mp >= s.mp();

/** after a cast, move on to the next spell that is ready, or simply the next one when none is */
function turnRotation(): void {
  const start = selectedSpell().id;
  rotation.next();
  for (let i = 0; i < ORDER.length; i++) {
    const { id, spell } = selectedSpell();
    if (id === start || ready(spell)) return;
    rotation.next();
  }
}

/** every spell's recharge runs */
export function tickSpells(step: number): void {
  for (const id of ORDER) {
    const s = SPELLS[id];
    if (s.left() > 0) s.spend(Math.max(0, s.left() - step));
  }
}

/** I: kneel and cast the selected spell, paid with MP; on the floor only */
export function pressCast(): boolean {
  const h = hero;
  if (!isFree() || !h.ground) return false;
  const { id, spell } = selectedSpell();
  if (spell.left() > 0 || !spell.room()) {
    deny("cast");
    return true;
  }
  if (h.mp < spell.mp()) {
    deny("mp");
    return true;
  }
  h.mp -= spell.mp();
  spell.spend(spell.cooldown());
  sable.casting = id;
  setState("snare");
  emitSkillEvent({ type: "cast", ability: id });
  turnRotation();
  return true;
}

/** the spell goes off on the casting clip's set frame */
export function runCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SNARE.set) {
    h.hitDone = true;
    SPELLS[sable.casting].release();
  }
  if (h.st >= SNARE.dur) settle();
}

export const resetSpells = (): void => rotation.reset();
