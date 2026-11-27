import { ENEMIES } from "../../constants/enemies";
import { W } from "../../constants/stage";
import { FOE_BAND, ROOM_BEATS, STAGE_ARCS } from "../../constants/stageArc";
import type { Approach, ArcBeat, AreaArc, Patrol, StageDef } from "../../types/campaign";
import type { EnemyType } from "../../types/enemy";
import type { Platform, Point } from "../../types/world";
import { levelBetween, type StageMods, xpBudget } from "../../utils/stageArc";

const EXIT_CORRIDOR = 150;
const RUN_PACE = 48;
export const GATE_ENTRY = 20;
export const SPAWN_LEAD = 84;

export interface RouteFoe extends Point {
  type: EnemyType;
  elite?: boolean;
  level: number;
  xp: number;
}

export interface SurgeBeat {
  kind: "surge";
  count: number;
  cap: number;
  from: number;
  to: number;
  foes: readonly EnemyType[];
}

export interface BigFoeBeat {
  kind: "elite" | "mini" | "boss";
  foe: EnemyType;
  level: number;
  xp: number;
}

export type RoomBeat = SurgeBeat | BigFoeBeat;

export interface RouteArea {
  enter: number;
  beats: readonly RoomBeat[];
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

export const foeWeight = (type: EnemyType, elite = false): number =>
  ENEMIES[type].xp * (elite ? FOE_BAND.eliteWeight : 1);

function approachFoes(stage: StageDef, approach: Approach, arc: AreaArc, start: number): RouteFoe[] {
  const placed = approach.patrol.map((patrol) => ({
    x: start + patrol.x,
    y: patrol.y,
    type: foeType(stage, patrol),
    elite: patrol.elite,
    level: levelBetween(arc.enter, arc.gate, patrol.x / approach.length),
  }));
  const xp = xpBudget(
    arc.enter,
    arc.gate,
    placed.map((foe) => ({ level: foe.level, weight: foeWeight(foe.type, foe.elite) })),
  );
  return placed.map((foe, i) => ({ ...foe, xp: xp[i] }));
}

function bigFoe(stage: StageDef, beat: Exclude<ArcBeat, { kind: "surge" }>): EnemyType {
  if (beat.kind === "boss") return beat.foe ?? stage.boss;
  return stage.mini.base;
}

function roomBeats(stage: StageDef, approach: Approach, arc: AreaArc, mods: StageMods): RoomBeat[] {
  const kinds = approach.room.foes ?? [stage.ground, stage.flyer];
  let from = arc.gate;
  return arc.beats.map((beat): RoomBeat => {
    const start = from;
    from = beat.to;
    if (beat.kind !== "surge") {
      const [xp] = xpBudget(start, beat.to, [{ level: start, weight: 1 }]);
      return { kind: beat.kind, foe: bigFoe(stage, beat), level: start, xp };
    }
    const grown = approach.room.cap + ROOM_BEATS.capPerLevel * (start - 1);
    const cap = Math.min(ROOM_BEATS.mostCap, Math.round(grown * mods.crowd));
    return { kind: "surge", count: beat.foes, cap, from: start, to: beat.to, foes: kinds };
  });
}

function areaPar(approach: Approach, beats: readonly RoomBeat[]): number {
  const surgeFoes = beats.reduce((n, beat) => n + (beat.kind === "surge" ? beat.count : 0), 0);
  const bigs = beats.filter((beat) => beat.kind !== "surge").length;
  return approach.parSeconds + surgeFoes * ROOM_BEATS.parPerSurgeFoe + bigs * ROOM_BEATS.parPerBigFoe;
}

const beatFoes = (beat: RoomBeat): number => (beat.kind === "surge" ? beat.count : 1);

export function buildRoute(stage: StageDef, mods: StageMods): Route {
  const arcs = STAGE_ARCS[stage.kind];
  let start = 0;
  const areas = stage.areas.map((approach, i): RouteArea => {
    const arc = arcs[Math.min(i, arcs.length - 1)];
    const entrance = start + approach.length;
    const exit = entrance + W;
    const beats = roomBeats(stage, approach, arc, mods);
    const area: RouteArea = {
      enter: arc.enter,
      beats,
      parSeconds: areaPar(approach, beats),
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
      foes: approachFoes(stage, approach, arc, start),
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
    foesTotal: areas.reduce(
      (count, area) => count + area.foes.length + area.beats.reduce((n, beat) => n + beatFoes(beat), 0),
      0,
    ),
    parSeconds: Math.ceil(exitX / RUN_PACE) + areas.reduce((time, area) => time + area.parSeconds, 0),
  };
}
