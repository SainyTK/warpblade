import { drawCastRing } from "../../../game/effects/castRing";
import { createGlint } from "../../../game/effects/flash";
import { isFree, setState, settle } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { deny } from "../../../game/hero/deny";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import type { AbilitySlot } from "../../../types/moveset";
import {
  ABILITY_COLOR,
  ABILITY_COST,
  BASE_RECHARGE,
  SPELL_RECHARGE,
  SPELL_SKILL,
  STITCH,
  VESPER_ABILITIES,
  WEAVE,
  WIDE_COST,
} from "../constants/abilities";
import type { VesperAbility } from "../types/ability";
import { clipOf } from "./abilityClip";
import { castCrescent } from "./crescent";
import { castGale } from "./spells/gale";
import { castMoon } from "./spells/moon";
import { castThread } from "./spells/thread";
import { vesper } from "./state";
import { startStitch, stitchTargets } from "./stitch";

/** the flare at her hands as an ability leaves them */
const CAST_LIGHT = { radius: 22, strength: 0.4 } as const;

type Spell = Exclude<VesperAbility, "crescent" | "stitch">;
const isSpell = (a: VesperAbility): a is Spell => a !== "crescent" && a !== "stitch";

/** she has an ability when it is a base one or its spell's skill is held */
const knows = (a: VesperAbility): boolean => !isSpell(a) || skillLevel(SPELL_SKILL[a]) > 0;
const evolved = (a: VesperAbility): boolean => isSpell(a) && skillEvolved(SPELL_SKILL[a]);
const cost = (a: VesperAbility, wide: boolean): number => ABILITY_COST[a] * (wide ? WIDE_COST : 1);

/** an ability's own recharge: fixed for the base two, from its skill for a spell; spell haste shortens it */
function recharge(a: VesperAbility): number {
  const own = isSpell(a) ? (skillValues(SPELL_SKILL[a]).recharge ?? SPELL_RECHARGE) : BASE_RECHARGE[a];
  return own / progress.stats.haste;
}

export function rechargeAbilities(dt: number): void {
  for (const a of VESPER_ABILITIES) vesper.cd[a] = Math.max(0, vesper.cd[a] - dt);
}

/** her cancel rule: a blow of the string has landed and its follow-through has started, or the link to the next press is
 *  still open, so I casts at once and the string goes on after */
const weaveOpen = (): boolean => (hero.state === "move" && blowsDone()) || (hero.link > 0 && hero.chain > 0);

/** I on an ability: from a free state, or woven into the string after a blow has landed */
function cast(a: VesperAbility, wideAsked: boolean): boolean {
  const woven = weaveOpen();
  if (!woven && !isFree()) return false;
  if (hero.mp < cost(a, false)) return false;
  const wide = wideAsked && hero.mp >= cost(a, true);
  if (a === "stitch") {
    const foes = stitchTargets(wide ? STITCH.wideReach : STITCH.reach, wide ? STITCH.wideMost : STITCH.most);
    if (!foes.length) {
      deny("cast");
      return true;
    }
    startStitch(foes, 1);
  }
  if (a === "thread" && !castThread(1, wide)) {
    deny("cast");
    return true;
  }
  const chain = hero.chain;
  hero.mp -= cost(a, wide);
  vesper.cd[a] = recharge(a);
  vesper.cdFull[a] = vesper.cd[a];
  vesper.casting = a;
  vesper.wide = wide;
  hero.move = null;
  hero.queued = null;
  setState(a === "stitch" ? "stitch" : "weave");
  // the string waits through the ability and goes on after it
  hero.chain = woven ? chain : 0;
  hero.link = woven ? clipOf(a, wide).dur + WEAVE.link : 0;
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** the ability leaves her hands */
function release(a: VesperAbility, wide: boolean): void {
  if (a === "crescent") castCrescent(1, wide);
  else if (a === "moon") castMoon(1, wide);
  else if (a === "gale") castGale(1, wide);
}

/** each ability's HUD tab */
const TAB: Readonly<Record<VesperAbility, string>> = {
  crescent: "CRESCENT",
  stitch: "STITCH",
  moon: "MOON",
  gale: "GALE",
  thread: "THREAD",
};
const css = (a: VesperAbility): string => `#${ABILITY_COLOR[a].toString(16).padStart(6, "0")}`;

/** Vesper's abilities on I, in the order O turns through them */
export const VESPER_SLOTS: readonly AbilitySlot[] = VESPER_ABILITIES.map((a) => ({
  id: a,
  label: TAB[a],
  tint: css(a),
  known: () => knows(a),
  wait: () => vesper.cd[a],
  full: () => Math.max(0.01, vesper.cdFull[a]),
  affordable: () => hero.mp >= ABILITY_COST[a],
  cast: (wide: boolean) => cast(a, wide),
  evolved: () => evolved(a),
}));

/** an ability under way (the stitch runs its own state): it leaves her hands on its clip's hit frame, then she settles */
export function runWeave(): void {
  const h = hero;
  const clip = clipOf(vesper.casting, vesper.wide);
  if (h.ground) h.vx = 0;
  if (!h.hitDone && h.st >= clip.hit) {
    h.hitDone = true;
    const hx = h.x + h.face * 10;
    const hy = h.y - 20;
    lights.add(hx, hy, CAST_LIGHT.radius, ABILITY_COLOR[vesper.casting], CAST_LIGHT.strength, 0.2);
    game.fx.push(createGlint(hx, hy, ABILITY_COLOR[vesper.casting]));
    release(vesper.casting, vesper.wide);
  }
  if (h.st >= clip.dur) settle();
}

/** the rune ring at her hands while a spell gathers, in its colour */
export function drawWeave(): void {
  if (hero.state !== "weave" || !isSpell(vesper.casting)) return;
  const clip = clipOf(vesper.casting, vesper.wide);
  if (hero.st >= clip.hit) return;
  drawCastRing(ABILITY_COLOR[vesper.casting], hero.st / clip.hit);
}
