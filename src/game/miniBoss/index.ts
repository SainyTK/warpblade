import { MINI_SIGNATURE } from "../../constants/miniBoss";
import type { BossProfile } from "../../types/bossFight";
import type { MiniBossDef } from "../../types/campaign";
import { castMiniMove } from "./moves";

export function miniProfile(def: MiniBossDef): BossProfile {
  return {
    epithet: def.epithet,
    power: def.power,
    light: def.light,
    adds: def.adds,
    drivesPhase: true,
    signature: {
      every: MINI_SIGNATURE.every,
      telegraph: MINI_SIGNATURE.telegraph,
      cast: (e, count) => castMiniMove(def, e, count),
    },
  };
}
