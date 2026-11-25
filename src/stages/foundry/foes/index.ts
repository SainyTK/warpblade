import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { cindersmithKind } from "./cindersmith/kind";
import { emberbatKind } from "./emberbat/kind";
import { forgeguardKind } from "./forgeguard/kind";
import { slaglingKind } from "./slagling/kind";

export const FOUNDRY_KINDS = {
  slagling: slaglingKind,
  emberbat: emberbatKind,
  forgeguard: forgeguardKind,
  cindersmith: cindersmithKind,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
