import type { Boon } from "../types/skill";

/**
 * Small rewards that fill the cards once fewer skills than cards are left to learn, so late picks stay a choice.
 * Each stat boon is worth about half a skill rank and stacks for the rest of the run.
 */
export const BOONS: readonly Boon[] = [
  { id: "boon_wind", name: "Second Wind", text: "Restore all HP and MP at once.", restore: true },
  { id: "boon_vigor", name: "Vigor", text: "Max HP +10 for this run.", stats: { hp: 10 } },
  { id: "boon_hone", name: "Honing", text: "Attack and spell damage +1 for this run.", stats: { ad: 1, ap: 1 } },
];
