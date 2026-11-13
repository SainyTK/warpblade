import { CLIPS } from "../../constants/clips";
import { SUNFLASK } from "../../constants/evolutions";
import { ABILITY_COLOR } from "../../constants/palette";
import {
  ABILITY_COST,
  BASE_RECHARGE,
  ELEMENT_RECHARGE,
  ELEMENT_SKILL,
  KAEL_ABILITIES,
  LANCE,
  LANCE_FAN,
  SPELLBLADE,
  WIDE_COST,
} from "../../constants/spells";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import type { AbilitySlot } from "../../types/moveset";
import { PK } from "../../types/particle";
import type { KaelAbility } from "../../types/spell";
import { WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { createCrystalWave } from "../effects/crystalWave";
import { createGlint } from "../effects/flash";
import { emitSkillEvent } from "../skills/events";
import { skillEvolved, skillLevel, skillValues } from "../skills/query";
import { castBolt } from "../spells/bolt";
import { castBurst } from "../spells/burst";
import { castFire } from "../spells/fire";
import { castIce } from "../spells/ice";
import { game, hero, lights, particles, progress, rng } from "../state";
import { isFree, leaveHang, setState } from "./actions";
import { comboOpen, endCombo } from "./combo";
import { spellwarpCostShare, spellwarpOpen } from "./kael/spellwarp";
import { kael } from "./kael/state";

/** the flare at the hand as a spell leaves it: small enough to leave Kael in view */
const CAST_LIGHT = { radius: 24, strength: 0.45 } as const;

/** Kael has an ability when it is a base one or its element's skill is held */
export const knowsAbility = (a: KaelAbility): boolean =>
  a === "lance" || a === "burst" || skillLevel(ELEMENT_SKILL[a]) > 0;

/** an element spell evolved by its skill */
export const abilityEvolved = (a: KaelAbility): boolean =>
  a !== "lance" && a !== "burst" && skillEvolved(ELEMENT_SKILL[a]);

/** MP an ability costs, more for its wide form */
const castCost = (a: KaelAbility, wide: boolean): number => ABILITY_COST[a] * (wide ? WIDE_COST : 1);

/** an ability's own recharge: fixed for the base abilities, from its skill's level for the elements; spell haste
 *  shortens it, and no cast makes another ability wait */
function recharge(a: KaelAbility): number {
  const own =
    a === "lance" || a === "burst" ? BASE_RECHARGE[a] : (skillValues(ELEMENT_SKILL[a]).recharge ?? ELEMENT_RECHARGE);
  return own / progress.stats.haste;
}
/** share of the current wait an ability still has to recharge, 0 when ready */
export const spellRecharge = (a: KaelAbility): number => hero.spellCd[a] / hero.spellCdFull[a];

export function rechargeSpells(dt: number): void {
  const cd = hero.spellCd;
  for (const a of KAEL_ABILITIES) cd[a] = Math.max(0, cd[a] - dt);
}

/** I: cast `a`; with Spellblade (in an open combo or just after a warp) it leaves the hand at once and hits harder;
 *  held, its wide form */
function startCast(a: KaelAbility, spellblade: boolean, wide: boolean, costShare: number): void {
  const h = hero;
  if (h.state === "hang") leaveHang();
  h.castAbility = a;
  h.castWide = wide;
  h.mp -= castCost(a, wide) * costShare;
  h.spellCd[a] = recharge(a);
  h.spellCdFull[a] = h.spellCd[a];
  h.move = null;
  h.spellPower = spellblade ? SPELLBLADE.power : 1;
  setState("cast");
  if (spellblade) {
    endCombo(true);
    h.st = CLIPS.cast.hit;
  }
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: a });
}

/** I on `a`: Spellblade after the second hit of a combo or just after a warp (Spellwarp), otherwise a cast from a free
 *  state or a crystal */
function castFrom(a: KaelAbility, wide: boolean): boolean {
  const afterWarp = !comboOpen(SPELLBLADE.after) && spellwarpOpen();
  const spellblade = afterWarp || comboOpen(SPELLBLADE.after);
  if (!spellblade && !isFree() && hero.state !== "hang") return false;
  const share = afterWarp ? spellwarpCostShare() : 1;
  if (hero.mp < castCost(a, false) * share) return false;
  if (afterWarp) kael.spellwarp = 0;
  // held with MP for the plain form only, the plain form goes
  startCast(a, spellblade, wide && hero.mp >= castCost(a, true) * share, share);
  return true;
}

