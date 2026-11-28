import { LIMITS, ROOM_LEAD, SURGE_LEVEL, SURGE_SHARDS, WAIT } from "../constants";
import { placeInArea } from "../placeInArea";
import { playOn } from "../playOn";
import { readStageNames } from "../readStageNames";
import { spendBankedPicks } from "../spendBankedPicks";
import type { Scene, SceneSubject } from "../types";

export function surgeScene(subject: SceneSubject): Scene {
  const { hero, stage } = subject;
  return {
    name: `${hero}-${stage}-surge`,
    async run(harness, album) {
      const session = await harness.newSession({ hero, start: { stage, level: SURGE_LEVEL } });
      try {
        await session.advance(WAIT.banner);
        const picks = await spendBankedPicks(session, SURGE_SHARDS);
        await placeInArea(session, { offset: -ROOM_LEAD, bossOnly: false });
        album.assisted(
          `level ${SURGE_LEVEL} start with ${picks} banked picks spent at once, ${SURGE_SHARDS.hearts} heart and ${SURGE_SHARDS.manas} mana shards, the road packs skipped and their foes removed, hero placed just before the first locked room with full HP`,
        );
        const names = await readStageNames(session);
        const surge = await playOn(session, { until: (_, trail) => trail.surge, limitMs: LIMITS.surge });
        if (surge.end !== "reached") {
          album.note(`no Rift Surge opened in the ${names.stage} (${surge.end})`);
          return;
        }
        await session.advance(WAIT.surgeOpen);
        await album.still(
          session,
          `${hero}-${stage}-surge`,
          `a Rift Surge in the first locked room of the ${names.stage}`,
        );
      } finally {
        await session.close();
      }
    },
  };
}
