import { ENEMIES } from "../../constants/enemies";
import { IRON_LIGHT } from "../../constants/hulda/look";
import { QUAKE, QUAKE_SKILL } from "../../constants/hulda/ultimates";
import { HERO_COLORS } from "../../constants/palette";
import { W } from "../../constants/stage";
import { ULT_LEVELS, ULT_REACH } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { createQuakeLine } from "../effects/quakeLine";
import { enemyCenter, walks } from "../enemies/enemy";
import { createQuakeTethers } from "../hero/hulda/effects/quakeTethers";
import { maxGrit } from "../hero/hulda/grit";
import { hulda } from "../hero/hulda/memory";
import { skin } from "../hero/skin";
import { ultimateValues } from "../hero/ultimate";
import { game, hero, lights, progress } from "../state";
import { shake, surfaceBelow } from "../world";
import { ultTargets } from "./targets";

/** a foe the crack reaches: the hit, minions thrown up, bigger foes made to reel */
function strike(e: Enemy, x: number, damage: number): void {
  const [cx, cy] = enemyCenter(e);
  const minion = ENEMIES[e.type].launchable;
  dealDamage(e, damage, {
    fromX: x,
    kx: 0,
    launch: minion ? QUAKE.launch : undefined,
    heavy: true,
    source: "ultimate",
  });
  // the stun of a blow only holds minions; the quake makes bigger foes reel too
  if (!minion) e.stun = Math.max(e.stun, QUAKE.bigStun);
  game.fx.push(createImpact(cx, cy, Math.sign(cx - x) || 1, true));
  sfx.hit(true, 0.6);
}

/** with the skill, fliers over the crack's stretch are shaken down toward the floor and struck */
function shakeFliers(x0: number, x1: number, damage: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || walks(e) || e.x < x0 || e.x > x1) continue;
    e.y = Math.min(hero.y - 12, e.y + QUAKE_SKILL.flierDrop);
    e.stun = Math.max(e.stun, QUAKE_SKILL.flierStun);
    dealDamage(e, damage, { fromX: hero.x, kx: 0, heavy: true, source: "ultimate" });
  }
}

/** one crack from her fists out to the ends, `delay` after the cast */
function crack(x: number, floor: number, ends: readonly number[], damage: number, delay: number, fliers: boolean) {
  game.fx.push(
    createQuakeLine({
      x,
      floor,
      ends,
      ramp: skin.ramp,
      delay,
      slam() {
        shake(QUAKE.shake[0], QUAKE.shake[1]);
        sfx.boom();
        if (fliers) shakeFliers(Math.min(x, ...ends), Math.max(x, ...ends), damage);
      },
      strike: (e) => strike(e, x, damage),
    }),
  );
}

/** the tethers drag minions (every foe, evolved) in reach to her front before the fists fall */
function tether(level: number, reach: number, big: boolean): void {
  const foes = ultTargets(level, 1).filter(
    (e) => (big || ENEMIES[e.type].launchable) && Math.abs(e.x - hero.x) <= reach,
  );
  if (foes.length) game.fx.push(createQuakeTethers(foes));
}

/** the drop leaves her iron for a while: no blow breaks a plate, and her damage is up */
function turnIron(seconds: number, bonus: number): void {
  hulda.ironT = seconds;
  hulda.iron = bonus;
  lights.add(hero.x, hero.y - 18, IRON_LIGHT.radius, HERO_COLORS.steel, IRON_LIGHT.strength, IRON_LIGHT.life);
}

/**
 * Quake Drop, Hulda's special: she hops with both fists raised and slams them into the floor, and a crack runs out to
 * the level's reach (ahead at 1 and 2, both ways at 3, wall to wall at 4). Each foe on the floor it passes takes the
 * level's power once; minions are thrown up, bigger foes reel.
 *
 * Her Quake Drop skill (`ultimateValues()`) reshapes it: tethers drag minions in first, the crack runs both ways from
 * the first level, fliers are shaken down, an aftershock follows, the drop fills her plates and leaves her iron (blows
 * in iron crack the floor, src/game/skills/hulda/quakeDrop.ts), and evolved every crack runs wall to wall.
 *
 * Per cast against the plain drop at charge level 3 (7x on each foe it reaches): level 8 is the drop at 3.2 times and an
 * aftershock at 0.7 of it, about 5.5 times, plus five seconds of iron at +50% with 4x blow quakes, about 6.5 times in
 * all; evolved, 7 times and a full aftershock, about 14 times, and eight seconds of iron, about 16 times.
 */
export function castQuakeDrop(level: number): void {
  const v = ultimateValues();
  const floor = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  const x = clamp(hero.x + hero.face * 6, 6, W - 6);
  const reach = ULT_REACH[level - 1];
  const both = level === 3 || (v.both > 0 && level < 4);
  const ends =
    level >= 4 || v.wall > 0
      ? [6, W - 6]
      : both
        ? [clamp(x - reach, 6, W - 6), clamp(x + reach, 6, W - 6)]
        : [clamp(x + hero.face * reach, 6, W - 6)];
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * (v.power ?? 1);
  if (v.pull) tether(level, v.pull, v.big > 0);
  crack(x, floor, ends, damage, QUAKE.slam, v.fliers > 0);
  if (v.aftershock) crack(x, floor, ends, damage * v.aftershock, QUAKE.slam + QUAKE_SKILL.aftershock, v.fliers > 0);
  if (v.iron) turnIron(v.iron, v.ironBonus);
  if (v.fill) hulda.grit = maxGrit();
}
