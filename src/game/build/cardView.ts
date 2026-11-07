import { charmSlots, charmUnlocked } from "../../store/unlocks";
import type { CardView } from "../../utils/cards";
import { progress } from "../state";

/** what a deal reads for the hero in play: their build, and the player's unlocks */
export const cardView = (): CardView => ({
  build: progress.build,
  unlocks: { charm: charmUnlocked, charmSlots: charmSlots() },
});
