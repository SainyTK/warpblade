import type { Build } from "../../types/build";
import { el } from "../dom";

export type PickTool = "reroll" | "skip" | "banish";

/** each tool's button label, key and the build field that counts what is left */
const TOOLS: readonly { tool: PickTool; label: string; key: string; count: "rerolls" | "skips" | "banishes" }[] = [
  { tool: "reroll", label: "Reroll", key: "R", count: "rerolls" },
  { tool: "skip", label: "Skip", key: "X", count: "skips" },
  { tool: "banish", label: "Banish", key: "B", count: "banishes" },
];

/** Reroll, Skip and Banish buttons with what is left of each; `onUse` runs when one is pressed */
export function createPickTools(onUse: (tool: PickTool) => void): {
  root: HTMLElement;
  update(build: Build, banishing: boolean): void;
} {
  const root = el("div", "pick-tools");
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", "Pick tools");
  const buttons = TOOLS.map((t) => {
    const b = el("button", "pick-tool");
    b.type = "button";
    b.dataset.tool = t.tool;
    const key = el("kbd", "", t.key);
    key.setAttribute("aria-hidden", "true");
    b.append(key, el("span", "pick-tool-label", t.label), el("b", "pick-tool-count"));
    b.addEventListener("click", () => onUse(t.tool));
    root.append(b);
    return b;
  });
  return {
    root,
    update(build, banishing) {
      TOOLS.forEach((t, i) => {
        const b = buttons[i];
        const left = build[t.count];
        (b.querySelector(".pick-tool-count") as HTMLElement).textContent = String(left);
        b.disabled = left <= 0;
        b.setAttribute("aria-label", `${t.label}, ${left} left`);
        b.classList.toggle("active", t.tool === "banish" && banishing);
      });
    },
  };
}
