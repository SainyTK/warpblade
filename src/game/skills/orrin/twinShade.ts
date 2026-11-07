import { CHAIN_CLIPS, HANGING_CLIP } from "../../../constants/clips/orrin/chain";
import { HANG } from "../../../constants/clips/orrin/stance";
import { PAL } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import { blit } from "../../../engine/sprite";
import type { Pose, PoseKeyframe } from "../../../types/pose";
import type { SpriteImage } from "../../../types/sprite";
import { drawLinks } from "../../effects/orrin/chainLinks";
import { ghostCanvas } from "../../hero/afterimages";
import { drawHero } from "../../hero/drawHero";
import { heroLook } from "../../hero/look";

/** the shade's poses: winding up, the two halves of the spin, hanging on its chain and the Hanging Arc's stroke */
export type ShadePose = "wind" | "spin" | "spinBack" | "hang" | "arc";

let poses: Record<ShadePose, SpriteImage> | null = null;

/** the pose at a clip's key nearest `at` seconds */
const keyAt = (keys: readonly PoseKeyframe[], at: number): Pose =>
  (keys.find(([t]) => t >= at - 1e-6) ?? keys[keys.length - 1])[1];

/** his own poses drawn once, from the hero in play, as the shade's frames */
function shadePoses(): Record<ShadePose, SpriteImage> {
  if (poses) return poses;
  const circle = CHAIN_CLIPS.circle;
  const snap = (p: Pose): SpriteImage => {
    drawHero(ghostCanvas, p, heroLook(2));
    return ghostCanvas.snapshot();
  };
  poses = {
    wind: snap(keyAt(circle.keys, circle.hit - 2 / 30)),
    spin: snap(keyAt(circle.keys, circle.hit)),
    spinBack: snap(keyAt(circle.keys, circle.hit + 4 / 30)),
    hang: snap(HANG),
    arc: snap(keyAt(HANGING_CLIP.keys, HANGING_CLIP.hit)),
  };
  return poses;
}

/** a shade of Orrin: brass and see-through, fading by `alpha` */
export function drawTwinShade(x: number, y: number, face: number, pose: ShadePose, alpha: number): void {
  if (alpha <= 0) return;
  blit(shadePoses()[pose], x, y, face < 0, {
    alpha: alpha * 0.65,
    tint: PAL.brass[4],
    tintAmount: 0.75,
    soft: true,
  });
  place();
  glow(x, y - 16, 16, PAL.brass[3], 0.2 * alpha);
}

/** the shade's chain out to its tip, faint brass links */
export function drawShadeChain(x0: number, y0: number, x1: number, y1: number, alpha: number): void {
  place();
  drawLinks(x0, y0, x1, y1, PAL.brass[4], 0.6 * alpha);
  glow(x1, y1, 5, PAL.brass[4], 0.45 * alpha);
}
