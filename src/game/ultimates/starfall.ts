import { FIRE_RAMP } from "../../constants/palette";
import { ULT_LEVELS } from "../../constants/ultimate";
import { circle, glow, glowLine, line, place, px } from "../../engine/frame";
import type { Blast, Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { launchEnemy } from "../enemies/airborne";
import { enemyCenter } from "../enemies/enemy";
import { skillEvolved, skillValues } from "../skills/query";
import { explode } from "../spells/explosion";
import { createFloorFire } from "../spells/floorFire";
import { game, hero, particles, progress, rng } from "../state";
import { surfaceBelow } from "../world";
import { densestSpot } from "./densestSpot";
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
const SKILL = "k_starfall";
/** Starfall's levels: the floor fire's width and burn (share of ability power), the throw, the late meteors' delay */
const FALL = { floorWidth: 24, floorPower: 0.25, launch: -260, late: 0.5 } as const;
/** Cataclysm: meteors fall on foes this close to Kael */
const RAIN_REACH = 140;

/** what a meteor does besides its blast, from Starfall's levels */
interface MeteorExtras {
  blast: Blast;
  /** seconds the floor burns where it lands, and the burn's damage a tick */
  floor: number;
  floorDamage: number;
  launch: boolean;
}

/** one meteor slanting down from the top of the screen onto (x, floor) */
function createMeteor(x: number, floor: number, delay: number, extras: MeteorExtras): Effect {
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
      land(x, floor, extras);
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

/** a meteor lands: its blast, and with Starfall's levels burning floor and foes thrown up */
function land(x: number, floor: number, extras: MeteorExtras): void {
  explode(x, floor, extras.blast);
  if (extras.floor) game.fx.push(createFloorFire(x, floor, FALL.floorWidth, extras.floor, extras.floorDamage, SKILL));
  if (!extras.launch) return;
  for (const e of game.enemies)
    if (e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) < extras.blast.radius) launchEnemy(e, FALL.launch);
}

/** Cataclysm: for a while meteors keep falling on foes near Kael, each bursting like his Fire Flask */
function createRain(seconds: number, every: number, extras: MeteorExtras): Effect {
  const flask = skillValues("k_flame");
  const blast: Blast = flask.power
    ? { ...extras.blast, radius: flask.radius, damage: flask.power * progress.stats.ap, burn: flask.burn }
    : extras.blast;
  let t = 0;
  let next = 0;
  return {
    update(dt) {
      t += dt;
      next -= dt;
      if (next > 0) return t < seconds;
      next = every;
      const near = game.enemies.filter((e) => e.hp > 0 && Math.abs(e.x - hero.x) < RAIN_REACH);
      const x = near.length ? enemyCenter(rng.pick(near))[0] : hero.x + rng.range(-RAIN_REACH, RAIN_REACH);
      game.fx.push(createMeteor(x, surfaceBelow(x, 0), 0, { ...extras, blast }));
      return t < seconds;
    },
    draw() {},
  };
}

/** Starfall: meteors rain onto the foes in reach and the floor around them; its levels leave the floor burning, stun,
 *  throw foes up and drop late meteors on the densest group; as Cataclysm the rain goes on */
export function castStarfall(level: number): void {
  const v = skillValues(SKILL);
  const foes = ultTargets(level);
  const [x0, x1] = ultSpan(level);
  const per = PER_FOE[level - 1];
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ap * (v.power ?? 1)) / per;
  const extras = (d: number): MeteorExtras => ({
    blast: { radius: RADIUS, damage: d, burn: BURN, brands: 1, stun: v.stun, source: "ultimate" },
    floor: v.floor ?? 0,
    floorDamage: progress.stats.ap * FALL.floorPower,
    launch: !!v.launch,
  });
  const aimed = foes.flatMap((foe) => Array<number>(per).fill(enemyCenter(foe)[0])).slice(0, MAX_METEORS);
  const loose = Array.from({ length: LOOSE[level - 1] }, () => -1);
  const drops = rng.shuffle([...aimed, ...loose]);
  drops.forEach((aim, i) => {
    const x = aim < 0 ? rng.range(x0, x1) : aim + rng.range(-5, 5);
    const delay = i * (SPAN / drops.length) + rng.range(0, 0.06);
    game.fx.push(createMeteor(x, surfaceBelow(x, 0), delay, extras(aim < 0 ? damage / 2 : damage)));
  });
  if (v.late && foes.length) {
    const spot = densestSpot(foes);
    for (let i = 0; i < v.late; i++)
      game.fx.push(createMeteor(spot.x + rng.range(-8, 8), spot.floor, SPAN + FALL.late + i * 0.08, extras(damage)));
  }
  if (skillEvolved(SKILL)) game.fx.push(createRain(v.rain, v.rainEvery, extras(damage)));
}
