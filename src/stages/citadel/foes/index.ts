import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { duskseraph } from "./duskseraph/kind";
import { eclipseknight } from "./eclipseknight/kind";
import { hollowsquire } from "./hollowsquire/kind";
import type { CitadelFoe } from "./ids";
import { riftmote } from "./riftmote/kind";
import { riftray } from "./riftray/kind";
import { umbramite } from "./umbramite/kind";
import { voidbehemoth } from "./voidbehemoth/kind";
import { voidheadsman } from "./voidheadsman/kind";

export const CITADEL_KINDS = {
  umbramite,
  riftmote,
  hollowsquire,
  riftray,
  eclipseknight,
  duskseraph,
  voidbehemoth,
  voidheadsman,
} satisfies Record<CitadelFoe, EnemyKind>;
