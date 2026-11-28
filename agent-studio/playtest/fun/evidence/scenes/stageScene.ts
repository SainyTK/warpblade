import { KEYS } from "../../../constants/keys";
import { readDefense } from "../../defense";
import { CLIPS, HIT_STRIKES, LIMITS, WAIT } from "../constants";
import { foeEngaged, never } from "../defenseMoments";
import { faceNearestFoe } from "../faceNearestFoe";
import { playOn } from "../playOn";
import type { Scene, SceneSubject } from "../types";

export function stageScene(subject: SceneSubject): Scene {
  const { hero, stage, lead, plan } = subject;
  const name = (what: string): string => `${hero}-${stage}-${what}`;
  return {
    name: `${hero}-${stage}`,
    async run(harness, album) {
      const session = await harness.newSession({ hero, start: { stage } });
      try {
        await session.advance(WAIT.banner);
        const names = await readDefense(session);
        if (plan.has("start")) {
          await album.still(
            session,
            name("start"),
            `${hero} at the ${names.stageName} crystal as the defense begins, with the stage banner`,
          );
        }
        const wantsFight = plan.has("fight") || (lead && (plan.has("hitClip") || plan.has("combatClip")));
        if (!wantsFight) {
          return;
        }
        const engaged = await playOn(session, { until: foeEngaged, limitMs: LIMITS.firstFoe });
        if (engaged.end !== "reached") {
          album.note(`no foe came near in the ${names.stageName} (${engaged.end})`);
          return;
        }
        await playOn(session, { until: never, limitMs: CLIPS.fightLeadMs });
        if (plan.has("fight")) {
          await album.still(
            session,
            name("fight"),
            `${hero} fighting the first ${names.stageName} foes at the crystal, with the HUD`,
          );
        }
        if (lead && plan.has("hitClip")) {
          await faceNearestFoe(session);
          await album.clip(
            session,
            name("hit"),
            `full-size close look at ${hero}'s slashes landing on a foe: hit stop, sparks, flinch and damage numbers`,
            async () => {
              for (let strike = 0; strike < HIT_STRIKES.count; strike++) {
                await session.press(KEYS.attack, HIT_STRIKES.pressMs);
                await session.advance(HIT_STRIKES.gapMs);
              }
            },
            CLIPS.hitWidth,
          );
        }
        if (lead && plan.has("combatClip")) {
          await album.clip(
            session,
            name("combat"),
            `${hero}'s first fight in the ${names.stageName}, played by the skilled bot`,
            () => playOn(session, { until: never, limitMs: CLIPS.combatMs }).then(() => undefined),
          );
        }
      } finally {
        await session.close();
      }
    },
  };
}
