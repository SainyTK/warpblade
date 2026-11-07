import type { SkillDef } from "../../../../types/skill";

/** a level's numbers: chance a landed blow calls shards, the shards' attack damage multiple, shards per call, foes
 *  one shard strikes, and the least seconds between calls */
const row = (text: string, chance: number, power: number, shards: number, pierce: number) => ({
  text,
  values: { chance, power, shards, pierce, cooldown: 0.8 },
});

/** Crystal Familiar: the reference summon of the skill framework (docs/skill-design.md, "How to add a skill") */
export const CRYSTAL_FAMILIAR: SkillDef = {
  id: "k_familiar",
  name: "Crystal Familiar",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A landed blow may call a crystal shard that flies at the nearest foe.",
  levels: [
    row("A landed blow may call a crystal shard that flies at the nearest foe.", 0.2, 0.6, 1, 1),
    row("Calls a shard more often.", 0.25, 0.6, 1, 1),
    row("Two shards at a time.", 0.25, 0.6, 2, 1),
    row("Shards strike half again as hard.", 0.25, 0.9, 2, 1),
    row("Each shard strikes a second foe.", 0.3, 0.9, 2, 2),
    row("Shards strike harder.", 0.3, 1.3, 2, 2),
    row("Three shards at a time.", 0.3, 1.3, 3, 2),
    row("Calls often and strikes hard.", 0.4, 1.8, 3, 2),
  ],
  evolution: {
    partner: "b_edge",
    name: "Crystal Choir",
    text: "Four shards that pierce three foes, and every foe struck takes 15% more damage for 3 seconds.",
    row: {
      text: "Four shards, pierce three, and they mark foes.",
      values: { ...row("", 0.5, 2.4, 4, 3).values, mark: 0.15, markTime: 3 },
    },
  },
};
