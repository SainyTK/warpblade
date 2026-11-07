import "./achievements.css";
import { onAchievement } from "../../store/achievements";
import type { Achievement } from "../../types/achievement";
import { coinAmount } from "../coinIcon";
import { medalIcon } from "./medalIcon";
import { showToast } from "./toastQueue";

function toast(a: Achievement): HTMLElement {
  const box = document.createElement("div");
  box.className = "ach-toast";
  box.setAttribute("role", "status");
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

/** a small banner at the top of the screen for every achievement earned, in play or in the menu */
export function bindAchievementToasts(): void {
  onAchievement((a) => showToast(toast(a)));
}
