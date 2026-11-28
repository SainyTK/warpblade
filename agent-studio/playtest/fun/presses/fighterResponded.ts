import { MOVE_EPSILON } from "./constants";
import type { FighterProbe } from "./types";

export const fighterResponded = (base: FighterProbe, cur: FighterProbe): boolean =>
  cur.state !== base.state ||
  Math.abs(cur.x - base.x) > MOVE_EPSILON ||
  Math.abs(cur.y - base.y) > MOVE_EPSILON ||
  cur.face !== base.face;
