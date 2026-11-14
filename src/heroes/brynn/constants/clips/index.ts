import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { BrynnClipName } from "../../types/moves";
import { BRYNN_AIR_CLIPS } from "./air";
import { BRYNN_LOCOMOTION } from "./locomotion";
import { BRYNN_STRING_CLIPS } from "./string";

/** every clip Brynn's combo moves play */
export const BRYNN_ACTION_CLIPS = { ...BRYNN_STRING_CLIPS, ...BRYNN_AIR_CLIPS } satisfies Record<
  BrynnClipName,
  ActionClip
>;

/** Brynn's clips as the roster reads them: her moves' actions, and her idle with the sword on her shoulder */
export const BRYNN_CLIPS: HeroClips = { actions: BRYNN_ACTION_CLIPS, idle: BRYNN_LOCOMOTION.idle };
