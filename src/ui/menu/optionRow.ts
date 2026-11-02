import { onAdjust } from "./menuNav";

function row(label: string): { button: HTMLButtonElement; value: HTMLSpanElement } {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-item option";
  button.dataset.nav = "";
  const name = document.createElement("span");
  name.className = "option-name";
  name.textContent = label;
  const value = document.createElement("span");
  value.className = "option-value";
  button.append(name, value);
  return { button, value };
}

/** an on or off option; a press, Left or Right flips it */
export function toggleRow(label: string, on: boolean, set: (on: boolean) => void): HTMLButtonElement {
  const { button, value } = row(label);
  value.textContent = on ? "On" : "Off";
  button.dataset.on = String(on);
  button.setAttribute("aria-pressed", String(on));
  button.addEventListener("click", () => set(!on));
  onAdjust(button, () => set(!on));
  return button;
}

/** a level from 0 to steps drawn as a row of pixel blocks; Left and Right step it, a click on a block sets it */
export function levelRow(label: string, level: number, steps: number, set: (level: number) => void): HTMLButtonElement {
  const { button, value } = row(label);
  button.classList.add("option-level");
  button.setAttribute("aria-label", `${label} ${level} of ${steps}`);
  const step = (by: number) => set(Math.min(steps, Math.max(0, level + by)));
  const minus = document.createElement("span");
  minus.className = "level-step";
  minus.textContent = "-";
  minus.dataset.step = "-1";
  const plus = document.createElement("span");
  plus.className = "level-step";
  plus.textContent = "+";
  plus.dataset.step = "1";
  const meter = document.createElement("span");
  meter.className = "meter";
  for (let i = 1; i <= steps; i++) {
    const block = document.createElement("i");
    block.dataset.level = String(i);
    if (i <= level) block.className = "on";
    meter.append(block);
  }
  value.append(minus, meter, plus);
  button.addEventListener("click", (ev) => {
    const target = ev.target as HTMLElement;
    if (target.dataset.step) step(Number(target.dataset.step));
    else if (target.dataset.level)
      set(Number(target.dataset.level) === level ? level - 1 : Number(target.dataset.level));
  });
  onAdjust(button, step);
  return button;
}
