import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { barrowhound } from "./barrowhound/kind";
import { barrowlord } from "./barrowlord/kind";
import { gravedigger } from "./gravedigger/kind";
import type { MoonlitFoe } from "./ids";
import { keenwraith } from "./keenwraith/kind";
import { lanternshade } from "./lanternshade";
import { rattleskull } from "./rattleskull/kind";
import { tollbell } from "./tollbell/kind";
import { wickling } from "./wickling/kind";

export const MOONLIT_KINDS = {
  rattleskull,
  wickling,
  lanternshade,
  gravedigger,
  keenwraith,
  barrowhound,
  tollbell,
  barrowlord,
} satisfies Record<MoonlitFoe, EnemyKind>;
