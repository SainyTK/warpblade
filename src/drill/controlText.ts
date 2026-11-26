import type { DrillProfile } from "../types/drill";
import type { InputAction } from "../types/input";

export const DRILL_WARP_LABEL = "Warp";

const DRILL_ACTION_TEXT = {
  left: "Run left.",
  right: "Run right.",
  up: "Jump. Hold to jump higher. Press while sliding on a wall to kick away.",
  down: "Drop through a ledge.",
  attack: "Slash. Press again during the swing to chain up to three ground slashes.",
  dash: "Dash on the ground or once in the air. Jump out of a ground dash to carry speed.",
  guard:
    "Hold to block from the front. Tap just before impact to parry. Press during a ground slash for an enhanced parry.",
  cast: "Cast the selected spell at once; if it is recharging or MP is short, the next ready one goes. Press during a slash to infuse the weapon with it.",
  cycle: "Select the next spell.",
  warp: "Throw the sword at the nearest foe ahead and warp strike it.",
  ultimate: "Hold to charge one of four skills. Release to use the highest tier reached.",
} satisfies Partial<Record<InputAction, string>>;

const CHARGE_PRICE_TEXT = "Each tier costs more MP and recharges longer; a tier MP cannot pay is skipped.";

export function drillActionText(profile: DrillProfile): Partial<Record<InputAction, string>> {
  const text: Partial<Record<InputAction, string>> = { ...DRILL_ACTION_TEXT, ...profile.text };
  return { ...text, ultimate: `${text.ultimate} ${CHARGE_PRICE_TEXT}` };
}
