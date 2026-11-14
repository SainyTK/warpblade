import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage to each foe the dodge passes, `barrier` the dodge ends behind a Bulwark, `valor` Valor for each foe passed, `burst` Shield Rush's wide burst grows by this share, `refund` stamina back for each foe passed, `ring` attack damage of a ring of light where the dodge ends */
const LEVELS = levelRows([
  { text: "Foes the dodge passes take a shield blow.", values: { power: 0.8 } },
  { text: "Shield blow 0.8 to 1.1.", values: { power: 1.1 } },
  { text: "New: the dodge ends behind a Bulwark.", values: { barrier: 1 } },
  { text: "New: 5 Valor for each foe passed.", values: { valor: 5 } },
  { text: "Shield blow 1.1 to 1.5.", values: { power: 1.5 } },
  { text: "New: Shield Rush's wide burst is 50% wider.", values: { burst: 0.5 } },
  { text: "New: 15 stamina back for each foe passed.", values: { refund: 15 } },
  { text: "Shield blow 1.5 to 2.", values: { power: 2 } },
]);

export const SHIELD_STEP: SkillDef = {
  id: "al_step",
  name: "Shield Step",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The dodge strikes each foe it passes with the shield.",
  levels: LEVELS,
  evolution: {
    partner: "al_rally",
    name: "Phalanx Step",
    text: "The dodge ends in a ring of light that strikes every foe around him, and its Bulwark takes two blows.",
    row: evolvedRow(LEVELS[7], "A ring where the dodge ends.", { ring: 2 }),
  },
};
