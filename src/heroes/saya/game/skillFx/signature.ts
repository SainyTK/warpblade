import type { FxAt, FxSignature } from "../../../../types/skillFx";
import type { FxPoint, SayaFxLook } from "../../types/skillFx";
import { SAYA_LAYERS } from "./layers";
import { drawReleasedCuts } from "./releasedCuts";

function centerOf(look: SayaFxLook, at: FxAt): FxPoint {
  if (look.shape !== "trail" || at.toX === undefined) return { x: 0, y: look.lift };
  return { x: (at.toX - at.x) * (at.face ?? 1), y: (at.toY ?? at.y) - at.y };
}

export function sayaSignature(look: SayaFxLook): FxSignature {
  const layer = SAYA_LAYERS[look.layer];
  return (cast, at, kit, progress, fade) => {
    const center = centerOf(look, at);
    layer(cast, kit, progress, fade, center, at);
    drawReleasedCuts(cast, kit, progress, fade, center);
  };
}
