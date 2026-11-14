import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { HEAVY } from "../constants/string";
import { createCrescentWave } from "./effects/heavyWave";

/** seconds after a blow lands that a J press makes the next swing heavy: Heavy Hands' window, or her own */
export const keenWindow = (): number => skillValues("br_heavy").window ?? HEAVY.window;

/** a heavy swing landed: a crimson crescent flies off the blade along the swing's line */
export function heavyLanded(hits: number): void {
  const v = skillValues("br_heavy");
  game.fx.push(
    createCrescentWave({
      x: hero.x + hero.face * 16,
      y: hero.y - 18,
      face: hero.face,
      reach: HEAVY.waveReach * (1 + (v.waveReach ?? 0)),
      damage: progress.stats.ad * (HEAVY.wave + (v.wave ?? 0)),
      scale: 1 + (v.waveReach ?? 0) * 0.5,
    }),
  );
  emitSkillEvent({ type: "heavy", hits });
}
