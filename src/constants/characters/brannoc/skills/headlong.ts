import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "The Hunt lands headlong: foes within 30 px take 0.5x.",
    values: { power: 0.5, reach: 30, stagger: 0, drag: 0, elites: 0, path: 0, juggernaut: 0 },
  },
  { text: "Minions it strikes stagger.", values: { stagger: 1 } },
  { text: "0.8x.", values: { power: 0.8 } },
  { text: "It drags the minions it strikes in front of him.", values: { drag: 1 } },
  { text: "It reaches 45 px.", values: { reach: 45 } },
  { text: "1.1x; it drags elites too.", values: { power: 1.1, elites: 1 } },
  { text: "The hurled axe also cuts every foe it passes, 1x.", values: { path: 1 } },
  { text: "1.5x.", values: { power: 1.5 } },
]);

/** Headlong. Design: docs/skills/brannoc.md. Values (read by his warp's arrival and `tune`): power: attack damage the landing deals to each foe within reach the chop did not reach; reach: pixels round where he lands; stagger: 1 minions it strikes stagger; drag: 1 it drags the minions it strikes in front of him, into the next blow's arc; elites: 1 it drags elites too; path: attack damage each foe the hurled axe passes takes; juggernaut: 1 the landing throws the minions it strikes up (evolution) */
export const HEADLONG: SkillDef = {
  id: "b_headlong",
  name: "Headlong",
  kind: "movement",
  risk: "easy",
  button: "J",
  text: "The Hunt (J held) lands headlong, striking and dragging in the foes round where he lands.",
  levels: LEVELS,
  evolution: {
    partner: "b_reaver",
    name: "Juggernaut",
    text: "The landing reaches 60 px and throws the minions it strikes up.",
    row: evolvedRow(LEVELS[7], "The landing reaches 60 px and throws minions up.", { juggernaut: 1, reach: 60 }),
  },
};
