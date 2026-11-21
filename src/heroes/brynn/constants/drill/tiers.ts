import { frame } from "../../../../constants/hero";
import type { DrillProfile } from "../../../../types/drill";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { BRYNN_HELD_CLIPS } from "../clips/held";
import { BRYNN_STRING_CLIPS } from "../clips/string";

const { slam: SLAM } = BRYNN_STRING_CLIPS;
const { ultimate: FALL } = BRYNN_HELD_CLIPS;
const SLAM_LOAD = sampleKeys(SLAM.keys, SLAM.hit - frame(1));
const SLAM_CUT = sampleKeys(SLAM.keys, SLAM.hit);
const SPRUNG = sampleKeys(FALL.keys, frame(3));
const TUCKED = sampleKeys(FALL.keys, frame(9));
const FALLEN = sampleKeys(FALL.keys, FALL.hit);

export const BRYNN_TIERS: DrillProfile["tiers"] = [
  {
    look: "crescent",
    around: false,
    level: 1,
    art: "tier1",
    name: "Crimson Fall I: Cleave",
    threshold: 0.46,
    damage: 40,
    reach: 66,
    height: 26,
    intro: 0.38,
    duration: 0.92,
    color: 0xff5a52,
  },
  {
    look: "spires",
    around: false,
    level: 2,
    art: "tier2",
    name: "Crimson Fall II: Fault",
    threshold: 0.86,
    damage: 76,
    reach: 104,
    height: 34,
    intro: 0.45,
    duration: 1.12,
    color: 0xdc3442,
    windup: SLAM_LOAD,
    cut: SLAM_CUT,
  },
  {
    look: "rift",
    around: false,
    level: 3,
    art: "tier3",
    name: "Crimson Fall III: Rupture",
    threshold: 1.27,
    damage: 124,
    reach: 156,
    height: 44,
    intro: 0.53,
    duration: 1.26,
    color: 0xff6a62,
    windup: TUCKED,
    cut: FALLEN,
  },
  {
    look: "nova",
    around: true,
    level: 4,
    art: "tier4",
    name: "Crimson Fall IV: Worldsplitter",
    threshold: 1.72,
    damage: 196,
    reach: 190,
    height: 115,
    intro: 0.66,
    duration: 1.56,
    color: 0xffc2ae,
    windup: SPRUNG,
    cut: FALLEN,
  },
];
