import type { PolicyName } from "../../types/bot";
import type { RoomPlan, RoomRunSpec } from "./types";

export const roomRunSpecs = (
  plans: readonly RoomPlan[],
  heroes: readonly string[],
  policies: readonly PolicyName[],
): RoomRunSpec[] =>
  heroes.flatMap((hero) =>
    plans.flatMap((plan) => policies.map((policy) => ({ id: `${plan.id}-${hero}-${policy}`, hero, policy, plan }))),
  );
