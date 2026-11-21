import { FH, FW } from "../../../constants/stage";
import type { SkillCast } from "../../../types/drill";
import { clamp, ease, smooth } from "../../../utils/math";

export const SAYA_CUT_IN_URL = new URL("./art/cut-in.webp", import.meta.url).href;

const INK = "#070915";
const INDIGO = "#1d2453";

function brushBand(ctx: CanvasRenderingContext2D, width: number, top: number, bottom: number, age: number): void {
  ctx.beginPath();
  ctx.moveTo(0, top + 6);
  for (let i = 0; i <= 12; i++) {
    const x = (i / 12) * width;
    ctx.lineTo(x, top + Math.sin(i * 1.7 + age * 3) * 3 - (i / 12) * 6);
  }
  ctx.lineTo(width * 0.92, (top + bottom) / 2);
  for (let i = 12; i >= 0; i--) {
    const x = (i / 12) * width * 0.9;
    ctx.lineTo(x, bottom + Math.sin(i * 2.3) * 3);
  }
  ctx.closePath();
}

export function drawSayaCutIn(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void {
  const { age, tier, face } = cast;
  if (age >= tier.intro + 0.12 || !portrait.naturalWidth) return;
  const enter = ease.outCubic(clamp(age / 0.16));
  const leave = smooth(tier.intro * 0.75, tier.intro + 0.12, age);
  const width = FW * 0.6;
  const top = FH * 0.16;
  const bottom = FH * 0.86;
  const tint = `#${tier.color.toString(16).padStart(6, "0")}`;
  ctx.save();
  if (face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(-width * (1 - enter) - leave * 40, 0);
  ctx.globalAlpha = enter * (1 - leave);
  brushBand(ctx, width, top, bottom, age);
  ctx.save();
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, top, width, bottom);
  backdrop.addColorStop(0, INK);
  backdrop.addColorStop(0.6, INDIGO);
  backdrop.addColorStop(1, INK);
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, top - 10, width, bottom - top + 20);
  ctx.globalAlpha *= 0.85;
  ctx.fillStyle = "#e8ecff";
  ctx.beginPath();
  ctx.arc(width * 0.62, top + 46, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INDIGO;
  ctx.beginPath();
  ctx.arc(width * 0.62 + 12, top + 40, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = enter * (1 - leave);
  const height = (bottom - top) * 1.08;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, width * 0.42 - artWidth / 2 + enter * 12, bottom - height + 6, artWidth, height);
  ctx.restore();
  const slash = smooth(0, tier.intro * 0.6, age);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, bottom - 4);
  ctx.lineTo(width * 0.92 * slash, bottom - 4 - 10 * slash);
  ctx.stroke();
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, top + 4);
  ctx.lineTo(width * slash, top - 4 * slash);
  ctx.stroke();
  ctx.restore();
}
