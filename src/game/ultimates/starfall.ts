import { FIRE_RAMP } from "../../constants/palette";
import { ULT_LEVELS } from "../../constants/ultimate";
import { circle, glow, glowLine, line, place, px } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { enemyCenter } from "../enemies/enemy";
import { explode } from "../spells/explosion";
import { game, particles, progress, rng } from "../state";
import { surfaceBelow } from "../world";
import { ultSpan, ultTargets } from "./targets";

/** meteors aimed at each foe in reach; together they deal the level's power once */
const PER_FOE = [2, 2, 3, 3] as const;
/** meteors on open floor, at half strength */
const LOOSE = [1, 3, 6, 12] as const;
const MAX_METEORS = 30;
/** how long the rain lasts */
const SPAN = 0.9;
const RADIUS = 30;
const SPEED = 330;
const BURN = 3;

/** one meteor slanting down from the top of the screen onto (x, floor) */
function createMeteor(x: number, floor: number, delay: number, damage: number): Effect {
  const slant = rng.range(0.35, 0.6) * (rng.chance(0.5) ? 1 : -1);
  const len = Math.hypot(floor + 20, (floor + 20) * slant);
  const vx = (-slant * (floor + 20) * SPEED) / len;
  const vy = ((floor + 20) * SPEED) / len;
  const o = { x: x + slant * (floor + 20), y: -20, t: -delay };
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      o.x += vx * dt;
      o.y += vy * dt;
      for (let i = 0; i < 3; i++)
        particles.spawn(
          PK.FIRE,
          o.x + rng.range(-2, 2),
          o.y + rng.range(-2, 2),
          -vx * 0.2 + rng.range(-15, 15),
          -vy * 0.2,
          rng.range(0.15, 0.35),
          {
            col: 0,
            size: rng.range(1.5, 2.8),
            flag: rng.chance(0.3) ? PF.SMOKES : 0,
          },
        );
      if (o.y < floor) return true;
      explode(x, floor, { radius: RADIUS, damage, burn: BURN, brands: 1 });
      return false;
    },
    draw() {
      if (o.t < 0) return;
      place();
      const tx = o.x - vx * 0.06;
      const ty = o.y - vy * 0.06;
      line(tx, ty, o.x, o.y, (u) => FIRE_RAMP[Math.round((1 - u) * 5)]);
      glowLine(tx, ty, o.x, o.y, 8, FIRE_RAMP[4], 0.5);
      circle(o.x, o.y, 3, FIRE_RAMP[3]);
      circle(o.x - 0.5, o.y - 0.5, 1.8, FIRE_RAMP[1]);
      px(o.x - 1, o.y - 1, WHITE);
      glow(o.x, o.y, 22, FIRE_RAMP[4], 0.6);
    },
  };
}

/** Starfall: meteors rain onto the foes in reach and the floor around them, and leave it burning */
export function castStarfall(level: number): void {
  const foes = ultTargets(level);
  const [x0, x1] = ultSpan(level);
  const per = PER_FOE[level - 1];
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ap) / per;
  const aimed = foes.flatMap((foe) => Array<number>(per).fill(enemyCenter(foe)[0])).slice(0, MAX_METEORS);
  const loose = Array.from({ length: LOOSE[level - 1] }, () => -1);
  const drops = rng.shuffle([...aimed, ...loose]);
  drops.forEach((aim, i) => {
    const x = aim < 0 ? rng.range(x0, x1) : aim + rng.range(-5, 5);
    const delay = i * (SPAN / drops.length) + rng.range(0, 0.06);
    game.fx.push(createMeteor(x, surfaceBelow(x, 0), delay, aim < 0 ? damage / 2 : damage));
  });
}
