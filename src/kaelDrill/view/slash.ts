import { place } from "../../engine/frame";
import { createSlash } from "../../game/effects/slash";
import type { Effect, SlashShape } from "../../types/effect";
import { WARP_SLASH } from "../constants";
import { type ReleasedStrike, STRIKES } from "../simulation";
import { swordElementRamp } from "./swordEffects";

const ARCS = {
  first: { cx: 5, cy: -19, sy: 0.82, rot: -0.19, a0: -1.63, a1: 1.14, W: 12 },
  second: { cx: 0, cy: -15, sy: 0.23, rot: -0.06, a0: 3.38, a1: -0.22, W: 8, sweep: 0.036 },
  third: { cx: 3, cy: -23, sy: 0.72, rot: 0.13, a0: -3.12, a1: 0.91, W: 13, hold: 0.055 },
  air: { cx: 5, cy: -16, sy: 0.9, rot: -0.1, a0: -1.88, a1: 1.32, W: 10, sweep: 0.038, trail: 0.11 },
} satisfies Record<Exclude<ReleasedStrike["kind"], "warp">, Omit<SlashShape, "R">>;

function slashShape(kind: ReleasedStrike["kind"]): SlashShape {
  if (kind === "warp") {
    return WARP_SLASH;
  }
  const arc = ARCS[kind];
  return { sweep: 0.042, hold: 0.035, trail: 0.14, ...arc, R: STRIKES[kind].reach - arc.cx };
}

const OPENING_AGE = 0.018;

export function createSlashView() {
  let active: Effect[] = [];
  return {
    reset(): void {
      active = [];
    },
    step(release: ReleasedStrike | null, dt: number): void {
      active = active.filter((effect) => effect.update(dt));
      if (release) {
        const { x, y, face, kind, element } = release;
        const shape = slashShape(kind);
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
