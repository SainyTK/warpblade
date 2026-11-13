import { STOPPED_CLOCK } from "../../../constants/mirel/abilities";
import { PAL, SAND } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { stopFoe } from "../../enemies/timeStop";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { setState } from "../actions";
import { cutForSharedAction } from "../sharedCut";
import { mayCast } from "./castCheck";
import { createClockFace } from "./clockFace";
import { mirel, mirelHost } from "./memory";

/** a foe ahead counts as level with her when its centre is this near her chest height */
const LEVEL = 20;

/** the nearest foe ahead within reach whose centre is within `height` of her chest, or null */
function nearestAhead(height: number): Enemy | null {
  let best: Enemy | null = null;
  let bestD: number = STOPPED_CLOCK.reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const d = (cx - hero.x) * hero.face;
    if (d < -6 || d > bestD || Math.abs(cy - (hero.y - 16)) > height) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** the foe she aims at: the nearest ahead level with her, so a flier above never takes the stop meant for the foe she
 *  faces; failing that, the nearest ahead at any height within reach */
const foeAhead = (): Enemy | null => nearestAhead(LEVEL) ?? nearestAhead(STOPPED_CLOCK.height);

/** every living foe round her within the wide form's reach */
function foesRound(): Enemy[] {
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    return Math.hypot(cx - hero.x, cy - (hero.y - 16)) <= STOPPED_CLOCK.wide.reach;
  });
}

/** the foes a cast would stop: the foe ahead, or held every foe round her */
const targets = (wide: boolean): Enemy[] => {
  if (wide) return foesRound();
  const foe = foeAhead();
  return foe ? [foe] : [];
};

/** MP a cast costs now: more for the wide form, half when it would find nobody */
export function clockMp(wide: boolean): number {
  const mp = STOPPED_CLOCK.mp * (wide ? STOPPED_CLOCK.wide.mp : 1);
  return targets(wide).length ? mp : mp / 2;
}

/** seconds a foe of this rank stays stopped, shorter in the wide form */
const stopFor = (e: Enemy, wide: boolean): number => STOPPED_CLOCK.stop[e.rank] * (wide ? STOPPED_CLOCK.wide.stop : 1);

/**
 * I with Stopped Clock: aim at the foe ahead; held, at every foe round her, for more MP and a shorter stop. With nobody
 * in reach it fizzles for half the MP.
 */
export function castStoppedClock(wide: boolean): boolean {
  if (!mayCast()) return false;
  // held with MP for the plain form only, the plain form goes
  const held = wide && hero.mp >= clockMp(true);
  cutForSharedAction();
  hero.mp -= clockMp(held);
  mirel.clockCd = STOPPED_CLOCK.cooldown;
  mirel.casting = "stoppedClock";
  mirel.wide = held;
  mirelHost.clockFoes = targets(held);
  if (hero.ground) hero.vx = 0;
  setState("clockCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: "stoppedClock" });
  return true;
}

/** a puff of sand where the spell found nobody */
function fizzle(): void {
  const x = hero.x + hero.face * 30;
  const y = hero.y - 18;
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.MOTE,
      x + rng.range(-4, 4),
      y + rng.range(-4, 4),
      rng.range(-30, 30),
      rng.range(-30, 10),
      rng.range(0.3, 0.5),
      {
        col: rng.chance(0.6) ? SAND.light : SAND.shade,
        size: 0.6,
      },
    );
}

/** one foe takes the cast's hit and stops dead under a clock face */
function stop(e: Enemy, wide: boolean): void {
  // the cast's own hit lands before the stop, so only what comes after is stored
  dealDamage(e, progress.stats.ap * STOPPED_CLOCK.power, { fromX: hero.x, source: "abilities" });
  stopFoe(e, stopFor(e, wide), STOPPED_CLOCK.returns);
  game.fx.push(createClockFace(e));
  const [cx, cy] = enemyCenter(e);
  lights.add(cx, cy, 34, PAL.hour[3], 0.55, 0.25);
}

/** the cast: on its frame the foes stop dead under clock faces and take the hit */
export function runClockCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= STOPPED_CLOCK.hit) {
    h.hitDone = true;
    const foes = mirelHost.clockFoes.filter((e) => e.hp > 0);
    mirelHost.clockFoes = [];
    if (!foes.length) fizzle();
    for (const e of foes) stop(e, mirel.wide);
    if (foes.length) sfx.chime(3);
  }
  if (h.st >= STOPPED_CLOCK.dur) setState(h.ground ? "idle" : "fall");
}
