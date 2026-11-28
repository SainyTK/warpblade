import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { GATOR_TIMES } from "./constants";

export const windupOf = (seconds: number): number => seconds * waveScale(game.wave).windup;

export const rushWindup = (): number => windupOf(GATOR_TIMES.rushWind);
export const slamWindup = (): number => windupOf(GATOR_TIMES.slamWind);
export const bellowWindup = (): number => windupOf(GATOR_TIMES.bellowWind);

export const progressOf = (e: Enemy, seconds: number): number => clamp(e.st / seconds);

export const rushing = (e: Enemy): boolean => e.state === "lunge";
export const bracing = (e: Enemy): boolean => e.state === "charge" || e.state === "lunge";
