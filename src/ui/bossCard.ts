import { bossCardView } from "../game/bossFight";
import { byId } from "./dom";

const card = byId("bossCard");
const label = byId("bossCardLabel");
const name = byId("bossCardName");
const sub = byId("bossCardSub");
let shown = "";

export function updateBossCard(): void {
  const view = bossCardView();
  const key = view ? [view.tone, view.label, view.name, view.sub].join("|") : "";
  if (key === shown) return;
  shown = key;
  card.classList.toggle("show", !!view);
  if (!view) return;
  card.dataset.tone = view.tone;
  label.textContent = view.label;
  name.textContent = view.name;
  sub.textContent = view.sub;
  label.hidden = !view.label;
  sub.hidden = !view.sub;
}
