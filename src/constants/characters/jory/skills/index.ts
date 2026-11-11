import type { SkillDef } from "../../../../types/skill";
import { CRASH_WAVE } from "./crashWave";
import { DISSONANCE } from "./dissonance";
import { DOWNBEAT_LEAP } from "./downbeatLeap";
import { DRUM_CORPS } from "./drumCorps";
import { ECHO_CHAMBER } from "./echoChamber";
import { ENCORE } from "./encore";
import { GONG } from "./gong";
import { GRAND_FINALE } from "./grandFinale";
import { HEAVY_ACCENT } from "./heavyAccent";
import { IRON_METRONOME } from "./ironMetronome";
import { KICK_DRUM } from "./kickDrum";
import { PARADIDDLE } from "./paradiddle";
import { RESONANCE } from "./resonance";
import { RIMSHOT } from "./rimshot";
import { RINGING_EARS } from "./ringingEars";
import { STEP_TOUCH } from "./stepTouch";
import { SWELL } from "./swell";
import { TUNING_FORK } from "./tuningFork";
import { WAR_HORN } from "./warHorn";
import { WAR_MARCH } from "./warMarch";

/** Jory's 20 skills, in the order the Codex lists them. Design: docs/skills/jory.md */
export const JORY_SKILL_DEFS: readonly SkillDef[] = [
  HEAVY_ACCENT,
  PARADIDDLE,
  CRASH_WAVE,
  RIMSHOT,
  KICK_DRUM,
  SWELL,
  STEP_TOUCH,
  WAR_MARCH,
  DOWNBEAT_LEAP,
  GONG,
  TUNING_FORK,
  ECHO_CHAMBER,
  RESONANCE,
  RINGING_EARS,
  DISSONANCE,
  DRUM_CORPS,
  WAR_HORN,
  IRON_METRONOME,
  ENCORE,
  GRAND_FINALE,
];
