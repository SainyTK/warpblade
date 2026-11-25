import { W } from "../../constants/stage";
import type { GateRoom, Patrol, StageDef } from "../../types/campaign";
import type { EnemyType } from "../../types/enemy";
import type { Platform, Point } from "../../types/world";

const EXIT_CORRIDOR = 150;
const RUN_PACE = 48;
export const GATE_ENTRY = 20;
export const STAGE_XP = 1.65;
export const SPAWN_LEAD = 84;

export interface RouteFoe extends Point {
  type: EnemyType;
  elite?: boolean;
}

export interface RouteArea {
  threat: number;
  room: GateRoom;
  parSeconds: number;
  start: number;
  entrance: number;
  exit: number;
  slabs: readonly Platform[];
  walls: readonly Platform[];
  spikes: readonly Platform[];
  pits: readonly Platform[];
  foes: readonly RouteFoe[];
  mentorSites: readonly Point[];
}

export interface Route {
  stage: StageDef;
  areas: readonly RouteArea[];
  exitX: number;
  width: number;
  platforms: readonly Platform[];
  walls: readonly Platform[];
  spikes: readonly Platform[];
  pits: readonly Platform[];
  foesTotal: number;
  parSeconds: number;
}

const offset = (p: Platform, start: number): Platform => ({ x0: p.x0 + start, x1: p.x1 + start, y: p.y });

const foeType = (stage: StageDef, patrol: Patrol): EnemyType =>
  patrol.type ?? (patrol.kind === "ground" ? stage.ground : stage.flyer);

const roomFoes = (room: GateRoom): number => (room.kind === "boss" ? 1 : room.count);

export function buildRoute(stage: StageDef, baseThreat: number): Route {
  let start = 0;
  const areas = stage.areas.map((approach): RouteArea => {
    const entrance = start + approach.length;
    const exit = entrance + W;
    const area: RouteArea = {
      threat: baseThreat + approach.rise,
      room: approach.room,
      parSeconds: approach.parSeconds,
      start,
      entrance,
      exit,
      slabs: [
        ...approach.slabs.map((slab) => offset(slab, start)),
        ...approach.arenaSlabs.map((slab) => offset(slab, entrance)),
      ],
      walls: approach.walls.map((wall) => offset(wall, start)),
      spikes: approach.spikes.map((strip) => offset(strip, start)),
      pits: (approach.pits ?? []).map((gap) => offset(gap, start)),
      foes: approach.patrol.map((patrol) => ({
        x: start + patrol.x,
        y: patrol.y,
        type: foeType(stage, patrol),
        elite: patrol.elite,
      })),
      mentorSites: approach.mentorSites.map(({ x, y }) => ({ x: start + x, y })),
    };
    start = exit;
    return area;
  });
  const exitX = areas[areas.length - 1].exit + EXIT_CORRIDOR;
  return {
    stage,
    areas,
    exitX,
    width: exitX + 36,
    platforms: areas.flatMap((area) => area.slabs),
    walls: areas.flatMap((area) => area.walls),
    spikes: areas.flatMap((area) => area.spikes),
    pits: areas.flatMap((area) => area.pits),
    foesTotal: areas.reduce((count, area) => count + area.foes.length + roomFoes(area.room), 0),
    parSeconds: Math.ceil(exitX / RUN_PACE) + areas.reduce((time, area) => time + area.parSeconds, 0),
  };
}
