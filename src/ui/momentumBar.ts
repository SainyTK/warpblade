import { fullMomentum, momentumShare } from "../game/hero/orrin/momentum";
import { character } from "../game/state";
import { byId } from "./dom";

/** Orrin's Momentum bar under stamina: a brass fill, glinting along its top edge when full */
const bar = byId("momentumBar");
const fill = byId("momentumFill");
let last = "";

export function updateMomentumBar(): void {
  const shown = character.kit === "orrin";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = momentumShare();
  const key = [Math.round(share * 100), fullMomentum()].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  bar.classList.toggle("full", fullMomentum());
}
