import type { Session } from "../../../types/session";
import { LIMITS } from "../constants";
import { runOver } from "../defenseMoments";
import { playOn } from "../playOn";
import type { Album } from "../types";
import { waitForResult } from "../waitForResult";

export async function resultShot(session: Session, album: Album, file: string, stage: string): Promise<void> {
  const held = await playOn(session, { until: runOver, limitMs: LIMITS.holdCrystal });
  if (held.end === "timeout" || !(await waitForResult(session))) {
    album.note(`no result screen came up after the ${stage} defense (${held.end})`);
    return;
  }
  const { lastRun } = await session.state();
  await album.still(
    session,
    file,
    `the result screen after the ${stage} defense ended (${lastRun.outcome}), played on by the skilled bot`,
  );
}
