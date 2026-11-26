import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { damage: 0.1, max: 3 } },
  { values: { damage: 0.15 } },
  { values: { from: 7 } },
  { values: { max: 5 } },
  { values: { burst: 1 } },
  { values: { damage: 0.24, from: 5 } },
  { values: { topRing: 60 } },
  { values: { damage: 0.34, burst: 1.6 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "A dash lays afterglow on foes it passes: 0.08 AD each 0.5 s, up to 3.", drill: { damage: 0.08, max: 3 } },
  { text: "New: a warp arrival lays 2 on foes within 40 px.", drill: { warp: 2 } },
  { text: "Afterglow 0.13 AD; up to 4.", drill: { damage: 0.13, max: 4 } },
  { text: "New: a glowing foe that falls bursts for 0.8 AD within 36 px.", drill: { burst: 0.8 } },
  { text: "Afterglow 0.2 AD.", drill: { damage: 0.2 } },
  { text: "New: spell hits lay afterglow too.", drill: { spells: 1 } },
  { text: "Afterglow 0.3 AD; up to 6; burst 1.6 AD.", drill: { damage: 0.3, max: 6, burst: 1.6 } },
  { text: "Afterglow 0.5 AD; burst 3 AD.", drill: { damage: 0.5, burst: 3 } },
]);

export const AFTERGLOW: SkillDef = {
  id: "ve_glow",
  name: "Afterglow",
  kind: "dot",
  element: "blaze",
  risk: "timed",
  button: "auto",
  text: "Foes your dash passes glow with dusk that burns each tick.",
  levels: LEVELS,
  evolution: {
    partner: "ve_edge",
    name: "Dusk Fire",
    text: "Every dash flares all afterglow on the stage, three ticks at once.",
    row: evolvedRow(LEVELS[7], "Each dash flares every afterglow.", {}),
  },
};
