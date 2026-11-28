import { REVIVE } from "../../constants/defense";
import { PAL } from "../../constants/palette";
import { GROUND } from "../../constants/stage";
import { steadyDrillFighter } from "../../drill";
import { sfx } from "../../services/audio";
import { reviveSeconds } from "../../utils/defenseClock";
import { heroSlot } from "../coopHooks";
import { createFloorRing } from "../effects/floorRing";
import { endRun } from "../runEnd";
import { rememberPerSeat } from "../seatMemory";
import { game, hero, lights, ponytail, progress, scarf } from "../state";
import { defense } from "./defense";

const RISE_OFFSETS = [0, 14, -14, 28] as const;
let falls = 0;

rememberPerSeat({
  save: () => falls,
  load(saved) {
    falls = saved as number;
  },
  fresh: () => 0,
});

export function resetFalls(): void {
  falls = 0;
}

export function placeHero(x: number): void {
  scarf.shift(x - hero.x, GROUND - hero.y);
  ponytail.shift(x - hero.x, GROUND - hero.y);
  Object.assign(hero, { x, y: GROUND, vx: 0, vy: 0, ground: true });
}

function rise(x: number): void {
  falls++;
  placeHero(x + (RISE_OFFSETS[heroSlot()] ?? 0));
  Object.assign(hero, { hp: progress.stats.hp, inv: REVIVE.guardSeconds, st: 0 });
  hero.state = "idle";
  steadyDrillFighter();
  game.fx.push(createFloorRing(hero.x, GROUND, 36, PAL.crystal, 0.7));
  lights.add(hero.x, GROUND - 18, 70, PAL.crystal[4], 0.9, 0.8);
  sfx.levelUp();
}

export const reviveLeft = (): number | null =>
  defense && !defense.end && hero.state === "dead" ? Math.max(0, reviveSeconds(falls) - hero.st) : null;

export function heroLiesFallen(liesFor: number): void {
  const run = defense;
  if (!run) {
    if (hero.st >= liesFor) endRun("fallen");
    return;
  }
  if (run.end) return;
  if (hero.st >= reviveSeconds(falls)) rise(run.crystal.x);
}
