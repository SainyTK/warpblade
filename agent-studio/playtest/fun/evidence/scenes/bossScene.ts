import { BOSS_LEVEL, BOSS_SECTION, BOSS_SHARDS, BUILDS, CLIPS, ENTRANCE_STEP, LIMITS, WAIT } from "../constants";
import { placeInArea } from "../placeInArea";
import { playOn } from "../playOn";
import { readStageNames } from "../readStageNames";
import { spendBankedPicks } from "../spendBankedPicks";
import { bossUp, never } from "../trailMoments";
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
        const placed = await placeInArea(session, { offset: ENTRANCE_STEP, bossOnly: true });
        album.assisted(
          `level ${BOSS_LEVEL} start in the last area with ${picks} banked picks spent at once, ${BOSS_SHARDS.hearts} heart and ${BOSS_SHARDS.manas} mana shards, the road packs skipped and their foes removed, the room trimmed to the boss${placed.trimmed ? "" : " (no boss beat found)"}, hero placed at the room entrance with full HP (max HP ${Math.round(placed.maxHp)})`,
        );
        const names = await readStageNames(session);
        const reached = await playOn(session, { until: (_, trail) => bossUp(trail), limitMs: LIMITS.reachBoss });
        if (reached.end !== "reached") {
          album.note(`${names.boss} was not reached (${reached.end})`);
          return;
        }
        await session.advance(WAIT.bossArrive);
        if (plan.has("bossArrival")) {
          await album.still(
            session,
            name("boss"),
            `${names.boss} arrives in the ${names.stage} boss room, with its title`,
          );
        }
        await bossShowcase(session, album, showcase, name, names.boss);
        if (showcase.has("bossFight")) {
          await playOn(session, { until: never, limitMs: CLIPS.midFightMs });
          await album.still(
            session,
            name("boss-fight"),
            `a level ${BOSS_LEVEL} ${hero} build mid fight with ${names.boss}`,
          );
        }
        if (lead && plan.has("result")) {
          await resultShot(session, album, "result", names);
        }
      } finally {
        await session.close();
      }
    },
  };
}
