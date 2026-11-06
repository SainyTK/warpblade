import type { PatchKind } from "../../../src/types/patch.ts";
import { BIG_PATCH_EVERY_DAYS } from "../constants.ts";
import { daysBetween } from "./dates.ts";

export interface ShippedPatch {
  version: string;
  kind: PatchKind;
  date: string;
}

/** big during the hero sprint, when no patch has shipped yet, when the day's work on main has a headline,
    or when the last big one is BIG_PATCH_EVERY_DAYS or more days old */
export function patchKindFor(
  date: string,
  shipped: ShippedPatch[],
  dayHeadline: boolean,
  heroSprint: boolean,
): PatchKind {
  if (heroSprint || dayHeadline) return "big";
  const lastBig = shipped.filter((p) => p.kind === "big").sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!lastBig) return "big";
  return daysBetween(lastBig.date, date) >= BIG_PATCH_EVERY_DAYS ? "big" : "small";
}

function parse(version: string): [number, number, number] {
  const [major, minor, patch] = version.split(".").map(Number);
  return [major, minor, patch];
}

/** big patches raise the minor number, small ones the patch number */
export function nextVersion(current: string, kind: PatchKind): string {
  const [major, minor, patch] = parse(current);
  return kind === "big" ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
}
