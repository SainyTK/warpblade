import { PAL } from "../../../constants/palette";
import {
  BEHIND_STRING,
  DROP_STAB,
  FRONT_STRING,
  KNIFE_BLOWS,
  KNIFE_LINK,
  SPRING,
} from "../../../constants/tallis/knives";
import { SINK } from "../../../constants/tallis/sink";
import { sfx } from "../../../services/audio";
import type { KnifeBlow } from "../../../types/tallis";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { lift } from "../lift";
import { backOpenFoe, flierOverhead } from "./backOpen";
import { tallis } from "./memory";
import { smear } from "./smear";
import { knifeStrike, strikeKnife } from "./strike";
import { throwKnives } from "./thrown";

/** the blow at this place in the string, from where the foes stand: the behind string on a foe's open back */
const blowAt = (index: number): KnifeBlow => (backOpenFoe(game.enemies) ? BEHIND_STRING : FRONT_STRING)[index];

/** the clock of a blow beyond the shared one: attack speed and Quick Knives */
const blowRate = (): number => progress.stats.aspd * (1 + (skillValues("t_quickKnives").speed ?? 0)) - 1;

function startBlow(index: number): void {
  tallis.blow = index;
  tallis.current = blowAt(index);
  tallis.queued = false;
  tallis.struck = false;
  tallis.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("knife");
  sfx.swing(tallis.current === "heelKick" || tallis.current === "gutSlash" ? 0.9 : 1.35);
}

/** the blow strikes on its hit frame */
function strikeNow(): void {
  const blow = tallis.current;
  smear(blow);
  strikeKnife(knifeStrike(blow), struckThisSwing, markStruck);
  throwKnives(blow);
}

/** J on the floor: the next blow of the string, or queue it during one */
export function pressString(): boolean {
  if (hero.state === "knife") {
    tallis.queued = true;
    return true;
  }
  if (!isFree() || !hero.ground) return false;
  if (flierOverhead(game.enemies)) {
    startRisingCut();
    lift(SPRING.rise, false);
    return true;
  }
  startBlow(tallis.link > 0 ? tallis.blow : 0);
  return true;
}

/** the blow under way: it strikes on its hit frame, Heel Kick hops him back after, and a queued press carries on */
export function runString(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  const b = KNIFE_BLOWS[tallis.current];
  if (!tallis.struck && h.st >= b.hit) {
    tallis.struck = true;
    strikeNow();
  }
  h.vx = tallis.struck && b.hop ? (-h.face * b.hop) / Math.max(0.05, b.dur - b.hit) : 0;
  if (h.st < b.dur) return;
  const next = tallis.blow < FRONT_STRING.length - 1 ? tallis.blow + 1 : -1;
  if (tallis.queued && next >= 0) return startBlow(next);
  h.vx = 0;
  settle();
  tallis.blow = next >= 0 ? next : 0;
  tallis.link = next >= 0 ? KNIFE_LINK : 0;
}

/** a blow's recovery after it struck can be cut short by a jump, the Veil or a Sink */
export const inRecovery = (): boolean => hero.state === "knife" && tallis.struck;

/** Heel Kick hops him back after it lands */
export const hopping = (): boolean => hero.state === "knife" && tallis.struck && !!KNIFE_BLOWS[tallis.current].hop;

/** J in the air: Drop Stab, once per airtime */
export function pressDropStab(): boolean {
  if (hero.ground || tallis.dropStabs <= 0) return false;
  if (!isFree()) return false;
  tallis.dropStabs--;
  // Raven Drop: every Drop Stab after a Night Leap is an Ambush
  if (tallis.afterLeap && skillValues("t_nightLeap").raven)
    tallis.ambushLeft = KNIFE_BLOWS.dropStab.dur + DROP_STAB.most;
  tallis.current = "dropStab";
  tallis.struck = false;
  tallis.diving = false;
  newSwing();
  setState("dropStab");
  hero.vy = 0;
  sfx.swing(1.25);
  return true;
}

/** Plunge's shock ring where a Drop Stab lands; Falling Night's ring blinds */
function landingRing(): void {
  const v = skillValues("t_plunge");
  if (!v.ring) return;
  const r = withCharms("area", v.ring);
  game.fx.push(createFloorRing(hero.x, hero.y, r, PAL.gloam, 0.35));
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - hero.x) > r || Math.abs(e.y - hero.y) > 20) continue;
    dealDamage(e, progress.stats.ad * KNIFE_BLOWS.dropStab.power * 0.5, {
      fromX: hero.x,
      kx: Math.sign(e.x - hero.x) * 60,
    });
    if (v.fallingNight && tallis.veil && e.rank === "minion") e.blind = Math.max(e.blind, 2);
  }
}

/** Drop Stab: a tuck, then straight down with both knives under him, striking every foe it passes through */
export function runDropStab(): void {
  const h = hero;
  const b = KNIFE_BLOWS.dropStab;
  if (!tallis.diving) {
    h.vy = 0;
    h.vx = 0;
    if (h.st >= b.hit) tallis.diving = true;
    return;
  }
  h.vx = 0;
  h.vy = DROP_STAB.speed;
  const s = knifeStrike("dropStab", true);
  s.spike = !!skillValues("t_plunge").spike;
  if (!tallis.struck) smear("dropStab");
  tallis.struck = true;
  const landed = strikeKnife(s, struckThisSwing, markStruck);
  if (landed.length && skillValues("t_plunge").jumpBack) {
    tallis.dropStabs = 1;
    lift(24, false);
  }
  if (h.ground) {
    landingRing();
    dust(h.x, h.y, 6);
    shake(0.1, 1.5);
    tallis.diving = false;
    settle();
    return;
  }
  if (h.st >= b.hit + DROP_STAB.most) {
    tallis.diving = false;
    settle();
  }
}

/** a landing gives the airtime's Drop Stab and Night Leaps back */
export function landed(): void {
  tallis.dropStabs = 1;
  tallis.afterLeap = false;
  tallis.leaps = skillValues("t_nightLeap").leaps ?? 0;
}

/** J out of the pool, or just after rising: Rising Cut, an upward slash that throws a minion up */
export function startRisingCut(): void {
  tallis.current = "risingCut";
  tallis.struck = false;
  tallis.risingQueued = false;
  newSwing();
  setState("risingCut");
  hero.vx = 0;
  sfx.swing(0.85);
}

/** Rising Cut strikes on its hit frame, then he settles */
export function runRisingCut(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  const b = KNIFE_BLOWS.risingCut;
  if (!tallis.struck && h.st >= b.hit) {
    tallis.struck = true;
    smear("risingCut");
  }
  // the slash stays live a moment, so a spring carries it up into a flier
  if (tallis.struck && h.st <= b.hit + SPRING.live) strikeKnife(knifeStrike("risingCut"), struckThisSwing, markStruck);
  if (h.st >= b.dur) settle();
}

/** a J now would rise into Rising Cut: in the pool, rising, or just risen */
export const risingCutOpen = (): boolean =>
  hero.state === "sink" || hero.state === "rise" || (isFree() && hero.ground && tallis.sinceRise < SINK.risingWindow);
