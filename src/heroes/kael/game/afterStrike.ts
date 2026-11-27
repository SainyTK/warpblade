import { skillFx } from "../../../game/skillFx";
import { skillLevel, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { surfaceBelow } from "../../../game/world";
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
  skillLook(id, hits);
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

const MOVE_SKILL: Partial<Record<KaelMoveId, string>> = {
  sweep: "k_reap",
  crescentTurn: "k_reap",
  skybreaker: "k_skyward",
  phaseCut: "k_phase",
};

function skillLook(id: KaelMoveId, hits: number): void {
  const quiet = hits === 0;
  const front = { x: hero.x + hero.face * 6, y: hero.y - 16, face: hero.face };
  const skill = MOVE_SKILL[id];
  if (skill === "k_reap") {
    const v = skillValues(skill);
    skillFx(
      skill,
      "slash",
      { ...front, reach: withBuild("area", v.reach) * 0.7 },
      { damage: progress.stats.ad * v.power, quiet },
    );
  } else if (skill === "k_skyward") {
    const x = hero.x + hero.face * 14;
    const v = skillValues(skill);
    skillFx(
      skill,
      "pillar",
      { x, y: surfaceBelow(x, hero.y - 2), reach: 34 },
      { damage: progress.stats.ad * v.launch, quiet },
    );
  } else if (skill === "k_phase") {
    const v = skillValues(skill);
    const from = { x: hero.x - hero.face * 40, y: hero.y - 16, face: hero.face, toX: hero.x, toY: hero.y - 16 };
    skillFx(skill, "trail", from, { damage: progress.stats.ad * v.power, quiet });
    skillFx(skill, "mark", { x: hero.x, y: hero.y - 16 }, { quiet: true, delay: 0.05 });
  }
  if (hero.keen && skillLevel("k_keen") && hits > 0) {
    skillFx(
      "k_keen",
      "slash",
      { ...front, reach: 22 },
      { damage: progress.stats.ad * 2 * (1 + (skillValues("k_keen").bonus ?? 0)) },
    );
  }
}
