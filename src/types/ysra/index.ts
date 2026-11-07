import type { GlaiveClipName, GlaiveMoveId } from "./glaive";
import type { StanceClipName, StanceMoveId } from "./stance";

/** Ysra's combo moves: the glaive string and its variants, and the blows of her vault, dive and charge */
export type YsraMoveId = GlaiveMoveId | StanceMoveId;
/** Ysra's action clips, played by her moves */
export type YsraClipName = GlaiveClipName | StanceClipName;
/** states only Ysra enters; her kit runs and poses them */
export type YsraState = "heft" | "vault" | "dive" | "brace" | "backstep" | "rite";
/** the passives and abilities of Ysra's skill tree */
export type YsraPerk =
  | "skewer"
  | "railLance"
  | "windmill"
  | "impale"
  | "highReaper"
  | "emberParry"
  | "counterThrust"
  | "vaultStrike"
  | "warpath"
  | "earthshaker"
  | "bulwark"
  | "unbroken"
  | "flare"
  | "flamePillar"
  | "brazier"
  | "searingEdge"
  | "ashenWake"
  | "overheat"
  | "hearthfire"
  | "moltenGuard"
  | "hotIron"
  | "skyline"
  | "pyreColonnade";
