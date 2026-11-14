import { game, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { ARRIVAL_SWORD } from "../constants/guard";
import { createArrivalSword } from "./effects/arrivalSword";
import { drawThrownJian } from "./effects/thrownJian";
import { hoverPlace } from "./hover";
import { yun } from "./state";
import { settleTassel } from "./tassel";

/** after the shared arrival blow, each held spirit sword dives onto the foe and strikes it once */
function arrived(foe: Enemy | null): void {
  settleTassel();
  if (!foe) return;
  for (let i = 0; i < yun.swords; i++) {
    const from = hoverPlace(i);
    game.fx.push(
      createArrivalSword(
        foe,
        from.x,
        from.y - ARRIVAL_SWORD.rise,
        i * ARRIVAL_SWORD.gap,
        progress.stats.ad * ARRIVAL_SWORD.power,
      ),
    );
  }
}

/** Yun's warp: the jian thrown with its tassel streaming and his wisp riding it; the spirit swords arrive with him */
export const YUN_WARP: WarpStyle = { drawThrown: drawThrownJian, arrived };
