import type { Session } from "../../types/session";
import { FIGHTER_MODULES } from "./constants";
import type { DrillModule, FighterProbe, FighterStateModule } from "./types";

export async function readFighter(session: Session): Promise<FighterProbe> {
  const probe = await session.page.evaluate(async (modules) => {
    const [drill, game] = (await Promise.all([import(modules.drill), import(modules.state)])) as [
      DrillModule,
      FighterStateModule,
    ];
    const fighter = drill.drillFighter();
    const hero = game.hero;
    return {
      state: String(hero.state),
      x: hero.x,
      y: hero.y,
      vy: hero.vy,
      face: hero.face,
      ground: hero.ground,
      mp: hero.mp,
      hp: hero.hp,
      maxHp: game.progress.stats.hp,
      swing: fighter?.swing?.kind ?? null,
      swingAge: fighter?.swing?.age ?? 0,
      dash: fighter?.dashTime ?? 0,
      guard: fighter ? (fighter.guardAge ?? null) !== null || (fighter.parryAge ?? null) !== null : false,
      warp: fighter?.warp?.phase ?? null,
      release: Boolean(fighter?.spellRelease),
      infusion: Boolean(fighter?.swordInfusion),
      skillCast: Boolean(fighter?.skillCast),
    };
  }, FIGHTER_MODULES);
  return { t: session.elapsedMs(), ...probe };
}
