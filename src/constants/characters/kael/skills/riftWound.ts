import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `per` attack damage per layer per second, `max` layers, `life` seconds, `slow` the wound slows the foe,
 *  `finisher` the 4th hit adds a layer, `spread` a new layer also lands on the nearest foe, `taken` damage taken per
 *  layer */
const LEVELS = levelRows([
  { text: "A warp strike opens a rift wound that drains the foe.", values: { per: 0.2, max: 3, life: 4 } },
  { text: "New: wounded foes are slowed; the wound lasts 6 s.", values: { slow: 1, life: 6 } },
  { text: "New: the 4th hit of a string adds a layer.", values: { finisher: 1 } },
  { text: "Each layer drains 0.2 to 0.5 a second.", values: { per: 0.5 } },
  { text: "New: each new layer also opens on the nearest foe.", values: { spread: 1 } },
  { text: "Up to 5 layers; each drains far more.", values: { max: 5, per: 1.2 } },
  { text: "New: each layer makes the foe take +6% damage.", values: { taken: 0.06 } },
  { text: "Each layer drains 1.2 to 2.4 a second.", values: { per: 2.4 } },
]);

export const RIFT_WOUND: SkillDef = {
  id: "k_rift",
  name: "Rift Wound",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Warp strikes open rift wounds that drain the foe; each warp deepens them.",
  levels: LEVELS,
  evolution: {
    partner: "k_warpcraft",
    name: "Rift Collapse",
    text: "A foe at full layers collapses: the wound's damage at once, doubled, and the rift pulls foes in and wounds them.",
    row: evolvedRow(LEVELS[7], "Full wounds collapse and pull foes in.", { collapse: 2, pull: 60, give: 3 }),
  },
};
