import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { hulkWindup } from "./hulkMoves";

export function hulkGathered(e: Enemy): number {
  const windup = hulkWindup(e);
  return windup ? clamp(e.st / (windup * waveScale(game.wave).windup)) : 0;
}
