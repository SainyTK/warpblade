import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { cryomancer } from "./cryomancer/kind";
import type { GlacierFoe } from "./ids";
import { rimeclaw } from "./rimeclaw/kind";
import { rimehound } from "./rimehound/kind";
import { shardling } from "./shardling/kind";

export const GLACIER_KINDS = {
  rimehound,
  shardling,
  cryomancer,
  rimeclaw,
} satisfies Record<GlacierFoe, EnemyKind>;
