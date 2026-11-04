import type { MoveDef } from "../../../../types/move";
import type { StanceMoveId } from "../../../../types/ysra/stance";

/** blows out of the vault, dive, guard and charge. Placeholder. */
export const STANCE_MOVES: Record<StanceMoveId, MoveDef> = {
  vaultCrash: {
    id: "vaultCrash",
    name: "Vault crash",
    clip: "yVaultCrash",
    hits: [{ at: 0.1, box: [-20, -30, 30, 0], power: 1.5, kx: 80, ky: -60 }],
  },
};
