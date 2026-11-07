import { FLOW } from "../../constants/growth";
import { buildStats, flowMultiplier } from "../../utils/build";
import { progress } from "../state";

/** Flow: the hero's own hits build stacks that multiply every source; time without a hit drains them, a hurt halves them */
export const flowDamage = (): number => flowMultiplier(progress.build.flow);

export function addFlow(stacks: number): void {
  const b = progress.build;
  b.flow = Math.min(buildStats(b).flowCap, b.flow + stacks);
  b.flowIdle = 0;
}

export function hurtFlow(): void {
  progress.build.flow = Math.floor(progress.build.flow * FLOW.keptOnHurt);
}

export function updateFlow(dt: number): void {
  const b = progress.build;
  b.flowIdle += dt;
  if (b.flowIdle > FLOW.grace) b.flow = Math.max(0, b.flow - FLOW.drainPerSecond * dt);
}
