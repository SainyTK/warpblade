import type { GlaiveClipName, GlaiveMoveId } from "./glaive";
import type { RiteId } from "./pyre";
import type { StanceClipName, StanceMoveId } from "./stance";

/** Ysra's combo moves: the glaive string and its variants, and the blows of her vault, dive and charge */
export type YsraMoveId = GlaiveMoveId | StanceMoveId;
/** Ysra's action clips, played by her moves */
export type YsraClipName = GlaiveClipName | StanceClipName;
/** her abilities on I: the pole vault, then her rites */
export type YsraAbility = "vault" | RiteId;
/** states only Ysra enters; her kit runs and poses them */
export type YsraState = "vault" | "dive" | "backstep" | "rite";

declare module "../skillBehavior" {
  /** Ysra's own skill events */
  interface SkillEvents {
    /** her guard stopped a blow from the front, outside the parry window */
    block: { fromX: number };
    /** a windmill finished its passes where she stands */
    spin: { x: number; y: number };
    /** Forge Altar lets a salamander out where it stands */
    altar: { x: number; y: number };
    /** she landed out of a vault or a dive */
    land: { x: number; y: number; from: "vault" | "dive" };
  }
}
