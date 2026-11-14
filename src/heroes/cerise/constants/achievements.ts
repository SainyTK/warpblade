import type { Achievement } from "../../../types/achievement";

/** the riposte chain Cerise must run to earn Unbroken Line, and the lifetime ripostes for Hundred Answers */
export const CHAIN_GOAL = 6;
export const RIPOSTE_GOAL = 100;

/** Cerise's own achievements: a full riposte chain in one go, and a hundred ripostes over all her runs */
export const CERISE_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "cerise-chain",
    name: "Unbroken Line",
    text: `As Cerise, land ${CHAIN_GOAL} ripostes in one chain`,
    group: "Skill",
    goal: { kind: "hero", stat: "cerise.chain", need: CHAIN_GOAL },
    reward: 50,
  },
  {
    id: "cerise-ripostes",
    name: "Hundred Answers",
    text: `As Cerise, land ${RIPOSTE_GOAL} ripostes`,
    group: "Skill",
    goal: { kind: "hero", stat: "cerise.ripostes", need: RIPOSTE_GOAL },
    reward: 60,
  },
];
