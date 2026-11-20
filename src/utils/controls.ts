import { SHARED_ACTION_TEXT } from "../constants/input";
import { SHARED_STICK_DIRECTIONS, SHARED_TOUCH_TEXT } from "../constants/touch";
import type { CharacterDef } from "../types/character";
import type { InputAction } from "../types/input";
import type { StickDirectionSpec, TouchButtonAction, TouchButtonText } from "../types/touch";
import { jobControls } from "./jobs";

/** what each action does for this hero in this job (null for their own), as the Controls screen tells it: the shared
 *  lines with the hero's own and then the job's over them */
export const actionText = (c: CharacterDef, job: string | null): Record<InputAction, string> => ({
  ...SHARED_ACTION_TEXT,
  ...jobControls(c, job).actions,
});

/** what each touch button is called and does for this hero in this job */
export const touchText = (c: CharacterDef, job: string | null): Record<TouchButtonAction, TouchButtonText> => ({
  ...SHARED_TOUCH_TEXT,
  ...jobControls(c, job).touch,
});

/** the stick's directions for this hero in this job, as the Controls screen lists them */
export const stickDirections = (c: CharacterDef, job: string | null): readonly StickDirectionSpec[] =>
  jobControls(c, job).stick ?? SHARED_STICK_DIRECTIONS;
