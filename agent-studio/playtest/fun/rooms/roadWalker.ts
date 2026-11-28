import { KEYS } from "../../constants/keys";
import type { Intent } from "../../types/bot";
import type { GameSnapshot } from "../../types/snapshot";
import { ROAD_TUNING } from "./constants";
import type { TrailInfo, Wall } from "./types";

export interface RoadWalker {
  lastProgressX: number;
  lastProgressAt: number;
  fightSince: number | null;
  ignoreFoesUntil: number;
  jumps: boolean[];
}

export type RoadStep = { kind: "fight" } | { kind: "walk"; intent: Intent };

export const freshRoadWalker = (x: number): RoadWalker => ({
  lastProgressX: x,
  lastProgressAt: 0,
  fightSince: null,
  ignoreFoesUntil: 0,
  jumps: [],
});

const walkRight = (up: boolean): Intent => ({ hold: up ? [KEYS.right, KEYS.up] : [KEYS.right], tap: [] });

export function roadStep(
  walker: RoadWalker,
  state: GameSnapshot,
  info: TrailInfo,
  walls: readonly Wall[],
  now: number,
): RoadStep {
  const tuning = ROAD_TUNING;
  if (info.heroX > walker.lastProgressX + tuning.progressStep) {
    walker.lastProgressX = info.heroX;
    walker.lastProgressAt = now;
  }
  const near = state.enemies.some(
    (foe) =>
      foe.hp > 0 &&
      Math.abs(foe.x - info.heroX) < tuning.fightReach.x &&
      Math.abs(foe.y - info.heroY) < tuning.fightReach.y,
  );
  const fighting = info.gate !== null || (near && now > walker.ignoreFoesUntil);
  if (fighting && info.gate === null) {
    walker.fightSince ??= now;
    if (now - walker.fightSince > tuning.fightPatienceMs) {
      walker.ignoreFoesUntil = now + tuning.ignoreFoesMs;
      walker.fightSince = null;
    }
  } else {
    walker.fightSince = null;
  }
  if (fighting) {
    return { kind: "fight" };
  }
  const jump = walker.jumps.shift();
  if (jump !== undefined) {
    return { kind: "walk", intent: walkRight(jump) };
  }
  const x = info.heroX;
  const wallAhead = walls.some(
    (wall) => wall.x0 - x > tuning.wallLook.behind && wall.x0 - x < tuning.wallLook.ahead && info.heroY > wall.y - 1,
  );
  const stuck = now - walker.lastProgressAt > tuning.stuckMs;
  if (state.hero.ground && (wallAhead || stuck)) {
    walker.jumps = [...tuning.jumpPlan];
    if (stuck) {
      walker.lastProgressAt = now;
    }
  }
  return { kind: "walk", intent: walkRight(false) };
}
