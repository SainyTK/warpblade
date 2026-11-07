import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `per` attack damage per splinter per second, `max` splinters a foe holds, `life` seconds, `finisher` lodged by
 *  the 4th hit, `crit` lodged by a crit, `spread` a full foe passes them on, `burst` power of each splinter a dying foe
 *  fires */
const LEVELS = levelRows([
  {
    text: "Sword blows lodge crystal splinters that bleed the foe.",
    values: { per: 0.05, max: 3, life: 3, finisher: 1, crit: 1 },
  },
  { text: "A foe holds 3 to 5 splinters.", values: { max: 5 } },
  { text: "Splinters bleed twice as fast.", values: { per: 0.1 } },
  { text: "New: the 4th hit lodges 3 at once.", values: { finisher: 3 } },
  { text: "New: a foe full of splinters passes them to foes beside it.", values: { spread: 1 } },
  { text: "New: a crit lodges 2; a foe holds 8.", values: { crit: 2, max: 8 } },
  { text: "New: a foe that dies fires its splinters at foes near it.", values: { burst: 0.5 } },
  { text: "Splinters bleed harder and last 5 s.", values: { per: 0.22, life: 5 } },
]);

export const CRYSTAL_SPLINTERS: SkillDef = {
  id: "k_splinters",
  name: "Crystal Splinters",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Sword blows lodge crystal splinters that bleed. Weak at first, a crowd shredder late.",
  levels: LEVELS,
  evolution: {
    partner: "k_keen",
    name: "Shatterstorm",
    text: "The 4th hit and every Keen blow shatter the splinters in the foes they hit, cutting every foe around.",
    row: evolvedRow(LEVELS[7], "Finishers and Keen blows shatter splinters.", { shatter: 0.5, shatterReach: 70 }),
  },
};
