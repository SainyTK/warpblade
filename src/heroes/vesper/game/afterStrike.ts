import { game, hero, progress } from "../../../game/state";
import { ECHO, TEMPO } from "../constants/tempo";
import type { VesperMoveId } from "../types/moves";
import { shortBlowAt } from "./blades";
import { createEchoCut } from "./effects/echoCut";
import { afterStrikeSkills, echoShare } from "./skills/strikeSkills";
import { takeStruck } from "./struck";
import { gainTempo, tempoTop } from "./tempo";

/**
 * A blow of the string is out. One that landed adds a Tempo stack, two more on a Keen move (her timing reward); at the
 * top of Tempo a short-blade blow sends an echo cut at each foe it struck; then her skills add theirs.
 */
export function afterStrike(id: string, hits: number): void {
  const foes = takeStruck();
  if (hits === 0) return;
  gainTempo(1 + (hero.keen ? TEMPO.keen : 0));
  const short = shortBlowAt(id as VesperMoveId, hero.hitIndex - 1);
  if (short && tempoTop())
    for (const foe of foes) game.fx.push(createEchoCut(foe, progress.stats.ad * ECHO.power * echoShare(), ECHO.delay));
  afterStrikeSkills(id, foes, short);
}
