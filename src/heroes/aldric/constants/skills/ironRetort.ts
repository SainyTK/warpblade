import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies the Counterbash, `window` seconds added to its moment after a block, `refund` stamina it gives back, `wave` attack damage of a wave of light at the foe it struck, `stun` seconds it knocks that foe down, `extend` seconds it adds to Radiance (or Valor when Radiance is out) */
const LEVELS = levelRows([
  { text: "Counterbash +30%.", values: { power: 1.3 } },
  { text: "Counterbash comes up to 0.1 s later after a block.", values: { window: 0.1 } },
  { text: "New: a Counterbash gives back 15 stamina.", values: { refund: 15 } },
  { text: "New: it throws a wave of light at the foe.", values: { wave: 1 } },
  { text: "Counterbash +60%.", values: { power: 1.6 } },
  { text: "New: it knocks the foe down.", values: { stun: 1 } },
  { text: "New: it adds 2 s to Radiance, or 10 Valor.", values: { extend: 2 } },
  { text: "Counterbash +100%; a heavier wave.", values: { power: 2, wave: 1.6 } },
]);

export const IRON_RETORT: SkillDef = {
  id: "al_retort",
  name: "Iron Retort",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "The Counterbash, a Guard bash just after a block, hits harder, comes easier and throws light at the foe.",
  levels: LEVELS,
  evolution: {
    partner: "al_vow",
    name: "Retribution",
    text: "The Counterbash strikes every foe in front of him at full power and its wave splits in three.",
    row: evolvedRow(LEVELS[7], "Strikes every foe ahead; three waves.", { wide: 1, waves: 3 }),
  },
};
