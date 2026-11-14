import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "A warp catch slams far harder.",
    values: {
      slam: 8,
      ride: 0,
      pounds: 0,
      poundPower: 0,
      drag: 0,
      ring: 34,
      ringPower: 0.8,
      refund: 0,
      fury: 0,
      plate: 0,
    },
  },
  { text: "Slam damage up.", values: { slam: 12 } },
  { text: "The warp rides big foes and pounds them.", values: { ride: 1, pounds: 2, poundPower: 4 } },
  { text: "The dive drags foes into the slam.", values: { drag: 1 } },
  { text: "Harder slam, bigger ring.", values: { slam: 18, ring: 50, ringPower: 1.5 } },
  { text: "A catch gives the warp back.", values: { refund: 1 } },
  { text: "A catch gives Fury.", values: { fury: 0.3 } },
  { text: "A crushing slam, three pounds.", values: { slam: 46, pounds: 3, poundPower: 6 } },
]);

/** Skyfall Breaker. Design: docs/skills/hulda.md. Values: slam: attack damage of the slam; ride: 1 the warp rides a mini or boss and pounds it; pounds; poundPower; drag: 1 drags foes under the dive into the slam; ring: radius; ringPower; refund: 1 a catch gives a spent warp back; fury: share of the Fury a catch gives; plate: 1 a catch fills a plate. Evolved (Comet Grab), the warp at a minion on the floor arrives over it and rides it down */
export const SKYFALL_BREAKER: SkillDef = {
  id: "h_skyfall",
  name: "Skyfall Breaker",
  kind: "movement",
  risk: "precise",
  button: "J",
  text: "Catches from the air hit very hard: the warp clamped on a flier rides the foe down into a slam.",
  levels: LEVELS,
  evolution: {
    partner: "h_counterGrab",
    name: "Comet Grab",
    text: "A warp at a minion on the floor drops on it from above and slams it. The slam is enormous, and a catch gives strong Fury and a plate.",
    row: evolvedRow(LEVELS[7], "Every warp catch slams; Fury and a plate.", { slam: 65, fury: 0.6, plate: 1 }),
  },
};
