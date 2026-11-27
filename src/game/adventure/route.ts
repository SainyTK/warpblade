import { ROAD, SURGE } from "../../constants/campaign";
import { ENEMIES } from "../../constants/enemies";
import { W } from "../../constants/stage";
import { FOE_BAND, ROOM_BEATS, STAGE_ARCS } from "../../constants/stageArc";
import type { Approach, ArcBeat, AreaArc, Patrol, StageDef } from "../../types/campaign";
import type { EnemyType } from "../../types/enemy";
import type { Platform, Point } from "../../types/world";
import { ladderChoices, pickLadderFoe } from "../../utils/ladder";
import type { Rng } from "../../utils/rng";
import { levelBetween, type StageMods, xpBudget } from "../../utils/stageArc";
import { kindOf } from "../enemies/kinds";

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

export interface BigFoeBeat {
  kind: "elite" | "mini" | "boss";
  foe: EnemyType;
  level: number;
  xp: number;
}

export interface RoutePack {
  hold: number;
  foes: readonly RouteFoe[];
  mini?: BigFoeBeat & { x: number };
}

export interface SurgeBeat {
  kind: "surge";
  waves: readonly number[];
  from: number;
  to: number;
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
  packs: readonly RoutePack[];
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
  foesTotal: number;
  parSeconds: number;
}

const offset = (p: Platform, start: number): Platform => ({ x0: p.x0 + start, x1: p.x1 + start, y: p.y });

export const foeWeight = (type: EnemyType, elite = false): number =>
  ENEMIES[type].xp * (elite ? FOE_BAND.eliteWeight : 1);

export function ladderFoe(stage: StageDef, level: number, random: Rng, flies?: boolean): EnemyType {
  const fits = flies === undefined ? undefined : (foe: EnemyType) => kindOf(foe).flies === flies;
  return pickLadderFoe(ladderChoices(stage.ladder, level, fits), random.next());
}

function roadFoe(stage: StageDef, patrol: Patrol, level: number, random: Rng): EnemyType {
  return patrol.type ?? ladderFoe(stage, level, random, patrol.kind === "flyer");
}

function roadMini(stage: StageDef, arc: AreaArc, start: number): RoutePack | null {
  if (arc.mini === undefined) return null;
  const [xp] = xpBudget(arc.enter, arc.mini, [{ level: arc.enter, weight: 1 }]);
  const x = start + ROAD.miniAt;
  return { hold: x + ROAD.miniHold, foes: [], mini: { kind: "mini", foe: stage.mini.base, level: arc.enter, xp, x } };
}

function roadPacks(stage: StageDef, approach: Approach, arc: AreaArc, start: number, random: Rng): RoutePack[] {
  const from = arc.mini ?? arc.enter;
  const placed = approach.packs.map((pack) =>
    pack.foes.map((patrol) => {
      const level = levelBetween(from, arc.gate, patrol.x / approach.length);
      return {
        x: start + patrol.x,
        y: patrol.y,
        type: roadFoe(stage, patrol, level, random),
        elite: patrol.elite,
        level,
      };
    }),
  );
  const xp = xpBudget(
    from,
    arc.gate,
    placed.flat().map((foe) => ({ level: foe.level, weight: foeWeight(foe.type, foe.elite) })),
  );
  let next = 0;
  const packs = approach.packs.map((pack, i) => ({
    hold: start + pack.hold,
    foes: placed[i].map((foe) => ({ ...foe, xp: xp[next++] })),
  }));
  const mini = roadMini(stage, arc, start);
  return mini ? [mini, ...packs] : packs;
}

function bigFoe(stage: StageDef, beat: Exclude<ArcBeat, { kind: "surge" }>): EnemyType {
  if (beat.kind === "boss") return beat.foe ?? stage.boss;
  return stage.mini.base;
}

function roomBeats(stage: StageDef, approach: Approach, arc: AreaArc, mods: StageMods): RoomBeat[] {
  let from = arc.gate;
  return arc.beats.map((beat): RoomBeat => {
    const start = from;
    from = beat.to;
    if (beat.kind !== "surge") {
      const [xp] = xpBudget(start, beat.to, [{ level: start, weight: 1 }]);
      return { kind: beat.kind, foe: bigFoe(stage, beat), level: start, xp };
    }
    const grown = approach.roomCap + ROOM_BEATS.capPerLevel * (start - 1);
    const cap = Math.min(ROOM_BEATS.mostCap, grown * mods.crowd);
    return {
      kind: "surge",
      waves: SURGE.waves.map((share) => Math.max(1, Math.round(cap * share))),
      from: start,
      to: beat.to,
    };
  });
}

const beatFoes = (beat: RoomBeat): number => (beat.kind === "surge" ? beat.waves.reduce((n, size) => n + size, 0) : 1);

function areaPar(approach: Approach, beats: readonly RoomBeat[], packs: readonly RoutePack[]): number {
  const surgeFoes = beats.reduce((n, beat) => n + (beat.kind === "surge" ? beatFoes(beat) : 0), 0);
  const bigs = beats.filter((beat) => beat.kind !== "surge").length + packs.filter((pack) => pack.mini).length;
  return approach.parSeconds + surgeFoes * ROOM_BEATS.parPerSurgeFoe + bigs * ROOM_BEATS.parPerBigFoe;
}

const packFoes = (pack: RoutePack): number => pack.foes.length + (pack.mini ? 1 : 0);

export function buildRoute(stage: StageDef, mods: StageMods, random: Rng): Route {
  const arcs = STAGE_ARCS[stage.kind];
  let start = 0;
  const areas = stage.areas.map((approach, i): RouteArea => {
    const arc = arcs[Math.min(i, arcs.length - 1)];
    const entrance = start + approach.length;
    const exit = entrance + W;
    const beats = roomBeats(stage, approach, arc, mods);
    const packs = roadPacks(stage, approach, arc, start, random);
    const area: RouteArea = {
      enter: arc.enter,
      beats,
      parSeconds: areaPar(approach, beats, packs),
      start,
      entrance,
      exit,
      slabs: [
        ...approach.slabs.map((slab) => offset(slab, start)),
        ...approach.arenaSlabs.map((slab) => offset(slab, entrance)),
      ],
      walls: approach.walls.map((wall) => offset(wall, start)),
      spikes: approach.spikes.map((strip) => offset(strip, start)),
      packs,
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
    foesTotal: areas.reduce(
      (count, area) =>
        count +
        area.packs.reduce((n, pack) => n + packFoes(pack), 0) +
        area.beats.reduce((n, beat) => n + beatFoes(beat), 0),
      0,
    ),
    parSeconds: Math.ceil(exitX / RUN_PACE) + areas.reduce((time, area) => time + area.parSeconds, 0),
  };
}
