import { PICK_LEVEL, WAIT } from "../constants";
import type { Scene, SceneSubject } from "../types";

export function pickScene(subject: SceneSubject): Scene {
  const { hero, stage } = subject;
  return {
    name: `${hero}-${stage}-pick`,
    async run(harness, album) {
      const session = await harness.newSession({ hero, start: { stage, level: PICK_LEVEL } });
      try {
        await session.waitFor((state) => state.pick.length > 0, WAIT.pick * 4, "the level-up cards");
        await session.advance(WAIT.pick);
        const { pick } = await session.state();
        await album.still(
          session,
          "pick",
          `the cards that open on a level up, at level ${PICK_LEVEL}: ${pick.map((card) => card.name).join(", ")}`,
        );
      } finally {
        await session.close();
      }
    },
  };
}
