import { GLOAM } from "../../../constants/tallis/gloam";
import type { Enemy } from "../../../types/enemy";
import type { KnifeBlow } from "../../../types/tallis";
import { dealDamage } from "../../damage";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { feat } from "../../feat";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress, rng } from "../../state";
import { addGloam } from "./gloam";
import { isMarked } from "./marks";
import { tallis } from "./memory";
import type { KnifeStrike } from "./strike";
import { keepVeil, raiseVeil, veilStruck } from "./veil";

/** what a landed knife blow did, for the skills that answer it */
export interface KnifeHit {
  back: boolean;
  ambush: boolean;
  kill: boolean;
  /** the blow's power on this foe, as a multiple of attack damage */
  power: number;
}

/** the blows of his ground strings, which Quick Knives quickens and strengthens */
const STRING_BLOWS: ReadonlySet<KnifeBlow> = new Set(["flick", "cross", "heelKick", "backstab", "twist", "gutSlash"]);

/** the last blow of either string */
const LAST_BLOWS: ReadonlySet<KnifeBlow> = new Set(["heelKick", "gutSlash"]);

/** a blow's power from the skills that shape it */
export function blowScale(blow: KnifeBlow): number {
  let k = 1;
  if (STRING_BLOWS.has(blow)) k *= 1 + (skillValues("t_quickKnives").power ?? 0);
  if (blow === "heelKick") k *= 1 + (skillValues("t_turnabout").power ?? 0);
  if (blow === "dropStab") {
    k *= 1 + (skillValues("t_plunge").power ?? 0);
    if (tallis.afterLeap) k *= 1 + (skillValues("t_nightLeap").drop ?? 0);
  }
  if (blow === "risingCut") {
    const v = skillValues("t_sink");
    k *= (1 + (v.rising ?? 0)) * (1 + (v.power ?? 0));
  }
  return k;
}

/** an Ambush's share more: Ambush raises it */
export const ambushPower = (): number => skillValues("t_ambush").power ?? 0;

/** Last Breath: a blow from behind fells a weakened minion or elite and hits a weakened mini boss three times as hard */
export function executes(e: Enemy): number {
  if (!skillValues("t_backbiter").lastBreath || e.hp > e.max * 0.25 || e.rank === "boss") return 1;
  return e.rank === "mini" ? 3 : 1000;
}

/** Bleed from Open Veins, on a blow from behind or any blow once its level says so */
function openVeins(e: Enemy, back: boolean): void {
  const v = skillValues("t_openVeins");
  if (!v.damage || (!back && !v.front)) return;
  addStacks(e, "t_openVeins", {
    stacks: 1,
    max: v.max,
    damage: progress.stats.ad * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  });
  if (v.slow) e.chill = Math.max(e.chill, 1);
}

/** Nightshade on the last blow of a string */
export function nightshade(e: Enemy, full = false): void {
  const v = skillValues("t_nightshade");
  if (!v.damage) return;
  addStacks(e, "t_nightshade", {
    stacks: full ? v.max : v.stacks,
    max: v.max,
    damage: progress.stats.ap * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  });
  if (v.slow) e.chill = Math.max(e.chill, 1);
}

/** a bleed from Backbiter's Gut Slash or Cut Tendon's Hamstring, under the skill's own name */
export function bleed(e: Enemy, source: string): void {
  addStacks(e, source, {
    stacks: 2,
    max: 6,
    damage: progress.stats.ad * 0.15,
    every: 1,
    duration: withCharms("duration", 3),
  });
}

/** Ink Wound: an Ambush leaves Ink on its foe, and Spreading Night on every foe near it */
function ink(e: Enemy): void {
  const v = skillValues("t_inkWound");
  if (!v.damage) return;
  const spec = {
    stacks: 1,
    max: 1,
    damage: progress.stats.ad * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  };
  addStacks(e, "t_inkWound", spec);
  if (v.slow) e.chill = Math.max(e.chill, withCharms("duration", v.life));
  if (!v.spreading) return;
  for (const o of game.enemies) if (o !== e && o.hp > 0 && Math.abs(o.x - e.x) < 60) addStacks(o, "t_inkWound", spec);
}

