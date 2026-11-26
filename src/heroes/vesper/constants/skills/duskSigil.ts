import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { damage: 0.06, max: 3, duration: 3 } },
  { values: { damage: 0.1 } },
  { values: { long: 1 } },
  { values: { max: 5 } },
  { values: { spread: 1 } },
  { values: { damage: 0.16, duration: 4 } },
  { values: { taken: 0.15 } },
  { values: { damage: 0.24, max: 6 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "A landed cut lays a sigil: 0.06 AD each 0.5 s, up to 4.", drill: { damage: 0.06, max: 4 } },
  { text: "New: a warp strike lays 3 sigils.", drill: { warp: 3 } },
  { text: "Sigils 0.1 AD; up to 6.", drill: { damage: 0.1, max: 6 } },
  { text: "New: a slain foe's sigils jump to the nearest foe.", drill: { jump: 1 } },
  { text: "Sigils 0.16 AD.", drill: { damage: 0.16 } },
  { text: "New: the moonrise blooms the sigils, 0.35 AD each at once.", drill: { bloom: 0.35 } },
  { text: "New: an infused cut lays 2 more; up to 8.", drill: { infused: 2, max: 8 } },
  { text: "Sigils 0.4 AD; bloom 0.8 AD each.", drill: { damage: 0.4, bloom: 0.8 } },
]);

export const DUSK_SIGIL: SkillDef = {
  id: "ve_hex",
  name: "Dusk Sigil",
  kind: "dot",
  element: "venom",
  risk: "easy",
  button: "auto",
  text: "Your cuts lay dusk sigils that cut the foe on each tick.",
  levels: LEVELS,
  evolution: {
    partner: "ve_moon",
    name: "Sigil Bloom",
    text: "Falling Moon blooms every sigil on the foes it strikes.",
    row: evolvedRow(LEVELS[7], "Falling Moon blooms the sigils.", { bloom: 1 }),
  },
};
