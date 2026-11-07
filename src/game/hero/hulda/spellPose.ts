import { SPELL_CLIPS as C } from "../../../constants/clips/hulda/spells";
import { RIDE } from "../../../constants/hulda/ride";
import type { Hero } from "../../../types/hero";
import type { Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { braceTime } from "./ironWall";

/** her clips for the I spells and the ride: the haul loops while a chain is out, the brace loops until the release, the
 *  pound loops while she rides */
export function spellPose(h: Hero): Pose {
  const st = h.st;
  switch (h.state) {
    case "chain":
      return st < C.chain.dur ? sampleKeys(C.chain.keys, st) : sampleKeys(C.haul.keys, (st - C.chain.dur) % C.haul.dur);
    case "stomp":
      return sampleKeys(C.stomp.keys, st);
    case "brace": {
      const brace = braceTime();
      if (st >= brace) return sampleKeys(C.release.keys, st - brace);
      if (st < C.braceIn.dur) return sampleKeys(C.braceIn.keys, st);
      return sampleKeys(C.brace.keys, (st - C.braceIn.dur) % C.brace.dur);
    }
    default:
      return st < RIDE.first
        ? sampleKeys(C.rideLand.keys, st)
        : sampleKeys(C.pound.keys, (st - RIDE.first) % RIDE.every);
  }
}
