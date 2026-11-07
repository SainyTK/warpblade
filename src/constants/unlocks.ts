import type { CharmId, RelicId } from "../types/build";
import type { Unlock } from "../types/unlock";

/** Discovery across runs: what a new player starts with and what every other relic, charm and slot asks. Design: docs/unlocks.md */
export const STARTING_RELICS: readonly RelicId[] = ["wisp", "shards"];
export const STARTING_CHARMS: readonly CharmId[] = ["might", "haste", "vigor", "insight"];
export const STARTING_SLOTS = { relic: 3, charm: 3 } as const;
/** a wave reached holding at most this many relics counts toward travelling light */
export const LIGHT_RELICS = 2;

/** every unlock, in the order the Codex lists them within relics, charms and slots */
export const UNLOCKS: readonly Unlock[] = [
  {
    id: "relic-daggers",
    target: { type: "relic", id: "daggers" },
    goal: { kind: "best", stat: "runBackAttacks", need: 30 },
    hint: "Strike them where they cannot see you.",
  },
  {
    id: "relic-echo",
    target: { type: "relic", id: "echo" },
    goal: { kind: "best", stat: "runBlows", need: 300 },
    hint: "A blade swung often enough begins to answer.",
  },
  {
    id: "relic-storm",
    target: { type: "relic", id: "storm" },
    goal: { kind: "best", stat: "cleared", need: 10 },
    hint: "Past the tenth gate, the sky starts to crackle.",
  },
  {
    id: "relic-aura",
    target: { type: "relic", id: "aura" },
    goal: { kind: "best", stat: "lightWave", need: 12 },
    hint: "Travel light into the deep, and the embers will find you.",
  },
  {
    id: "relic-bell",
    target: { type: "relic", id: "bell" },
    goal: { kind: "count", stat: "relicEvolutions", need: 1 },
    hint: "When one relic changes shape, another rings in answer.",
  },
  {
    id: "relic-thorns",
    target: { type: "relic", id: "thorns" },
    goal: { kind: "count", stat: "relicKills", need: 1500 },
    hint: "Let your relics reap until the ground itself grows teeth.",
    secret: true,
  },
  {
    id: "charm-persistence",
    target: { type: "charm", id: "persistence" },
    goal: { kind: "best", stat: "relicLevel", need: 4 },
    hint: "A relic kept long enough wants to stay longer.",
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
    goal: { kind: "best", stat: "runRelicKills", need: 150 },
    hint: "Relics that reap enough in one night want to reach further.",
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
    goal: { kind: "best", stat: "relicLevel", need: 8 },
    hint: "A relic at its peak longs for company.",
    secret: true,
  },
  {
    id: "relic-slot-4",
    target: { type: "slot", slot: "relic", number: 4 },
    goal: { kind: "best", stat: "wave", need: 8 },
    hint: "Go deeper than the first giant and your hands find room.",
  },
  {
    id: "charm-slot-4",
    target: { type: "slot", slot: "charm", number: 4 },
    goal: { kind: "count", stat: "chests", need: 5 },
    hint: "Open enough chests and one of them opens you.",
  },
  {
    id: "relic-slot-5",
    target: { type: "slot", slot: "relic", number: 5 },
    goal: { kind: "best", stat: "cleared", need: 20 },
    hint: "Break the gate at the end of the fourth era.",
  },
  {
    id: "charm-slot-5",
    target: { type: "slot", slot: "charm", number: 5 },
    goal: { kind: "count", stat: "clears", need: 1 },
    hint: "Only those who see the stage's end carry five.",
    secret: true,
  },
];