/** Arcane Arrival: `a` goes off from Kael's hand at once at `power`, with no MP, no recharge and no cast pose */
export function castFree(a: KaelAbility, power: number): void {
  const h = hero;
  const hx = h.x + h.face * h.hand[0];
  const hy = h.y + h.hand[1];
  lights.add(hx, hy, CAST_LIGHT.radius, ABILITY_COLOR[a], CAST_LIGHT.strength, 0.2);
  game.fx.push(createGlint(hx, hy, ABILITY_COLOR[a]));
  release(a, hx, hy, power, false);
}

/** each ability's tab label and the colour it lights in when selected */
const TAB: Readonly<Record<KaelAbility, { label: string; tint: string }>> = {
  lance: { label: "LANCE", tint: "var(--crystal)" },
  burst: { label: "BURST", tint: "var(--mist)" },
  fire: { label: "FIRE", tint: "var(--fire)" },
  ice: { label: "ICE", tint: "var(--ice)" },
  volt: { label: "BOLT", tint: "var(--volt)" },
};

/** Kael's abilities on I, in the order O turns through them: Crystal Lance and Crystal Burst, then the element spells */
export const KAEL_SLOTS: readonly AbilitySlot[] = KAEL_ABILITIES.map((a) => ({
  id: a,
  label: TAB[a].label,
  tint: TAB[a].tint,
  known: () => knowsAbility(a),
  wait: () => hero.spellCd[a],
  full: () => Math.max(0.01, hero.spellCdFull[a]),
  affordable: () => hero.mp >= ABILITY_COST[a],
  cast: (wide: boolean) => castFrom(a, wide),
  evolved: () => abilityEvolved(a),
}));

/** Crystal Lance, or held a fan of three lances that cut each foe once */
function releaseLance(hx: number, hy: number, face: number, damage: number, wide: boolean): void {
  if (!wide) {
    game.fx.push(createCrystalWave(hx, hy, face, damage, "abilities"));
    return;
  }
  const struck = new Set<Enemy>();
  for (const rise of LANCE_FAN)
    game.fx.push(createCrystalWave(hx, hy, face, damage, "abilities", undefined, { rise, struck }));
}

/** the ability leaves the hand, in its wide form when it was held */
function release(a: KaelAbility, hx: number, hy: number, power: number, wide: boolean): void {
  const h = hero;
  switch (a) {
    case "lance":
      releaseLance(hx, hy, h.face, progress.stats.ap * LANCE.power * power, wide);
      return;
    case "burst":
      castBurst(power, wide);
      return;
    case "fire":
      castFire(hx, hy, h.face, power, wide);
      return;
    case "ice":
      game.fx.push(castIce(h.x, h.y, h.face, power, wide));
      return;
    case "volt":
      castBolt(h.x, h.y, h.face, power, wide);
  }
}

/** while casting: streaks gather at the hand, then the ability leaves it */
export function runCast(): void {
  const h = hero;
  const a = h.castAbility;
  const c = ABILITY_COLOR[a];
  const hx = h.x + h.face * h.hand[0];
  const hy = h.y + h.hand[1];
  if (h.st < CLIPS.cast.hit && rng.chance(0.6)) {
    const angle = rng.range(0, TAU);
    const d = rng.range(14, 26);
    particles.spawn(
      PK.STREAK,
      hx + Math.cos(angle) * d,
      hy + Math.sin(angle) * d,
      -Math.cos(angle) * 35,
      -Math.sin(angle) * 35,
      rng.range(0.12, 0.18),
      { col: c },
    );
  }
  if (h.hitDone || h.st < CLIPS.cast.hit) return;
  h.hitDone = true;
  lights.add(hx, hy, CAST_LIGHT.radius, c, CAST_LIGHT.strength, 0.2);
  game.fx.push(createGlint(hx, hy, c));
  // an evolved spell: a second glint in white, larger, over its own
  if (abilityEvolved(a)) game.fx.push(createGlint(hx, hy, WHITE, SUNFLASK.glintGrow));
  release(a, hx, hy, h.spellPower, h.castWide);
}
