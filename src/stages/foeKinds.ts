import type { EnemyKind } from "../game/enemies/kinds/kind";
import type { StageFoeType } from "../types/enemy";
import { ARCHIVE_KINDS } from "./archive/foes";
import { BLIGHT_KINDS } from "./blight/foes";
import { CITADEL_KINDS } from "./citadel/foes";
import { FOUNDRY_KINDS } from "./foundry/foes";
import { GLACIER_KINDS } from "./glacier/foes";
import { MARSH_KINDS } from "./marsh/foes";
import { MOONLIT_KINDS } from "./moonlit/foes";
import { PROLOGUE_KINDS } from "./prologue/foes";
import { SKYWAY_KINDS } from "./skyway/foes";
import { VEIL_KINDS } from "./veil/foes";

export const STAGE_KINDS: Record<StageFoeType, EnemyKind> = {
  ...PROLOGUE_KINDS,
  ...MARSH_KINDS,
  ...MOONLIT_KINDS,
  ...VEIL_KINDS,
  ...FOUNDRY_KINDS,
  ...GLACIER_KINDS,
  ...SKYWAY_KINDS,
  ...BLIGHT_KINDS,
  ...ARCHIVE_KINDS,
  ...CITADEL_KINDS,
};
