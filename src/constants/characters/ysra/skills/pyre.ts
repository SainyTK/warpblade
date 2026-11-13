import type { SkillDef } from "../../../../types/skill";
import { ULT_CHARGE } from "../../../ultimate";
import { evolved, grow } from "./rows";

/**
 * Read by Pyre Wave through `ultimateValues`. power: the wave's damage is multiplied by this; reach: its roll is this
 * share longer; both: it rolls both ways; heat: Heat each foe it burns gives; cooldown: seconds; erupt: share of the
 * wave's damage the floor it crossed erupts with a moment later (0 off); pin: seconds struck foes are pinned (0 off),
 * taking `taken` more; again: a second wave at this share (0 off); whole: it crosses the whole stage; open: the
 * evolution keeps the floor erupting this many seconds, once a second at `eruption` of the wave's damage
 */
const levels = grow({ power: 1.5, reach: 1.3, both: 0, heat: 0, cooldown: 20, erupt: 0, pin: 0, again: 0 }, [
  ["Pyre Wave rolls farther and burns harder.", {}],
  ["The wave rolls both ways.", { both: 1 }],
  ["Each foe it burns gives you Heat.", { heat: 5 }],
  ["Wave damage +40%; back sooner.", { power: 2.1, cooldown: 16 }],
  ["The floor it crossed erupts in pillars of fire.", { erupt: 0.5 }],
  ["Struck foes are pinned and take more damage.", { pin: 2, taken: 0.25 }],
  ["A second wave follows the first.", { again: 0.6 }],
  ["Much harder, and it crosses the whole stage.", { power: 3, whole: 1, cooldown: 13 }],
]);

/** Pyre Wave: her one ultimate, the wall of flame, learns to roll both ways, erupt, pin and come again */
export const PYRE_WAVE: SkillDef = {
  id: "y_pyre",
  name: "Pyre Wave",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Pyre Wave rolls farther and burns harder, and grows to roll both ways, erupt, pin and come again. ${ULT_CHARGE}`,
  levels,
  evolution: {
    partner: "y_overheat",
    name: "Caldera",
    text: "The floor the wave crossed stays open for 5 seconds, erupting every second, each eruption refilling Heat.",
    row: evolved(levels, "The floor stays open and erupts.", { open: 5, eruption: 0.35 }),
  },
};
