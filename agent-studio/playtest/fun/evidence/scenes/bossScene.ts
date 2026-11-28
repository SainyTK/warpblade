import { readDefense } from "../../defense";
import { BOSS_LEVEL, BOSS_SECTION, BOSS_SHARDS, BUILDS, CLIPS, LIMITS, WAIT } from "../constants";
import { bossUp, never } from "../defenseMoments";
import { faceNearestFoe } from "../faceNearestFoe";
import { playOn } from "../playOn";
import { spendBankedPicks } from "../spendBankedPicks";
import type { Scene, SceneSubject } from "../types";
import { bossShowcase } from "./bossShowcase";
import { resultShot } from "./resultShot";

export function bossScene(subject: SceneSubject): Scene {
  const { hero, stage, lead, plan } = subject;
  const name = (what: string): string => `${hero}-${stage}-${what}`;
  const showcase = lead ? plan : new Set(plan.has("bossFight") ? (["bossFight"] as const) : []);
  return {
    name: `${hero}-${stage}-boss`,
    async run(harness, album) {
      const session = await harness.newSession({
        hero,
        start: { stage, section: BOSS_SECTION, level: BOSS_LEVEL, build: BUILDS[hero] },
      });
      try {
        await session.advance(WAIT.banner);
        const picks = await spendBankedPicks(session, BOSS_SHARDS);
        album.assisted(
          `defense started at minute ${BOSS_SECTION} at level ${BOSS_LEVEL} with a set build, ${picks} banked picks spent at once and ${BOSS_SHARDS.hearts} heart and ${BOSS_SHARDS.manas} mana shards`,
        );
        const view = await readDefense(session);
        const reached = await playOn(session, { until: bossUp, limitMs: LIMITS.reachBoss });
        if (reached.end !== "reached") {
          album.note(`${view.bossName} did not arrive (${reached.end})`);
          return;
        }
        await session.advance(WAIT.bossArrive);
        if (plan.has("bossArrival")) {
          await album.still(
            session,
            name("boss"),
            `${view.bossName} arrives at the ${view.stageName} crystal, with its title`,
          );
        }
        await bossShowcase(session, album, showcase, name, view.bossName);
        if (showcase.has("bossFight")) {
          await playOn(session, { until: never, limitMs: CLIPS.midFightMs });
          await faceNearestFoe(session, (foe) => foe.rank === "boss");
          await album.still(
            session,
            name("boss-fight"),
            `a level ${BOSS_LEVEL} ${hero} build mid fight with ${view.bossName} beside the crystal`,
          );
        }
        if (lead && plan.has("result")) {
          await resultShot(session, album, "result", view.stageName);
        }
      } finally {
        await session.close();
      }
    },
  };
}
