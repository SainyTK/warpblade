import type { BossBar, BossCard } from "../../types/bossFight";
import type { Enemy } from "../../types/enemy";
import { bossUntouchable, currentBossFight } from "./fight";

export function bossBarView(e: Enemy): BossBar | null {
  const f = currentBossFight();
  if (!f || f.boss !== e) return null;
  return { marks: [f.profile.phaseAt], phase: e.phase, shielded: bossUntouchable(e) };
}

export function bossCardView(): BossCard | null {
  const f = currentBossFight();
  return f && f.cardLeft > 0 ? f.card : null;
}
