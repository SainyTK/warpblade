import { COMBO } from "../../../constants/combat";
import { frame } from "../../../constants/hero";
import { createGlint } from "../../../game/effects/flash";
import { isFree, setState, settle } from "../../../game/hero/actions";
import { comboOpen, endCombo } from "../../../game/hero/combo";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { surfaceBelow } from "../../../game/world";
import { sfx } from "../../../services/audio";
import type { AbilitySlot } from "../../../types/moveset";
import {
  ABILITY_COST,
  ABILITY_TAB,
  BASE_RECHARGE,
  BRYNN_ABILITIES,
  CARRY,
  QUAKE,
  REND,
  SPELL_RECHARGE,
  SPELL_SKILL,
  WIDE_COST,
} from "../constants/abilities";
import { BRYNN_ABILITY_CLIPS } from "../constants/clips/abilities";
import { CRIMSON } from "../constants/colors";
import type { BrynnAbility } from "../types/ability";
import { createFloorWave } from "./effects/floorWave";
import { createQuake } from "./effects/quake";
import { castArc, castCry, castPillars } from "./spells";
import { brynn } from "./state";

/** the state, and so the clip, each ability plays: a cut up out of the floor, or the blade driven down into it */
const CLIP_STATE: Readonly<Record<BrynnAbility, "rend" | "quake">> = {
  rend: "rend",
  quake: "quake",
  arc: "rend",
  pillars: "quake",
  cry: "quake",
};

/** a base ability, or a spell whose skill she holds */
const knows = (a: BrynnAbility): boolean => a === "rend" || a === "quake" || skillLevel(SPELL_SKILL[a]) > 0;

/** an ability's own recharge: fixed for the base ones, from the skill for the spells; ability haste shortens it */
function recharge(a: BrynnAbility): number {
  const own =
    a === "rend" || a === "quake" ? BASE_RECHARGE[a] : (skillValues(SPELL_SKILL[a]).recharge ?? SPELL_RECHARGE);
  return own / progress.stats.haste;
}

const castCost = (a: BrynnAbility, wide: boolean): number => ABILITY_COST[a] * (wide ? WIDE_COST : 1);

/** her ability states are under way */
export const casting = (): boolean => hero.state === "rend" || hero.state === "quake";

/** the recharges run down */
export function rechargeAbilities(dt: number): void {
  for (const a of BRYNN_ABILITIES) brynn.cd[a] = Math.max(0, brynn.cd[a] - dt);
}

/**
 * I on `a`: from a free state the ability plays from its wind-up; once a blow of the string has landed it is carried:
 * it goes at once from the swing, harder, and the string is kept for the next J. Held, the wide form.
 */
function cast(a: BrynnAbility, wide: boolean): boolean {
  const h = hero;
  const carried = h.state === "move" && comboOpen(1);
  if (!carried && !isFree()) return false;
  if (h.mp < castCost(a, false)) return false;
  const full = wide && h.mp >= castCost(a, true);
  h.mp -= castCost(a, full);
  brynn.cd[a] = recharge(a);
  brynn.cdFull[a] = brynn.cd[a];
  brynn.casting = a;
  brynn.wide = full;
  brynn.power = carried ? CARRY.power : 1;
  brynn.carry = carried ? h.chain : 0;
  h.move = null;
  h.queued = null;
  endCombo(false);
  setState(CLIP_STATE[a]);
  // carried out of the swing, the ability skips its wind-up and leaves the blade a frame later
  if (carried) h.st = BRYNN_ABILITY_CLIPS[CLIP_STATE[a]].hit - frame(1);
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** Brynn's abilities on I, in the order O turns through them */
export const BRYNN_SLOTS: readonly AbilitySlot[] = BRYNN_ABILITIES.map((a) => ({
  id: a,
  label: ABILITY_TAB[a],
  known: () => knows(a),
  wait: () => brynn.cd[a],
  full: () => Math.max(0.01, brynn.cdFull[a]),
  affordable: () => hero.mp >= ABILITY_COST[a],
  cast: (wide: boolean) => cast(a, wide),
  evolved: () => a !== "rend" && a !== "quake" && skillEvolved(SPELL_SKILL[a]),
}));

/** Rend: a crimson wave runs along the floor from the blade, both ways in its wide form */
function releaseRend(power: number, wide: boolean): void {
  const h = hero;
  const floor = surfaceBelow(h.x, h.y);
  const damage = progress.stats.ap * REND.power * power;
  for (const face of wide ? [h.face, -h.face] : [h.face])
    game.fx.push(
      createFloorWave({
        x: h.x + face * 12,
        y: floor,
        face,
        reach: REND.reach,
        speed: REND.speed,
        damage,
        launch: REND.launch,
        source: "abilities",
        kind: "rend",
      }),
    );
}

/** Quake: the floor round her heaves and throws foes up; the wide form reaches farther and shakes again after */
function releaseQuake(power: number, wide: boolean): void {
  const h = hero;
  const floor = surfaceBelow(h.x, h.y);
  const reach = wide ? QUAKE.wideReach : QUAKE.reach;
  const quake = {
    x: h.x + h.face * 8,
    y: floor,
    reach,
    damage: progress.stats.ap * QUAKE.power * power,
    delay: 0,
    launch: QUAKE.launch,
    height: QUAKE.height,
    source: "abilities" as const,
  };
  game.fx.push(createQuake(quake));
  if (wide) game.fx.push(createQuake({ ...quake, damage: quake.damage * QUAKE.afterShare, delay: QUAKE.after }));
}

/** what each ability lets loose, at its power and in its wide form or not */
const RELEASE: Readonly<Record<BrynnAbility, (power: number, wide: boolean) => void>> = {
  rend: releaseRend,
  quake: releaseQuake,
  arc: castArc,
  pillars: castPillars,
  cry: castCry,
};

/** the ability leaves the blade */
function release(): void {
  const h = hero;
  const hx = h.x + h.face * 14;
  const hy = h.y - 10;
  lights.add(hx, hy, 22, CRIMSON[4], 0.5, 0.2);
  game.fx.push(createGlint(hx, hy, CRIMSON[5]));
  const release = RELEASE[brynn.casting];
  release(brynn.power, brynn.wide);
}

/** play the ability under way: let it loose on its hit frame, and at the end give back the carried string */
export function runAbility(): void {
  const h = hero;
  const clip = BRYNN_ABILITY_CLIPS[h.state as "rend" | "quake"];
  if (h.ground) h.vx = 0;
  if (!h.hitDone && h.st >= clip.hit) {
    h.hitDone = true;
    release();
  }
  if (h.st < clip.dur) return;
  settle();
  if (!brynn.carry) return;
  h.chain = brynn.carry;
  h.link = COMBO.link;
  brynn.carry = 0;
}
