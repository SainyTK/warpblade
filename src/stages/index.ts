import type { StageDef, StageId } from "../types/campaign";
import { archive } from "./archive";
import { blight } from "./blight";
import { citadel } from "./citadel";
import { foundry } from "./foundry";
import { glacier } from "./glacier";
import { marsh } from "./marsh";
import { moonlit } from "./moonlit";
import { prologue } from "./prologue";
import { skyway } from "./skyway";
import { veil } from "./veil";

export const STAGES: Readonly<Record<StageId, StageDef>> = {
  prologue,
  marsh,
  moonlit,
  veil,
  foundry,
  glacier,
  skyway,
  blight,
  archive,
  citadel,
};

export const RIFT_STAGES: readonly StageId[] = [
  "marsh",
  "foundry",
  "glacier",
  "skyway",
  "archive",
  "moonlit",
  "veil",
  "blight",
];

export const stageDef = (id: StageId): StageDef => STAGES[id];
