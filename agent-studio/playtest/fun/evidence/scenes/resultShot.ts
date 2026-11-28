import type { Session } from "../../../types/session";
import { LIMITS } from "../constants";
import { leaveOneHp } from "../leaveOneHp";
import { playOn } from "../playOn";
import { runOver } from "../trailMoments";
import type { Album, StageNames } from "../types";
import { waitForResult } from "../waitForResult";

export async function resultShot(session: Session, album: Album, file: string, names: StageNames): Promise<void> {
  await leaveOneHp(session);
  album.assisted("hero HP set to 1 so the boss ends the run and the result screen opens");
  const fight = await playOn(session, { until: runOver, limitMs: LIMITS.bossFight });
  if (fight.end === "timeout" || !(await waitForResult(session))) {
    album.note(`no result screen came up after the ${names.stage} boss fight (${fight.end})`);
    return;
  }
  const { lastRun } = await session.state();
  await album.still(
    session,
    file,
    `the result screen after the run ended in the ${names.stage} boss room (${lastRun.outcome})`,
  );
}
