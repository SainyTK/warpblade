import { charmSlots, charmUnlocked, relicSlots, relicUnlocked } from "../../store/unlocks";
import type { CardView } from "../../utils/cards";
import { progress } from "../state";

/** what a deal reads for the hero in play: their level, skills and build, and the player's unlocks */
export const cardView = (): CardView => ({
  level: progress.level,
  ranks: progress.ranks,
  build: progress.build,
  unlocks: { relic: relicUnlocked, charm: charmUnlocked, relicSlots: relicSlots(), charmSlots: charmSlots() },
});
