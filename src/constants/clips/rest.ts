import type { KitId } from "../../types/kit";
import type { ActionClip } from "../../types/pose";
import { BRANNOC_IDLE } from "./brannoc/stance";
import { HULDA_IDLE } from "./hulda/stance";
import { JORY_IDLE } from "./jory/stance";
import { MIREL_IDLE } from "./mirel/stance";
import { ORRIN_IDLE } from "./orrin/stance";
import { SABLE_IDLE } from "./sable/moves";
import { TALLIS_IDLE } from "./tallis/stance";
import { WENNA_IDLE } from "./wenna/stance";
import { YSRA_STATE_CLIPS } from "./ysra";

/** each hero's own idle clip; a hero left out stands in the shared pose */
export const HERO_IDLES: Partial<Record<KitId, ActionClip>> = {
  ysra: YSRA_STATE_CLIPS.idle,
  sable: SABLE_IDLE,
  hulda: HULDA_IDLE,
  orrin: ORRIN_IDLE,
  mirel: MIREL_IDLE,
  wenna: WENNA_IDLE,
  tallis: TALLIS_IDLE,
  jory: JORY_IDLE,
  brannoc: BRANNOC_IDLE,
};
