import { CLIPS, LOOPING_STATES, STATE_CLIPS } from "../../constants/clips";
import { STAND } from "../../constants/hero";
import type { Hero } from "../../types/hero";
import type { Pose } from "../../types/pose";
import { sampleKeys } from "../../utils/sampleKeys";
import { MOVES } from "./moves";

/** Kael's pose for his state: a move or action plays its clip, walk and run follow the stride, loops repeat */
export function heroPose(h: Hero, t: number): Pose {
  switch (h.state) {
    case "move":
      return h.move ? sampleKeys(CLIPS[MOVES[h.move].clip].keys, h.st) : STAND;
    case "cast":
    case "throw":
    case "warpStrike":
      return sampleKeys(CLIPS[h.state].keys, h.st);
    case "walk":
    case "run": {
      const clip = STATE_CLIPS[h.state];
      return sampleKeys(clip.keys, h.runPhase * clip.dur);
    }
    case "charge": {
      const p = sampleKeys(STATE_CLIPS.charge.keys, h.st % STATE_CLIPS.charge.dur);
      const tremble = h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? 0.5 : 0;
      return { ...p, nx: p.nx + tremble };
    }
    default: {
      const clip = STATE_CLIPS[h.state];
      return sampleKeys(clip.keys, LOOPING_STATES.has(h.state) ? h.st % clip.dur : h.st);
    }
  }
}
