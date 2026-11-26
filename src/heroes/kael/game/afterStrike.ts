import { skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { KaelMoveId } from "../types/moves";
import { createEcho } from "./effects/echo";
import { afterKeenMove } from "./keen";
import { KAEL_MOVES } from "./moves";
import { afterSweep } from "./reap";
import { kael } from "./state";

/** a move's blow is out: when it was the move's last, Keen Edge counts it, and a phase cut opens Phase Cut's back
 *  bonus and leaves its afterimage; the finisher closes Phantom Passage */
export function afterStrike(id: KaelMoveId, hits: number): void {
  if (hero.hitIndex < KAEL_MOVES[id].hits.length) return;
  afterKeenMove(hits);
  if (id === "phaseCut") afterPhase(hits);
  if (id === "sweep") afterSweep();
  if (hero.chain >= progress.comboLimit) kael.passage = false;
}

/** Phase Cut: back attacks hit harder for a while, and an afterimage repeats the cut on the foe */
function afterPhase(hits: number): void {
  const v = skillValues("k_phase");
  if (v.backTime) kael.phaseBack = withBuild("duration", v.backTime);
  const foe = hero.lastHit;
  if (!v.echo || !hits || !foe || foe.hp <= 0) return;
  // Kael lands past the foe still facing on, so the echo cuts it back toward where he came from
  game.fx.push(createEcho(foe, progress.stats.ad * v.power * v.echo, -hero.face, "k_phase"));
}
