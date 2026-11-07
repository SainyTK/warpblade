import { CLIPS } from "../../../constants/clips";
import { glow, place } from "../../../engine/frame";
import { blit } from "../../../engine/sprite";
import type { SpriteImage } from "../../../types/sprite";
import { hex, ramp } from "../../../utils/color";
import { ghostCanvas } from "../../hero/afterimages";
import { drawHero } from "../../hero/drawHero";
import { heroLook } from "../../hero/look";

/** the shade's cold temple-ghost light, and the ramp of its glaive's slash */
const SHADE_TINT = hex("#9ad8ff");
export const SHADE_RAMP = ramp(["#0a1830", "#163a6a", "#2a6ab0", "#5aa8ff", "#9ad8ff", "#d8f0ff", "#ffffff"]);
const SHADE_GLOW = hex("#5aa8ff");

/** her hip thrust's guard and its hit, drawn once as the shade's two poses */
let poses: { guard: SpriteImage; thrust: SpriteImage } | null = null;

function shadePoses(): { guard: SpriteImage; thrust: SpriteImage } {
  if (poses) return poses;
  const clip = CLIPS.yHipThrust;
  const thrustKey = clip.keys.find(([t]) => t >= clip.hit) ?? clip.keys[clip.keys.length - 1];
  drawHero(ghostCanvas, clip.keys[0][1], heroLook(2));
  const guard = ghostCanvas.snapshot();
  drawHero(ghostCanvas, thrustKey[1], heroLook(2));
  poses = { guard, thrust: ghostCanvas.snapshot() };
  return poses;
}

/** a shade of a temple guard with her glaive: pale and see-through, thrusting while `thrust` is on, fading by `alpha` */
export function drawShade(x: number, y: number, face: number, thrust: boolean, alpha: number): void {
  const p = shadePoses();
  blit(thrust ? p.thrust : p.guard, x, y, face < 0, {
    alpha: alpha * 0.7,
    tint: SHADE_TINT,
    tintAmount: 0.8,
    soft: true,
  });
  place();
  glow(x, y - 16, 16, SHADE_GLOW, 0.18 * alpha);
}
