import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { AldricClipName } from "../../types/moves";
import { ACTION_CLIPS_ALDRIC } from "./actions";
import { AIR_CLIPS } from "./air";
import { ALDRIC_IDLE } from "./rest";
import { STRING_CLIPS } from "./string";

/** every action clip Aldric plays, by his own names */
export const ALDRIC_ACTION_CLIPS = {
  ...STRING_CLIPS,
  ...AIR_CLIPS,
  ...ACTION_CLIPS_ALDRIC,
} satisfies Record<AldricClipName, ActionClip>;

/** Aldric's clips as the roster reads them: his actions and his rest behind the grounded shield */
export const ALDRIC_CLIPS: HeroClips = { actions: ALDRIC_ACTION_CLIPS, idle: ALDRIC_IDLE };
