import { progress } from "../game/state";
import { buildStats, flowMultiplier } from "../utils/build";
import { byId } from "./dom";

/** Flow: the stacks the hero's own hits have built, and the damage multiplier they give */
const bar = byId("flowBar");
const fill = byId("flowFill");
const mult = byId("flowMult");
let last = "";

export function updateFlowBar(): void {
  const b = progress.build;
  const stacks = Math.ceil(b.flow);
  const cap = buildStats(b).flowCap;
  const key = `${stacks}/${cap}`;
  if (key === last) return;
  last = key;
  fill.style.width = `${(Math.min(stacks, cap) / cap) * 100}%`;
  mult.textContent = `x${flowMultiplier(stacks).toFixed(1)}`;
  bar.classList.toggle("full", stacks >= cap);
  bar.classList.toggle("idle", stacks === 0);
}
