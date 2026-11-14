import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `needles` needles a pull-off lodges, `damage` attack damage each needle deals a tick, `max` needles a foe can carry, `keen` Keen blows lodge needles too, `mark` extra damage a needled foe takes, `dodge` perfect dodges lodge needles in the nearest foe, `burst` attack damage per needle when a foe reaches its most */
const LEVELS = levelRows([
  { text: "A parry lodges 2 jade needles in the nearest foe.", values: { needles: 2, damage: 0.15, max: 6 } },
  { text: "Needle damage 0.15 to 0.22.", values: { damage: 0.22 } },
  { text: "New: Keen blows lodge needles too.", values: { keen: 1 } },
  { text: "Needle damage 0.22 to 0.3.", values: { damage: 0.3 } },
  { text: "New: needles stack to 12.", values: { max: 12 } },
  { text: "Needle damage 0.3 to 0.4.", values: { damage: 0.4 } },
  { text: "New: a needled foe takes 15% more damage.", values: { mark: 0.15 } },
  { text: "New: perfect dodges lodge needles too; damage 0.5.", values: { dodge: 1, damage: 0.5 } },
]);

export const JADE_NEEDLE: SkillDef = {
  id: "yu_needle",
  name: "Jade Needle",
  kind: "dot",
  risk: "precise",
  button: "K",
  text: "A parry lodges jade needles in the attacker that bleed qi.",
  levels: LEVELS,
  evolution: {
    partner: "yu_flow",
    name: "Acupuncture",
    text: "At 12 needles they all burst at once for 2.5 attack damage each.",
    row: evolvedRow(LEVELS[7], "Full needles burst.", { burst: 2.5 }),
  },
};
