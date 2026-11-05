import { BOONS } from "../../constants/boons";
import type { CharacterDef } from "../../types/character";
import type { PickWire } from "../../types/coop";
import type { PickOption } from "../../types/skill";
import { isAvailable, nodeById } from "../../utils/skillPicks";
import { progress } from "../state";

/** a card a guest chose, back from its id; null when the hero cannot learn it now */
export function readPick(c: CharacterDef, pick: PickWire): PickOption | null {
  if (pick.type === "boon") {
    const boon = BOONS.find((b) => b.id === pick.id);
    return boon ? { type: "boon", boon } : null;
  }
  const node = nodeById(c, pick.id);
  const branch = c.branches.find((b) => b.nodes.some((n) => n.id === pick.id));
  if (!node || !branch || !isAvailable(c, node, progress)) return null;
  return { type: "skill", node, branch };
}

/** a card as it crosses the network */
export const writePick = (option: PickOption): PickWire =>
  option.type === "boon" ? { type: "boon", id: option.boon.id } : { type: "skill", id: option.node.id };
