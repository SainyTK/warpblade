import { frame } from "../../../constants/hero";

/**
 * The beats of Saya's own states, in game seconds from the state's start: when each blow lands, when a dash runs, and
 * the click, when the blade goes home and her stored cuts release. Her clips are keyed on these frames.
 */
export const BEATS = {
  /** the parry's counter draw: the cut, then the click */
  counter: { hit: frame(2), click: frame(12), end: frame(18) },
  /** the warp's arrival: she lands past the foe mid-cut and clicks the blade home; the shared state lasts 0.4 s */
  warp: { click: frame(9) },
  /** Brushline: the dash from frame 3 to 6, the click at frame 17 */
  line: { dash: frame(3), stop: frame(6), click: frame(17), end: frame(22) },
  /** Brushline held: out on frames 3 to 6, back on 12 to 15, the click at frame 23 */
  lineWide: { dash: frame(3), stop: frame(6), back: frame(12), home: frame(15), click: frame(23), end: frame(28) },
  /** Moonrise: the rising draw on frame 5, the click at frame 17 */
  rise: { hit: frame(5), click: frame(17), end: frame(21) },
  /** a spell: it leaves the blade on the shared cast's hit and the blade clicks home here, before the cast ends */
  cast: { click: frame(13) },
  /** Silent Moon: she draws on frame 0, the lines cross the stage, she clicks the blade home on frame 27 */
  moon: { click: frame(27), end: frame(34) },
} as const;
