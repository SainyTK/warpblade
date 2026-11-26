import { BOSS_ARENA } from "../../constants/bossFight";
import { FH, FW, GROUND, RES } from "../../constants/stage";
import { blendImage, glow, glowLine, hairline, place } from "../../engine/frame";
import { cb, cg, cr, mix, rgb, WHITE } from "../../utils/color";
import { clamp } from "../../utils/math";
import { stageLeft, stageRight } from "../adventure";
import { game } from "../state";
import { type BossFight, currentBossFight } from "./fight";

const BAR_EASE = 0.45;
const SEAL_PULSE = 5;

function veil(f: BossFight): { color: number; alpha: number } {
  const shade = f.dark;
  const tint = BOSS_ARENA.tint * f.rage;
  const alpha = 1 - (1 - shade) * (1 - tint);
  if (alpha <= 0.01) return { color: 0, alpha: 0 };
  const sw = (shade * (1 - tint)) / alpha;
  const lw = tint / alpha;
  const s = BOSS_ARENA.shadow;
  const l = f.profile.light;
  return {
    color: rgb(cr(s) * sw + cr(l) * lw, cg(s) * sw + cg(l) * lw, cb(s) * sw + cb(l) * lw),
    alpha,
  };
}

export function drawBossArenaBack(): void {
  const f = currentBossFight();
  if (!f) return;
  const { color, alpha } = veil(f);
  if (alpha <= 0.01) return;
  for (let iy = 0; iy < FH; iy++) for (let ix = 0; ix < FW; ix++) blendImage(ix, iy, color, alpha);
}

function barShare(f: BossFight): number {
  if (f.moment === "gather" || f.moment === "entrance") return clamp((f.moment === "gather" ? f.t : 1) / BAR_EASE);
  if (f.moment === "fight" && f.phase === 1) return clamp(1 - f.t / BAR_EASE);
  if (f.moment === "finale") return clamp(f.t / BAR_EASE);
  if (f.moment === "over") return clamp(1 - f.t / BAR_EASE);
  return 0;
}

function drawBars(share: number): void {
  const rows = Math.round(BOSS_ARENA.bars * RES * share);
  for (let iy = 0; iy < rows; iy++)
    for (let ix = 0; ix < FW; ix++) {
      blendImage(ix, iy, BOSS_ARENA.shadow, 1);
      blendImage(ix, FH - 1 - iy, BOSS_ARENA.shadow, 1);
    }
}

function drawSeals(f: BossFight): void {
  const k = f.moment === "over" ? clamp(1 - f.t / BAR_EASE) : 1;
  if (k <= 0) return;
  const light = f.profile.light;
  const pulse = 0.75 + 0.25 * Math.sin(game.t * SEAL_PULSE);
  const core = mix(light, WHITE, 0.55);
  for (const x of [stageLeft(), stageRight()]) {
    glowLine(x, 0, x, GROUND, BOSS_ARENA.sealWidth, light, 0.45 * pulse * k);
    hairline(x, 0, x, GROUND, core, 0.8 * k);
  }
}

export function drawBossArenaFront(): void {
  const f = currentBossFight();
  if (!f) return;
  place();
  drawSeals(f);
  if (f.rage > 0.01 && f.boss && f.boss.hp > 0) glow(f.at[0], f.at[1], BOSS_ARENA.glow, f.profile.light, 0.2 * f.rage);
  const share = barShare(f);
  if (share > 0) drawBars(share);
}
