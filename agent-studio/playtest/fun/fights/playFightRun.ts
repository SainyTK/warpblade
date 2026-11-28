import { policyByName } from "../../bots/policies";
import type { Session } from "../../types/session";
import { dropArts } from "./dropArts";
import { playFight } from "./playFight";
import { prepareFight } from "./setup";
import type { FightRecord, FightRunSpec } from "./types";

export async function playFightRun(session: Session, spec: FightRunSpec): Promise<FightRecord> {
  const policy = policyByName(spec.policy);
  await dropArts(session);
  const setup = await prepareFight(session, spec.plan, policy);
  const outcome = await playFight(session, spec.plan, policy);
  return {
    ...outcome,
    kind: "fight",
    policy: spec.policy,
    fight: spec.plan.id,
    stage: spec.plan.stage,
    foe: spec.plan.foe,
    foeKind: spec.plan.kind,
    tier: spec.plan.tier,
    designedKillSeconds: spec.plan.designedKillSeconds,
    setup,
  };
}
