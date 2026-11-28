import type { Harness } from "../../session/harness";
import { planRooms } from "./planRooms";
import type { RoomPlan } from "./types";

export async function planSampledRooms(harness: Harness, stages: readonly string[]): Promise<RoomPlan[]> {
  const session = await harness.newSession();
  try {
    return await planRooms(session, stages);
  } finally {
    await session.close();
  }
}
