import { FH, FW } from "../../../constants/stage";
import type { SkillCast } from "../../../types/drill";
import { clamp, ease, smooth } from "../../../utils/math";

const CRACKS = [
  [0.08, 0.34, 0.21, 0.48, 0.17, 0.62, 0.3, 0.8],
  [0.52, 0.2, 0.47, 0.41, 0.58, 0.55, 0.5, 0.86],
  [0.74, 0.28, 0.83, 0.44, 0.78, 0.7],
] as const;

function bandPath(ctx: CanvasRenderingContext2D, upper: number, lower: number, tilt: number): void {
  ctx.beginPath();
  ctx.moveTo(0, upper + tilt);
  ctx.lineTo(FW, upper - tilt);
  ctx.lineTo(FW, lower - tilt);
  ctx.lineTo(0, lower + tilt);
  ctx.closePath();
}

export function drawBrynnCutIn(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void {
  const { age, face } = cast;
  const { intro, color, level } = cast.tier;
  if (age >= intro + 0.14 || !portrait.naturalWidth) {
    return;
  }
  const open = ease.outCubic(clamp(age / 0.12));
  const leave = smooth(intro * 0.72, intro + 0.14, age);
  const middle = FH * 0.5;
  const half = FH * 0.25 * open * (1 - leave * 0.6);
  const upper = middle - half;
  const lower = middle + half;
  const tilt = FH * 0.07;
  const tint = `#${color.toString(16).padStart(6, "0")}`;
  ctx.save();
  if (face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.globalAlpha = 1 - leave;
  bandPath(ctx, upper, lower, tilt);
  ctx.save();
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, upper, FW, lower);
  backdrop.addColorStop(0, "#1c0509");
  backdrop.addColorStop(0.5, "#5c0e1c");
  backdrop.addColorStop(1, "#1c0509");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, upper - tilt, FW, lower - upper + tilt * 2);
  ctx.strokeStyle = tint;
  ctx.globalAlpha = (1 - leave) * 0.55;
  ctx.lineWidth = 1.5;
  for (const crack of CRACKS.slice(0, 1 + Math.min(level, 2))) {
    ctx.beginPath();
    for (let i = 0; i < crack.length; i += 2) {
      const x = FW * crack[i];
      const y = FH * crack[i + 1];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1 - leave;
  for (let i = 0; i < 10; i++) {
    const x = (FW * (i * 0.13 + age * 0.9 * (1 + (i % 3) * 0.3))) % FW;
    const y = lower - ((age * 160 + i * 37) % (lower - upper + 10));
    ctx.fillStyle = i % 2 ? "#ffc2ae" : tint;
    ctx.fillRect(x, y, 2, 2);
  }
  const height = (lower - upper) * 1.12;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  const slide = FW * 0.62 + FW * 0.18 * (1 - open) - FW * 0.05 * smooth(0, intro, age);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, slide, middle - height * 0.58, artWidth, height);
  ctx.restore();
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, upper + tilt);
  ctx.lineTo(FW, upper - tilt);
  ctx.moveTo(0, lower + tilt);
  ctx.lineTo(FW, lower - tilt);
  ctx.stroke();
  ctx.restore();
}
