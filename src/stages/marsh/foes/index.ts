import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { bogleech } from "./bogleech";
import { bogling } from "./bogling/kind";
import { fenmidge } from "./fenmidge/kind";
import type { MarshFoe } from "./ids";
import { mossback } from "./mossback/kind";
import { reedseer } from "./reedseer/kind";
import { stormgator } from "./stormgator/kind";
import { thunderray } from "./thunderray/kind";
import { voltfly } from "./voltfly/kind";

export const MARSH_KINDS = {
  bogleech,
  bogling,
  fenmidge,
  mossback,
  voltfly,
  reedseer,
  thunderray,
  stormgator,
} satisfies Record<MarshFoe, EnemyKind>;
