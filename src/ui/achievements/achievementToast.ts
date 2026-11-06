import "./achievements.css";
import { onAchievement } from "../../store/achievements";
import type { Achievement } from "../../types/achievement";
import { coinAmount } from "../coinIcon";
import { medalIcon } from "./medalIcon";

/** how long each banner stays; several earned at once follow one another */
const TOAST_MS = 3200;

const queue: Achievement[] = [];
let showing = false;

function toast(a: Achievement): HTMLElement {
  const box = document.createElement("div");
  box.className = "ach-toast";
  box.setAttribute("role", "status");
  box.style.setProperty("--toast-ms", `${TOAST_MS}ms`);
  const text = document.createElement("span");
  text.className = "ach-toast-text";
  const label = document.createElement("small");
  label.textContent = "Achievement";
  const name = document.createElement("b");
  name.textContent = a.name;
  text.append(label, name);
  box.append(medalIcon(true), text, coinAmount(a.reward));
  return box;
}

function next(): void {
  const a = queue.shift();
  showing = !!a;
  if (!a) return;
  const box = toast(a);
  document.body.append(box);
  setTimeout(() => {
    box.remove();
    next();
  }, TOAST_MS);
}

/** a small banner at the top of the screen for every achievement earned, in play or in the menu */
export function bindAchievementToasts(): void {
  onAchievement((a) => {
    queue.push(a);
    if (!showing) next();
  });
}
