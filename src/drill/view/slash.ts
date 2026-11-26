import { place } from "../../engine/frame";
import { createSlash } from "../../game/effects/slash";
import type { DrillStrikeId, Session } from "../../types/drill";
import type { Effect, SlashShape } from "../../types/effect";
import { swordElementRamp } from "./swordEffects";

function slashShape({ profile, modifiers }: Session, kind: DrillStrikeId | "warp"): SlashShape {
  if (kind === "warp") {
    return profile.warpSlash;
  }
  const { arc, reach } = profile.strikes[kind];
  return { sweep: 0.042, hold: 0.035, trail: 0.14, ...arc, R: reach * modifiers.strikeReach - arc.cx };
}

const OPENING_AGE = 0.018;

export function createSlashView() {
  let active: Effect[] = [];
  return {
    step(session: Session, dt: number): void {
      active = active.filter((effect) => effect.update(dt));
      const release = session.releasedStrike;
      if (release) {
        const { x, y, face, kind, element } = release;
        const shape = slashShape(session, kind);
        const effect = createSlash(x, y, face, element ? { ...shape, ramp: swordElementRamp(element) } : shape);
        effect.update(OPENING_AGE);
        active.push(effect);
      }
    },
    draw(): void {
      for (const effect of active) {
        effect.draw();
      }
      place();
    },
  };
}
