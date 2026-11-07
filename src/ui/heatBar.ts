import { HEAT } from "../constants/ysra/heat";
import { heatFlash, heatShare, overheatLeft, searing } from "../game/hero/ysra/pyre/heat";
import { skillLevel } from "../game/skills/query";
import { character } from "../game/state";
import { byId } from "./dom";

/** Ysra's Heat bar under stamina: hidden for Kael */
const bar = byId("heatBar");
const fill = byId("heatFill");
let last = "";

export function updateHeatBar(): void {
  const shown = character.kit === "ysra";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = heatShare();
  const hot = overheatLeft() > 0;
  const key = [Math.round(share * HEAT.max), searing(), skillLevel("y_searing") > 0, hot, heatFlash() > 0].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  bar.classList.toggle("edge", skillLevel("y_searing") > 0);
  bar.classList.toggle("searing", searing());
  bar.classList.toggle("full", !hot && share >= 1);
  bar.classList.toggle("overheat", hot);
  bar.classList.toggle("empty", heatFlash() > 0);
}
