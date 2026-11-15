import { createSlash } from "../../../game/effects/slash";
import { game, hero, progress } from "../../../game/state";
import type { GuardStyle } from "../../../types/moveset";
import { QI_WAVE, YUN_GUARD } from "../constants/guard";
import { SPIRIT } from "../constants/swords";
import { createQiWave } from "./effects/qiWave";
import { screenBlocked } from "./screen";
import { gainSwords } from "./swords";

/** the flick of the blade the qi wave leaves from */
const FLICK = { cx: 8, cy: -22, R: 18, sy: 0.6, rot: 0, a0: -1.6, a1: 0.4, W: 6, trail: 0.18 } as const;

/** Sword Screen: the held spirit swords fan out before him as a screen, an average block that flashes white when it
 *  holds a blow. Deflecting Qi, his parry: a qi wave leaves the blade and runs ahead, and a spirit sword joins him */
export const YUN_GUARD_STYLE: GuardStyle = {
  chip: YUN_GUARD.chip,
  blockCost: YUN_GUARD.blockCost,
  blocked: screenBlocked,
  parried() {
    game.fx.push(createSlash(hero.x, hero.y, hero.face, FLICK));
    game.fx.push(
      createQiWave(hero.x + hero.face * 10, hero.y - 20, hero.face, {
        reach: QI_WAVE.reach,
        speed: QI_WAVE.speed,
        damage: progress.stats.ad * QI_WAVE.power,
        half: QI_WAVE.half,
      }),
    );
    gainSwords(SPIRIT.gain);
  },
};
