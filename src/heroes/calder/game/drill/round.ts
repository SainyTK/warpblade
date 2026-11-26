import { enemyCenter } from "../../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../../game/skills/events";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { CalderRound } from "../../types/events";
import { blastAt } from "../blastFoe";
import { createMuzzleFlash } from "../effects/muzzleFlash";
import { createTracerLine } from "../effects/tracerLine";

const CHAMBER = 6;
const chamber = { fired: 0 };

export interface DrillRound {
  power: number;
  kind: CalderRound;
  hot?: boolean;
  big?: boolean;
  stagger?: number;
  source?: string;
}

function muzzle(): [number, number] {
  return [hero.x + hero.face * 18, hero.y - 18];
}

export function fireRound(foe: Enemy | null, round: DrillRound, at?: readonly [number, number]): Enemy[] {
  const [x, y] = at ?? (foe ? enemyCenter(foe) : [hero.x + hero.face * 30, hero.y - 18]);
  const [mx, my] = muzzle();
  game.fx.push(createMuzzleFlash(mx, my, hero.face > 0 ? 0 : Math.PI));
  game.fx.push(createTracerLine(mx, my, x, y));
  const ad = progress.stats.ad;
  const struck = blastAt(foe, x, y, {
    damage: ad * round.power,
    splash: ad * round.power * 0.4,
    reach: 18,
    kx: 50,
    hot: round.hot ?? false,
    big: round.big,
    stagger: round.stagger,
    source: round.source,
  });
  emitSkillEvent({ type: "calderBlast", x, y, foes: struck, kind: round.kind });
  if (round.kind === "trigger") {
    emitSkillEvent({ type: "calderTrigger", foe, x, y });
  }
  chamber.fired++;
  if (chamber.fired % CHAMBER === 0) {
    emitSkillEvent({ type: "calderReload", quick: true, ultimate: false });
  }
  return struck;
}

export function resetChamber(): void {
  chamber.fired = 0;
}
