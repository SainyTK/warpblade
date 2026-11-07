import { frame } from "../hero";

/** O: two slaps on the chest, each worth Grit, rooted and open while she does it */
export const TAUNT = {
  dur: frame(21),
  beats: [frame(6), frame(14)] as const,
  cooldown: 3,
} as const;
