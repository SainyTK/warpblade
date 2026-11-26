import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { path: 0.8 } },
  { values: { recharge: 1.6 } },
  { values: { tempo: 2 } },
  { values: { path: 1.4 } },
  { values: { charges: 2 } },
  { values: { open: 0.8 } },
  { values: { strike: 2.4 } },
  { values: { wave: 1.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Warp recharge -15%; warp damage +30%.", drill: { cooldown: 0.85, damage: 0.3 } },
  { text: "New: the arrival cuts foes within 36 px for 0.5 AD.", drill: { cross: 36, crossPower: 0.5 } },
  { text: "Warp recharge -25%.", drill: { cooldown: 0.75 } },
  { text: "New: an arrival restores the air dash and the air cuts.", drill: { refresh: 1 } },
  { text: "Warp damage +80%; arrival cut 1 AD.", drill: { damage: 0.8, crossPower: 1 } },
  { text: "New: the arrival cut staggers.", drill: { stagger: 0.4 } },
  { text: "Warp recharge -40%; arrival cut reaches 50 px.", drill: { cooldown: 0.6, cross: 50 } },
  { text: "Warp damage +200%; arrival cut 2.5 AD.", drill: { damage: 2, crossPower: 2.5 } },
]);

export const THROWN_DUSK: SkillDef = {
  id: "ve_warp",
  name: "Thrown Dusk",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "L",
  text: "The warp strike recharges faster and hits harder, and the arrival cuts in a cross.",
  levels: LEVELS,
  evolution: {
    partner: "ve_thread",
    name: "Twin Throw",
    text: "The short blade follows the long one: the arrival cut strikes a second time a moment later.",
    row: evolvedRow(LEVELS[7], "The arrival cut strikes twice.", { twin: 2 }),
  },
};