/** Turnabout: Heel Kick spins a minion round so its back is to him, and dazes it */
function turnabout(e: Enemy): void {
  const v = skillValues("t_turnabout");
  if (!v.chance) return;
  const turn = (f: Enemy) => {
    f.face = Math.sign(f.x - hero.x) || f.face;
    f.turn = -(v.hold ?? 0);
    if (v.daze) f.stun = Math.max(f.stun, v.daze);
  };
  if (v.pirouette) {
    for (const f of game.enemies) if (f.hp > 0 && f.rank !== "boss" && Math.abs(f.x - hero.x) <= 30) turn(f);
    return;
  }
  if (e.rank !== "minion" || (e.elite && !v.elites) || !rng.chance(v.chance)) return;
  turn(e);
}

/** an Ambush landed: its stun, its cleave, its Ink, and a kill that keeps or raises the Veil */
function ambushLanded(e: Enemy, hit: KnifeHit): void {
  const v = skillValues("t_ambush");
  emitSkillEvent({ type: "ambush", foe: e });
  if (v.stun) e.stun = Math.max(e.stun, v.stun);
  if (v.gloam) addGloam(v.gloam);
  ink(e);
  if (v.cleave)
    for (const o of game.enemies)
      if (o !== e && o.hp > 0 && Math.abs(o.x - e.x) <= v.cleave)
        dealDamage(o, progress.stats.ad * hit.power * 0.5, { fromX: hero.x, melee: true, kx: hero.face * 30 });
  if (!hit.kill) return;
  if (v.keep) keepVeil();
  if (v.nightHunter && !tallis.veil) raiseVeil("free");
}

/** a blow from behind: Gloam back, the foe's turn held back, a kill counted toward Knife in the Dark */
function fromBehind(e: Enemy, hit: KnifeHit): void {
  const markGloam = isMarked(e) && skillValues("t_markDusk").gloam ? 2 : 1;
  addGloam(GLOAM.backBlow * markGloam);
  // a foe struck from behind cannot turn until a moment after the last such blow; Backbiter lengthens it
  e.turn = -(skillValues("t_backbiter").slow ?? 0);
  if (hit.kill) {
    addGloam(GLOAM.backKill + (skillValues("t_backbiter").refund ?? 0));
    countBackKill();
  }
  emitSkillEvent({ type: "backstab", foe: e, kill: hit.kill });
}

/** one more foe felled from behind this run */
export function countBackKill(): void {
  tallis.backKills++;
  feat({ kind: "backKills", kills: tallis.backKills });
}

/** what a landed knife blow sets off: Gloam, bleeds and poisons, the Ambush, Turnabout, thrown knives */
export function afterKnifeHit(e: Enemy, s: KnifeStrike, hit: KnifeHit): void {
  // Falling Night: a Drop Stab from the Veil keeps it
  const keeps = s.blow === "dropStab" && !!skillValues("t_plunge").fallingNight;
  // Quiet Step: blows from the Veil give Gloam back
  if (tallis.veil) addGloam(skillValues("t_quietStep").refund ?? 0);
  if (tallis.veil && !keeps) veilStruck();
  if (hit.back) fromBehind(e, hit);
  if (hit.ambush) ambushLanded(e, hit);
  openVeins(e, hit.back);
  const veins = skillValues("t_openVeins").gloam;
  if (veins && stacksOf(e, "t_openVeins") > 0) addGloam(veins);
  if (LAST_BLOWS.has(s.blow)) nightshade(e);
  if (s.blow === "risingCut" && skillValues("t_nightshade").rising) nightshade(e);
  if (s.blow === "heelKick") {
    turnabout(e);
    const stagger = skillValues("t_turnabout").stagger;
    if (stagger) e.stagger = Math.max(e.stagger, stagger);
  }
  const bite = skillValues("t_backbiter");
  if (s.blow === "backstab" && bite.twice && e.hp > 0)
    dealDamage(e, progress.stats.ad * hit.power, { fromX: e.x - e.face * 6, melee: true, sureCrit: hit.ambush });
  if (s.blow === "gutSlash" && bite.bleed) bleed(e, "t_backbiter");
}
