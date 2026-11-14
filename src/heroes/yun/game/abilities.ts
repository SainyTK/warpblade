import { ACTION_CLIPS } from "../../../constants/clips";
import { createGlint } from "../../../game/effects/flash";
import { feat } from "../../../game/feat";
import { isFree, setState } from "../../../game/hero/actions";
import { comboOpen } from "../../../game/hero/combo";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import type { AbilitySlot } from "../../../types/moveset";
import { hex } from "../../../utils/color";
import {
  ABILITY_SKILL,
  ABILITY_TINT,
  CRESCENT_COST,
  LEAST_SWORDS,
  RECHARGE,
  YUN_ABILITIES,
} from "../constants/abilities";
import { SWORDS_SENT_STAT } from "../constants/achievements";
import { JADE } from "../look";
import type { YunAbility } from "../types/ability";
import { hoverPlace, type SwordPlace } from "./hover";
import { castCage } from "./spells/cage";
import { castCrescent } from "./spells/crescent";
import { castFan } from "./spells/fan";
import { sendLotus, sendStream } from "./spells/send";
import { yun } from "./state";
import { spendSwords } from "./swords";

/** the flare at the sword fingers as the swords leave */
const SEND_LIGHT = { radius: 22, strength: 0.4 } as const;

/** the abilities paid with MP; the rest spend the spirit swords */
const paidWithMp = (a: YunAbility): boolean => a === "crescent";

/** Yun knows an ability when it is a base one or its skill is held */
export const knowsAbility = (a: YunAbility): boolean => {
  const skill = ABILITY_SKILL[a];
  return !skill || skillLevel(skill) > 0;
};

/** an ability's spell skill has evolved */
const abilityEvolved = (a: YunAbility): boolean => {
  const skill = ABILITY_SKILL[a];
  return !!skill && skillEvolved(skill);
};

/** he can pay for it now: MP for Qi Crescent, a spirit sword for the rest */
const affordable = (a: YunAbility): boolean => (paidWithMp(a) ? hero.mp >= CRESCENT_COST : yun.swords >= LEAST_SWORDS);

/** where his sword fingers are, in the world */
function fingers(): [number, number] {
  const p = hero.pose;
  return [hero.x + hero.face * p.bx, hero.y + p.by];
}

/** the ability leaves his hand: the swords it spends go into it, or the MP for Qi Crescent */
function release(a: YunAbility, wide: boolean): void {
  const [fx, fy] = fingers();
  lights.add(fx, fy, SEND_LIGHT.radius, JADE[3], SEND_LIGHT.strength, 0.2);
  game.fx.push(createGlint(fx, fy, JADE[4]));
  emitSkillEvent({ type: "cast", ability: a });
  if (paidWithMp(a)) {
    castCrescent(wide);
    return;
  }
  const places: SwordPlace[] = Array.from({ length: yun.swords }, (_, i) => hoverPlace(i));
  spendSwords();
  feat({ kind: "heroCount", stat: SWORDS_SENT_STAT, add: places.length });
  if (a === "stream") sendStream(places, wide);
  else if (a === "lotus") sendLotus(places.length, wide);
  else if (a === "fan") castFan(places, wide);
  else castCage(places, wide);
}

/** the ability waits its recharge, its skill's when it has one, shortened by haste */
function startWait(a: YunAbility): void {
  const skill = ABILITY_SKILL[a];
  const own = skill ? (skillValues(skill).recharge ?? RECHARGE[a]) : RECHARGE[a];
  yun.wait[a] = own / progress.stats.haste;
  yun.waitFull[a] = yun.wait[a];
}

/**
 * I on `a`, once he can pay for it. Free Hand: in an open string, after a blow has landed, it leaves his sword fingers
 * at once with no cast pose and the string stays open. Otherwise from a free state he plays the cast and it leaves on
 * the cast's release frame.
 */
function cast(a: YunAbility, wide: boolean): boolean {
  if (!affordable(a)) return false;
  const free = comboOpen(1);
  if (!free && !isFree()) return false;
  startWait(a);
  if (paidWithMp(a)) hero.mp -= CRESCENT_COST;
  sfx.cast();
  if (free) {
    release(a, wide);
    return true;
  }
  yun.castAbility = a;
  yun.castWide = wide;
  hero.move = null;
  setState("cast");
  return true;
}

/** while casting: the ability leaves on the cast's release frame */
export function runCast(): void {
  const h = hero;
  if (h.hitDone || h.st < ACTION_CLIPS.cast.hit) return;
  h.hitDone = true;
  release(yun.castAbility, yun.castWide);
}

/** the abilities' recharges run down */
export function rechargeAbilities(dt: number): void {
  for (const a of YUN_ABILITIES) yun.wait[a] = Math.max(0, yun.wait[a] - dt);
}

const TAB: Readonly<Record<YunAbility, string>> = {
  stream: "STREAM",
  lotus: "LOTUS",
  fan: "FAN",
  cage: "CAGE",
  crescent: "CRESCENT",
};

/** Yun's abilities on I, in the order O turns through them */
export const YUN_SLOTS: readonly AbilitySlot[] = YUN_ABILITIES.map((a) => ({
  id: a,
  label: TAB[a],
  tint: ABILITY_TINT[a],
  known: () => knowsAbility(a),
  wait: () => yun.wait[a],
  full: () => Math.max(0.01, yun.waitFull[a]),
  affordable: () => affordable(a),
  cast: (wide: boolean) => cast(a, wide),
  evolved: () => abilityEvolved(a),
}));

/** the colour each ability lights the touch buttons in */
export const abilityColor = (a: YunAbility) => hex(ABILITY_TINT[a]);
