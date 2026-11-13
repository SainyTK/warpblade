import type { MoveDef } from "../../../../types/move";
import type { GlaiveMoveId } from "../../../../types/ysra/glaive";
import { AIR_BLOWS } from "./blows/air";
import { STRING_BLOWS } from "./blows/string";
import { VARIANT_BLOWS } from "./blows/variants";

/** every glaive blow, for the shared combo engine */
export const GLAIVE_MOVES: Record<GlaiveMoveId, MoveDef> = {
  ...STRING_BLOWS,
  ...VARIANT_BLOWS,
  ...AIR_BLOWS,
};
