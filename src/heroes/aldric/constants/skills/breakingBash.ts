import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies the Shield bash, `stagger` seconds added to its stagger, `valor` Valor added on a hit, `mark` extra damage the bashed foe takes for 3 s, `shock` attack damage of a shock to foes within `shockReach` behind it, `stun` seconds it knocks the foe down */
const LEVELS = levelRows([
  { text: "Shield bash +40%.", values: { power: 1.4 } },
  { text: "Shield bash staggers longer and gives 4 more Valor.", values: { stagger: 0.3, valor: 4 } },
  { text: "New: the bashed foe takes 15% more for 3 s.", values: { mark: 0.15 } },
  { text: "New: a shock hits the foes behind it.", values: { shock: 0.6, shockReach: 26 } },
  { text: "Shield bash +80%.", values: { power: 1.8 } },
  { text: "New: Shield bash knocks the foe down.", values: { stun: 0.6 } },
  { text: "New: the mark rises to 25%.", values: { mark: 0.25 } },
  { text: "Shield bash +120%; a stronger shock.", values: { power: 2.2, shock: 1 } },
]);

export const BREAKING_BASH: SkillDef = {
  id: "al_breaker",
  name: "Breaking Bash",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The string's Shield bash hits harder, marks the foe and sends a shock through to the foes behind it.",
  levels: LEVELS,
  evolution: {
    partner: "al_brand",
    name: "Shattering Bash",
    text: "Shield bash bursts every Sunbrand on the foes it reaches, each stack a heavy hit.",
    row: evolvedRow(LEVELS[7], "Bursts Sunbrand stacks it reaches.", { shatter: 1.2 }),
  },
};
