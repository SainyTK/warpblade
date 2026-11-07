import { FLARE } from "../../../../constants/ysra/rites";
import type { RiteId } from "../../../../types/ysra/pyre";
import { skillValues } from "../../../skills/query";
import { buffs } from "../buffs";
import { mend } from "./mend";

/** after a rite: Flare's own healing, Flame Pillar's and Kindling's in one burst of motes, and the Eternal Hearth
 *  glow on the glaive */
export function afterRite(id: RiteId): void {
  const k = skillValues("y_kindling");
  const pillar = id === "flamePillar" ? (skillValues("y_pillar").heal ?? 0) : 0;
  const share = (id === "flare" ? FLARE.heal : 0) + pillar + (k.heal ?? 0);
  if (share > 0) mend(share);
  if (k.ignite) {
    buffs.glow = k.ignite;
    buffs.glowBonus = k.glow;
  }
}
