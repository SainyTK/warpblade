import { GROUND, W } from "../constants/stage";
import type { Approach } from "../types/campaign";
import type { Platform } from "../types/world";

const ENTRY_CLEAR = 96;
const ROOM_CLEAR = 40;
const MARGIN = 16;
const SHIFTS = [0, 12, -12, 24, -24, 36, -36] as const;

const near = (x: number, spans: readonly Platform[]): boolean =>
  spans.some((span) => x > span.x0 - MARGIN && x < span.x1 + MARGIN);

function approachSites(approach: Approach, spacing: number, phase: number): number[] {
  const floorSpikes = approach.spikes.filter((strip) => strip.y >= GROUND);
  const mentors = approach.mentorSites.map(({ x }) => ({ x0: x, x1: x, y: GROUND }));
  const blockers = [approach.pits ?? [], approach.walls, floorSpikes, mentors];
  const sites: number[] = [];
  const free = (x: number) => !blockers.some((spans) => near(x, spans));
  for (let x = ENTRY_CLEAR + phase; x < approach.length - ROOM_CLEAR; x += spacing) {
    const shifted = SHIFTS.map((shift) => x + shift).find(free);
    if (shifted !== undefined && shifted < approach.length - ROOM_CLEAR) sites.push(shifted);
  }
  return sites;
}

export interface FloorSites {
  xs: number[];
  span: number;
}

export function floorSites(areas: readonly Approach[], spacing: number, phase: number): FloorSites {
  let start = 0;
  const xs: number[] = [];
  for (const approach of areas) {
    for (const x of approachSites(approach, spacing, phase)) xs.push(start + x);
    start += approach.length + W;
  }
  return { xs, span: start };
}
