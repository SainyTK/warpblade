import { MENTOR_LEVEL, WAIT } from "../constants";
import type { Scene, SceneSubject } from "../types";
import { visitMentor } from "../visitMentor";

export function pickScene(subject: SceneSubject): Scene {
  const { hero, stage } = subject;
  return {
    name: `${hero}-${stage}-pick`,
    async run(harness, album) {
      const session = await harness.newSession({ hero, start: { stage, level: MENTOR_LEVEL } });
      try {
        await session.advance(WAIT.banner);
        const missed = await visitMentor(session, {
          atMentor: async () => undefined,
          atPick: (cards) =>
            album.still(
              session,
              "pick",
              `the skill pick opened at the stage mentor at level ${MENTOR_LEVEL}: ${cards.map((card) => card.name).join(", ")}`,
            ),
        });
        if (missed) {
          album.note(missed);
        }
      } finally {
        await session.close();
      }
    },
  };
}
