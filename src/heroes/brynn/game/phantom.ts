import { ghostCanvas } from "../../../game/hero/afterimages";
import { drawHeroSprite } from "../../../game/hero/look";
import { game } from "../../../game/state";
import type { Pose } from "../../../types/pose";
import { BRYNN_STRING_CLIPS } from "../constants/clips/string";

/** the slam's strike pose, the shape of every echo of her */
const SLAM_POSE: Pose = (BRYNN_STRING_CLIPS.slam.keys.find(([, , snap]) => snap) ?? BRYNN_STRING_CLIPS.slam.keys[0])[1];

/** a fading crimson echo of Brynn standing at (x, y), facing `face`, for `life` seconds, bowed over her slam */
export function showEcho(x: number, y: number, face: number, life: number): void {
  drawHeroSprite(ghostCanvas, SLAM_POSE, 4);
  game.ghosts.push({ s: ghostCanvas.snapshot(), x, y, flip: face < 0, life, max: life });
}
