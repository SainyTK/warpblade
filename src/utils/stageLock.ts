import { OPENS_WITH_ALL } from "../constants/stageGraph";
import { stageOpeners } from "../constants/unlocks";
import { STAGES } from "../stages";
import type { StageId } from "../types/campaign";

function listed(names: readonly string[], joiner: string): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} ${joiner} ${names[names.length - 1]}`;
}

export function stageLockText(stage: StageId): string {
  const names = stageOpeners(stage).map((id) => STAGES[id].name);
  return `Clear ${listed(names, OPENS_WITH_ALL.includes(stage) ? "and" : "or")}`;
}
