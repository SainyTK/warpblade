import { EMBER } from "../../constants/characters/ysra/look";
import { W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { FLAME_PILLAR } from "../../constants/ysra/rites";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createBurningSpear, type SpearFlight } from "../effects/burningSpear";
import { emberBurst } from "../effects/emberBurst";
import { createGlint } from "../effects/flash";
import { createImpact } from "../effects/impact";
import { ignite } from "../enemies/burn";
import { enemyCenter } from "../enemies/enemy";
import { pinFoe } from "../hero/ysra/pin";
import { skillValues, withCharms } from "../skills/query";
import { layCinder } from "../spells/rites/cinder";
import { castFlamePillar } from "../spells/rites/flamePillar";
import { game, hero, lights, progress, rng } from "../state";
import { hitStop, shake, surfaceBelow } from "../world";
import { foesOnSegment } from "./segmentHits";
import { ultSpan, ultTargets } from "./targets";

/** the spear leaves her hand after this wind-up */
const WIND = 0.14;
const SPEED = 950;
/** the spear flies at her chest */
const CHEST = 20;
/** foes this close to where it bursts are caught by the burst */
const BURST = 30;
const BURN = 3;
/** level 4: spears on open floor besides the one on each foe, and how long the rain lasts */
const RAIN_LOOSE = 10;
const RAIN_MAX = 24;
const RAIN_FROM = 0.3;
const RAIN_SPAN = 0.8;
const RAIN_SPEED = 620;

/** the burning line a spear leaves on the floor under its path: a patch every this many pixels */
const LINE_STEP = 14;
/** Solar Lance's fan: where each spear of a side ends, in pixels above (less than 0) or below its chest-high line */
const FAN = [0, -18, 14] as const;

/** one cast: each foe takes the level's power, times Sunspear's, once, from whichever spear or burst reaches it first */
function spearCast(level: number, v: Readonly<Record<string, number>>) {
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * (v.power ?? 1);
  const struck = new Set<Enemy>();
  const strike = (e: Enemy, fromX: number, dir: number, launch: boolean) => {
    struck.add(e);
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, damage, {
      fromX,
      kx: dir * 120,
      ky: -70,
      launch: launch ? -160 : undefined,
      heavy: true,
      source: "ultimate",
    });
    ignite(e, BURN);
    if (v.pin) pinFoe(e, { time: v.pin, taken: v.taken, burn: 0 });
    game.fx.push(createImpact(cx, cy, dir, true));
    sfx.hit(true, 0.8);
  };
  /** Sunspear: the floor under a thrown spear's path burns */
  const burnLine = (ax: number, bx: number, y: number) => {
    if (!v.line) return;
    for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x += LINE_STEP)
      layCinder(x, surfaceBelow(x, y), {
        life: v.line,
        power: 0.5,
        halfWidth: LINE_STEP / 2,
        overlap: 1,
        halt: 0,
        source: "y_sunspear",
      });
  };
  /** a spear from (x0, y0) to (x1, y1), piercing all it passes and bursting where it ends; the thrown ones are loud,
   *  the rain is quieter so two dozen of them do not drown the stage */
  const spear = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    speed: number,
    delay: number,
    loud: boolean,
  ): SpearFlight => {
    const dir = Math.sign(x1 - x0) || 1;
    let thrown = false;
    return {
      x0,
      y0,
      x1,
      y1,
      speed,
      delay,
      pass: (ax, ay, bx, by) => {
        if (!thrown && loud) sfx.lunge();
        thrown = true;
        for (const e of foesOnSegment(ax, ay, bx, by, struck)) strike(e, ax, dir, false);
      },
      end: (x, y) => {
        const floor = surfaceBelow(x, y - 4);
        emberBurst(x, y, BURST, floor);
        if (loud) burnLine(x0, x, y);
        if (loud && v.pillars) game.fx.push(castFlamePillar(x, floor, { ...FLAME_PILLAR, power: v.power }, "ultimate"));
        for (const e of game.enemies) {
          if (struck.has(e) || e.hp <= 0) continue;
          const [cx, cy] = enemyCenter(e);
          if (Math.hypot(cx - x, cy - y) < BURST) strike(e, x, Math.sign(cx - x) || dir, true);
        }
        if (!loud) {
          shake(0.1, 1.5);
          sfx.hit(true, 0.5);
          return;
        }
        hitStop(0.04);
        shake(0.25, 3);
        sfx.boom();
      },
    };
  };
  return { spear };
}

/** Sunspear: a spear of forge-fire hurled the length of the stage at chest height, through every foe in its line,
 *  bursting at the far wall. Level 3 throws one each way, level 4 also rains them across the stage; the skill's level
 *  throws both ways and rains at every charge, and Solar Lance throws a fan each way ending in pillars of fire. */
export function castSunspear(level: number): void {
  const v = skillValues("y_sunspear");
  hero.ultCd = withCharms("cooldown", v.cooldown);
  const { spear } = spearCast(level, v);
  const y = hero.y - CHEST;
  const hand = hero.x + hero.face * 4;
  game.fx.push(createGlint(hand, hero.y - 36, EMBER[4]));
  lights.add(hand, hero.y - 36, 36, EMBER[4], 0.5, WIND + 0.1);
  const dirs = level >= 3 || v.both ? [hero.face, -hero.face] : [hero.face];
  const fan = FAN.slice(0, v.fan ?? 1);
  dirs.forEach((dir, i) => {
    fan.forEach((dy, k) => {
      const delay = WIND + i * 0.08 + k * 0.05;
      game.fx.push(createBurningSpear(spear(hero.x + dir * 6, y, dir > 0 ? W - 6 : 6, y + dy, SPEED, delay, true)));
    });
  });
  if (level < 4 && !v.rain) return;
  // spears slant down out of the sky onto every foe and across the floor
  const [x0, x1] = ultSpan(level);
  // a spear aimed at a foe lands on the floor under it, a loose one on the first floor it meets
  const aims: [number, number][] = [
    ...ultTargets(level).map(enemyCenter),
    ...Array.from({ length: RAIN_LOOSE }, (): [number, number] => [rng.range(x0, x1), 0]),
  ];
  const drops = rng.shuffle(aims).slice(0, RAIN_MAX);
  drops.forEach(([x, top], i) => {
    const floor = surfaceBelow(x, top);
    const slant = rng.range(0.25, 0.45) * (rng.chance(0.5) ? 1 : -1);
    const delay = RAIN_FROM + (i * RAIN_SPAN) / drops.length;
    game.fx.push(createBurningSpear(spear(x + slant * (floor + 30), -30, x, floor - 2, RAIN_SPEED, delay, false)));
  });
}
