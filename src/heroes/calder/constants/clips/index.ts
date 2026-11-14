import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { CalderClipName } from "../../types/moves";
import { AIR_CLIPS } from "./air";
import { CALDER_IDLE } from "./idle";
import { RELOAD_CLIP } from "./reload";
import { SHOT_CLIPS } from "./shots";
import { STRING_CLIPS } from "./string";
import { BREAK_START } from "./ultimate";

/** every action clip Calder's moves and states play, by name */
export const CALDER_ACTION_CLIPS = {
  ...STRING_CLIPS,
  ...AIR_CLIPS,
  ...SHOT_CLIPS,
  reload: RELOAD_CLIP,
  cylinderBreak: BREAK_START,
} satisfies Record<CalderClipName, ActionClip>;

/** Calder's clips as the roster reads them: his moves' actions, and his idle with the sword on his shoulder */
export const CALDER_CLIPS: HeroClips = { actions: CALDER_ACTION_CLIPS, idle: CALDER_IDLE };
