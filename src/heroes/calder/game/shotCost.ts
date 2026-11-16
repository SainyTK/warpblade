import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { SHOT_RECHARGE, SHOT_ROUNDS, WIDE_COST } from "../constants/shots";
import type { CalderAbility } from "../types/ability";
import { spendRounds } from "./chamber";
import { calder } from "./state";

/** how one ability is known, paid for and recharged */
interface ShotCost {
  known(): boolean;
  affordable(wide: boolean): boolean;
  paidSoon(): boolean;
  pay(wide: boolean): void;
  recharge(): number;
  evolved(): boolean;
}

/** the reload is under way and its rounds are not in yet: a round shot pressed now waits for them */
const roundsComing = (): boolean => hero.state === "reload" && !hero.hitDone;

/** a base shot, paid in rounds from the chamber; while a reload loads them, a press waits for the rounds */
function roundShot(a: "slug" | "scatter"): ShotCost {
  const rounds = (wide: boolean): number => SHOT_ROUNDS[a][wide ? 1 : 0];
  return {
    known: () => true,
    affordable: (wide) => calder.rounds >= rounds(wide),
    paidSoon: roundsComing,
    pay: (wide) => {
      spendRounds(rounds(wide));
    },
    recharge: () => SHOT_RECHARGE[a] / progress.stats.haste,
    evolved: () => false,
  };
}

/** a shell from the bandolier, taught by a spell skill and paid in MP */
function shell(skill: string): ShotCost {
  const mp = (wide: boolean): number => (skillValues(skill).cost ?? 0) * (wide ? WIDE_COST : 1);
  return {
    known: () => skillLevel(skill) > 0,
    affordable: (wide) => hero.mp >= mp(wide),
    paidSoon: () => false,
    pay: (wide) => {
      hero.mp -= mp(wide);
    },
    recharge: () => (skillValues(skill).recharge ?? 1) / progress.stats.haste,
    evolved: () => skillEvolved(skill),
  };
}

/** every ability Calder can cast, by id */
export const SHOTS: Readonly<Record<CalderAbility, ShotCost>> = {
  slug: roundShot("slug"),
  scatter: roundShot("scatter"),
  flare: shell("ca_flare"),
  chain: shell("ca_chainshot"),
  charge: shell("ca_charge"),
};
