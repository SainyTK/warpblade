import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { NIGHT_RAMP } from "../../look/colors";
import { createDuskWave } from "../effects/duskWave";
import { createEchoCut } from "../effects/echoCut";

const WAVE = { speed: 240, life: 0.5, spread: 10 } as const;

export function echo(foe: Enemy, power: number, source: string, delay = 0.08): void {
  if (power > 0) {
    game.fx.push(createEchoCut(foe, progress.stats.ad * power, delay, source));
  }
}

export function twinWaves(power: number, source: string, face: number = hero.face, y = hero.y - 18): void {
  const struck = new Set<Enemy>();
  const common = {
    x: hero.x + face * 6,
    face,
    damage: progress.stats.ad * power,
    speed: WAVE.speed,
    life: WAVE.life,
    struck,
    source,
  };
  game.fx.push(createDuskWave({ ...common, y: y - WAVE.spread / 2, rise: 0.13 }));
  game.fx.push(createDuskWave({ ...common, y: y + WAVE.spread / 2, rise: -0.13, ramp: NIGHT_RAMP }));
}
