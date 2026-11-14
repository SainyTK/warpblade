import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values, read by the shared warp (`path`, `recharge`, `charges`, `strike`) and by her arrival: `tempo` Tempo added,
 *  `open` seconds the foes are opened, `wave` the short blade's wave in attack damage, `twin` (evolved) the ring cut */
const LEVELS = levelRows([
  { text: "The thrown blade cuts every foe it passes for 0.8 times attack damage.", values: { path: 0.8 } },
  { text: "Warp recharge 2 to 1.6 s.", values: { recharge: 1.6 } },
  { text: "New: the arrival adds 2 more Tempo.", values: { tempo: 2 } },
  { text: "Path cut 0.8 to 1.4.", values: { path: 1.4 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "New: the arrival opens the foes as a parry does, for 0.8 s.", values: { open: 0.8 } },
  { text: "Arrival blow 1.8 to 2.4.", values: { strike: 2.4 } },
  { text: "New: the short blade flies on from the arrival as a wave.", values: { wave: 1.5 } },
]);

export const THROWN_DUSK: SkillDef = {
  id: "ve_warp",
  name: "Thrown Dusk",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "Your thrown blade cuts what it passes, and the warp comes back sooner.",
  levels: LEVELS,
  evolution: {
    partner: "ve_thread",
    name: "Twin Throw",
    text: "The arrival's cross cuts every foe close by for 2 times attack damage and fills Tempo.",
    row: evolvedRow(LEVELS[7], "The arrival cuts all round you and fills Tempo.", { twin: 2 }),
  },
};
