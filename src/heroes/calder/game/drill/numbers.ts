import { skillValues } from "../../../../game/skills/query";

const PREFIX = "drill.";

export function drillNumbers(id: string): Record<string, number> {
  return Object.fromEntries(
    Object.entries(skillValues(id))
      .filter(([key]) => key.startsWith(PREFIX))
      .map(([key, value]) => [key.slice(PREFIX.length), value]),
  );
}
