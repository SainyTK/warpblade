import type { SkillDef } from "../../../../types/skill";
import { ULT_CHARGE } from "../../kael";
import { evolved, grow } from "./rows";

/**
 * power: the charge level's power is multiplied by this; cooldown: seconds; burn: seconds the crack burns (0 off);
 * reach: the crack's length as a share of its base; wave: a second wave's share (0 off); floor: the crack splits the
 * whole floor at every charge; heat: Heat each eruption gives; open: the evolution keeps the rift open this long,
 * erupting every second at `eruption` of the cast's power
 */
const levels = grow({ power: 1.2, cooldown: 20, burn: 0, reach: 1, wave: 0, floor: 0, heat: 0, open: 0 }, [
  ["U splits the floor in eruptions both ways.", {}],
  ["The crack keeps burning.", { burn: 3 }],
  ["A longer crack, back sooner.", { reach: 1.5, cooldown: 17 }],
  ["Eruptions much harder.", { power: 2 }],
  ["A second eruption.", { wave: 0.6 }],
  ["The whole floor splits.", { floor: 1 }],
  ["Eruptions refill Heat.", { heat: 5 }],
  ["Much harder, back sooner.", { power: 3.2, cooldown: 14 }],
]);

/** Volcanic Rift: a crack both ways that erupts under the whole crowd */
export const VOLCANIC_RIFT: SkillDef = {
  id: "y_rift",
  name: "Volcanic Rift",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Your ultimate becomes a crack that runs out both ways and erupts in pillars of fire. Grows with ability power. ${ULT_CHARGE}`,
  ultimate: "volcanicRift",
  levels,
  evolution: {
    partner: "y_overheat",
    name: "Caldera",
    text: "The rift stays open for 6 seconds, erupting across the floor every second, each eruption refilling Heat.",
    row: evolved(levels, "The rift stays open.", { open: 6, eruption: 0.25 }),
  },
};
