import { sfx } from "../../services/audio";
import { bank } from "../../store/meta";
import { buyUnlock, hyperUnlock, unlockState } from "../../store/unlocks";
import type { StageId } from "../../types/campaign";
import type { UnlockState } from "../../types/unlock";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { lockIcon } from "./lockIcon";
import { onAdjust } from "./menuNav";
import { shakeNode } from "./shakeNode";

export interface StageModes {
  root: HTMLElement;
  entry: HTMLElement;
  show: (id: StageId, hyper: boolean) => void;
  isHyper: () => boolean;
}

const HINT: Readonly<Record<UnlockState, string>> = {
  locked: "Clear this stage to open Hyper.",
  forSale: "Faster foes, more gold, a reward of its own.",
  found: "Faster foes, more gold, a reward of its own.",
};

function chip(label: string, accent: string): HTMLButtonElement {
  const node = el("button", "hero-job stage-mode", label);
  node.type = "button";
  node.tabIndex = -1;
  node.setAttribute("role", "radio");
  node.style.setProperty("--job", accent);
  return node;
}

export function stageModes(changed: (hyper: boolean) => void): StageModes {
  const root = el("div", "hero-jobs stage-modes");
  const entry = el("div", "hero-job-row");
  entry.tabIndex = 0;
  entry.dataset.nav = "";
  entry.setAttribute("role", "radiogroup");
  entry.setAttribute("aria-label", "Mode");
  const normal = chip("Normal", "var(--crystal)");
  const hyperChip = chip("Hyper", "var(--hp)");
  const chips = el("span", "hero-job-chips");
  chips.append(normal, hyperChip);
  entry.append(el("span", "hero-job-label", "MODE"), chips);
  const hint = el("span", "hero-job-hint");
  root.append(entry, hint);
  let stage: StageId = "prologue";
  let hyper = false;
  let armed = false;
  const state = (): UnlockState => {
    const def = hyperUnlock(stage);
    return def ? unlockState(def) : "locked";
  };
  const render = (): void => {
    const s = state();
    const price = hyperUnlock(stage)?.price ?? 0;
    normal.setAttribute("aria-checked", String(!hyper));
    hyperChip.setAttribute("aria-checked", String(hyper));
    hyperChip.replaceChildren();
    delete hyperChip.dataset.locked;
    if (s === "locked") {
      hyperChip.dataset.locked = "";
      hyperChip.append(lockIcon(), "Hyper");
    } else if (s === "forSale") {
      const tag = coinAmount(price);
      if (price > bank()) tag.classList.add("short");
      hyperChip.append(armed ? "Buy? Press again" : "Hyper ", ...(armed ? [] : [tag]));
    } else hyperChip.append("Hyper");
    hint.textContent = HINT[s];
  };
  const set = (next: boolean): void => {
    if (next === hyper) return;
    hyper = next;
    render();
    changed(hyper);
  };
  const deny = (): void => {
    sfx.denied();
    shakeNode(hyperChip);
  };
  const tryHyper = (): void => {
    const s = state();
    if (s === "found") return set(true);
    if (s === "locked") return deny();
    const price = hyperUnlock(stage)?.price ?? 0;
    if (price > bank()) return deny();
    if (!armed) {
      armed = true;
      render();
      return;
    }
    armed = false;
    changed(true);
    if (!buyUnlock(hyperUnlock(stage)?.id ?? "")) return deny();
    sfx.learn();
    hyper = true;
    render();
  };
  normal.addEventListener("click", () => set(false));
  hyperChip.addEventListener("click", tryHyper);
  entry.addEventListener("click", (ev) => {
    if (ev.target === entry) (hyper ? normal : hyperChip).click();
  });
  entry.addEventListener("blur", () => {
    if (!armed) return;
    armed = false;
    render();
  });
  onAdjust(entry, () => (hyper ? set(false) : tryHyper()));
  return {
    root,
    entry,
    show: (id, wanted) => {
      stage = id;
      armed = false;
      hyper = wanted && state() === "found";
      render();
    },
    isHyper: () => hyper,
  };
}
