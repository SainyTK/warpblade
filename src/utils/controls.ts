import { SHARED_ACTION_TEXT } from "../constants/input";
import { SHARED_STICK_DIRECTIONS, SHARED_TOUCH_TEXT } from "../constants/touch";
import type { CharacterDef } from "../types/character";
import type { InputAction } from "../types/input";
import type { StickDirectionSpec, TouchButtonAction, TouchButtonText } from "../types/touch";

/** what each action does for this hero, as the Controls screen tells it: the shared lines with the hero's own over them */
export const actionText = (c: CharacterDef): Record<InputAction, string> => ({
  ...SHARED_ACTION_TEXT,
  ...c.controls.actions,
});

/** what each touch button is called and does for this hero */
export const touchText = (c: CharacterDef): Record<TouchButtonAction, TouchButtonText> => ({
  ...SHARED_TOUCH_TEXT,
  ...c.controls.touch,
});

/** the stick's directions for this hero, as the Controls screen lists them */
export const stickDirections = (c: CharacterDef): readonly StickDirectionSpec[] =>
  c.controls.stick ?? SHARED_STICK_DIRECTIONS;
