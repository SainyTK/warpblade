import type { RelicDef, RelicId } from "../../types/build";
import { AURA } from "./aura";
import { BELL } from "./bell";
import { DAGGERS } from "./daggers";
import { ECHO } from "./echo";
import { SHARDS } from "./shards";
import { STORM } from "./storm";
import { THORNS } from "./thorns";
import { WISP } from "./wisp";

/** every relic by id, in the order cards and the HUD list them */
export const RELICS: Readonly<Record<RelicId, RelicDef>> = {
  shards: SHARDS,
  wisp: WISP,
  daggers: DAGGERS,
  storm: STORM,
  aura: AURA,
  bell: BELL,
  echo: ECHO,
  thorns: THORNS,
};
export const RELIC_IDS = Object.keys(RELICS) as RelicId[];
