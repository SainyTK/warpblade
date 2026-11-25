import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` multiplies the Shield bash, `stagger` seconds added to its stagger, `valor` Valor added on a hit, `mark` extra damage the bashed foe takes for 3 s, `shock` attack damage of a shock to foes within `shockReach` behind it, `stun` seconds it knocks the foe down */
const NATIVE = levelRows([
  { text: "Shield bash +40%.", values: { power: 1.4 } },
  { text: "Shield bash staggers longer and gives 4 more Valor.", values: { stagger: 0.3, valor: 4 } },
  { text: "New: the bashed foe takes 15% more for 3 s.", values: { mark: 0.15 } },
  { text: "New: a shock hits the foes behind it.", values: { shock: 0.6, shockReach: 26 } },
  { text: "Shield bash +80%.", values: { power: 1.8 } },
  { text: "New: Shield bash knocks the foe down.", values: { stun: 0.6 } },
  { text: "New: the mark rises to 25%.", values: { mark: 0.25 } },
  { text: "Shield bash +200%; a stronger shock.", values: { power: 3, shock: 1.6 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "The Shield bash staggers foes for 0.5 s.", drill: { stagger: 0.5 } },
  { text: "New: the bash knocks foes back.", drill: { knock: 90 } },
  { text: "New: a shock hits the foes up to 26 px behind the bashed foe.", drill: { shock: 0.6, reach: 26 } },
  { text: "New: the bash adds a blow of 0.8 attack.", drill: { extra: 0.8 } },
  { text: "New: a bashed foe takes 15% more for 3 s.", drill: { mark: 0.15 } },
  { text: "Bash blow 0.8 to 1.6; the shock twice as hard.", drill: { extra: 1.6, shock: 1.2 } },
  { text: "New: the bash staggers for 1 s and the shock reaches 40 px.", drill: { stagger: 1, reach: 40 } },
  { text: "Bash blow 1.6 to 5.", drill: { extra: 5 } },
]);

export const BREAKING_BASH: SkillDef = {
  id: "al_breaker",
  name: "Breaking Bash",
  kind: "attack",
  element: "storm",
  risk: "timed",
  button: "J",
  text: "The Shield bash, the second blow of the chain, staggers, shocks the foes behind and leaves them open.",
  levels: LEVELS,
  evolution: {
    partner: "al_brand",
    name: "Shattering Bash",
    text: "The bash bursts the Sunbrand stacks of every foe it shocks.",
    row: evolvedRow(LEVELS[7], "The shock bursts Sunbrand stacks.", {
      ...drillValues({ shatter: 1.2 }),
      shatter: 1.2,
    }),
  },
};
