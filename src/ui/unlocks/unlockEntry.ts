import { unlockProgress, unlockState } from "../../store/unlocks";
import type { UnlockDef } from "../../types/unlock";
import { goalText } from "../../utils/goalText";
import type { CodexEntry } from "./codexRow";

export interface Shown {
  icon: string;
  name: string;
  text: string;
}

export function unlockEntry(def: UnlockDef | undefined, shown: Shown): CodexEntry {
  if (!def) return { state: "found", ...shown };
  const state = unlockState(def);
  if (state === "found") return { state: "found", ...shown };
  if (def.secret) return { state: "secret" };
  if (state === "forSale")
    return {
      state: "forSale",
      icon: shown.icon,
      name: shown.name,
      hint: "For sale in the Armory",
      price: def.price ?? 0,
    };
  const { have, need } = unlockProgress(def);
  return { state: "locked", icon: shown.icon, name: shown.name, hint: goalText(def.goal), have, need };
}
