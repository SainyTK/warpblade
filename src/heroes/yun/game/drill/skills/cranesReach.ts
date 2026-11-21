import { drillSession } from "../../../../../drill";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { foesNear } from "../strike";
import { sendWave } from "./qiWave";

const ID = "yu_crane";
const FAN_HEIGHTS = [-10, -18, -28] as const;
const HALT_RADIUS = 60;
const seen = { cue: null as object | null };

export const CRANES_REACH_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.parryWindow *= values.window;
  },
  tick(_dt, { values, evolved }) {
    const session = drillSession();
    const cue = session?.defenseCue ?? null;
    if (!session || !cue || cue === seen.cue) {
      seen.cue = cue;
      return;
    }
    seen.cue = cue;
    const h = session.fighter;
    const parried = cue.kind === "parry" || cue.kind === "enhancedParry";
    const power = parried ? (values.wave ?? 0) : cue.kind === "block" ? (values.blockWave ?? 0) : 0;
    const heights = parried && evolved ? FAN_HEIGHTS : [-18];
    for (const y of heights) {
      sendWave({ x: h.x, y: h.y + y, face: h.face, reach: 120, power, source: ID });
    }
    if (parried && values.halt) {
      for (const foe of foesNear(h.x, h.y - 16, HALT_RADIUS)) {
        foe.halt = Math.max(foe.halt, values.halt);
      }
    }
  },
};
