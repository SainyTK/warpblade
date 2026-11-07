import { FEEL } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { FLARE } from "../../../../constants/ysra/rites";
import { CRASH } from "../../../../constants/ysra/stance";
import type { MoveDef, MoveHit } from "../../../../types/move";
import type { Box } from "../../../../types/world";
import type { StanceMoveId } from "../../../../types/ysra/stance";
import { skillEvolved, skillValues } from "../../../skills/query";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero } from "../../../state";
import { impactBurst } from "./landing";
import { stance } from "./memory";
import { skyfall } from "./skyfall";

/** Vault Strike's numbers; empty when not held */
const strike = () => skillValues("y_vault");
const reach = (): number => strike().reach ?? CRASH.reach;

/**
 * The vault crash: the glaive raised overhead in the air, then the drop. The clip holds the drop until the floor; on the
 * floor it jumps to the blow, which lands a frame later around the point.
 */
function crashStep(t: number): void {
  const h = hero;
  if (h.ground) {
    h.vx = 0;
    if (stance.landed) return;
    stance.landed = true;
    h.st = CRASH.impactKey;
    impactBurst("vault", reach());
    if (skillEvolved("y_vault")) skyfall(strike());
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

/** the crash's blow around the point: its power, width and launch from Vault Strike */
const crashHit: MoveHit = {
  at: CRASH.impactKey + frame(1),
  get box(): Box {
    return [10 - reach(), -30, 10 + reach(), 4];
  },
  get power() {
    return strike().crash ?? CRASH.power;
  },
  kx: 70,
  ky: 0,
  get launch() {
    return strike().launch ? CRASH.launch * 1.5 : CRASH.launch;
  },
  big: true,
  feel: FEEL.crush,
};

/** blows out of the vault, dive, guard and charge */
export const STANCE_MOVES: Record<StanceMoveId, MoveDef> = {
  vaultCrash: {
    id: "vaultCrash",
    name: "Vault crash",
    clip: "yVaultCrash",
    hits: [crashHit],
    finisher: true,
    falls: true,
    pitch: 0.6,
    step: crashStep,
    // Vault Strike's ring of fire around the point
    afterHit: () => {
      const ring = strike().ring ?? 0;
      if (ring) game.fx.push(castFlare(hero.x, hero.y, { ...FLARE, radius: reach(), power: ring }, "attacks"));
    },
  },
};
