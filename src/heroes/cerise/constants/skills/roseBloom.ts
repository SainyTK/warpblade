import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `power` AP of the bloom, `reach` px round her, `recharge` seconds, `linger` seconds petals stay, `tick` AP
 *  each tick of them, `launch` it throws foes up, `heal` HP per foe struck, `points` a Point for every two foes struck; evolved `echoes` blooms */
const NATIVE = levelRows([
  {
    text: "The bloom bursts on every foe within 60 px.",
    values: { power: 1.6, reach: 40, recharge: 6 },
  },
  { text: "New: petals linger 2 s and cut foes inside.", values: { linger: 2, tick: 0.3 } },
  { text: "New: the bloom throws foes up; reach 40 to 56 px.", values: { reach: 56, launch: 1 } },
  { text: "New: heals 3 HP for each foe struck.", values: { heal: 3 } },
  { text: "Bloom 1.6 to 3 AP.", values: { power: 3 } },
  { text: "New: a Point for every two foes struck.", values: { points: 1 } },
  { text: "Recharge 6 to 4 s.", values: { recharge: 4 } },
  { text: "Bloom 3 to 5 AP; petals 0.3 to 0.6 AP a tick.", values: { power: 5, tick: 0.6 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "Rose Bloom strikes again for 1.2 AP.", drill: { bloom: 1.2, ring: 26, tick: 0.3 } },
  { text: "New: the bloom bleeds its foe.", drill: { bleed: 0.15 } },
  { text: "New: petals linger 2 s and cut foes inside, 0.3 AP a tick.", drill: { linger: 2 } },
  { text: "Strike 1.2 to 2.2 AP.", drill: { bloom: 2.2 } },
  { text: "New: the bloom binds 0.5 s longer; the ring is wider.", drill: { hold: 0.5, ring: 40 } },
  { text: "Strike 2.2 to 4 AP; petals 0.6 AP.", drill: { bloom: 4, tick: 0.6 } },
  { text: "New: the bloom throws its foe up; Rose Edge hits from it strike for 1 AP.", drill: { launch: 1, edge: 1 } },
  { text: "Strike 4 to 8 AP; petals 1.2 AP.", drill: { bloom: 8, tick: 1.2 } },
]);

export const ROSE_BLOOM: SkillDef = {
  id: "ce_bloom",
  name: "Rose Bloom",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Rose Bloom strikes harder and leaves a ring of cutting petals.",
  levels: LEVELS,
  evolution: {
    partner: "ce_petals",
    name: "Full Bloom",
    text: "The bloom bursts twice more at half strength, wider each time.",
    row: evolvedRow(LEVELS[7], "The bloom bursts on every foe within 60 px.", {
      ...drillValues({ full: 60 }),
      echoes: 2,
    }),
  },
};
