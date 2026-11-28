import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { auroraray } from "./auroraray/kind";
import { facetseer } from "./facetseer/kind";
import { glimmerwing } from "./glimmerwing/kind";
import { glintmite } from "./glintmite/kind";
import type { VeilFoe } from "./ids";
import { riftknight } from "./riftknight";
import { runebinder } from "./runebinder/kind";
import { shardram } from "./shardram/kind";
import { spirecolossus } from "./spirecolossus/kind";

export const VEIL_KINDS = {
  glintmite,
  glimmerwing,
  riftknight,
  shardram,
  auroraray,
  runebinder,
  facetseer,
  spirecolossus,
} satisfies Record<VeilFoe, EnemyKind>;
