import type { FxAt, FxSignature } from "../../../../types/skillFx";
import type { FxPoint, VesperFxLook } from "../../types/skillFx";
import { VESPER_LAYERS } from "./layers";
import { drawTwinBlades } from "./twinBlades";

function centerOf(look: VesperFxLook, at: FxAt): FxPoint {
  if (look.shape !== "trail" || at.toX === undefined) return { x: 0, y: look.lift };
  return { x: (at.toX - at.x) * (at.face ?? 1), y: (at.toY ?? at.y) - at.y };
}

export function vesperSignature(look: VesperFxLook): FxSignature {
  const layer = VESPER_LAYERS[look.layer];
  return (cast, at, kit, progress, fade) => {
    const center = centerOf(look, at);
    layer(cast, kit, progress, fade, center, at);
    drawTwinBlades(cast, kit, progress, fade, center);
  };
}
