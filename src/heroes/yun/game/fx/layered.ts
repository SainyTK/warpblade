import type { FxShapeDraw } from "../../../../types/skillFx";

export function layered(...draws: readonly (FxShapeDraw | undefined)[]): FxShapeDraw {
  return (cast, at, kit, progress, fade) => {
    for (const draw of draws) draw?.(cast, at, kit, progress, fade);
  };
}
