import type { InputAction } from "../../../../types/input";
import { ROSE_EDGE } from "./infusion";

export const CERISE_DRILL_TEXT: Partial<Record<InputAction, string>> = {
  left: "Run left",
  right: "Run right",
  up: "Hold to jump higher. Jump again in the air or kick off a wall.",
  down: "Drop through a ledge",
  attack: "Strike with the rapier. Tap on the beat to chain thrusts.",
  ultimate: "Hold, then release to cast Rose Tempest at one of four levels.",
  dash: "Dodge on the ground or in the air. Jump to carry your speed. During a strike, queue Warp Strike.",
  guard: "Hold to guard or press on impact to parry. During a grounded strike, queue a longer parry window.",
  cast: `Prepare the selected ability, then press again when ready. Hold down for the wide form. Cast during a grounded strike for ${ROSE_EDGE}: the next three swings that land apply Rose Mark.`,
  cycle: "Select the next known ability before preparing.",
};
