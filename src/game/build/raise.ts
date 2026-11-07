import { CHARMS } from "../../constants/charms";
import { SKILL_MAX_LEVEL } from "../../constants/growth";
import { learnRecipe } from "../../store/unlocks";
import type { CharmId } from "../../types/build";
import { skillOf } from "../../utils/skills";
import { feat } from "../feat";
import { character, progress } from "../state";

/** a skill is taken at level 1 or goes up a level, up to its top */
export function raiseSkill(id: string): void {
  const skills = progress.build.skills;
  const level = Math.min(SKILL_MAX_LEVEL, (skills[id] ?? 0) + 1);
  skills[id] = level;
  feat({ kind: "skillLevel", skill: id, level });
  if (level === 1 && skillOf(character, id)?.kind === "ultimate") feat({ kind: "ultimateLearned" });
}

/** a charm is taken at level 1 or goes up a level, up to its top */
export function raiseCharm(id: CharmId): void {
  const charms = progress.build.charms;
  charms[id] = Math.min(CHARMS[id].maxLevel, (charms[id] ?? 0) + 1);
}

/** a skill takes its evolved form for the rest of the run, and its partner is known from then on */
export function evolveSkill(id: string): void {
  if (progress.build.evolved.includes(id)) return;
  progress.build.evolved = [...progress.build.evolved, id];
  learnRecipe(id);
  feat({ kind: "evolved", skill: id });
}
