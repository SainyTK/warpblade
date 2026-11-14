import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `grit` attack damage each grit grinds a second, `gritMost` the most grit a foe carries, `gritHalt` seconds a foe full of grit stands held, `gritTaken` share more damage a gritted foe takes from the ring, `cyclone` grit the cyclone grinds in, `fuse` attack damage per grit when a full foe shatters, `spin` every spin grinds grit, `splash` the shatter cuts foes round it */
const LEVELS = levelRows([
  { text: "The sand ring grinds grit into foes, 0.1 a second each.", values: { grit: 0.1, gritMost: 4 } },
  { text: "Grit 0.1 to 0.15.", values: { grit: 0.15 } },
  { text: "New: a foe full of grit stands held for 0.5 s.", values: { gritHalt: 0.5 } },
  { text: "New: the ring cuts gritted foes 25% harder.", values: { gritTaken: 0.25 } },
  { text: "New: the cyclone grinds in two grit; up to 6 grit.", values: { cyclone: 2, gritMost: 6 } },
  { text: "Grit 0.15 to 0.25.", values: { grit: 0.25 } },
  { text: "New: a foe full of grit fuses to glass and shatters, 1.5 a grit.", values: { fuse: 1.5 } },
  { text: "Grit 0.25 to 1; shatter 1.5 to 6 a grit.", values: { grit: 1, fuse: 6 } },
]);

export const SCOURING_SAND: SkillDef = {
  id: "za_scour",
  name: "Scouring Sand",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "The sand ring grinds grit into foes that bleeds on its own; full of grit, they fuse to glass and shatter.",
  levels: LEVELS,
  evolution: {
    partner: "za_unbroken",
    name: "Glassing Wind",
    text: "Every spin grinds grit in, and a shatter cuts every foe round it.",
    row: evolvedRow(LEVELS[7], "Every spin grinds grit; shatters cut round them.", { spin: 1, splash: 1 }),
  },
};
