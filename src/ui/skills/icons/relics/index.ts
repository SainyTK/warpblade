import { AURA_ICONS } from "./aura";
import { BELL_ICONS } from "./bell";
import { DAGGERS_ICONS } from "./daggers";
import { ECHO_ICONS } from "./echo";
import { SHARDS_ICONS } from "./shards";
import { STORM_ICONS } from "./storm";
import { THORNS_ICONS } from "./thorns";
import { WISP_ICONS } from "./wisp";

/** every relic's icon and evolution icon, by `relic_<id>` and `relic_<id>_evo` */
export const RELIC_ICONS = {
  ...SHARDS_ICONS,
  ...WISP_ICONS,
  ...DAGGERS_ICONS,
  ...STORM_ICONS,
  ...AURA_ICONS,
  ...BELL_ICONS,
  ...ECHO_ICONS,
  ...THORNS_ICONS,
};
