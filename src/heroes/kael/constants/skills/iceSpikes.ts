import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` per spike (ability power), `spikes`, `freeze` seconds, `recharge`, `chill` seconds foes beside the
 *  line are slowed, `shatter` attack power of the shards when a heavy blow breaks a frozen foe, `frozenBonus` damage
 *  frozen foes take, `burst` ability power of a frozen foe's death burst */
const LEVELS = levelRows([
  {
    text: "I sends a running line of ice spikes that freezes foes.",
    values: { power: 1.6, spikes: 4, freeze: 0.8, recharge: 9 },
  },
  { text: "Spikes 4 to 6.", values: { spikes: 6 } },
  { text: "Spike power 1.6 to 2.4; freezes longer.", values: { power: 2.4, freeze: 1.4 } },
  { text: "New: a heavy blow on a frozen foe shatters it.", values: { shatter: 0.8 } },
  { text: "New: foes beside the line are slowed; recharge 6.5 s.", values: { chill: 2, recharge: 6.5 } },
  { text: "New: frozen foes take +25% damage.", values: { frozenBonus: 0.25 } },
  { text: "New: a frozen foe that dies bursts and freezes others.", values: { burst: 1 } },
  { text: "Spike power 2.4 to 7; shards far stronger.", values: { power: 7, shatter: 3.5 } },
]);

export const ICE_SPIKES: SkillDef = {
  id: "k_frost",
  name: "Ice Spikes",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Learn the ice spell: a running line of spikes that freezes foes.",
  levels: LEVELS,
  evolution: {
    partner: "k_reap",
    name: "Glacier Bloom",
    text: "A second line runs behind Kael, and the last spike grows into a spire that bursts into freezing shards.",
    row: evolvedRow(LEVELS[7], "A line behind, and a great spire at the end.", { bloom: 1, spire: 3, bloomPower: 1.5 }),
  },
};
