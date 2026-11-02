import { ENEMIES } from "../../constants/enemies";
import { GROUND } from "../../constants/stage";
import type { Enemy, EnemyType } from "../../types/enemy";
import type { Box } from "../../types/world";
import { waveScale } from "../../utils/progression";
import { rng } from "../state";

export function enemyBox(e: Enemy): Box {
  switch (e.type) {
    case "wisp":
      return [e.x - 7, e.y - 7, e.x + 7, e.y + 7];
    case "husk":
      return [e.x - 8, e.y - 26, e.x + 8, e.y];
    case "brute":
      return [e.x - 13, e.y - 40, e.x + 13, e.y];
    case "warden":
      return [e.x - 17, e.y - 18, e.x + 17, e.y + 16];
  }
}
export function enemyCenter(e: Enemy): [number, number] {
  if (e.type === "husk") return [e.x, e.y - 13];
  if (e.type === "brute") return [e.x, e.y - 20];
  return [e.x, e.y];
}
/** whether the foe stands on the floor rather than floating */
export const walks = (e: Enemy): boolean => e.type === "husk" || e.type === "brute";

/** a foe scaled to the wave it comes in */
export function makeEnemy(type: EnemyType, x: number, y: number, wave: number, xpShare = 1): Enemy {
  const def = ENEMIES[type];
  const scale = waveScale(wave);
  const hp = Math.round(def.hp * scale.hp);
  return {
    type,
    rank: def.rank,
    x,
    y: type === "husk" || type === "brute" ? GROUND : y,
    vx: 0,
    vy: 0,
    hp,
    max: hp,
    state: type === "husk" || type === "brute" ? "walk" : "drift",
    st: 0,
    cd: type === "wisp" ? rng.range(0.6, 1.6) : 1,
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
  };
}
