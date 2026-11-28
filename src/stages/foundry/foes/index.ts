import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { anvilhulkKind } from "./anvilhulk/kind";
import { bellowhoundKind } from "./bellowhound/kind";
import { cinderdrakeKind } from "./cinderdrake/kind";
import { cindersmithKind } from "./cindersmith/kind";
import { coalmiteKind } from "./coalmite/kind";
import { crucibledroneKind } from "./crucibledrone/kind";
import { emberbatKind } from "./emberbat/kind";
import { forgeguardKind } from "./forgeguard/kind";
import type { FoundryFoe } from "./ids";
import { slaglingKind } from "./slagling/kind";
import { slagtitanKind } from "./slagtitan/kind";
import { sparkflyKind } from "./sparkfly/kind";

export const FOUNDRY_KINDS = {
  coalmite: coalmiteKind,
  sparkfly: sparkflyKind,
  slagling: slaglingKind,
  emberbat: emberbatKind,
  forgeguard: forgeguardKind,
  bellowhound: bellowhoundKind,
  crucibledrone: crucibledroneKind,
  anvilhulk: anvilhulkKind,
  cinderdrake: cinderdrakeKind,
  slagtitan: slagtitanKind,
  cindersmith: cindersmithKind,
} satisfies Record<FoundryFoe, EnemyKind>;
