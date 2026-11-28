import type { Harness } from "../../session/harness";
import { type FightPlan, planFights } from "../defense";
import { FIGHT_KINDS } from "./constants";

export async function planSampledFights(harness: Harness, stages: readonly string[]): Promise<FightPlan[]> {
  const session = await harness.newSession();
  try {
    return await planFights(session, stages, FIGHT_KINDS);
  } finally {
    await session.close();
  }
}
