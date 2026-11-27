import type { StageId, StageTier } from "../types/campaign";

export const STAGE_ORDER: readonly StageId[] = [
  "prologue",
  "marsh",
  "foundry",
  "glacier",
  "skyway",
  "archive",
  "moonlit",
  "veil",
  "blight",
  "citadel",
];

export const STAGE_OPENS: Readonly<Record<StageId, readonly StageId[]>> = {
  prologue: ["marsh", "foundry"],
  marsh: ["glacier", "skyway"],
  foundry: ["glacier", "archive"],
  glacier: ["moonlit"],
  skyway: ["moonlit", "veil"],
  archive: ["moonlit", "blight"],
  moonlit: ["veil", "blight"],
  veil: ["citadel"],
  blight: ["citadel"],
  citadel: [],
};

export const OPENS_WITH_ALL: readonly StageId[] = ["citadel"];

export const STAGE_TIER: Readonly<Record<StageId, StageTier>> = {
  prologue: 1,
  marsh: 2,
  foundry: 2,
  glacier: 2,
  skyway: 3,
  archive: 3,
  moonlit: 3,
  veil: 4,
  blight: 4,
  citadel: 5,
};
