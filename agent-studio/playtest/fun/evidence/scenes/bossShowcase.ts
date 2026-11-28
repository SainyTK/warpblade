import { KEYS } from "../../../constants/keys";
import type { Session } from "../../../types/session";
import { BOSS_CALM_STATES, CLIPS, WAIT } from "../constants";
import { never } from "../defenseMoments";
import { faceNearestFoe } from "../faceNearestFoe";
import { playOn } from "../playOn";
import type { Album, ShotPlan } from "../types";

export async function bossShowcase(
  session: Session,
  album: Album,
  plan: ShotPlan,
  name: (what: string) => string,
  boss: string,
): Promise<void> {
  if (plan.has("bossAttackClip")) {
    await session
      .waitFor(
        (state) =>
          state.menu.context !== null ||
          state.enemies.some((e) => e.rank === "boss" && e.hp > 0 && !BOSS_CALM_STATES.includes(e.state)),
        WAIT.windUp,
        "a boss attack",
      )
      .catch(() => album.note("no boss attack began before the attack clip"));
    await album.clip(session, name("boss-attack"), `${boss} attacking while the hero fights on`, () =>
      playOn(session, { until: never, limitMs: CLIPS.bossAttackMs }).then(() => undefined),
    );
  }
  if (plan.has("chargeClip")) {
    await faceNearestFoe(session);
    await album.clip(
      session,
      name("charged-skill"),
      "J held through every charge tier and released next to the boss: the hero's charged skill at its top tier",
      async () => {
        await session.keyDown(KEYS.attack);
        await session.advance(CLIPS.chargeHoldMs);
        await session.keyUp(KEYS.attack);
        await session.advance(CLIPS.chargeAfterMs);
      },
    );
  }
}
