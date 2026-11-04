import type { Policy } from "../types/bot";
import { mashPolicy } from "./mash";
import { skilledPolicy } from "./skilled";

export const POLICIES: Readonly<Record<string, Policy>> = { mash: mashPolicy, skilled: skilledPolicy };

export function policyByName(name: string): Policy {
  const policy = POLICIES[name];
  if (!policy) {
    throw new Error(`No bot policy "${name}". Use ${Object.keys(POLICIES).join(" or ")}.`);
  }
  return policy;
}
