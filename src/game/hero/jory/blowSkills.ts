import { COMBO } from "../../../constants/combat";
import { frame } from "../../../constants/hero";
import { KNOCKDOWN, MALLET_BLOWS } from "../../../constants/jory/mallets";
import { PAL } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { BeatJudgement, MalletBlow } from "../../../types/jory";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createAccentRing } from "../../effects/jory/accentRing";
import { createSoundWave } from "../../effects/jory/soundWave";
import { enemyCenter } from "../../enemies/enemy";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress, rng } from "../../state";
import { tier } from "./beat";
import { jory } from "./memory";
import type { MalletStrike } from "./strike";

/** what a skill adds to the first foe a blow reaches: the payoff of a precise press lands on that foe only */
export interface FirstFoe {
  scale: number;
  sureCrit: boolean;
  stun: number;
}

/** Roll's hit frames by the number of strikes (Paradiddle and Blast Beat) */
const ROLL_HITS: Readonly<Record<number, readonly number[]>> = {
  2: MALLET_BLOWS.roll.hits,
  3: [frame(2), frame(5), frame(8)],
  4: [frame(2), frame(5), frame(8), frame(11)],
  6: [frame(2), frame(4), frame(6), frame(8), frame(10), frame(12)],
  8: [frame(2), frame(3), frame(4), frame(5), frame(6), frame(7), frame(8), frame(9)],
};

/** how many times Roll strikes: Paradiddle's three or four, six at Crescendo, Blast Beat's eight */
function rollStrikes(): number {
  const v = skillValues("j_paradiddle");
  if (v.blast) return 8;
  if (v.crescendo && tier() >= 4) return 6;
  return v.strikes ?? 2;
}

/** the hit frames of a blow */
export const blowHits = (blow: MalletBlow): readonly number[] =>
  blow === "roll" ? (ROLL_HITS[rollStrikes()] ?? ROLL_HITS[2]) : MALLET_BLOWS[blow].hits;

/** the blow a J starts at this place in the string: Kick Drum puts a front Kick in place of it on a downbeat press */
export function blowFor(blow: MalletBlow, judged: BeatJudgement): MalletBlow {
  const v = skillValues("j_kickDrum");
  if (!skillLevel("j_kickDrum") || !judged.onBeat) return blow;
  return judged.downbeat || v.fourFloor ? "kick" : blow;
}

/** Swell: every blow deals more for each Groove tier */
const swell = (): number => 1 + (skillValues("j_swell").perTier ?? 0) * tier();

/** a multiple on a blow's power for every foe it reaches */
export function blowScale(s: MalletStrike): number {
  let k = swell();
  if (s.blow === "roll") k *= 1 + (skillValues("j_paradiddle").power ?? 0);
  if (s.blow === "kick") k *= skillValues("j_kickDrum").power ?? 1;
  return k;
}

/** at Crescendo, Swell lets every blow reach further */
export const reachGrow = (): number => (tier() >= 4 ? (skillValues("j_swell").reach ?? 0) : 0);

/** a Kick is an Accent only once Kick Drum's level says so */
export const kickAccents = (): boolean => !!skillValues("j_kickDrum").accent;

/** the payoff of Heavy Accent and Rimshot, on the first foe a blow reaches */
export function firstFoe(s: MalletStrike): FirstFoe {
  const out: FirstFoe = { scale: 1, sureCrit: false, stun: 0 };
  if (s.accent) {
    const v = skillValues("j_accent");
    out.scale += v.power ?? 0;
    if (v.crit && rng.chance(v.crit)) out.sureCrit = true;
    if (v.thunderclap && s.downbeat) out.sureCrit = true;
    if (s.blow === "crash") out.stun = v.stun ?? 0;
  }
  if (s.accent && s.blow === "tap") {
    const r = skillValues("j_rimshot");
    out.scale += r.power ?? 0;
    if (r.crit && rng.chance(r.crit)) out.sureCrit = true;
    if (r.sure && s.downbeat) out.sureCrit = true;
    out.stun = Math.max(out.stun, r.stun ?? 0);
  }
  return out;
}

/** extra stagger on a blow: Heavy Accent's longer stagger on an Accent, Swell's at tier 3 */
export function staggerOf(s: MalletStrike): number {
  let t = COMBO.stagger;
  if (s.accent) t += skillValues("j_accent").stagger ?? 0;
  if (tier() >= 3) t += skillValues("j_swell").stagger ?? 0;
  return t;
}

/** Heavy Accent's guard break: an Accent breaks a guard */
export const accentBreaks = (s: MalletStrike): boolean => s.accent && !!skillValues("j_accent").guard;

/** a ring of sound round a point that strikes every foe in it but one, once */
function ringAt(x: number, y: number, r: number, power: number, skip: Enemy | null): void {
  game.fx.push(createFloorRing(x, hero.y, r, PAL.beat, 0.3));
  for (const e of game.enemies) {
    if (e === skip || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, cy - y) > r) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: x, kx: Math.sign(cx - x) * 30, stagger: COMBO.stagger });
  }
}

