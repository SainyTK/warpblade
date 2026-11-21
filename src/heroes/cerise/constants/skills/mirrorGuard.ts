import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `time` seconds of the stance, `recharge` seconds, `bonus` added damage of the riposte it answers with, `around` blows from
 *  behind are taken too, `points` more Points when it takes a blow, `line` it sends a Rose Line when it does */
const NATIVE = levelRows([
  { text: "I: for 0.4 s the next blow from the front is parried for you.", values: { time: 0.4, recharge: 6 } },
  { text: "New: its riposte deals +200% damage.", values: { bonus: 2 } },
  { text: "Stance 0.4 to 0.7 s.", values: { time: 0.7 } },
  { text: "New: blows from behind are parried too.", values: { around: 1 } },
  { text: "New: a parry in the stance gives 2 more Points.", values: { points: 2 } },
  { text: "Recharge 6 to 4 s.", values: { recharge: 4 } },
  { text: "New: a parry in the stance sends a Rose Line.", values: { line: 1 } },
  { text: "Riposte bonus +200% to +800%.", values: { bonus: 8 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "Rose Line strikes again for 1 AP.", drill: { line: 1 } },
  { text: "New: a mirrored line runs back from the foe it hits.", drill: { mirrors: 1 } },
  { text: "Strike 1 to 2 AP.", drill: { line: 2 } },
  { text: "New: struck foes take +15% from every source for 3 s.", drill: { taken: 0.15 } },
  { text: "New: Rose Edge hits from Rose Line strike again for 0.8 AP.", drill: { edge: 0.8 } },
  { text: "Strike 2 to 4 AP.", drill: { line: 4 } },
  { text: "New: two more mirrored lines, one each way.", drill: { mirrors: 2 } },
  { text: "Strike 4 to 8 AP; Rose Edge 2 AP.", drill: { line: 8, edge: 2 } },
]);

export const MIRROR_GUARD: SkillDef = {
  id: "ce_mirrorguard",
  name: "Mirror Guard",
  kind: "spell",
  risk: "precise",
  button: "I",
  text: "Rose Line strikes harder and its light mirrors back from the foe it hits.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Perfect Mirror",
    text: "Rose Line marks every foe within 50 px of the one it hits.",
    row: evolvedRow(LEVELS[7], "Rose Line marks every foe within 50 px.", {
      ...drillValues({ garden: 50 }),
      time: 1.2,
      bonus: 16,
    }),
  },
};
