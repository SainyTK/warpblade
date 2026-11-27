import { ATTUNEMENT, CHARGE_RANK, MASTERY, SKILL_MAX_LEVEL } from "../../constants/growth";
import { learnRecipe } from "../../store/unlocks";
import type { Card } from "../../types/build";
import type { ArtId, ElementId } from "../../types/campaign";
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

export const ART_MAX_LEVEL = 5;

export function raiseArt(id: ArtId): void {
  const arts = progress.build.arts;
  arts[id] = Math.min(ART_MAX_LEVEL, (arts[id] ?? 0) + 1);
}

/** a skill takes its evolved form for the rest of the run, and its partner is known from then on */
export function evolveSkill(id: string): void {
  if (progress.build.evolved.includes(id)) return;
  progress.build.evolved = [...progress.build.evolved, id];
  learnRecipe(id);
  feat({ kind: "evolved", skill: id });
}

export function raiseMastery(id: string): void {
  const mastery = progress.build.mastery;
  mastery[id] = Math.min(MASTERY.levels, (mastery[id] ?? 0) + 1);
}

function raiseAttunement(id: ElementId): void {
  const attunement = progress.build.attunement;
  attunement[id] = Math.min(ATTUNEMENT.levels, (attunement[id] ?? 0) + 1);
}

export function raiseCard(card: Exclude<Card, { type: "boon" }>): void {
  const b = progress.build;
  if (card.type === "skill") raiseSkill(card.id);
  else if (card.type === "art") raiseArt(card.id);
  else if (card.type === "mastery") raiseMastery(card.id);
  else if (card.type === "charge") b.chargeRank = Math.min(CHARGE_RANK.ranks, b.chargeRank + 1);
  else if (card.type === "attunement") raiseAttunement(card.id);
  else b.honing[card.id] = (b.honing[card.id] ?? 0) + 1;
}
