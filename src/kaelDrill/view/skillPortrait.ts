import { FH, FW } from "../../constants/stage";
import { clamp, ease, smooth } from "../../utils/math";
import type { SkillCast } from "../simulation";

const PORTRAIT_URL = `${import.meta.env.BASE_URL}kael-drill/kael-portrait.webp`;

export function createSkillPortrait() {
  const portrait = new Image();
  portrait.src = PORTRAIT_URL;

  return function drawPortrait(ctx: CanvasRenderingContext2D, cast: SkillCast | null): void {
    if (!cast || cast.age >= cast.tier.intro + 0.12 || !portrait.naturalWidth) {
      return;
    }
    const { age, tier } = cast;
    const enter = ease.outCubic(clamp(age / 0.18));
    const leave = smooth(tier.intro * 0.78, tier.intro + 0.12, age);
    const tint = `#${tier.color.toString(16).padStart(6, "0")}`;
    const opacity = enter * (1 - leave);
    const inset = -89 * (1 - enter) - leave * 30;
    const topEdge = FW * 0.465;
    const bottomEdge = FW * 0.335;
    ctx.save();
    if (cast.face < 0) {
      ctx.translate(FW, 0);
      ctx.scale(-1, 1);
    }
    ctx.translate(inset, 0);
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(-90, 12);
    ctx.lineTo(topEdge, 12);
    ctx.lineTo(bottomEdge, FH - 8);
    ctx.lineTo(-90, FH - 8);
    ctx.closePath();
    ctx.clip();
    const background = ctx.createLinearGradient(18, 14, bottomEdge, FH);
    background.addColorStop(0, "#11142b");
    background.addColorStop(0.62, "#1c2749");
    background.addColorStop(1, "#060a16");
    ctx.fillStyle = background;
    ctx.fillRect(-95, 3, FW, FH);
    ctx.globalAlpha = opacity * 0.48;
    for (let i = 0; i < 10; i++) {
      const y = ((i * 47 + age * 270) % (FH + 30)) - 12;
      const span = 50 + ((i * 39) % 181);
      const streak = ctx.createLinearGradient(0, y, span, y - 29);
      streak.addColorStop(0, "transparent");
      streak.addColorStop(0.73, tint);
      streak.addColorStop(1, "transparent");
      ctx.strokeStyle = streak;
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(-8, y + 28);
      ctx.lineTo(span, y - 30);
      ctx.stroke();
    }
    ctx.globalAlpha = opacity;
    ctx.imageSmoothingEnabled = true;
    const size = 313 + enter * 9;
    ctx.drawImage(portrait, -35 + enter * 20, FH - size + 14, size, size);
    const shade = ctx.createLinearGradient(0, FH - 72, 0, FH);
    shade.addColorStop(0, "transparent");
    shade.addColorStop(1, "#090a19");
    ctx.fillStyle = shade;
    ctx.fillRect(-90, FH - 72, FW, 72);
    ctx.strokeStyle = tint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topEdge - 1, 12);
    ctx.lineTo(bottomEdge - 1, FH - 8);
    ctx.stroke();
    ctx.restore();
  };
}
