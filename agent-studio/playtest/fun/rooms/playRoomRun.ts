import { policyByName } from "../../bots/policies";
import type { Session } from "../../types/session";
import { dropArts } from "./dropArts";
import { playRoom } from "./playRoom";
import { prepareRoom } from "./setup";
import type { RoomRecord, RoomRunSpec } from "./types";

export async function playRoomRun(session: Session, spec: RoomRunSpec): Promise<RoomRecord> {
  const policy = policyByName(spec.policy);
  await dropArts(session);
  const setup = await prepareRoom(session, spec.plan, policy);
  const outcome = await playRoom(session, policy);
  return {
    ...outcome,
    kind: "room",
    policy: spec.policy,
    room: spec.plan.id,
    stage: spec.plan.stage,
    boss: spec.plan.boss,
    tier: spec.plan.tier,
    level: spec.plan.level,
    setup,
  };
}
