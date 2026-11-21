import { FH, FW } from "../../../constants/stage";
import type { SkillCast } from "../../../types/drill";
import { clamp, ease, smooth } from "../../../utils/math";

const PANEL = { width: 0.34, upper: 0.14, lower: 0.9, slant: 0.72 } as const;

function outline(ctx: CanvasRenderingContext2D, width: number, upper: number, lower: number): void {
  ctx.beginPath();
  ctx.moveTo(width * (1 - PANEL.slant), upper);
  ctx.lineTo(width, upper);
  ctx.lineTo(width * PANEL.slant, lower);
  ctx.lineTo(0, lower);
  ctx.lineTo(0, upper);
  ctx.closePath();
}

function crescents(
  ctx: CanvasRenderingContext2D,
  age: number,
  width: number,
  upper: number,
  lower: number,
  tint: string,
) {
  for (let i = 0; i < 6; i++) {
    const cx = width * (0.2 + 0.16 * i) + ((age * 120) % 30);
    const cy = upper + (lower - upper) * (0.15 + ((i * 0.37 + age * 0.9) % 0.75));
    const r = 10 + (i % 3) * 6;
    ctx.strokeStyle = i % 2 === 0 ? tint : "#6a4cc0";
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -2.4, 0.4);
    ctx.stroke();
  }
}

export function drawVesperCutIn(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void {
  const { age, face } = cast;
  const { intro, color } = cast.tier;
  if (age >= intro + 0.12 || !portrait.naturalWidth) {
    return;
  }
  const enter = ease.outCubic(clamp(age / 0.14));
  const leave = smooth(intro * 0.7, intro + 0.12, age);
  const width = FW * PANEL.width;
  const upper = FH * PANEL.upper;
  const lower = FH * PANEL.lower;
  const tint = `#${color.toString(16).padStart(6, "0")}`;
  ctx.save();
  if (face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(-width * (1 - enter + 0.36 * leave), 0);
  ctx.globalAlpha = enter * (1 - leave);
  outline(ctx, width, upper, lower);
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, upper, width, lower);
  backdrop.addColorStop(0, "#0e0820");
  backdrop.addColorStop(0.5, "#3e2680");
  backdrop.addColorStop(1, "#140c2a");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, upper, width, lower - upper);
  crescents(ctx, age, width, upper, lower, tint);
  const height = lower - upper + FH * 0.04;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, (width * 0.86 - artWidth) / 2, lower - height, artWidth, height);
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  outline(ctx, width, upper, lower);
  ctx.stroke();
  ctx.restore();
}
