import { BEAT, GROOVE, TEMPO_BPM } from "../../../constants/jory/beat";
import { PACE } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { InputAction } from "../../../types/input";
import type { BeatButton, BeatJudgement } from "../../../types/jory";
import { beatSeconds, offBeat, tierOf } from "../../../utils/beat";
import { heroSlot } from "../../coopHooks";
import { feat } from "../../feat";
import { pressAge } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { jory } from "./memory";

/** the action behind each judged button */
const ACTIONS: Readonly<Record<BeatButton, InputAction>> = { J: "attack", K: "warp", L: "dash", I: "cast" };
const STAMPS = { J: "stampJ", K: "stampK", L: "stampL", I: "stampI" } as const;

/** his Groove tier now, 1 to 4 */
export const tier = (): number => tierOf(jory.groove);

/** how far through the beat under way he is, 0 just after a beat to 1 just before the next */
export const beatShare = (): number => Math.min(1, jory.phase / jory.beatLen);

/** the beat just played opened a bar */
export const onDownbeat = (): boolean => jory.beats % BEAT.bar === 0;

/** Groove cannot fall: Steady Hand's beats, and Grand Finale's locked Crescendo */
const held = (): boolean => jory.steadyBeats > 0 || jory.lockBeats > 0;

/** change Groove by a whole number; a loss blinks the lost pips grey, a new tier sounds and tells the skills */
export function addGroove(amount: number): void {
  if (amount < 0 && held()) return;
  const before = jory.groove;
  const after = Math.max(0, Math.min(GROOVE.max, before + amount));
  if (after === before) return;
  if (after < before) {
    jory.lostFrom = Math.max(jory.lostFrom, before);
    jory.lostBlink = GROOVE.blink;
  }
  jory.groove = after;
  const from = tierOf(before);
  const to = tierOf(after);
  if (to === from) return;
  if (to > from) sfx.tierUp();
  emitSkillEvent({ type: "tier", from, to });
}

/** at least this much Groove (Drumroll leaves him at tier 3) */
export function raiseGroove(least: number): void {
  if (jory.groove < least) addGroove(least - jory.groove);
}

/** the window of a press: wider with Steady Hand and Encore, and wider for a guest seat whose keys come late */
function windowNow(): number {
  const encore = skillValues("j_encore").window ?? 0;
  const own = (jory.steadyBeats > 0 ? BEAT.steadyWindow : BEAT.window) + encore;
  return heroSlot() > 0 ? Math.max(own, BEAT.guestWindow + encore) : own;
}

/** the beat-clock time a button's waiting press was made, or now when it came this step */
const stampOf = (button: BeatButton): number => {
  const at = jory[STAMPS[button]];
  return at >= 0 ? at : jory.clock;
};

/** where a press made at this beat-clock time fell: on the beat or not, and whether the beat it was nearest opened a bar */
function placeOf(at: number): BeatJudgement {
  const lag = heroSlot() > 0 ? BEAT.guestLag : 0;
  const phase = jory.phase - (jory.clock - at) - lag;
  const off = offBeat(phase, jory.beatLen);
  // a late press is nearest the beat already played; an early one, the beat to come
  const lateBy = Math.floor(phase / jory.beatLen);
  const nearest = jory.beats + lateBy + (off < 0 ? 1 : 0);
  return { onBeat: Math.abs(off) <= windowNow(), downbeat: nearest % BEAT.bar === 0 };
}

/** a press right now would fall on the beat: for Up, which is never judged */
export const onBeatNow = (): boolean => placeOf(jory.clock).onBeat;

/**
 * Judge a press of J, K, L or I: on the beat it adds a pip of Groove and a thump, off the beat it costs Groove and a
 * muted click. `early` marks a J pressed before the blow under way had struck, which always counts as off the beat, so
 * mashing never builds Groove.
 */
export function judge(button: BeatButton, early = false): BeatJudgement {
  const place = placeOf(stampOf(button));
  const onBeat = place.onBeat && !early;
  jory.silent = 0;
  if (onBeat) {
    jory.streak++;
    jory.onBeats++;
    addGroove(GROOVE.onBeat);
    sfx.thump();
  } else {
    jory.streak = 0;
    addGroove(-(skillValues("j_encore").cost ?? -GROOVE.offBeat));
    sfx.offBeat();
  }
  emitSkillEvent({ type: "beat", onBeat, button, groove: jory.groove, downbeat: place.downbeat });
  return { onBeat, downbeat: place.downbeat };
}

/** each judged button's waiting press keeps the beat-clock time it was first seen at, through hit-stop too */
function stampPresses(): void {
  for (const button of Object.keys(ACTIONS) as BeatButton[]) {
    const key = STAMPS[button];
    if (pressAge(ACTIONS[button]) < 0) jory[key] = -1;
    else if (jory[key] < 0) jory[key] = jory.clock;
  }
}

/** a foe stands on the stage, so silence costs Groove */
const foesStanding = (): boolean => game.enemies.some((e) => e.hp > 0);

/** one beat went by: the tempo for the next is set, Steady Hand and the Finale count down, and silence costs Groove */
function beatPlayed(sound: boolean): void {
  jory.beats++;
  jory.beatLen = beatSeconds(TEMPO_BPM[tier() - 1]);
  if (jory.steadyBeats > 0) jory.steadyBeats--;
  if (jory.lockBeats > 0) jory.lockBeats--;
  jory.silent++;
  const quiet = skillValues("j_encore").silence ?? GROOVE.silence;
  const marching = hero.running && !!skillValues("j_march").hold;
  if (jory.silent > quiet && foesStanding() && !marching) addGroove(-1);
  const downbeat = onDownbeat();
  if (sound) sfx.beat(downbeat);
  emitSkillEvent({ type: "tick", beats: jory.beats, downbeat });
}

/** time held at Crescendo, in real seconds, and the best of the run for In Time */
function holdCrescendo(dt: number): void {
  if (tier() < 4) {
    jory.crescendoT = 0;
    return;
  }
  const before = Math.floor(jory.crescendoT);
  jory.crescendoT += dt / PACE;
  const now = Math.floor(jory.crescendoT);
  if (now <= before) return;
  jory.crescendoBest = Math.max(jory.crescendoBest, now);
  feat({ kind: "crescendo", seconds: now });
}

/**
 * The beat clock of the Jory swapped in, one fixed step of the fight's time. It runs through hit-stop and slow motion,
 * so beats stay evenly spaced in real time; `sound` plays the tick (the first Jory in a room only).
 */
export function tickBeat(dt: number, sound: boolean): void {
  jory.clock += dt;
  jory.phase += dt;
  jory.lostBlink = Math.max(0, jory.lostBlink - dt);
  if (jory.lostBlink <= 0) jory.lostFrom = 0;
  stampPresses();
  while (jory.phase >= jory.beatLen) {
    jory.phase -= jory.beatLen;
    beatPlayed(sound);
  }
  holdCrescendo(dt);
}
