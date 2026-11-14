import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { CeriseClipName } from "../../types/moves";
import { FLURRY_CLIP, LINE_CLIP } from "./abilities";
import { AIR_CLIPS } from "./air";
import { CERISE_IDLE } from "./rest";
import { RIPOSTE_CLIP } from "./riposte";
import { STRING_CLIPS } from "./string";
import { TEMPEST_CLIP } from "./tempest";

/** every action clip Cerise's moves and own states play, by name */
export const CERISE_ACTION_CLIPS = {
  ...STRING_CLIPS,
  ...AIR_CLIPS,
  riposte: RIPOSTE_CLIP,
  flurry: FLURRY_CLIP,
  line: LINE_CLIP,
  tempest: TEMPEST_CLIP,
} satisfies Record<CeriseClipName, ActionClip>;

/** Cerise's clips as the roster reads them: her moves' actions, and her rest as the idle */
export const CERISE_CLIPS: HeroClips = { actions: CERISE_ACTION_CLIPS, idle: CERISE_IDLE };
