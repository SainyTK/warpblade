import type { HeroMeter } from "../../../types/heroModule";
import { ZAFIR_ACCENT } from "../constants/palette";
import { RING_TIERS, WHIRL } from "../constants/whirl";
import { zafir } from "./state";
import { ringTier } from "./whirl";

/** the Whirl bar on the HUD: it glows while the ring's top tier turns round him */
export const WHIRL_METER: HeroMeter = {
  label: "WH",
  tint: ZAFIR_ACCENT,
  share: () => zafir.whirl / WHIRL.most,
  lit: () => ringTier() === RING_TIERS[RING_TIERS.length - 1],
};
