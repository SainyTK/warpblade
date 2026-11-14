import type { Color } from "../../../types/color";
import type { Box } from "../../../types/world";
import { hex } from "../../../utils/color";
import type { CeriseAbility } from "../types/ability";

/** Cerise's abilities on I, in the order O turns through them */
export const CERISE_ABILITIES: readonly CeriseAbility[] = ["flurry", "line", "bloom", "needle", "mirror"];
/** MP each ability costs */
export const ABILITY_COST: Readonly<Record<CeriseAbility, number>> = {
  flurry: 10,
  line: 14,
  bloom: 16,
  needle: 16,
  mirror: 12,
};
/** seconds before a base ability can be cast again; the spell skills take theirs from their level */
export const BASE_RECHARGE = { flurry: 2.5, line: 4 } as const;
/** I held: the wide form costs this much more MP */
export const WIDE_COST = 1.5;

/** Flurry: thrusts every `gap` seconds from `start`, each `power` times ability power, along a narrow cone */
export const FLURRY = {
  count: 7,
  wideCount: 11,
  perPoint: 2,
  start: 0.1,
  gap: 0.045,
  power: 0.36,
  box: [-2, -30, 42, -6] as Box,
  wideBox: [-2, -52, 46, 2] as Box,
  lastKick: 160,
  wideLaunch: -230,
  /** the state lasts this long after its last thrust */
  tail: 0.16,
} as const;

/** Rose Line: a thin wave of rose light that runs the whole screen along her line, cutting each foe once */
export const ROSE_LINE = { power: 2.4, speed: 620, half: 6, height: 18, release: 0.13, dur: 0.36 } as const;

/** the colour of each ability: the glow at her hand, the HUD tab and the touch button rim */
export const ABILITY_COLOR: Readonly<Record<CeriseAbility, Color>> = {
  flurry: hex("#ff8fb0"),
  line: hex("#ffc2d6"),
  bloom: hex("#ff5f8f"),
  needle: hex("#e8d8ff"),
  mirror: hex("#ffe6ef"),
};
/** each ability's HUD tab label */
export const ABILITY_LABEL: Readonly<Record<CeriseAbility, string>> = {
  flurry: "FLURRY",
  line: "LINE",
  bloom: "BLOOM",
  needle: "NEEDLE",
  mirror: "MIRROR",
};
/** the spell skill that teaches each ability past the two base ones */
export const ABILITY_SKILL: Readonly<Record<Exclude<CeriseAbility, "flurry" | "line">, string>> = {
  bloom: "ce_bloom",
  needle: "ce_needle",
  mirror: "ce_mirrorguard",
};
