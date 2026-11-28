import { PLATFORMS, W } from "../../constants/stage";
import type { Platform } from "../../types/world";
import { clamp } from "../../utils/math";
import { defense } from "./defense";

export const stagePlatforms = (): readonly Platform[] => (defense ? defense.field.platforms : PLATFORMS);
export const stageWalls = (): readonly Platform[] => [];
export const stageExitX = (): number => defense?.field.width ?? W;
export const stageLeft = (): number => 0;
export const stageRight = (): number => defense?.field.width ?? W;
export const stageBounds = () => ({ left: stageLeft(), right: stageRight() });
export const clampStageX = (x: number, margin: number): number => clamp(x, stageLeft() + margin, stageRight() - margin);
