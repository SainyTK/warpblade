import { CORE_SIZE, EVOLVED_INVESTMENT } from "../constants";
import type { Build } from "../types/game";

export function coreOfFour(build: Build, takenOrder: readonly string[]): string {
  const investment = (id: string): number =>
    (build.skills[id] ?? 0) + (build.mastery[id] ?? 0) + (build.evolved.includes(id) ? EVOLVED_INVESTMENT : 0);
  return Object.keys(build.skills)
    .sort((a, b) => investment(b) - investment(a) || takenOrder.indexOf(a) - takenOrder.indexOf(b))
    .slice(0, CORE_SIZE)
    .sort()
    .join(",");
}
