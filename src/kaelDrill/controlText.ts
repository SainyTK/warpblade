import type { InputAction } from "../types/input";

export const DRILL_ACTION_TEXT = {
  left: "Run left.",
  right: "Run right.",
  up: "Jump. Hold to jump higher. Press while sliding on a wall to kick away.",
  down: "Drop through a ledge.",
  attack: "Slash. Press again during the swing to chain up to three ground slashes.",
  dash: "Dash on the ground or once in the air. Jump out of a ground dash to carry speed. Press during a slash to warp strike.",
  guard:
    "Hold to block from the front. Tap just before impact to parry. Press during a ground slash for an enhanced parry.",
  cast: "Prepare the selected spell. Press again when ready to cast, or press during a slash to infuse the sword.",
  cycle: "Cycle Fire, Ice and Thunder before preparing a spell.",
  ultimate: "Hold to charge one of four skills. Release to use the highest tier reached.",
} satisfies Partial<Record<InputAction, string>>;
