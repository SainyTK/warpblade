import { BLOW_RANGE, BLOW_STATES, HAZARD_RANGE, RECOVER_STATE, WINDUP_RANGE, WINDUP_STATE } from "../constants/bot";
import type { FoeSnapshot, HeroSnapshot } from "../types/snapshot";

export const livingFoes = (foes: readonly FoeSnapshot[]): FoeSnapshot[] => foes.filter((foe) => foe.hp > 0);

export function nearestFoe(hero: HeroSnapshot, foes: readonly FoeSnapshot[]): FoeSnapshot | null {
  let best: FoeSnapshot | null = null;
  for (const foe of livingFoes(foes)) {
    if (!best || Math.abs(foe.x - hero.x) < Math.abs(best.x - hero.x)) {
      best = foe;
    }
  }
  return best;
}

/** 1 when the foe is to the right of the hero, -1 when to the left */
export const sideOf = (hero: HeroSnapshot, foe: FoeSnapshot): 1 | -1 => (foe.x >= hero.x ? 1 : -1);

const within = (hero: HeroSnapshot, foe: FoeSnapshot, range: { x: number; y: number }): boolean =>
  Math.abs(foe.x - hero.x) < range.x && Math.abs(foe.y - hero.y) < range.y;

/** a foe close by that is striking, or winding up right next to the hero */
export function threatOf(hero: HeroSnapshot, foes: readonly FoeSnapshot[]): FoeSnapshot | null {
  const threats = livingFoes(foes).filter(
    (foe) =>
      foe.stun <= 0 &&
      ((BLOW_STATES.has(foe.state) && within(hero, foe, BLOW_RANGE)) ||
        (foe.state === WINDUP_STATE && within(hero, foe, WINDUP_RANGE))),
  );
  return threats[0] ?? null;
}

/** a foe that is neither winding up nor striking, so the hero can close in */
export const isOpen = (foe: FoeSnapshot): boolean => foe.state !== WINDUP_STATE && !BLOW_STATES.has(foe.state);

/** a foe on the ground looking at the hero, so a blow from behind needs the hero to get past it */
export const facesHero = (hero: HeroSnapshot, foe: FoeSnapshot): boolean => foe.face === -sideOf(hero, foe);

export function foesWithin(hero: HeroSnapshot, foes: readonly FoeSnapshot[], range: number): FoeSnapshot[] {
  return livingFoes(foes).filter((foe) => Math.abs(foe.x - hero.x) < range);
}

/** a foe high above the hero, out of reach of a blow from the ground */
export const isHigh = (hero: HeroSnapshot, foe: FoeSnapshot, height: number): boolean => foe.y < hero.y - height;

/** the nearest foe a blow can reach: on the hero's level, or a high one sinking after its attack; else the nearest */
export function targetFoe(hero: HeroSnapshot, foes: readonly FoeSnapshot[], height: number): FoeSnapshot | null {
  const living = livingFoes(foes);
  const low = living.filter((foe) => !isHigh(hero, foe, height));
  const sinking = living.filter((foe) => foe.state === RECOVER_STATE);
  return nearestFoe(hero, low) ?? nearestFoe(hero, sinking) ?? nearestFoe(hero, living);
}

/** a high foe winding up or shooting close overhead: what it drops lands around the hero */
export function hazardAbove(hero: HeroSnapshot, foes: readonly FoeSnapshot[], height: number): FoeSnapshot | null {
  const above = livingFoes(foes).filter(
    (foe) => isHigh(hero, foe, height) && !isOpen(foe) && within(hero, foe, HAZARD_RANGE),
  );
  return above[0] ?? null;
}