/** Rimshot's Gunshot Snare: an on-beat Tap fires a crack straight ahead at the first foe within reach */
function gunshot(power: number): void {
  const reach = 120;
  const target = game.enemies
    .filter((e) => e.hp > 0 && Math.sign(e.x - hero.x) === hero.face && Math.abs(e.x - hero.x) <= reach)
    .filter((e) => Math.abs(enemyCenter(e)[1] - (hero.y - 18)) < 24)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0];
  if (!target) return;
  const [cx, cy] = enemyCenter(target);
  game.fx.push(createAccentRing(cx, cy));
  dealDamage(target, progress.stats.ad * power, { fromX: hero.x, kx: hero.face * 60, heavy: true, melee: false });
}

/** what happens after a mallet blow lands on a foe: the rings, waves and statuses his attack skills add */
export function afterMalletHit(e: Enemy, s: MalletStrike, at: { first: boolean; kill: boolean }): void {
  const [cx, cy] = enemyCenter(e);
  const accent = skillValues("j_accent");
  if (s.accent && at.first && accent.ring) ringAt(cx, cy, withCharms("area", accent.ring), 0.4, e);
  if (s.accent && at.first && accent.thunderclap && s.downbeat) ringAt(cx, cy, withCharms("area", 50), 0.9, e);
  const rim = skillValues("j_rimshot");
  if (s.accent && s.blow === "tap" && at.first && rim.gunshot && !s.repeat) gunshot(rim.gunshot);
  const kick = skillValues("j_kickDrum");
  if (s.blow === "kick" && at.first && kick.thump)
    ringAt(hero.x + hero.face * 10, hero.y - 8, withCharms("area", kick.thump), 0.5, e);
  if (s.blow === "kick" && kick.elite && e.elite && e.hp > 0) e.stun = Math.max(e.stun, 0.6);
  const swellV = skillValues("j_swell");
  if (swellV.fortissimo && tier() >= 4 && at.first) ringAt(cx, cy, withCharms("area", 30), 0.3, e);
  const para = skillValues("j_paradiddle");
  if (s.blow === "roll" && at.first && para.chain) chainHit(e, para.chain);
  if (s.blow === "roll" && para.blast) drawIn(cx);
}

/** Paradiddle: each Roll strike chains on to the next foe near the first */
function chainHit(from: Enemy, power: number): void {
  const [fx, fy] = enemyCenter(from);
  const next = game.enemies
    .filter((e) => e !== from && e.hp > 0)
    .map((e) => ({ e, d: Math.hypot(enemyCenter(e)[0] - fx, enemyCenter(e)[1] - fy) }))
    .filter((c) => c.d < 40)
    .sort((a, b) => a.d - b.d)[0];
  if (!next) return;
  dealDamage(next.e, progress.stats.ad * power, {
    fromX: fx,
    kx: Math.sign(next.e.x - fx) * 10,
    stagger: COMBO.stagger,
  });
  const [nx, ny] = enemyCenter(next.e);
  game.fx.push(createAccentRing(nx, ny));
}

/** Blast Beat: the flurry draws minions within 30 px in toward the struck point */
function drawIn(x: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.rank !== "minion" || e.air) continue;
    const d = x - e.x;
    if (Math.abs(d) > 30 || Math.abs(d) < 6) continue;
    e.vx += Math.sign(d) * 60;
  }
}

/** Crash's sound wave as his tier and Crash Wave shape it */
export interface CrashWave {
  reach: number;
  power: number;
  height: number;
  /** passes through every foe; otherwise it stops at the first */
  pierce: boolean;
  knockdown: boolean;
  bounce: boolean;
  /** seconds a foe it passes is slowed */
  slow: number;
}

/** Crash's sound wave: from tier 3 on his own, from tier 1 with Crash Wave; null for none */
export function crashWave(tierReach: number, tierPower: number, tierHeight: number): CrashWave | null {
  const v = skillValues("j_crashWave");
  const held = skillLevel("j_crashWave") > 0;
  if (!held && tierReach <= 0) return null;
  const own = tierReach > 0;
  return {
    reach: v.wall ? W : withCharms("area", Math.max(tierReach, v.reach ?? 0)),
    power: Math.max(tierPower, v.power ?? 0),
    height: Math.max(tierHeight, v.height ?? 0),
    pierce: own || !!v.pierce || !!v.wall,
    knockdown: tier() >= 4 || !!v.wall,
    bounce: !!v.bounce || !!v.wall,
    slow: v.slow ?? 0,
  };
}

/** Crash Wave's echo: a second wave on the next beat at tier 3 */
export function crashEcho(): boolean {
  return !!skillValues("j_crashWave").echo && tier() >= 3;
}

/** a second wave one beat later, from where the Crash landed */
export function sendEchoWave(x: number, dir: number, reach: number, power: number): void {
  let wait = jory.beatLen;
  game.fx.push({
    update(dt) {
      wait -= dt;
      if (wait > 0) return true;
      game.fx.push(
        createSoundWave({
          x,
          floor: hero.y,
          dir,
          reach,
          speed: 300,
          damage: progress.stats.ad * power,
          height: 20,
          stagger: COMBO.stagger,
          launch: KNOCKDOWN,
        }),
      );
      return false;
    },
    draw() {},
  });
}
