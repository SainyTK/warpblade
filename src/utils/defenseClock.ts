import {
  ALIVE_CAP_BY_SECOND,
  DEFENSE_SECONDS,
  FOES_PER_SECOND,
  FRONTS,
  type Front,
  LEVEL_BY_SECOND,
  PACK_SIZE_BY_SECOND,
  REVIVE,
} from "../constants/defense";
import { MAX_LEVEL } from "../constants/growth";
import { clamp } from "./math";

type Anchors = readonly (readonly [number, number])[];

export function alongAnchors(anchors: Anchors, at: number): number {
  const next = anchors.findIndex(([x]) => x >= at);
  if (next === 0) return anchors[0][1];
  if (next < 0) return anchors[anchors.length - 1][1];
  const [x0, y0] = anchors[next - 1];
  const [x1, y1] = anchors[next];
  return y0 + ((y1 - y0) * (at - x0)) / (x1 - x0);
}

export const levelAtSecond = (seconds: number): number =>
  clamp(alongAnchors(LEVEL_BY_SECOND, clamp(seconds, 0, DEFENSE_SECONDS)), 1, MAX_LEVEL);

const DEFENSE_MINUTES = DEFENSE_SECONDS / 60;

export const lookShareAt = (seconds: number): number => clamp(Math.floor(seconds / 60) / (DEFENSE_MINUTES - 1));

export const foesPerSecond = (seconds: number): number => alongAnchors(FOES_PER_SECOND, seconds);

export const aliveCap = (seconds: number): number => Math.round(alongAnchors(ALIVE_CAP_BY_SECOND, seconds));

export const packSize = (seconds: number): number => alongAnchors(PACK_SIZE_BY_SECOND, seconds);

export function frontAt(seconds: number): Front {
  let found = FRONTS[0];
  for (const front of FRONTS) if (front.from <= seconds) found = front;
  return found;
}

export const reviveSeconds = (falls: number): number =>
  Math.min(REVIVE.mostSeconds, REVIVE.firstSeconds * REVIVE.growth ** Math.max(0, falls));

export const secondsLeft = (elapsed: number): number => Math.max(0, DEFENSE_SECONDS - elapsed);
