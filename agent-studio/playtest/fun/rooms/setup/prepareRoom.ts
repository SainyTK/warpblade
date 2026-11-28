import type { Policy } from "../../../types/bot";
import type { Session } from "../../../types/session";
import type { RoomPlan, RoomSetup } from "../types";
import { cutToBossRoom } from "./cutToBossRoom";
import { enterRoom } from "./enterRoom";
import { grantShards } from "./grantShards";
import { openChests } from "./openChests";
import { raiseLevel } from "./raiseLevel";
import { spendPicks } from "./spendPicks";

export async function prepareRoom(session: Session, plan: RoomPlan, policy: Policy): Promise<RoomSetup> {
  const picks: string[] = [];
  const chests: string[] = [];
  await cutToBossRoom(session, plan.boss);
  for (const step of plan.steps) {
    await raiseLevel(session, step.level);
    picks.push(...(await spendPicks(session, policy)));
    if (step.chests > 0) {
      chests.push(...(await openChests(session, step)));
    }
  }
  await grantShards(session, plan.hearts, plan.manas);
  picks.push(...(await spendPicks(session, policy)));
  const entry = await enterRoom(session);
  return { ...entry, picks, chests };
}
