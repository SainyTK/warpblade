import {
  DODGE_GAP_MS,
  HIGH_FOE,
  PICK_PRIORITY,
  SPELL_RANGE,
  STRIKE_REACH,
  ULT_HOLD_MS,
  ULT_RANGE,
  VAULT_GAP_MS,
  WARP_RANGE,
} from "../constants/bot";
import { KEYS } from "../constants/keys";
import type { BotMemory, Intent, Policy } from "../types/bot";
import type { GameSnapshot } from "../types/snapshot";
import { facesHero, foesWithin, hazardAbove, isHigh, isOpen, sideOf, targetFoe, threatOf } from "../utils/foes";
import { directionKey } from "./directionKey";
import { readyMoveKeys, spellChoice, ultimateReady } from "./hudReadiness";

/** spend MP on a spell only while this share of the bar is left */
const SPELL_MP_SHARE = 0.25;
const IDLE: Intent = { hold: [], tap: [] };

function decide(state: GameSnapshot, memory: BotMemory): Intent {
  const { hero, enemies, hud } = state;
  if (memory.now < memory.ultUntil) {
    return { hold: [KEYS.ultimate], tap: [] };
  }
  const foe = targetFoe(hero, enemies, HIGH_FOE);
  if (!foe) {
    return IDLE;
  }
  const side = sideOf(hero, foe);
  const toward = directionKey(side);
  const dx = Math.abs(foe.x - hero.x);
  const threat = threatOf(hero, enemies);
  // L is a dash or a brace, whichever the hero has: taken toward the blow, it passes through or blocks it
  if (threat && memory.now - memory.lastDodge > DODGE_GAP_MS) {
    memory.lastDodge = memory.now;
    return { hold: [directionKey(sideOf(hero, threat))], tap: [KEYS.defend] };
  }
  const hazard = hazardAbove(hero, enemies, HIGH_FOE);
  if (hazard) {
    return { hold: [directionKey(-sideOf(hero, hazard))], tap: [] };
  }
  const near = foesWithin(hero, enemies, ULT_RANGE);
  if (ultimateReady(hud) && (near.length >= 2 || near.some((f) => f.rank !== "minion"))) {
    memory.ultUntil = memory.now + ULT_HOLD_MS;
    return { hold: [KEYS.ultimate], tap: [] };
  }
  const spell = spellChoice(hud);
  if (spell === "cycle") {
    return { hold: [], tap: [KEYS.cycle] };
  }
  if (spell === "cast" && dx < SPELL_RANGE && hero.mp >= hero.maxMp * SPELL_MP_SHARE) {
    return { hold: hero.face === side ? [] : [toward], tap: [KEYS.spell] };
  }
  const moves = readyMoveKeys(hud);
  if (moves.length > 0 && dx > WARP_RANGE.min && dx < WARP_RANGE.max) {
    return { hold: [toward], tap: moves };
  }
  if (isHigh(hero, foe, HIGH_FOE) && dx < STRIKE_REACH && isOpen(foe)) {
    return { hold: [toward], tap: [KEYS.up, KEYS.attack] };
  }
  // a foe on the ground looking at the hero: jump over it and strike its back
  const vault = foe.rank === "minion" && !foe.air && facesHero(hero, foe) && dx < STRIKE_REACH && hero.ground;
  if (vault && memory.now - memory.lastVault > VAULT_GAP_MS) {
    memory.lastVault = memory.now;
    return { hold: [toward], tap: [KEYS.up] };
  }
  const walk = dx > STRIKE_REACH / 2 || hero.face !== side;
  return { hold: walk ? [toward] : [], tap: [KEYS.attack] };
}

/** dodge or brace blows, spells, the ultimate and blows from behind; cards by kind */
export const skilledPolicy: Policy = {
  name: "skilled",
  decide,
  choosePick(cards) {
    for (const kind of PICK_PRIORITY) {
      const card = cards.find((c) => c.kind === kind);
      if (card) {
        return card.index;
      }
    }
    return 0;
  },
};
