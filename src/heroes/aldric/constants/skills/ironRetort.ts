import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` multiplies the Counterbash, `window` seconds added to its moment after a block, `refund` stamina it gives back, `wave` attack damage of a wave of light at the foe it struck, `stun` seconds it knocks that foe down, `extend` seconds it adds to Radiance (or Valor when Radiance is out) */
const NATIVE = levelRows([
  { text: "Counterbash +50%.", values: { power: 1.5 } },
  { text: "Counterbash comes up to 0.1 s later after a block.", values: { window: 0.1 } },
  { text: "New: a Counterbash gives back 15 stamina.", values: { refund: 15 } },
  { text: "New: it throws a wave of light at the foe.", values: { wave: 2 } },
  { text: "Counterbash three times as hard.", values: { power: 3 } },
  { text: "New: it knocks the foe down.", values: { stun: 1 } },
  { text: "New: it adds 2 s to Radiance, or 10 Valor.", values: { extend: 2 } },
  { text: "Counterbash eight times as hard; a heavier wave.", values: { power: 8, wave: 6 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "The parry window is 30% longer.", drill: { window: 1.3 } },
  { text: "New: a parry strikes the attacker with the shield, 1.2 attack.", drill: { strike: 1.2 } },
  { text: "New: a block hits back for 0.5 attack.", drill: { block: 0.5 } },
  { text: "Parry strike 1.2 to 2.4.", drill: { strike: 2.4 } },
  { text: "New: a parry staggers the attacker for 1 s.", drill: { stagger: 1 } },
  { text: "Parry window 30% to 60% longer; a block hits back for 1.2.", drill: { window: 1.6, block: 1.2 } },
  { text: "New: a parry readies the warp.", drill: { warp: 1 } },
  { text: "Parry strike 2.4 to 8.", drill: { strike: 8 } },
]);

export const IRON_RETORT: SkillDef = {
  id: "al_retort",
  name: "Iron Retort",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "A longer parry window, and the parry strikes back with the shield.",
  levels: LEVELS,
  evolution: {
    partner: "al_vow",
    name: "Retribution",
    text: "A parry throws a wave of light both ways.",
    row: evolvedRow(LEVELS[7], "A parry throws waves both ways.", {
      ...drillValues({ waves: 1.5 }),
      wide: 1,
      waves: 3,
    }),
  },
};
