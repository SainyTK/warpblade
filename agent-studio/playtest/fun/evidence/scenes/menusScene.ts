import { WAIT } from "../constants";
import { chooseFocused, openMenuEntry } from "../menuSteps";
import type { Scene, SceneSubject } from "../types";

export function menusScene(subject: SceneSubject): Scene {
  const { plan, stage } = subject;
  return {
    name: "menus",
    async run(harness, album) {
      const session = await harness.newSession({ start: { stage } });
      try {
        await session.advance(WAIT.load);
        if (plan.has("menuStart")) {
          await album.still(session, "menu-start", "the start menu");
        }
        if (!(await openMenuEntry(session, "hero"))) {
          album.note("the start menu has no Start entry");
          return;
        }
        if (plan.has("menuHeroes")) {
          await album.still(session, "menu-heroes", "the hero screen with the first hero in focus");
        }
        if (plan.has("menuStage")) {
          await chooseFocused(session, WAIT.screen);
          await album.still(session, "menu-stage", "the stage screen after choosing the first hero");
        }
      } finally {
        await session.close();
      }
    },
  };
}
