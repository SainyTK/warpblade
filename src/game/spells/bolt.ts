import { W } from "../../constants/stage";
import type { Effect } from "../../types/effect";
import { clamp } from "../../utils/math";
import { enemyCenter } from "../enemies/enemy";
import { hasPerk } from "../progress";
import { game, progress } from "../state";
import { surfaceBelow } from "../world";
import { createLightning } from "./lightning";
import { createThunderhead } from "./thunderhead";

/** damage as multiples of ability power: the strike, and each arc */
const POWER = { strike: 4, arc: 2 } as const;

/** the bolt spell, and as Thunderhead the storm cloud that follows it: lightning on the nearest foe in front, or on the floor ahead */
export function castBolt(x: number, y: number, face: number, power: number): Effect {
  const target = game.enemies
    .filter((e) => (enemyCenter(e)[0] - x) * face > -6 && Math.abs(enemyCenter(e)[0] - x) < 190)
    .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
  const markX = clamp(x + face * 80, 10, W - 10);
  const ap = progress.stats.ap * power;
  if (hasPerk("thunderhead")) game.fx.push(createThunderhead(target ? enemyCenter(target)[0] : markX, ap));
  return createLightning(target ?? null, [markX, surfaceBelow(markX, y)], {
    damage: POWER.strike * ap,
    arcDamage: POWER.arc * ap,
    arcs: hasPerk("stormcalling") ? 4 : 1,
    shock: 1,
  });
}
