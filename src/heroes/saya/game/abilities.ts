import { setState } from "../../../game/hero/actions";
import { cutForSharedAction, maySharedAct } from "../../../game/hero/sharedCut";
import { emitSkillEvent } from "../../../game/skills/events";
import { hero, progress } from "../../../game/state";
import type { AbilitySlot } from "../../../types/moveset";
import { ABILITY, SAYA_ABILITIES, WIDE_COST } from "../constants/abilities";
import type { SayaAbility } from "../types/ability";
import { sayaSound } from "./sound";
import { beginBeat, saya } from "./state";

/** the state each ability plays */
const STATE = { line: "line", rise: "rise" } as const satisfies Record<SayaAbility, string>;

/** an ability's own recharge, shortened by spell haste; no cast makes another wait */
const recharge = (a: SayaAbility): number => ABILITY[a].recharge / progress.stats.haste;

/** MP an ability costs, more for its wide form */
const castCost = (a: SayaAbility, wide: boolean): number => ABILITY[a].cost * (wide ? WIDE_COST : 1);

export function rechargeAbilities(dt: number): void {
  for (const a of SAYA_ABILITIES) saya.cd[a] = Math.max(0, saya.cd[a] - dt);
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
  saya.wide = wideNow;
  beginBeat();
  setState(STATE[a]);
  sayaSound.draw();
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** Saya's abilities on I, in the order O turns through them */
export const SAYA_SLOTS: readonly AbilitySlot[] = SAYA_ABILITIES.map((a) => ({
  id: a,
  label: ABILITY[a].label,
  tint: ABILITY[a].tint,
  known: () => true,
  wait: () => saya.cd[a],
  full: () => Math.max(0.01, saya.cdFull[a]),
  affordable: () => hero.mp >= ABILITY[a].cost,
  cast: (wide: boolean) => cast(a, wide),
}));
