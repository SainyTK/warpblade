import { HOT_IRON, MOLTEN_GUARD } from "../../../../constants/ysra/heat";
import { hasPerk } from "../../../progress";
import { hero } from "../../../state";
import { onYsra } from "../events";
import { addHeat, heatShare } from "./heat";
import { letLoose } from "./rite";

/** Molten Guard fills Heat from the brace; Hot Iron ends a hot full lunge in a free Flame Pillar */
export function listenFusions(): void {
  onYsra("parry", () => {
    if (hasPerk("moltenGuard")) addHeat(MOLTEN_GUARD.parry);
  });
  onYsra("block", () => {
    if (hasPerk("moltenGuard")) addHeat(MOLTEN_GUARD.block);
  });
  onYsra("lungeEnd", ({ x, full }) => {
    if (!full || !hasPerk("hotIron") || heatShare() < HOT_IRON.from) return;
    letLoose("flamePillar", x + hero.face * HOT_IRON.reach);
  });
}
