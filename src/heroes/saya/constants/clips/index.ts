import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { SayaClipName } from "../../types/moves";
import { AIR_CLIPS } from "./air";
import { SAYA_IDLE } from "./idle";
import { STRING_CLIPS } from "./string";

/** the clips Saya's combo moves play: the string and the falling draw */
export const SAYA_ACTION_CLIPS = { ...STRING_CLIPS, ...AIR_CLIPS } satisfies Record<SayaClipName, ActionClip>;

/** Saya's clips as the roster reads them: her moves' actions, and her rest with the katana sheathed */
export const SAYA_CLIPS: HeroClips = { actions: SAYA_ACTION_CLIPS, idle: SAYA_IDLE };
