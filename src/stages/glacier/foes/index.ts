import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { cryomancer } from "./cryomancer/kind";
import { rimeclaw } from "./rimeclaw/kind";
import { rimehound } from "./rimehound/kind";
import { shardling } from "./shardling/kind";

export const GLACIER_KINDS = {
  rimehound,
  shardling,
  cryomancer,
  rimeclaw,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
