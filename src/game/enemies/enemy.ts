import { ENEMIES } from "../../constants/enemies";
import { GROUND } from "../../constants/stage";
import type { Enemy, EnemyType } from "../../types/enemy";
import type { Box } from "../../types/world";
import { waveScale } from "../../utils/progression";
import { rng } from "../state";
import { kindOf } from "./kinds";

export const enemyBox = (e: Enemy): Box => kindOf(e.type).box(e);
export const enemyCenter = (e: Enemy): [number, number] => kindOf(e.type).center(e);
/** whether the foe stands on the floor rather than floating */
export const walks = (e: Enemy): boolean => !kindOf(e.type).flies;

/** a foe scaled to the wave it comes in */
export function makeEnemy(type: EnemyType, x: number, y: number, wave: number, xpShare = 1): Enemy {
  const def = ENEMIES[type];
  const kind = kindOf(type);
  const scale = waveScale(wave);
  const hp = Math.round(def.hp * scale.hp);
  return {
    type,
    rank: def.rank,
    x,
    y: kind.flies ? y : GROUND,
    vx: 0,
    vy: 0,
    hp,
    max: hp,
    state: kind.rest,
    st: 0,
    cd: kind.firstCooldown(),
    face: -1,
    turn: 0,
    flash: 0,
    frozen: 0,
    burn: 0,
    burnTick: 0,
    shock: 0,
    stun: 0,
    air: false,
    airTime: 0,
    seed: rng.range(0, 9),
    swing: -1,
    side: rng.chance(0.5) ? 1 : -1,
    power: scale.damage,
    xp: Math.round(def.xp * scale.xp * xpShare),
    phase: 1,
    guardHits: 0,
    airHits: 0,
    charged: 0,
    evadeCd: 0,
    stagger: 0,
    pinned: 0,
    ax: 0,
    ay: 0,
    n: 0,
  };
}
