import { sfx } from "../../../../services/audio";

/** a high glassy ring as a foe's shards break: one per foe, however many shards it held */
export function shardsBreak(): void {
  sfx.tone(2600, 3400, 0.08, "triangle", 0.05);
  sfx.tone(3900, 3100, 0.12, "sine", 0.03, 0.025);
}
