import type { GlaiveClipName, GlaiveMoveId } from "./glaive";
import type { RiteId } from "./pyre";

/** Ysra's combo moves: the glaive string, its variants and her air reaps */
export type YsraMoveId = GlaiveMoveId;
/** Ysra's action clips, played by her moves */
export type YsraClipName = GlaiveClipName;
/** her abilities on I: her rites */
export type YsraAbility = RiteId;
/** states only Ysra enters; her kit runs and poses them */
export type YsraState = "backstep" | "rite";

declare module "../skillBehavior" {
  /** Ysra's own skill events */
  interface SkillEvents {
    /** her guard stopped a blow from the front, outside the parry window */
    block: { fromX: number };
    /** a windmill finished its passes where she stands */
    spin: { x: number; y: number };
    /** Forge Altar lets a salamander out where it stands */
    altar: { x: number; y: number };
  }
}
