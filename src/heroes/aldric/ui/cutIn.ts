import { FH, FW } from "../../../constants/stage";
import type { SkillCast } from "../../../types/drill";
import { clamp, ease, smooth, TAU } from "../../../utils/math";

const RAYS = 14;

function band(ctx: CanvasRenderingContext2D, width: number, upper: number, lower: number): void {
  ctx.beginPath();
  ctx.moveTo(0, upper);
  ctx.lineTo(width, upper);
  ctx.lineTo(width * 0.86, (upper + lower) / 2);
  ctx.lineTo(width, lower);
  ctx.lineTo(0, lower);
  ctx.closePath();
}

export function drawAldricCutIn(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void {
  const { age, face } = cast;
  const { intro, color } = cast.tier;
  if (age >= intro + 0.12 || !portrait.naturalWidth) return;
  const enter = ease.outCubic(clamp(age / 0.14));
  const leave = smooth(intro * 0.7, intro + 0.12, age);
  const width = FW * 0.36;
  const upper = FH * 0.12;
  const lower = FH * 0.9;
  const tint = `#${color.toString(16).padStart(6, "0")}`;
  ctx.save();
  if (face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(-width * (1 - enter + 0.36 * leave), 0);
  ctx.globalAlpha = enter * (1 - leave);
  band(ctx, width, upper, lower);
  ctx.save();
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, upper, 0, lower);
  backdrop.addColorStop(0, "#14204a");
  backdrop.addColorStop(0.6, "#2a3d7a");
  backdrop.addColorStop(1, "#6e5420");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, upper, width, lower - upper);
  const sunX = width * 0.42;
  const sunY = upper + (lower - upper) * 0.38;
  const reach = width * 0.9;
  ctx.fillStyle = tint;
  for (let i = 0; i < RAYS; i++) {
    const angle = (i / RAYS) * TAU + age * 0.8;
    const spread = TAU / RAYS / 4;
    ctx.globalAlpha = enter * (1 - leave) * (i % 2 ? 0.16 : 0.3);
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(angle - spread) * reach, sunY + Math.sin(angle - spread) * reach);
    ctx.lineTo(sunX + Math.cos(angle + spread) * reach, sunY + Math.sin(angle + spread) * reach);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = enter * (1 - leave);
  const halo = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * 0.4);
  halo.addColorStop(0, "rgba(255, 246, 220, 0.85)");
  halo.addColorStop(1, "rgba(255, 246, 220, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, upper, width, lower - upper);
  const height = lower - upper + FH * 0.04;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, (width * 0.84 - artWidth) / 2, lower - height, artWidth, height);
  ctx.restore();
  ctx.strokeStyle = "#ffe08a";
  ctx.lineWidth = 3;
  band(ctx, width, upper, lower);
  ctx.stroke();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
