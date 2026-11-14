import { ghostCanvas } from "../../../game/hero/afterimages";
import { drawHeroSprite } from "../../../game/hero/look";
import { game } from "../../../game/state";
import type { Pose } from "../../../types/pose";
import { STRING_CLIPS } from "../constants/clips/string";

/** the strike pose, taken from the step cut's hit frame */
export const STRIKE_POSE: Pose = (STRING_CLIPS.atk1.keys.find(([, , snap]) => snap) ?? STRING_CLIPS.atk1.keys[0])[1];

/** a fading phantom of Kael standing at (x, y), facing `face`, for `life` seconds: the shape every phantom of his skills
 *  takes (Phantom Edge, Mirror Knight, Shadow Step, Heavenfall) */
export function showPhantom(x: number, y: number, face: number, life: number, pose: Pose = STRIKE_POSE): void {
  drawHeroSprite(ghostCanvas, pose, 4);
  game.ghosts.push({ s: ghostCanvas.snapshot(), x, y, flip: face < 0, life, max: life });
}
