import { BOSS_PHASES, ENRAGE_AFTER } from "../../constants/bossFight";
import type { BossBar, BossCard } from "../../types/bossFight";
import type { Enemy } from "../../types/enemy";
import { bossUntouchable, currentBossFight } from "./fight";

export function bossBarView(e: Enemy): BossBar | null {
  const f = currentBossFight();
  if (!f || f.boss !== e) return null;
  const limit = ENRAGE_AFTER[f.kind];
  return {
    marks: [BOSS_PHASES.second, BOSS_PHASES.third],
    phase: f.phase,
    shielded: bossUntouchable(e),
    poise: f.poise.fill,
    broken: f.poise.broken > 0,
    enrageIn: f.enraged ? 0 : limit === null ? null : Math.max(0, limit - f.clock),
  };
}

export function bossCardView(): BossCard | null {
  const f = currentBossFight();
  return f && f.cardLeft > 0 ? f.card : null;
}

export function miniLight(e: Enemy): number | null {
  const f = currentBossFight();
  return f && f.boss === e && f.kind === "mini" ? f.profile.light : null;
}
