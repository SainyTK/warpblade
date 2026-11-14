import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { YunClipName } from "../../types/moves";
import { AIR_CLIPS } from "./air";
import { CAST_CLIPS } from "./cast";
import { YUN_IDLE } from "./idle";
import { STRING_CLIPS } from "./string";

export { YUN_GUARD_CLIP } from "./guard";
export { YUN_IDLE, YUN_WOUNDED_IDLE } from "./idle";

/** every clip Yun's moves and casts play */
export const YUN_ACTION_CLIPS = { ...STRING_CLIPS, ...AIR_CLIPS, ...CAST_CLIPS } satisfies Record<
  YunClipName,
  ActionClip
>;

/** Yun's clips as the roster reads them: his moves' actions and his own idle */
export const YUN_CLIPS: HeroClips = { actions: YUN_ACTION_CLIPS, idle: YUN_IDLE };
