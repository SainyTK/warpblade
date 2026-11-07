import { skillValues } from "../../skills/query";

/** the rank a skill stands for, until the hero's skills are designed: its old tree rank, read from the skill's level */
export const rankOf = (id: string): number => skillValues(id).rank ?? 0;
