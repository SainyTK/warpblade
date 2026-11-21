import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` attack damage to each foe the dodge passes, `barrier` the dodge ends behind a Bulwark, `valor` Valor for each foe passed, `burst` Shield Rush's wide burst grows by this share, `refund` stamina back for each foe passed, `ring` attack damage of a ring of light where the dodge ends */
const NATIVE = levelRows([
  { text: "Foes the dodge passes take a shield blow.", values: { power: 0.8 } },
  { text: "Shield blow 0.8 to 1.1.", values: { power: 1.1 } },
  { text: "New: the dodge ends behind a Bulwark.", values: { barrier: 1 } },
  { text: "New: 5 Valor for each foe passed.", values: { valor: 5 } },
  { text: "Shield blow 1.1 to 1.5.", values: { power: 1.5 } },
  { text: "New: Shield Rush's wide burst is 50% wider.", values: { burst: 0.5 } },
  { text: "New: 15 stamina back for each foe passed.", values: { refund: 15 } },
  { text: "Shield blow 1.5 to 2.", values: { power: 2 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Dashing through foes bashes them, 0.6 attack.", drill: { bash: 0.6 } },
  { text: "New: the dash bash staggers.", drill: { stagger: 0.4 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Dash bash 0.6 to 1.2.", drill: { bash: 1.2 } },
  { text: "New: each foe bashed takes 0.5 s off the warp's recharge.", drill: { warp: 0.5 } },
  { text: "Dash bash 1.2 to 2.", drill: { bash: 2 } },
  { text: "New: the dash bash knocks foes away.", drill: { knock: 120 } },
  { text: "Dash bash 2 to 5.", drill: { bash: 5 } },
]);

export const SHIELD_STEP: SkillDef = {
  id: "al_step",
  name: "Shield Step",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Dashing through foes bashes them with the shield.",
  levels: LEVELS,
  evolution: {
    partner: "al_rally",
    name: "Phalanx Step",
    text: "Every dash ends in a ring of light.",
    row: evolvedRow(LEVELS[7], "Every dash ends in a ring.", {
      ...drillValues({ ring: 1.5 }),
      ring: 2,
    }),
  },
};
