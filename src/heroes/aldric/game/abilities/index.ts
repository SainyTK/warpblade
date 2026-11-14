import { createGlint } from "../../../../game/effects/flash";
import { isFree, setState, settle } from "../../../../game/hero/actions";
import { comboOpen } from "../../../../game/hero/combo";
import { cutForSharedAction } from "../../../../game/hero/sharedCut";
import { emitSkillEvent } from "../../../../game/skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../../../game/skills/query";
import { game, hero, lights, progress } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { AbilitySlot } from "../../../../types/moveset";
import {
  ABILITY_COST,
  ABILITY_TAB,
  ALDRIC_ABILITIES,
  BASE_RECHARGE,
  RUSH,
  SPELL_SKILL,
  WIDE_COST,
} from "../../constants/abilities";
import { ALDRIC_ACTION_CLIPS } from "../../constants/clips";
import { SHIELDCAST } from "../../constants/kit";
import { DAWN_RAMP } from "../../constants/light";
import type { AldricAbility } from "../../types/state";
import { aldric } from "../state";
import { callPillars } from "./pillars";
import { runRush, startRush } from "./rush";
import { castLance, castMend, castRally } from "./spells";

type Spell = keyof typeof SPELL_SKILL;
const isSpell = (a: AldricAbility): a is Spell => a in SPELL_SKILL;

/** Aldric has an ability when it is a base one or its spell's skill is held */
const knowsAbility = (a: AldricAbility): boolean => !isSpell(a) || skillLevel(SPELL_SKILL[a]) > 0;

const castCost = (a: AldricAbility, wide: boolean): number => ABILITY_COST[a] * (wide ? WIDE_COST : 1);

/** an ability's own recharge: fixed for the base ones, from its skill's row for a spell, shortened by haste */
function recharge(a: AldricAbility): number {
  const own = isSpell(a) ? (skillValues(SPELL_SKILL[a]).recharge ?? BASE_RECHARGE.pillar) : BASE_RECHARGE[a];
  return own / progress.stats.haste;
}

export function rechargeAbilities(dt: number): void {
  for (const a of ALDRIC_ABILITIES) aldric.cd[a] = Math.max(0, aldric.cd[a] - dt);
}

/**
 * I on `a`: from a stand, the guard or an open string. Shieldcast: pressed in an open string it skips its wind-up, and
 * after the Shield bash it hits harder. Held with MP for it, the wide form.
 */
function cast(a: AldricAbility, wide: boolean): boolean {
  const shieldcast = comboOpen(1);
  if (!shieldcast && !isFree() && hero.state !== "guard") return false;
  if (hero.mp < castCost(a, false)) return false;
  const full = wide && hero.mp >= castCost(a, true);
  aldric.castPower = shieldcast && hero.chain >= SHIELDCAST.after ? SHIELDCAST.power : 1;
  cutForSharedAction();
  hero.mp -= castCost(a, full);
  aldric.cd[a] = recharge(a);
  aldric.cdFull[a] = Math.max(0.01, aldric.cd[a]);
  aldric.castAbility = a;
  aldric.castWide = full;
  hero.running = false;
  if (a === "rush") {
    startRush();
    setState("rush");
    if (shieldcast) hero.st = RUSH.load;
    sfx.lunge();
  } else {
    setState("call");
    if (shieldcast) hero.st = ALDRIC_ACTION_CLIPS.call.hit;
    sfx.cast();
  }
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** the call of light goes off from the raised sword */
function release(): void {
  const a = aldric.castAbility;
  const p = aldric.castPower;
  const tip = { x: hero.x + hero.face * 4, y: hero.y - 36 };
  game.fx.push(createGlint(tip.x, tip.y, DAWN_RAMP[5], isSpell(a) && skillEvolved(SPELL_SKILL[a]) ? 1 : 0));
  lights.add(tip.x, tip.y, 26, DAWN_RAMP[4], 0.5, 0.25);
  if (a === "pillar") callPillars(p, aldric.castWide);
  if (a === "lance") castLance(p, aldric.castWide);
  if (a === "mend") castMend(p, aldric.castWide);
  if (a === "rally") castRally(p, aldric.castWide);
}

/** his own ability states: Shield Rush drives him forward; the call lets the light go at its hit frame */
export function runAbilityState(): boolean {
  const h = hero;
  if (h.state === "rush") {
    runRush();
    if (h.st >= ALDRIC_ACTION_CLIPS.rush.dur) settle();
    return true;
  }
  if (h.state !== "call") return false;
  if (!h.hitDone && h.st >= ALDRIC_ACTION_CLIPS.call.hit) {
    h.hitDone = true;
    release();
  }
  if (h.st >= ALDRIC_ACTION_CLIPS.call.dur) settle();
  return true;
}

/** Aldric's abilities on I, in the order O turns through them */
export const ALDRIC_SLOTS: readonly AbilitySlot[] = ALDRIC_ABILITIES.map((a) => ({
  id: a,
  label: ABILITY_TAB[a].label,
  tint: ABILITY_TAB[a].tint,
  known: () => knowsAbility(a),
  wait: () => aldric.cd[a],
  full: () => Math.max(0.01, aldric.cdFull[a]),
  affordable: () => hero.mp >= ABILITY_COST[a],
  cast: (wide: boolean) => cast(a, wide),
  evolved: () => isSpell(a) && skillEvolved(SPELL_SKILL[a]),
}));
