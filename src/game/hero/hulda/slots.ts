import { BELLOW } from "../../../constants/hulda/bellow";
import { RUSH } from "../../../constants/hulda/rush";
import { TAUNT } from "../../../constants/hulda/taunt";
import type { HuldaAbility } from "../../../types/hulda";
import type { AbilitySlot } from "../../../types/moveset";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { bellowMp, pressBellow } from "./bellow";
import { pressChain } from "./ironChain";
import { pressBrace } from "./ironWall";
import { hulda } from "./memory";
import { pressRush, rushAgainReady, rushCost } from "./rush";
import { pressSkyfall } from "./skyfall";
import { pressTaunt } from "./taunt";
import { pressStomp } from "./tremorStomp";

/** a spell skill on I: known once held, paid with MP, its recharge from its level */
function spellSlot(id: HuldaAbility, label: string, wait: () => number, press: () => boolean): AbilitySlot {
  return {
    id,
    label,
    known: () => skillLevel(id) > 0,
    wait,
    full: () => Math.max(0.01, skillValues(id).cooldown ?? 1),
    affordable: () => hero.mp >= (skillValues(id).mp ?? 0),
    cast: press,
    evolved: () => skillEvolved(id),
  };
}

/**
 * Bull Rush: the armoured charge on the floor (held, a longer one) and Skyfall Grab in the air. Stampede's free rush
 * in the skid is ready at once.
 */
const RUSH_TAB: AbilitySlot = {
  id: "rush",
  label: "RUSH",
  tint: "var(--rust)",
  known: () => true,
  wait: () => (rushAgainReady() ? 0 : hulda.rushCd),
  full: () => RUSH.cooldown,
  affordable: () => (hero.ground ? hero.stamina >= rushCost() || rushAgainReady() : !hulda.airGrabbed),
  cast: (wide) => (hero.ground ? pressRush(wide) : pressSkyfall()),
  cost: () => `${Math.round(rushCost())}ST`,
};

/** Bellow: the roar that drags foes in; held, a wider roar that pulls harder for more MP */
const BELLOW_TAB: AbilitySlot = {
  id: "bellow",
  label: "BELLOW",
  known: () => true,
  wait: () => hulda.bellowCd,
  full: () => BELLOW.cooldown,
  affordable: () => hero.mp >= bellowMp(false),
  cast: pressBellow,
};

/** the taunt: two chest slaps for Grit, free */
const TAUNT_TAB: AbilitySlot = {
  id: "taunt",
  label: "TAUNT",
  tint: "#e0ac48",
  known: () => true,
  wait: () => hulda.tauntCd,
  full: () => TAUNT.cooldown,
  affordable: () => true,
  cast: pressTaunt,
};

/** Hulda's abilities on I in the order O turns through them: Bull Rush, Bellow and the taunt, then her spell skills */
export const HULDA_SLOTS: readonly AbilitySlot[] = [
  RUSH_TAB,
  BELLOW_TAB,
  TAUNT_TAB,
  spellSlot("h_ironChain", "CHAIN", () => hulda.chainCd, pressChain),
  spellSlot("h_tremorStomp", "STOMP", () => hulda.stompCd, pressStomp),
  spellSlot("h_ironWall", "WALL", () => hulda.wallCd, pressBrace),
];
