import type { Platform } from "../../types/world";
import { spikeCycle } from "../../utils/spikeCycle";
import { heroGuarded } from "../hero/guard";
import { hurtHero } from "../hurtHero";
import { game, hero } from "../state";
import { EXIT_X, STAGE_SPIKES } from "./route";
import { isAdventure } from "./trail";

const FEET_WIDTH = 4;
const FOOTING_TOLERANCE = 3;
const FIRST_DAMAGE = 13;
const EXTRA_DAMAGE = 9;

export const stageSpikes = (): readonly Platform[] => (isAdventure() ? STAGE_SPIKES : []);

export function updateSpikes(): void {
  if (game.mode !== "play" || heroGuarded()) return;
  for (const spike of stageSpikes()) {
    if (hero.x + FEET_WIDTH <= spike.x0 || hero.x - FEET_WIDTH >= spike.x1 || hero.y > spike.y + FOOTING_TOLERANCE) {
      continue;
    }
    const { height } = spikeCycle(game.t, spike.x0);
    if (height <= 0 || hero.y <= spike.y - height) continue;
    const x = (spike.x0 + spike.x1) / 2;
    hurtHero(FIRST_DAMAGE + EXTRA_DAMAGE * (x / EXIT_X), x);
    return;
  }
}
