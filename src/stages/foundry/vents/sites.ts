import { W } from "../../../constants/stage";
import { FOUNDRY_AREAS, FOUNDRY_VENTS } from "../layout";

const starts: number[] = [];
let start = 0;
for (const area of FOUNDRY_AREAS) {
  starts.push(start);
  start += area.length + W;
}

export const VENT_XS: readonly number[] = FOUNDRY_VENTS.flatMap((xs, i) => xs.map((x) => starts[i] + x));
