import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { cindersmithKind } from "./cindersmith/kind";
import { emberbatKind } from "./emberbat/kind";
import { forgeguardKind } from "./forgeguard/kind";
import type { FoundryFoe } from "./ids";
import { slaglingKind } from "./slagling/kind";

export const FOUNDRY_KINDS = {
  slagling: slaglingKind,
  emberbat: emberbatKind,
  forgeguard: forgeguardKind,
  cindersmith: cindersmithKind,
} satisfies Record<FoundryFoe, EnemyKind>;
