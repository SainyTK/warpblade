import { FEEL } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { CRASH } from "../../../../constants/ysra/stance";
import type { MoveDef } from "../../../../types/move";
import type { StanceMoveId } from "../../../../types/ysra/stance";
import { hero } from "../../../state";
import { impactBurst } from "./landing";
import { stance } from "./memory";

/**
 * Vault Strike: the glaive raised overhead in the air, then the drop. The clip holds the drop until the floor; on the
 * floor it jumps to the blow, which lands a frame later around the point.
 */
function crashStep(t: number): void {
  const h = hero;
  if (h.ground) {
    h.vx = 0;
    if (stance.landed) return;
    stance.landed = true;
    h.st = CRASH.impactKey;
    impactBurst("vault", CRASH.reach);
    return;
  }
  if (t < CRASH.lift) {
    h.vx = h.face * CRASH.drift * 0.5;
    h.vy = Math.min(h.vy, -20);
    return;
  }
  h.vx = h.face * CRASH.drift;
  h.vy = CRASH.drop;
  h.st = Math.min(h.st, CRASH.impactKey - 0.001);
}

/** blows out of the vault, dive, guard and charge */
export const STANCE_MOVES: Record<StanceMoveId, MoveDef> = {
  vaultCrash: {
    id: "vaultCrash",
    name: "Vault crash",
    clip: "yVaultCrash",
    hits: [
      {
        at: CRASH.impactKey + frame(1),
        box: [10 - CRASH.reach, -30, 10 + CRASH.reach, 4],
        power: CRASH.power,
        kx: 70,
        ky: 0,
        launch: CRASH.launch,
        big: true,
        feel: FEEL.crush,
      },
    ],
    finisher: true,
    falls: true,
    pitch: 0.6,
    step: crashStep,
  },
};
