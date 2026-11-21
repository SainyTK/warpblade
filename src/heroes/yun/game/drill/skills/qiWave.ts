import { game, progress } from "../../../../../game/state";
import { createQiWave } from "../../effects/qiWave";

export interface WaveShot {
  x: number;
  y: number;
  face: number;
  reach: number;
  power: number;
  source: string;
  stun?: number;
  launch?: number;
  half?: number;
}

const WAVE_SPEED = 280;

export function sendWave({ x, y, face, reach, power, source, stun, launch, half = 8 }: WaveShot): void {
  if (power <= 0) {
    return;
  }
  game.fx.push(
    createQiWave(x, y, face, {
      reach,
      speed: WAVE_SPEED,
      damage: progress.stats.ad * power,
      half,
      source,
      stun,
      launch: launch ? 260 : undefined,
    }),
  );
}
