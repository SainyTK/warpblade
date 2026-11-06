import { RELOAD } from "../constants/sable/reload";
import { sable } from "../game/hero/sable/memory";
import { quiverSize, reloadWindow } from "../game/hero/sable/quiver";
import { reloadShare } from "../game/hero/sable/reload";
import { character } from "../game/state";
import { byId } from "./dom";

/** Sable's quiver bar under stamina, in place of the combo pips: bolts left, and the reload with its bright window */
const bar = byId("quiverBar");
const fill = byId("quiverFill");
const windowEl = byId("reloadWindow");
const needle = byId("reloadNeedle");
const comboRow = byId("chain").parentElement as HTMLElement;
let last = "";

export function updateQuiverBar(): void {
  const shown = character.kit === "sable";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (comboRow.hidden !== shown) comboRow.hidden = shown;
  if (!shown) return;
  const size = quiverSize();
  const r = sable.reload;
  const share = r ? reloadShare() : sable.ammo / size;
  const [a, b] = reloadWindow();
  const flash = sable.flash > 0 ? sable.flashKind : "";
  const key = [Math.round(share * 200), size, !!r, r?.jammed, sable.primed > 0, flash, a].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  needle.style.left = `${share * 100}%`;
  // the window is drawn on the reload's own length, which a jam stretches
  const scale = r ? (r.dur - (r.jammed ? RELOAD.jam : 0)) / r.dur : 1;
  windowEl.style.left = `${a * scale * 100}%`;
  windowEl.style.width = `${(b - a) * scale * 100}%`;
  bar.style.setProperty("--bolt-share", `${100 / size}%`);
  bar.classList.toggle("reloading", !!r);
  bar.classList.toggle("jammed", !!r?.jammed);
  bar.classList.toggle("primed", !r && sable.primed > 0);
  bar.classList.toggle("perfect", flash === "perfect");
  bar.classList.toggle("empty", flash === "empty" || flash === "jam");
}
