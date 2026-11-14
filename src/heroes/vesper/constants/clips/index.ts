import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { VesperClipName } from "../../types/moves";
import { ABILITY_CLIPS } from "./abilities";
import { ACTION_CLIPS_OF_VESPER } from "./actions";
import { AIR_CLIPS } from "./air";
import { GUARD_CLIP } from "./guard";
import { IDLE_CLIP, WOUNDED_CLIP } from "./idle";
import { STRING_CLIPS } from "./string";

export { SHORT_CARRY, VESPER_CROUCH } from "./stance";
export { IDLE_CLIP, WOUNDED_CLIP };

/** every clip Vesper's moves and states play, by her own names */
export const VESPER_ACTION_CLIPS = {
  ...STRING_CLIPS,
  ...AIR_CLIPS,
  ...ACTION_CLIPS_OF_VESPER,
  ...ABILITY_CLIPS,
  guard: GUARD_CLIP,
} satisfies Record<VesperClipName, ActionClip>;

/** Vesper's clips as the roster reads them: her actions, and her own rest, whose first frame is her stand on the hero screen */
export const VESPER_CLIPS: HeroClips = { actions: VESPER_ACTION_CLIPS, idle: IDLE_CLIP };
