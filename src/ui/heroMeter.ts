import { usesDrill } from "../drill";
import { heroCode } from "../game/hero/kits";
import { byId } from "./dom";

/**
 * The hero's own meter under stamina: one bar drawn from the `HeroMeter` of the hero in play (`HeroModule.meter`),
 * hidden for a hero without one.
 */
const bar = byId("kitBar");
const label = byId("kitLabel");
const fill = byId("kitFill");
const text = byId("kitText");
let last = "";

export function updateHeroMeter(): void {
  const meter = usesDrill() ? undefined : heroCode().meter;
  if (bar.hidden === !!meter) bar.hidden = !meter;
  if (!meter) return;
  const share = Math.max(0, Math.min(1, meter.share()));
  const cells = meter.cells?.() ?? 0;
  const lit = meter.lit?.() ?? false;
  const flash = meter.flash?.() ?? false;
  const figure = meter.text?.() ?? "";
  const key = [meter.label, meter.tint, Math.round(share * 200), cells, lit, flash, figure].join();
  if (key === last) return;
  last = key;
  label.textContent = meter.label;
  text.textContent = figure;
  fill.style.width = `${share * 100}%`;
  bar.style.setProperty("--meter", meter.tint);
  bar.style.setProperty("--cell", cells > 0 ? `${100 / cells}%` : "100%");
  bar.classList.toggle("cells", cells > 1);
  bar.classList.toggle("lit", lit);
  bar.classList.toggle("empty", flash);
}
