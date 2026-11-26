import { FH, FW } from "../../../constants/stage";
import type { SkillCast } from "../../../types/drill";
import { clamp, ease, smooth } from "../../../utils/math";

const BACKDROP = ["#2a1408", "#a4501a", "#3a1a0a"] as const;
const GRAINS = 26;

const css = (color: number): string => `#${color.toString(16).padStart(6, "0")}`;

function band(ctx: CanvasRenderingContext2D, width: number, upper: number, lower: number): void {
  ctx.beginPath();
  ctx.moveTo(width * 0.12, upper);
  ctx.lineTo(width, upper);
  ctx.lineTo(width * 0.84, lower);
  ctx.lineTo(0, lower);
  ctx.closePath();
}

export function drawZafirCutIn(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void {
  const { age, face } = cast;
  const { intro, color } = cast.tier;
  if (age >= intro + 0.12 || !portrait.naturalWidth) {
    return;
  }
  const enter = ease.outCubic(clamp(age / 0.13));
  const leave = smooth(intro * 0.7, intro + 0.12, age);
  const width = FW * 0.36;
  const upper = FH * 0.16;
  const lower = FH * 0.88;
  const tint = css(color);
  ctx.save();
  if (face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(-width * (1 - enter + 0.4 * leave), 0);
  ctx.globalAlpha = enter * (1 - leave);
  band(ctx, width, upper, lower);
  ctx.save();
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, upper, width, lower);
  backdrop.addColorStop(0, BACKDROP[0]);
  backdrop.addColorStop(0.5, BACKDROP[1]);
  backdrop.addColorStop(1, BACKDROP[2]);
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, upper, width, lower - upper);
  ctx.fillStyle = tint;
  for (let i = 0; i < GRAINS; i++) {
    const t = (age * (180 + (i % 5) * 40) + i * 37) % (width + 40);
    const y = upper + ((i * 53) % (lower - upper));
    const sway = Math.sin(age * 9 + i) * 4;
    ctx.globalAlpha = enter * (1 - leave) * (0.35 + (i % 3) * 0.2);
    ctx.fillRect(width - t, y + sway, i % 4 === 0 ? 6 : 3, 1);
  }
  ctx.globalAlpha = enter * (1 - leave);
  const height = lower - upper + FH * 0.04;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, (width * 0.86 - artWidth) / 2, lower - height, artWidth, height);
  ctx.restore();
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  band(ctx, width, upper, lower);
  ctx.stroke();
  ctx.restore();
}
