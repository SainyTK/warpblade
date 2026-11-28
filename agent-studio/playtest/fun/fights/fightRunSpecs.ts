import type { PolicyName } from "../../types/bot";
import type { FightPlan } from "../defense";
import type { FightRunSpec } from "./types";

export const fightRunSpecs = (
  plans: readonly FightPlan[],
  heroes: readonly string[],
  policies: readonly PolicyName[],
): FightRunSpec[] =>
  heroes.flatMap((hero) =>
    plans.flatMap((plan) => policies.map((policy) => ({ id: `${plan.id}-${hero}-${policy}`, hero, policy, plan }))),
  );
