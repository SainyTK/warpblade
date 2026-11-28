import type { Session } from "../../types/session";
import { PAGE_MODULES } from "./constants";
import type { GameStateModule, MentorModule, TrailModule, TrailView } from "./types";

export function readTrail(session: Session): Promise<TrailView> {
  return session.page.evaluate(async (modules) => {
    const [{ trail }, mentor, { hero, progress }] = (await Promise.all([
      import(modules.trail),
      import(modules.mentor),
      import(modules.state),
    ])) as [TrailModule, MentorModule, GameStateModule];
    const beat = trail && trail.gate !== null ? (trail.route.areas[trail.area]?.beats[trail.beat] ?? null) : null;
    return {
      stage: trail?.route.stage.id ?? null,
      area: trail?.area ?? -1,
      beat: trail?.beat ?? 0,
      beatKind: beat?.kind ?? null,
      bigFoeHp: trail?.bigFoe ? trail.bigFoe.hp : null,
      surge: Boolean(trail?.surge),
      gate: trail?.gate ?? null,
      hold: trail?.hold ?? null,
      mentor: mentor.stageMentor(),
      heroX: hero.x,
      heroY: hero.y,
      picks: progress.picks,
      level: progress.level,
    };
  }, PAGE_MODULES);
}
