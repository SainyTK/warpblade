import type { MoveId } from "../../../types/move";
import { createEcho } from "../../effects/echo";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { MOVES } from "../moves";
import { afterKeenMove } from "./keen";
import { afterSweep } from "./reap";
import { kael } from "./state";

/** a move's blow is out: when it was the move's last, Keen Edge counts it, and a phase cut opens Phase Cut's back
 *  bonus and leaves its afterimage; the finisher closes Phantom Passage */
export function afterStrike(id: MoveId, hits: number): void {
  if (hero.hitIndex < MOVES[id].hits.length) return;
  afterKeenMove(hits);
  if (id === "phaseCut") afterPhase(hits);
  if (id === "sweep") afterSweep();
  if (hero.chain >= progress.comboLimit) kael.passage = false;
}

/** Phase Cut: back attacks hit harder for a while, and an afterimage repeats the cut on the foe */
function afterPhase(hits: number): void {
  const v = skillValues("k_phase");
  if (v.backTime) kael.phaseBack = withCharms("duration", v.backTime);
  const foe = hero.lastHit;
  if (!v.echo || !hits || !foe || foe.hp <= 0) return;
  game.fx.push(createEcho(foe, progress.stats.ad * v.power * v.echo, hero.face, "k_phase"));
}
