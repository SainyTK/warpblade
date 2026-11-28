import { readDefense } from "../../defense";
import { LIMITS, SIEGE_LEVEL, SIEGE_SECTION, SIEGE_SHARDS, WAIT } from "../constants";
import { underSiege } from "../defenseMoments";

import { spendBankedPicks } from "../spendBankedPicks";
import { standGuard } from "../standGuard";
import type { Scene, SceneSubject } from "../types";

export function siegeScene(subject: SceneSubject): Scene {
  const { hero, stage } = subject;
  return {
    name: `${hero}-${stage}-siege`,
    async run(harness, album) {
      const session = await harness.newSession({
        hero,
        start: { stage, section: SIEGE_SECTION, level: SIEGE_LEVEL },
      });
      try {
        await session.advance(WAIT.banner);
        const picks = await spendBankedPicks(session, SIEGE_SHARDS);
        album.assisted(
          `defense started at minute ${SIEGE_SECTION}, when foes come from all four sides, at level ${SIEGE_LEVEL} with ${picks} banked picks spent at once and ${SIEGE_SHARDS.hearts} heart and ${SIEGE_SHARDS.manas} mana shards; the hero stands still beside the crystal so the siege stays in frame`,
        );
        const siege = await standGuard(session, { until: underSiege, limitMs: LIMITS.siege });
        const { stageName } = await readDefense(session);
        if (siege.end === "ended") {
          album.note(`the ${stageName} defense ended before the crystal came under siege`);
          return;
        }
        if (siege.end === "timeout") {
          album.note(`the crystal was not struck with many foes on the field within ${LIMITS.siege / 1000} s`);
        }
        await album.still(
          session,
          `${hero}-${stage}-siege`,
          `the ${stageName} crystal under siege from every side with ${hero} beside it`,
        );
      } finally {
        await session.close();
      }
    },
  };
}
