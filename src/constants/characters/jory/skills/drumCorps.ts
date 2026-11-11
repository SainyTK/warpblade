import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "35%: a drummer strikes on each of 4 beats, 0.4x.",
    values: { chance: 0.35, cooldown: 3, beats: 4, power: 0.4, stagger: 0, count: 1, band: 0 },
  },
  { text: "50% chance.", values: { chance: 0.5 } },
  { text: "Drummers stay 6 beats.", values: { beats: 6 } },
  { text: "0.6x.", values: { power: 0.6 } },
  { text: "Their strikes stagger minions.", values: { stagger: 1 } },
  { text: "70% chance.", values: { chance: 0.7 } },
  { text: "Two drummers.", values: { count: 2 } },
  { text: "0.9x; 8 beats.", values: { power: 0.9, beats: 8 } },
]);

/** Drum Corps. Design: docs/skills/jory.md. Values: chance: chance an accented Crash calls one; cooldown: seconds between calls; beats: beats a drummer stays; power: attack damage each strike deals; stagger: 1 strikes stagger minions; count: drummers called; band: 1 three drummers march with him for the whole run (evolution) */
export const DRUM_CORPS: SkillDef = {
  id: "j_drumCorps",
  name: "Drum Corps",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "An accented Crash may call a spectral drummer who strikes the nearest foe on each beat.",
  levels: LEVELS,
  evolution: {
    partner: "j_march",
    name: "Marching Band",
    text: "Three drummers march with him and strike on every beat.",
    row: evolvedRow(LEVELS[7], "Three drummers march with him.", { band: 1 }),
  },
};
