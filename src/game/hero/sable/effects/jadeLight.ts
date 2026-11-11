import { JADE_LIGHT, type JadeLight } from "../../../../constants/sable/look";
import { lights } from "../../../state";
import { skin } from "../../skin";

/** one of her small lights, in a saturated step of her ramp */
export function jadeLight(x: number, y: number, kind: JadeLight): void {
  const [radius, strength, life] = JADE_LIGHT[kind];
  lights.add(x, y, radius, skin.ramp[3], strength, life);
}
