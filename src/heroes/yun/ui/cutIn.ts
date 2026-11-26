import { FH, FW } from "../../../constants/stage";
import type { SkillCast } from "../../../types/drill";
import { clamp, ease, smooth } from "../../../utils/math";

const BACKDROP = ["#06201a", "#13513f", "#0a2a22"] as const;
const RIM = "#dcfff0";

function sword(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, tint: string): void {
  ctx.strokeStyle = tint;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - length);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = RIM;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 3, y - length + 4);
  ctx.lineTo(x + 3, y - length + 4);
  ctx.stroke();
}

export function drawYunCutIn(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void {
  const { age, face } = cast;
  const { intro, color, level } = cast.tier;
  if (age >= intro + 0.12 || !portrait.naturalWidth) return;
  const enter = ease.outCubic(clamp(age / 0.16));
  const leave = smooth(intro * 0.7, intro + 0.12, age);
  const width = FW * 0.36;
  const upper = FH * 0.1;
  const lower = FH * 0.92;
  const tint = `#${color.toString(16).padStart(6, "0")}`;
  ctx.save();
  if (face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(0, -FH * 0.3 * (1 - enter) + FH * 0.12 * leave);
  ctx.globalAlpha = enter * (1 - leave);
  ctx.beginPath();
  ctx.moveTo(0, upper);
  ctx.lineTo(width * 0.82, upper);
  ctx.lineTo(width, lower);
  ctx.lineTo(0, lower);
  ctx.closePath();
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, upper, 0, lower);
  backdrop.addColorStop(0, BACKDROP[0]);
  backdrop.addColorStop(0.5, BACKDROP[1]);
  backdrop.addColorStop(1, BACKDROP[2]);
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, upper, width, lower - upper);
  const swords = 6 + level * 2;
  for (let i = 0; i < swords; i++) {
    const x = width * ((i * 0.37) % 1);
    const y = upper + ((age * 340 + i * 41) % (lower - upper + 30));
    sword(ctx, x, y, i % 3 === 0 ? 18 : 11, tint);
  }
  const height = lower - upper + FH * 0.04;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, (width * 0.9 - artWidth) / 2, lower - height, artWidth, height);
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.82, upper);
  ctx.lineTo(width, lower);
  ctx.stroke();
  ctx.strokeStyle = RIM;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.82 - 4, upper);
  ctx.lineTo(width - 4, lower);
  ctx.stroke();
  ctx.restore();
}
