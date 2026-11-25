import { trail } from "./trail";

const hazard = () => trail?.route.stage.hazard;

export function resetStageHazard(): void {
  hazard()?.reset();
}

export function updateStageHazard(dt: number): void {
  hazard()?.update(dt);
}

export function drawStageHazardBack(cameraX: number, t: number): void {
  hazard()?.drawBack?.(cameraX, t);
}

export function drawStageHazardFront(cameraX: number, t: number): void {
  hazard()?.drawFront?.(cameraX, t);
}
