import { COMBO } from "../../../constants/combat";
import { isFree, setState, settle } from "../../../game/hero/actions";
import { comboOpen } from "../../../game/hero/combo";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { surfaceBelow } from "../../../game/world";
import type { AbilitySlot } from "../../../types/moveset";
import {
  ABILITY_COST,
  ABILITY_LABEL,
  ABILITY_TINT,
  BASE_RECHARGE,
  SANDCAST,
  SPELL_RECHARGE,
  SPELL_SKILL,
  SPOUT,
  WIDE_COST,
  ZAFIR_ABILITIES,
} from "../constants/abilities";
import type { ZafirAbility } from "../types/abilities";
import { throwCrescent } from "./crescent";
import { createSpout } from "./effects/spout";
import { sandSound } from "./sound";
import { castSpell } from "./spells";
import { zafir } from "./state";

/** a spell taught by a skill, as opposed to a base ability */
const isSpell = (a: ZafirAbility): a is keyof typeof SPELL_SKILL => a in SPELL_SKILL;

/** Zafir has an ability when it is a base one or its skill is held */
export const knowsAbility = (a: ZafirAbility): boolean => !isSpell(a) || skillLevel(SPELL_SKILL[a]) > 0;

/** an ability's own recharge: fixed for the base abilities, from its skill for the spells; spell haste shortens it */
function recharge(a: ZafirAbility): number {
  const own = isSpell(a) ? (skillValues(SPELL_SKILL[a]).recharge ?? SPELL_RECHARGE) : BASE_RECHARGE[a];
  return own / progress.stats.haste;
}

/** the timers run down */
export function rechargeAbilities(dt: number): void {
  for (const a of ZAFIR_ABILITIES) zafir.abilityCd[a] = Math.max(0, zafir.abilityCd[a] - dt);
}

/**
 * I on `a`: from a free state, or straight out of a blow of an open string, where it goes off at once and the string
 * carries on after it. Held with MP to spare, its wide form.
 */
function castFrom(a: ZafirAbility, wide: boolean): boolean {
  const inString = comboOpen(1);
  if (!inString && !isFree()) return false;
  if (a === "crescent" && zafir.bladeOut) return false;
  const cost = ABILITY_COST[a];
  if (hero.mp < cost) return false;
  const widened = wide && hero.mp >= cost * WIDE_COST;
  hero.mp -= widened ? cost * WIDE_COST : cost;
  zafir.abilityCd[a] = recharge(a);
  zafir.abilityFull[a] = zafir.abilityCd[a];
  Object.assign(zafir, { casting: a, castWide: widened, castInString: inString });
  Object.assign(hero, { move: null, queued: null, link: 0 });
  setState("sandcast");
  if (inString) hero.st = SANDCAST.release;
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** Sandspout: a whirl along the floor ahead; wide, one each way */
function releaseSpout(wide: boolean): void {
  const y = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  const damage = progress.stats.ap * SPOUT.power;
  game.fx.push(createSpout(hero.x + hero.face * 12, y, hero.face, { damage, range: 1 }));
  if (wide) game.fx.push(createSpout(hero.x - hero.face * 12, y, -hero.face, { damage, range: 1 }));
  sandSound.hiss();
}

/** the ability leaves his hands */
function release(a: ZafirAbility, wide: boolean): void {
  if (a === "spout") return releaseSpout(wide);
  if (a === "crescent") return throwCrescent(wide, 1);
  castSpell(a, wide);
}

/** the cast under way: the ability goes on its release frame; the string, when it was cut into, carries on after */
export function runSandcast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SANDCAST.release) {
    h.hitDone = true;
    release(zafir.casting, zafir.castWide);
  }
  if (h.st < SANDCAST.end) return;
  settle();
  if (zafir.castInString) h.link = COMBO.link;
  zafir.castInString = false;
}

/** Zafir's abilities on I, in the order O turns through them */
export const ZAFIR_SLOTS: readonly AbilitySlot[] = ZAFIR_ABILITIES.map((a) => ({
  id: a,
  label: ABILITY_LABEL[a],
  tint: ABILITY_TINT[a],
  known: () => knowsAbility(a),
  wait: () => zafir.abilityCd[a],
  full: () => Math.max(0.01, zafir.abilityFull[a]),
  affordable: () => hero.mp >= ABILITY_COST[a] && (a !== "crescent" || !zafir.bladeOut),
  cast: (wide: boolean) => castFrom(a, wide),
  evolved: () => isSpell(a) && skillEvolved(SPELL_SKILL[a]),
}));
