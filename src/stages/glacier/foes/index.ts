import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { cryomancer } from "./cryomancer/kind";
import { frostbell } from "./frostbell/kind";
import { frostcolossus } from "./frostcolossus/kind";
import { frostmite } from "./frostmite/kind";
import { hoarback } from "./hoarback/kind";
import { hoarwraith } from "./hoarwraith/kind";
import type { GlacierFoe } from "./ids";
import { rimeclaw } from "./rimeclaw/kind";
import { rimehound } from "./rimehound/kind";
import { rimetusk } from "./rimetusk/kind";
import { shardling } from "./shardling/kind";
import { snowflit } from "./snowflit/kind";

export const GLACIER_KINDS = {
  frostmite,
  snowflit,
  rimehound,
  shardling,
  cryomancer,
  hoarback,
  hoarwraith,
  rimetusk,
  frostbell,
  frostcolossus,
  rimeclaw,
} satisfies Record<GlacierFoe, EnemyKind>;
