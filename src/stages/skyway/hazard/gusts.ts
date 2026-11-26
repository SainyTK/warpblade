import { stageAreaShare, stageGate } from "../../../game/adventure";
import { eachStanding } from "../../../game/coopHooks";
import { game, rng } from "../../../game/state";
import { sfx } from "../../../services/audio";
import { clamp } from "../../../utils/math";
import { SKYWAY_AREAS } from "../layout";
import { pushHero } from "../wind";

type Phase = "calm" | "warn" | "blow";

const TIMES = { warn: 1.1, blow: 1.9, rampIn: 0.3, rampOut: 0.4 } as const;
const AIR_PUSH = 430;
const AREA_GUSTS: readonly { strength: number; calm: readonly [number, number] }[] = [
  { strength: 0.65, calm: [6, 8.5] },
  { strength: 1, calm: [3.4, 5.2] },
  { strength: 0.8, calm: [5, 7] },
];

const gust = { phase: "calm" as Phase, left: 4, age: 0, dir: -1, strength: 0, flaps: 0 };

export const areaIndex = (): number => Math.round(stageAreaShare() * (SKYWAY_AREAS.length - 1));

const areaGusts = () => AREA_GUSTS[clamp(areaIndex(), 0, AREA_GUSTS.length - 1)];

export function resetGusts(): void {
  Object.assign(gust, { phase: "calm", left: 4, age: 0, dir: -1, strength: 0, flaps: 0 });
}

function next(phase: Phase): void {
  const area = areaGusts();
  gust.phase = phase;
  gust.age = 0;
  if (phase === "calm") gust.left = rng.range(area.calm[0], area.calm[1]);
  if (phase === "warn") {
    gust.left = TIMES.warn;
    gust.dir = rng.chance(0.5) ? 1 : -1;
    gust.strength = area.strength;
    sfx.swing(0.3);
  }
  if (phase === "blow") gust.left = TIMES.blow;
}

export function updateGusts(dt: number): void {
  gust.flaps += dt;
  if (game.mode !== "play") return;
  const sheltered = stageGate() !== null;
  if (sheltered && gust.phase === "calm") return;
  gust.age += dt;
  gust.left -= dt;
  if (gust.phase === "blow") {
    const force = AIR_PUSH * gust.dir * gust.strength * gustStrength();
    eachStanding(() => {
      pushHero(force, 0, dt);
    });
  }
  if (gust.left > 0) return;
  next(gust.phase === "calm" ? "warn" : gust.phase === "warn" ? "blow" : "calm");
}

export function gustStrength(): number {
  if (gust.phase !== "blow") return 0;
  const end = TIMES.blow - gust.age;
  return clamp(Math.min(gust.age / TIMES.rampIn, end / TIMES.rampOut));
}

export function gustWarning(): number {
  return gust.phase === "warn" ? clamp(gust.age / TIMES.warn) : 0;
}

export const gustDirection = (): number => gust.dir;
export const gustPower = (): number => gust.strength;
export const gustClock = (): number => gust.flaps;
