import { VITAL_BAR } from "../constants/vitals";
import { progress } from "../game/state";
import type { ShardKind } from "../types/game";
import { rateFigure } from "../utils/pacts";
import { byId } from "./dom";

const bars: Readonly<Record<ShardKind, HTMLElement>> = { heart: byId("hpBar"), mana: byId("mpBar") };
const hpRate = byId("hpRate");
const shown = { heart: -1, mana: -1, rate: Number.NaN };

function grow(kind: ShardKind, count: number): void {
  const bar = bars[kind];
  const share = Math.min(1, count / VITAL_BAR.fullShards[kind]);
  bar.style.setProperty("--span", String(VITAL_BAR.start + (1 - VITAL_BAR.start) * share));
  if (shown[kind] < 0 || count <= shown[kind]) return;
  bar.classList.remove("grew");
  void bar.offsetWidth;
  bar.classList.add("grew");
}

export function updateVitalBars(): void {
  const counts = { heart: progress.heartShards, mana: progress.manaShards };
  for (const kind of ["heart", "mana"] as const) {
    if (counts[kind] === shown[kind]) continue;
    grow(kind, counts[kind]);
    shown[kind] = counts[kind];
  }
  const rate = Math.round(progress.hpPerSecond * 10) / 10;
  if (rate === shown.rate) return;
  shown.rate = rate;
  hpRate.hidden = rate === 0;
  hpRate.textContent = `${rate < 0 ? "-" : "+"}${rateFigure(rate)}/s`;
  hpRate.classList.toggle("drain", rate < 0);
  hpRate.classList.toggle("regen", rate > 0);
}
