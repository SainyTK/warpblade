import type { Policy } from "../../../types/bot";
import type { Session } from "../../../types/session";
import type { FightPlan } from "../../defense";
import type { FightSetup } from "../types";
import { grantShards } from "./grantShards";
import { openChests } from "./openChests";
import { raiseLevel } from "./raiseLevel";
import { spendPicks } from "./spendPicks";

export async function prepareFight(session: Session, plan: FightPlan, policy: Policy): Promise<FightSetup> {
  const picks: string[] = [];
  const chests: string[] = [];
  for (const step of plan.steps) {
    await raiseLevel(session, step.level);
    picks.push(...(await spendPicks(session, policy)));
    if (step.chests > 0) {
      chests.push(...(await openChests(session, step)));
    }
  }
  await raiseLevel(session, plan.level);
  const heroMaxHp = await grantShards(session, plan.hearts, plan.manas);
  picks.push(...(await spendPicks(session, policy)));
  return { level: plan.level, heroMaxHp, picks, chests };
}
