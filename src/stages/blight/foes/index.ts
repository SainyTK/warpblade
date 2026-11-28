import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { bloatcap } from "./bloatcap/kind";
import { cordywasp } from "./cordywasp/kind";
import { hyphamancer } from "./hyphamancer/kind";
import type { BlightFoe } from "./ids";
import { moldmite } from "./moldmite/kind";
import { rotbear } from "./rotbear/kind";
import { rotboar } from "./rotboar/kind";
import { rotcrawler } from "./rotcrawler/kind";
import { spitbloom } from "./spitbloom/kind";
import { sporegnat } from "./sporegnat/kind";
import { sporeheart } from "./sporeheart/kind";
import { sporepuff } from "./sporepuff/kind";
import { wardKinds } from "./ward";

export const BLIGHT_KINDS: Record<BlightFoe, EnemyKind> = wardKinds({
  moldmite,
  sporegnat,
  rotcrawler,
  sporepuff,
  spitbloom,
  rotboar,
  cordywasp,
  hyphamancer,
  bloatcap,
  rotbear,
  sporeheart,
} satisfies Record<BlightFoe, EnemyKind>);
