import { FH, FW } from "../constants/stage";
import { loadGeneratedHeroPortrait } from "../generatedHeroArt";
import { ceriseCutIn, usesCeriseDrill } from "../heroes";
import { clamp, ease, smooth } from "../utils/math";

const portrait = new Image();
void loadGeneratedHeroPortrait("cerise")
  .then((url) => {
    if (url) portrait.src = url;
  })
  .catch((error: unknown) => console.warn("Cerise cut-in portrait could not load", error));

export function drawCeriseCutIn(ctx: CanvasRenderingContext2D): void {
  if (!usesCeriseDrill() || !portrait.naturalWidth) return;
  const cue = ceriseCutIn();
  if (!cue) return;
  const enter = ease.outCubic(clamp(cue.age / 0.14));
  const leave = smooth(cue.intro * 0.7, cue.intro + 0.12, cue.age);
  const width = FW * 0.34;
  const upper = FH * 0.14;
  const lower = FH * 0.9;
  const tint = `#${cue.tint.toString(16).padStart(6, "0")}`;
  ctx.save();
  if (cue.face < 0) {
    ctx.translate(FW, 0);
    ctx.scale(-1, 1);
  }
  ctx.translate(-width * (1 - enter + 0.36 * leave), 0);
  ctx.globalAlpha = enter * (1 - leave);
  ctx.beginPath();
  ctx.moveTo(0, upper);
  ctx.lineTo(width, upper);
  ctx.lineTo(width * 0.75, lower);
  ctx.lineTo(0, lower);
  ctx.closePath();
  ctx.clip();
  const backdrop = ctx.createLinearGradient(0, upper, width, lower);
  backdrop.addColorStop(0, "#220c21");
  backdrop.addColorStop(0.55, "#73203c");
  backdrop.addColorStop(1, "#210b22");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, upper, width, lower - upper);
  for (let i = 0; i < 8; i++) {
    const y = upper + ((cue.age * 290 + i * 23) % (lower - upper + 22));
    const x = width * (0.54 + (i % 3) * 0.19);
    const streak = ctx.createLinearGradient(0, y, x, y - 30);
    streak.addColorStop(0, "transparent");
    streak.addColorStop(0.77, tint);
    streak.addColorStop(1, "transparent");
    ctx.strokeStyle = streak;
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(x, y - 30);
    ctx.stroke();
  }
  const height = lower - upper + FH * 0.04;
  const artWidth = (height * portrait.naturalWidth) / portrait.naturalHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(portrait, (width * 0.82 - artWidth) / 2, lower - height, artWidth, height);
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, upper);
  ctx.lineTo(width, upper);
  ctx.lineTo(width * 0.75, lower);
  ctx.lineTo(0, lower);
  ctx.stroke();
  ctx.restore();
}
