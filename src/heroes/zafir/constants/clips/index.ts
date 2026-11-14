import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { ZafirClipName } from "../../types/moves";
import { AIR_CLIPS } from "./air";
import { IDLE } from "./stance";
import { STRING_CLIPS } from "./string";

export { CAST_CLIPS } from "./casts";
export { ARRIVAL, DODGE, GUARD, IDLE, THROW, ULTIMATE, WOUNDED_IDLE } from "./stance";

/** every clip Zafir's combo moves play */
export const ZAFIR_ACTION_CLIPS = { ...STRING_CLIPS, ...AIR_CLIPS } satisfies Record<ZafirClipName, ActionClip>;

/** Zafir's clips as the roster reads them: his moves' actions, and his rest with the scimitar on his shoulder */
export const ZAFIR_CLIPS: HeroClips = { actions: ZAFIR_ACTION_CLIPS, idle: IDLE };
