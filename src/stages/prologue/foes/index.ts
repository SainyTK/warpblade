import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { amberwasp } from "./amberwasp/kind";
import { bat } from "./bat/kind";
import type { PrologueFoe } from "./ids";
import { ivygargoyle } from "./ivygargoyle/kind";
import { rootcaller } from "./rootcaller/kind";
import { ruinsentinel } from "./ruinsentinel/kind";
import { slime } from "./slime/kind";
import { sunbasilisk } from "./sunbasilisk/kind";
import { vinelash } from "./vinelash/kind";

export const PROLOGUE_KINDS = {
  slime,
  bat,
  vinelash,
  amberwasp,
  ruinsentinel,
  ivygargoyle,
  rootcaller,
  sunbasilisk,
} satisfies Record<PrologueFoe, EnemyKind>;
