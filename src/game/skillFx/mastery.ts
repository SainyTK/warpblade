import { FX_MASTERY as M } from "../../constants/skillFx";
import { fleck, glow, px } from "../../engine/frame";
import type { Color } from "../../types/color";
import type { ElementKit, FxCast } from "../../types/skillFx";
import { clamp, smooth } from "../../utils/math";

function star(x: number, y: number, arm: number, heart: Color, tip: Color, alpha: number): void {
  const n = Math.round(arm);
  px(x, y, heart, alpha);
  for (let d = 1; d <= n; d++) {
    const c = d <= n * 0.5 ? heart : tip;
    const dot = d <= n * 0.5 ? px : fleck;
    dot(x + d, y, c, alpha);
    dot(x - d, y, c, alpha);
    dot(x, y + d, c, alpha);
    dot(x, y - d, c, alpha);
  }
  glow(x, y, arm * 2 + 3, tip, M.glow * alpha);
}

export function drawMasteryMarks(cast: FxCast, kit: ElementKit, extent: number, progress: number, fade: number): void {
  const marks = cast.mastery;
  if (marks <= 0) return;
  const shown = smooth(0, M.showFrom, progress) * (1 - smooth(M.showUntil * 0.7, M.showUntil, progress));
  if (shown <= 0) return;
  const R = kit.look.ramp;
  const radius = clamp(extent * M.radiusShare, M.radiusMin, M.radiusMost);
  const arm = M.arm + marks * M.armPerLevel;
  const turn = progress * M.turn;
  for (let i = 0; i < marks; i++) {
    const a = M.arcFrom + ((M.arcTo - M.arcFrom) * (i + 0.5)) / marks + turn;
    star(Math.cos(a) * radius, Math.sin(a) * radius, arm, R[5], R[3], fade * shown);
  }
}
