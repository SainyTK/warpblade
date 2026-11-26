import { setState } from "../../../game/hero/actions";
import { cutForSharedAction, maySharedAct } from "../../../game/hero/sharedCut";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import type { HeroState } from "../../../types/hero";
import type { AbilitySlot } from "../../../types/moveset";
import { ABILITY, ABILITY_ORDER, ABILITY_TAB, WIDE_COST } from "../constants/abilities";
import { SKILL } from "../constants/skills/ids";
import type { SayaAbility } from "../types/ability";
import { sayaSound } from "./sound";
import { beginBeat, saya } from "./state";

/** the skill that teaches each spell; the base abilities need none */
const TEACHER: Partial<Record<SayaAbility, string>> = {
  crescent: SKILL.crescent,
  rain: SKILL.rain,
  still: SKILL.still,
};

/** the state each ability plays: her own for the base abilities and Still Water, the shared cast for the others */
const STATE: Record<SayaAbility, HeroState> = {
  line: "line",
  rise: "rise",
  crescent: "cast",
  rain: "cast",
  still: "still",
};

/** she has this ability: a base one, or its spell skill is held */
const knows = (a: SayaAbility): boolean => !TEACHER[a] || skillLevel(TEACHER[a]) > 0;

/** MP an ability costs: Long Stroke makes Brushline free; the wide form costs more */
function castCost(a: SayaAbility, wide: boolean): number {
  if (a === "line" && skillValues(SKILL.stroke).free) return 0;
  return ABILITY_TAB[a].cost * (wide ? WIDE_COST : 1);
}

/** an ability's own recharge from its skill or its base, shortened by Haste and spell haste */
function recharge(a: SayaAbility): number {
  const teacher = TEACHER[a];
  const own = teacher
    ? skillValues(teacher).recharge
    : a === "line"
      ? (skillValues(SKILL.stroke).recharge ?? ABILITY.line.recharge)
      : ABILITY.rise.recharge;
  return withBuild("cooldown", own) / progress.stats.haste;
}

export function rechargeAbilities(dt: number): void {
  for (const a of ABILITY_ORDER) saya.cd[a] = Math.max(0, saya.cd[a] - dt);
}

/**
 * I on `a`: free, or once a blow of the string has landed, which cuts into the string; the ability's own sheathe then
 * releases the string's stored cuts too. Held with MP for it, the wide form.
 */
function cast(a: SayaAbility, wide: boolean): boolean {
  if (!maySharedAct() || hero.mp < castCost(a, false)) return false;
  const wideNow = wide && hero.mp >= castCost(a, true);
  cutForSharedAction();
  hero.mp -= castCost(a, wideNow);
  saya.cd[a] = recharge(a);
  saya.cdFull[a] = saya.cd[a];
  saya.casting = a;
  saya.wide = wideNow;
  beginBeat();
  setState(STATE[a]);
  sayaSound.draw();
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** a clean sheathe gives Brushline and Moonrise back */
export function resetBaseAbilities(): void {
  saya.cd.line = 0;
  saya.cd.rise = 0;
}

/** Saya's abilities on I, in the order O turns through them */
export const SAYA_SLOTS: readonly AbilitySlot[] = ABILITY_ORDER.map((a) => ({
  id: a,
  label: ABILITY_TAB[a].label,
  tint: ABILITY_TAB[a].tint,
  known: () => knows(a),
  wait: () => saya.cd[a],
  full: () => Math.max(0.01, saya.cdFull[a]),
  affordable: () => hero.mp >= castCost(a, false),
  cast: (wide: boolean) => cast(a, wide),
  evolved: () => !!TEACHER[a] && skillEvolved(TEACHER[a] as string),
}));
