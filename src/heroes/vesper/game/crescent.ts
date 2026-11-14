import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { CRESCENT } from "../constants/abilities";
import { NIGHT_RAMP } from "../look/colors";
import { createDuskWave } from "./effects/duskWave";

/**
 * Twin Crescent: the long blade's wave and the short blade's wave leave her hands angled toward each other and cross
 * `cross` pixels ahead, each cutting a foe once; held, a second, steeper pair crosses higher to reach fliers.
 */
export function castCrescent(power: number, wide: boolean): void {
  const struck = new Set<Enemy>();
  const damage = progress.stats.ap * CRESCENT.power * power;
  const x = hero.x + hero.face * 8;
  const y = hero.y - 20;
  // the two waves start apart and meet `cross` pixels ahead
  const tilt = CRESCENT.spread / CRESCENT.cross;
  const pair = (rise: number) => {
    const common = {
      x,
      face: hero.face,
      damage,
      speed: CRESCENT.speed,
      life: CRESCENT.life,
      struck,
      source: "abilities" as const,
    };
    game.fx.push(createDuskWave({ ...common, y: y - CRESCENT.spread / 2, rise: rise + tilt / 2 }));
    game.fx.push(createDuskWave({ ...common, y: y + CRESCENT.spread / 2, rise: rise - tilt / 2, ramp: NIGHT_RAMP }));
  };
  pair(0);
  if (wide) pair(-CRESCENT.wideRise);
}
