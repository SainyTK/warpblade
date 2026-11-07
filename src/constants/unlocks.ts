import type { CharmId } from "../types/build";
import type { Unlock } from "../types/unlock";

/** Discovery across runs: what a new player starts with and what every other charm and charm slot asks. Design: docs/unlocks.md */
export const STARTING_CHARMS: readonly CharmId[] = ["might", "haste", "vigor", "insight"];
export const STARTING_CHARM_SLOTS = 3;

/** every unlock, in the order the Codex lists them within charms and slots */
export const UNLOCKS: readonly Unlock[] = [
  {
    id: "charm-persistence",
    target: { type: "charm", id: "persistence" },
    goal: { kind: "best", stat: "skillLevel", need: 4 },
    hint: "A skill kept long enough wants to stay longer.",
  },
  {
    id: "charm-resonance",
    target: { type: "charm", id: "resonance" },
    goal: { kind: "count", stat: "flowFulls", need: 1 },
    hint: "Strike without pause until the current runs over.",
  },
  {
    id: "charm-swiftness",
    target: { type: "charm", id: "swiftness" },
    goal: { kind: "best", stat: "runPerfects", need: 10 },
    hint: "Slip past enough blows in one night and your feet grow light.",
  },
  {
    id: "charm-reach",
    target: { type: "charm", id: "reach" },
    goal: { kind: "best", stat: "runSkillKills", need: 150 },
    hint: "Skills that reap enough on their own in one night want to reach further.",
  },
  {
    id: "charm-fortune",
    target: { type: "charm", id: "fortune" },
    goal: { kind: "best", stat: "chestUpgrades", need: 5 },
    hint: "Some chests hold far more than they should.",
  },
  {
    id: "charm-multitude",
    target: { type: "charm", id: "multitude" },
    goal: { kind: "best", stat: "skillLevel", need: 8 },
    hint: "A skill at its peak longs for company.",
    secret: true,
  },
  {
    id: "charm-slot-4",
    target: { type: "slot", number: 4 },
    goal: { kind: "count", stat: "chests", need: 5 },
    hint: "Open enough chests and one of them opens you.",
  },
  {
    id: "charm-slot-5",
    target: { type: "slot", number: 5 },
    goal: { kind: "count", stat: "clears", need: 1 },
    hint: "Only those who see the stage's end carry five.",
    secret: true,
  },
];
