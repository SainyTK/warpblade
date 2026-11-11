import { COMBO } from "../../../constants/combat";
import { TEMPO_BPM } from "../../../constants/jory/beat";
import {
  CRASH_CANCEL,
  CRASH_REACH,
  CRASH_WAVE,
  DOWNSTROKE,
  KNOCKDOWN,
  MALLET_BLOWS,
  MALLET_CANCEL,
  MALLET_LINK,
  MALLET_STRING,
} from "../../../constants/jory/mallets";
import { sfx } from "../../../services/audio";
import type { BeatJudgement, MalletBlow } from "../../../types/jory";
import { createSoundWave } from "../../effects/jory/soundWave";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { lift } from "../lift";
import { judge, tier } from "./beat";
import {
  accentBreaks,
  blowFor,
  blowHits,
  crashEcho,
  crashWave,
  kickAccents,
  reachGrow,
  sendEchoWave,
  staggerOf,
} from "./blowSkills";
import { jory } from "./memory";
import { smear } from "./smear";
import { type MalletStrike, malletBox, strikeMallets } from "./strike";

/** his combo clips play faster with the tempo, so a blow played through lasts one beat at any tier */
export const attackRate = (): number => TEMPO_BPM[tier() - 1] / TEMPO_BPM[0];

/** the clock of a blow beyond the shared one: attack speed and the tempo */
const blowRate = (): number => progress.stats.aspd * attackRate() - 1;

/** the strike of the blow under way */
function currentStrike(): MalletStrike {
  const blow = jory.current;
  const spec = MALLET_BLOWS[blow];
  const s: MalletStrike = {
    blow,
    box: blow === "crash" ? { ...spec.box, far: CRASH_REACH[tier() - 1] } : spec.box,
    power: spec.power,
    kx: spec.kx,
    heavy: !!spec.heavy,
    launch: blow === "kick" ? (skillValues("j_kickDrum").launch ?? spec.launch) : spec.launch,
    stagger: COMBO.stagger,
    feel: spec.feel,
    accent: jory.accent && (blow !== "kick" || kickAccents()),
    downbeat: jory.downbeat,
    repeat: jory.hits > 0,
  };
  s.stagger = staggerOf(s);
  if (accentBreaks(s)) s.heavy = true;
  if (blow === "roll" && skillValues("j_paradiddle").shred) s.heavy = true;
  return s;
}

function startBlow(index: number, judged: BeatJudgement): void {
  jory.blow = index;
  jory.current = blowFor(MALLET_STRING[index], judged);
  jory.accent = judged.onBeat;
  jory.downbeat = judged.downbeat;
  jory.queued = false;
  jory.hits = 0;
  jory.struckAt = -1;
  jory.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("mallet");
  sfx.swing(MALLET_BLOWS[jory.current].feel.pitch);
}

/** Crash's sound wave along the floor: from tier 3, or from tier 1 with Crash Wave */
function sendCrashWave(): void {
  const t = tier() - 1;
  const wave = crashWave(CRASH_WAVE.reach[t], CRASH_WAVE.power[t], CRASH_WAVE.height);
  if (!wave) return;
  const x = hero.x + hero.face * 10;
  game.fx.push(
    createSoundWave({
      x,
      floor: hero.y,
      dir: hero.face,
      reach: wave.reach,
      speed: CRASH_WAVE.speed,
      damage: progress.stats.ad * wave.power,
      height: wave.height,
      stagger: COMBO.stagger,
      launch: wave.knockdown ? KNOCKDOWN : undefined,
      bounce: wave.bounce,
      stops: !wave.pierce,
      slow: wave.slow,
    }),
  );
  if (crashEcho()) sendEchoWave(x, hero.face, wave.reach, wave.power);
}

/** one hit frame of the blow under way */
function strikeNow(): void {
  const s = currentStrike();
  smear(s.blow, jory.hits, s.accent);
  if (jory.struckAt < 0) jory.struckAt = jory.clock;
  strikeMallets(s, malletBox(s.box, reachGrow()), struckThisSwing, markStruck);
  jory.hits++;
  // Roll strikes again: every hit of a blow is a fresh swing, so the same foe takes each
  newSwing();
  if (s.blow === "crash") {
    dust(hero.x + hero.face * 12, hero.y, 6);
    sendCrashWave();
  }
}

