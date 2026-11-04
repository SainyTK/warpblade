import { CLIPS, LOOPING_STATES, STATE_CLIPS } from "../../constants/clips";
import { STAND } from "../../constants/hero";
import type { Hero, StateClipName } from "../../types/hero";
import type { Pose } from "../../types/pose";
import { sampleKeys } from "../../utils/sampleKeys";
import { kit } from "./kits";
import { MOVES } from "./moves";

/** the hero's pose: their kit's own clip when it has one, otherwise Kael's shared clips: a move or action plays its clip, walk and run follow the stride, loops repeat */
export function heroPose(h: Hero, t: number): Pose {
  const own = kit().pose(h, t);
  if (own) return own;
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
      if (!(h.state in STATE_CLIPS)) return STAND;
      const state = h.state as StateClipName;
      const clip = STATE_CLIPS[state];
      return sampleKeys(clip.keys, LOOPING_STATES.has(state) ? h.st % clip.dur : h.st);
    }
  }
}
