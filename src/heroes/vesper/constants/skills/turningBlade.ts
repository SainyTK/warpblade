import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `riposte` the parry's second cut in attack damage, `open` seconds the foes stay opened, `openBonus` opened foes
 *  take this much more, `parryTop` a parry fills Tempo, `around` the cut sweeps both sides, `blockCut` a block cuts back in
 *  attack damage, `spin` and `spinPower` (evolved) the spin's cuts and their attack damage */
const LEVELS = levelRows([
  { text: "A parry adds a cut for 2 times attack damage.", values: { riposte: 2 } },
  { text: "The foes stay opened 1.4 to 2 s.", values: { open: 2 } },
  { text: "New: opened foes take 30% more from your blows.", values: { openBonus: 0.3 } },
  { text: "The parry's cut 2 to 4.", values: { riposte: 4 } },
  { text: "New: a parry fills Tempo to the top.", values: { parryTop: 1 } },
  { text: "New: the parry's cut sweeps both sides.", values: { around: 1 } },
  { text: "Opened foes take 30% to 60% more.", values: { openBonus: 0.6 } },
  { text: "New: a block cuts back too.", values: { blockCut: 1 } },
]);

export const TURNING_BLADE: SkillDef = {
  id: "ve_turn",
  name: "Turning Blade",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "Your parry cuts harder and leaves the foes open longer.",
  levels: LEVELS,
  evolution: {
    partner: "ve_keen",
    name: "Whirling Mirror",
    text: "A parry sends both blades spinning round you: 6 cuts on every foe close by.",
    row: evolvedRow(LEVELS[7], "A parry spins both blades round you.", { spin: 6, spinPower: 0.9 }),
  },
};
