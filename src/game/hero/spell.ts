import { CLIPS } from "../../constants/clips";
import { SUNFLASK } from "../../constants/evolutions";
import { ABILITY_COLOR } from "../../constants/palette";
import {
  ABILITY_COST,
  BASE_RECHARGE,
  ELEMENT_SKILL,
  KAEL_ABILITIES,
  LANCE,
  SPELL_SHARED_COOLDOWN,
  SPELLBLADE,
} from "../../constants/spells";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import type { KaelAbility } from "../../types/spell";
import { WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { createCrystalWave } from "../effects/crystalWave";
import { createGlint } from "../effects/flash";
import { emitSkillEvent } from "../skills/events";
import { skillEvolved, skillLevel, skillValues } from "../skills/query";
import { createRotation } from "../skills/rotation";
import { castBolt } from "../spells/bolt";
import { castBurst } from "../spells/burst";
import { castFire } from "../spells/fire";
import { castIce } from "../spells/ice";
import { game, hero, lights, particles, progress, rng } from "../state";
import { leaveHang, setState } from "./actions";
import { endCombo } from "./combo";

/** the flare at the hand as a spell leaves it: small enough to leave Kael in view */
const CAST_LIGHT = { radius: 24, strength: 0.45 } as const;

/** Kael has an ability when it is a base one or its element's skill is held */
export const knowsAbility = (a: KaelAbility): boolean =>
  a === "lance" || a === "burst" || skillLevel(ELEMENT_SKILL[a]) > 0;

/** the abilities O turns through, each co-op seat with its own selection */
const rotation = createRotation(KAEL_ABILITIES, (id) => knowsAbility(id as KaelAbility));

/** the selected ability */
export const selectedAbility = (): KaelAbility => (rotation.selected() ?? "lance") as KaelAbility;
/** O: move to the next ability Kael has; true when the selection changed */
export const selectNextAbility = (): boolean => rotation.next();
/** a fresh run starts on Crystal Lance */
export const resetAbilities = (): void => rotation.reset();

/** an element spell evolved by its skill */
export const abilityEvolved = (a: KaelAbility): boolean =>
  a !== "lance" && a !== "burst" && skillEvolved(ELEMENT_SKILL[a]);

/** MP the selected ability costs */
export const castCost = (): number => ABILITY_COST[selectedAbility()];

/** an ability's own recharge: fixed for the base abilities, from its skill's level for the elements */
function ownRecharge(a: KaelAbility): number {
  if (a === "lance" || a === "burst") return BASE_RECHARGE[a];
  return skillValues(ELEMENT_SKILL[a]).recharge ?? SPELL_SHARED_COOLDOWN;
}

/** seconds an ability waits after a cast: its own recharge when it was the one cast, the shared one otherwise; spell
 *  haste shortens both */
const spellWait = (a: KaelAbility, cast: KaelAbility): number =>
  (a === cast ? ownRecharge(a) : SPELL_SHARED_COOLDOWN) / progress.stats.haste;
/** share of the current wait an ability still has to recharge, 0 when ready */
export const spellRecharge = (a: KaelAbility): number => hero.spellCd[a] / hero.spellCdFull[a];
/** the selected ability is still recharging */
export const isRecharging = (): boolean => hero.spellCd[selectedAbility()] > 0;

export function rechargeSpells(dt: number): void {
  const cd = hero.spellCd;
  for (const a of KAEL_ABILITIES) cd[a] = Math.max(0, cd[a] - dt);
}

/** I: start a cast; with Spellblade in an open combo it leaves the hand at once and hits harder */
export function startCast(spellblade: boolean): void {
  const h = hero;
  if (h.state === "hang") leaveHang();
  h.castAbility = selectedAbility();
  h.mp -= ABILITY_COST[h.castAbility];
  for (const a of KAEL_ABILITIES) {
    const wait = spellWait(a, h.castAbility);
    if (wait <= h.spellCd[a]) continue;
    h.spellCd[a] = wait;
    h.spellCdFull[a] = wait;
  }
  h.move = null;
  h.spellPower = spellblade ? SPELLBLADE.power : 1;
  setState("cast");
  if (spellblade) {
    endCombo(true);
    h.st = CLIPS.cast.hit;
  }
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: h.castAbility });
}

/** the ability leaves the hand */
function release(a: KaelAbility, hx: number, hy: number, power: number): void {
  const h = hero;
  switch (a) {
    case "lance":
      game.fx.push(createCrystalWave(hx, hy, h.face, progress.stats.ap * LANCE.power * power, "abilities"));
      return;
    case "burst":
      castBurst(power);
      return;
    case "fire":
      castFire(hx, hy, h.face, power);
      return;
    case "ice":
      game.fx.push(castIce(h.x, h.y, h.face, power));
      return;
    case "volt":
      castBolt(h.x, h.y, h.face, power);
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
  release(a, hx, hy, h.spellPower);
}
