import { bank } from "../../store/meta";
import { unlockProgress, unlockState } from "../../store/unlocks";
import type { UnlockDef } from "../../types/unlock";
import { goalText } from "../../utils/goalText";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { goalBar } from "./goalBar";
import { lockIcon } from "./lockIcon";
import { shakeNode } from "./shakeNode";

export interface HeroLock {
  root: HTMLElement;
  def: UnlockDef;
  show: (armed: boolean) => void;
  deny: () => void;
}

function goalLine(def: UnlockDef): HTMLElement {
  const line = el("span", "hero-goal");
  if (def.secret) {
    line.append(el("span", "hero-goal-text", "???"));
    return line;
  }
  const { have, need } = unlockProgress(def);
  line.append(el("span", "hero-goal-text", goalText(def.goal)));
  if (need > 1) line.append(goalBar(have, need));
  return line;
}

export function heroLock(def: UnlockDef): HeroLock {
  const root = el("span", "hero-lock");
  const price = def.price ?? 0;
  const show = (armed: boolean): void => {
    if (unlockState(def) === "locked") {
      root.dataset.goal = "";
      root.replaceChildren(lockIcon(), goalLine(def));
      return;
    }
    delete root.dataset.goal;
    if (armed) {
      root.replaceChildren(lockIcon(), "Unlock? Press again");
      return;
    }
    const tag = coinAmount(price);
    if (price > bank()) tag.classList.add("short");
    root.replaceChildren(lockIcon(), tag);
  };
  show(false);
  return { root, def, show, deny: () => shakeNode(root) };
}