/** the share of the clip after which a queued J starts the next blow */
const cancelAt = (blow: MalletBlow): number =>
  blow === "crash" ? CRASH_CANCEL : MALLET_BLOWS[blow].dur * MALLET_CANCEL;

/** J on the floor: the next blow of the string, or queue it during one */
export function pressString(): boolean {
  if (hero.state === "mallet") {
    if (jory.queued) return true;
    // a press before the blow under way has struck counts as off the beat, so mashing never builds Groove
    const judged = judge("J", jory.struckAt < 0);
    jory.queued = true;
    jory.queuedAccent = judged.onBeat;
    jory.queuedDownbeat = judged.downbeat;
    return true;
  }
  if (!isFree() || !hero.ground) return false;
  startBlow(jory.link > 0 ? jory.blow : 0, judge("J"));
  return true;
}

/** the blow under way: it strikes on its hit frames, and a queued press carries on */
export function runString(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  h.vx = 0;
  const b = MALLET_BLOWS[jory.current];
  const hits = blowHits(jory.current);
  if (jory.hits < hits.length && h.st >= hits[jory.hits]) strikeNow();
  const next = jory.blow < MALLET_STRING.length - 1 ? jory.blow + 1 : 0;
  if (jory.queued && jory.hits >= hits.length && h.st >= cancelAt(jory.current))
    return startBlow(next, { onBeat: jory.queuedAccent, downbeat: jory.queuedDownbeat });
  if (h.st < b.dur) return;
  settle();
  jory.blow = next;
  jory.link = next > 0 ? MALLET_LINK * jory.beatLen : 0;
}

/** a blow's recovery after it struck can be cut short by a jump, a Boom or a Beat Step */
export const inRecovery = (): boolean => hero.state === "mallet" && jory.struckAt >= 0;

/** the link runs down while he is out of the string; once it lapses the next J starts a new string */
export function tickLink(dt: number): void {
  if (hero.state === "mallet") return;
  jory.link = Math.max(0, jory.link - dt);
  if (jory.link <= 0 && hero.state !== "downstroke") hero.chain = 0;
}

/** J in the air: Downstroke, once per airtime */
export function pressDownstroke(): boolean {
  if (hero.ground || jory.downstrokes <= 0 || !isFree()) return false;
  const judged = judge("J");
  jory.downstrokes--;
  jory.current = "downstroke";
  jory.accent = judged.onBeat;
  jory.downbeat = judged.downbeat;
  jory.hits = 0;
  jory.struckAt = -1;
  newSwing();
  setState("downstroke");
  sfx.swing(MALLET_BLOWS.downstroke.feel.pitch);
  return true;
}

/**
 * Downstroke: a tuck with both mallets raised that hangs a frame at the top, then both mallets driven down under him.
 * On the beat a blow that lands bounces him up.
 */
export function runDownstroke(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  const b = MALLET_BLOWS.downstroke;
  if (jory.hits === 0) {
    h.vx *= 0.9;
    if (h.st < b.hits[0]) {
      h.vy = Math.min(h.vy, 0);
      return;
    }
    jory.hits = 1;
    jory.struckAt = jory.clock;
    smear("downstroke", 0, jory.accent);
    h.vy = DOWNSTROKE.fall;
  }
  const landed = strikeMallets(currentStrike(), malletBox(b.box), struckThisSwing, markStruck);
  if (landed.length && jory.accent) {
    h.vy = 0;
    lift(DOWNSTROKE.bounce, false);
  }
  if (h.ground) {
    dust(h.x, h.y, 5);
    shake(0.08, 1);
    settle();
    return;
  }
  if (h.st >= b.dur) settle();
}

/** a landing gives the airtime's Downstroke and air step back */
export function landed(): void {
  jory.downstrokes = 1;
  jory.airStep = true;
  jory.leaps = 0;
}
