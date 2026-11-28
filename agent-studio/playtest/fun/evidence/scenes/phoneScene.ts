import type { Viewport } from "../../../types/session";
import { readDefense } from "../../defense";
import { CLIPS, LIMITS, WAIT } from "../constants";
import { foeEngaged, never } from "../defenseMoments";
import { playOn } from "../playOn";
import { spendPicksInDialog } from "../spendPicksInDialog";
import type { Scene, SceneSubject } from "../types";

export function phoneScene(subject: SceneSubject, viewport: Viewport): Scene {
  const { hero, stage } = subject;
  const size = `${viewport.width}x${viewport.height}`;
  return {
    name: `phone-${size}`,
    async run(harness, album) {
      const session = await harness.newSession({ hero, viewport, start: { stage } });
      try {
        await spendPicksInDialog(session);
        await session.advance(WAIT.banner);
        const names = await readDefense(session);
        const engaged = await playOn(session, { until: foeEngaged, limitMs: LIMITS.firstFoe });
        if (engaged.end !== "reached") {
          album.note(`no foe came near at ${size} (${engaged.end})`);
          return;
        }
        await playOn(session, { until: never, limitMs: CLIPS.fightLeadMs });
        await album.window(
          session,
          `phone-${size}-fight`,
          `${hero} fighting in the ${names.stageName} at phone size ${size}, full window with the HUD`,
        );
      } finally {
        await session.close();
      }
    },
  };
}
