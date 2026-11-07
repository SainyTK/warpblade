import { CLIPS } from "../../constants/clips";
import type { Pose } from "../../types/pose";
import { game } from "../state";
import { ghostCanvas } from "./afterimages";
import { drawHero } from "./drawHero";
import { heroLook } from "./look";

/** the strike pose, taken from the cross cut's hit frame */
export const STRIKE_POSE: Pose = CLIPS.atk1.keys[2][1];

/** a fading phantom of Kael standing at (x, y), facing `face`, for `life` seconds: the shape every phantom of his skills
 *  takes (Phantom Edge, Mirror Knight, Shadow Step, Heavenfall) */
export function showPhantom(x: number, y: number, face: number, life: number, pose: Pose = STRIKE_POSE): void {
  drawHero(ghostCanvas, pose, heroLook(4));
  game.ghosts.push({ s: ghostCanvas.snapshot(), x, y, flip: face < 0, life, max: life });
}
