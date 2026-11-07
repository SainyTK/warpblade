import type { CharacterDef } from "../../types/character";
import { KAEL_COLORS, PAL, SPARKS } from "../palette";
import { KAEL_SKILL_DEFS } from "./kael/skills/index";

/** other heroes' temporary skill lists read the charge rule here until their own skills replace them */
export { ULT_CHARGE } from "../ultimate";

/**
 * Kael's head, 24 by 22 image pixels, facing right in three-quarters: silver hair swept back in wedges with a glint on
 * the crown, bangs over the brow, one blue eye, the jaw in shadow.
 */
const HEAD = [
  "..........DDDDD.........",
  ".......DDDdhhhhdD.......",
  ".....DDdhhhHHHHhhdD.....",
  "...DDddhhHHHHWWHHhhD....",
  "DDDdhhhHHHHHWWHHHHHhD...",
  "...DDdhhHHHHHHHHHHHHhD..",
  ".....DdhHHHHHHhHHHHHHhD.",
  "..DDddhHHHHHHhHHHHHhHHhD",
  "DDdhhhhHHHHHhHHHHhHHHHHh",
  "..DDdhhhHHHhHHHhHHHhHHHh",
  "....DdhhhhhhhHHhhHHhhHhh",
  "....DddhhhhhhHHhhHHhhHhh",
  "....DDdhhhdhhHhLhHhsHhsh",
  "....DDddhdhhhLsLshsLssss",
  ".....DDdhdSssLLssdddssss",
  ".....DDddSsLsLssdwPPssss",
  "......DDdSssssssswIPssss",
  "......DDdSSssssssLIIssss",
  ".......DdSSsssssssssSss.",
  "........DdSSSssssssmmS..",
  ".........D.SSSsssssSS...",
  "...........SSSSSSSS.....",
] as const;
/** the back of Kael's head, for a spin: hair swept back in wedges and strands, with the nape of the neck under it */
const HEAD_BACK = [
  "..........DDDDD.........",
  ".......DDDddhhhdD.......",
  ".....DDdhhdHhhdhhdD.....",
  "...DDddhhdHHhWWhhdhD....",
  "DDDdhhhHHHHHWWhhdhhhD...",
  "...DDdhhHHHdhhhdhhhdhD..",
  ".....DdhHHdHhhdhhhdhhhD.",
  "..DDddhHHdHHhdhhhdhhhdhD",
  "DDdhhhhHHHHHdhhhdhhhdhhh",
  "..DDdhhhHHHdhhhdhhhdhhhd",
  "....Ddhhhhdhhhdhhhdhhhdh",
  "....DddhhhdhhhdhhhdhhddD",
  "....DddhhdhhhdhhhdhhdddD",
  "....DDdhhdhhdhhhdhhhddDD",
  ".....DdhhdhhdhhdhhhdddD.",
  ".....DDdhdhhdhhdhhdddDD.",
  "......DddhdhdhhdhdddDD..",
  "......DDddhdhdhdhddDD...",
  ".......DDddhdddhddDD....",
  ".........DDdddddDD......",
  "...........DSSSSD.......",
  "...........SSSSSS.......",
] as const;
/** Kael, the warp knight: the first character. */
export const KAEL: CharacterDef = {
  id: "kael",
  kit: "kael",
  name: "Kael",
  title: "The last warp knight",
  blurb:
    "Throws his crystal sword and appears where it lands. A quick sword string, a dash nothing can touch, and crystal magic.",
  accent: "#7fe3ff",
  special: "crystalNova",
  base: { ad: 10, ap: 10, hp: 100, mp: 100, stamina: 100, crit: 0.05, move: 1, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.1, mp: 0.45 },
  skills: KAEL_SKILL_DEFS,
  comboHits: 4,
  skin: {
    colors: KAEL_COLORS,
    head: HEAD,
    headBack: HEAD_BACK,
    weapon: "sword",
    reach: 17,
    ramp: PAL.crystal,
    glow: PAL.crystal[3],
    sparks: SPARKS.crystal,
  },
};
