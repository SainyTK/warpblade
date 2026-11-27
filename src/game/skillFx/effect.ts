import { FX_REDUCED_MOTION } from "../../constants/skillFx";
import { W } from "../../constants/stage";
import { place } from "../../engine/frame";
import { prefersReducedMotion } from "../../services/reducedMotion";
import type { Effect } from "../../types/effect";
import type { ElementKit, FxAt, FxCast, FxShape, SkillFxOptions } from "../../types/skillFx";
import { smooth } from "../../utils/math";
import { drawCracks, drawScorch, makeCracks, makeScorch, spawnAftermath } from "./aftermath";
import { castFeel, castLights } from "./feel";
import { drawMasteryMarks } from "./mastery";
import { MOVING_SHAPES, SHAPE_LIFE, SHAPES } from "./shapes";
import { threatVeil } from "./veil";

const AFTERIMAGE_STEP = 0.07;
const CRACK_LIFE = 1.6;
const FADE_FROM = 0.55;

export function createSkillEffect(
  shape: FxShape,
  cast: FxCast,
  at: FxAt,
  kit: ElementKit,
  options: SkillFxOptions,
  budgetScale: number,
): Effect {
  const life = cast.feel.life * SHAPE_LIFE[shape];
  const reduced = prefersReducedMotion();
  const afterimages =
    MOVING_SHAPES.has(shape) && budgetScale >= 1
      ? reduced
        ? FX_REDUCED_MOTION.afterimages
        : cast.feel.afterimages
      : 0;
  const extent = cast.fillsScreen ? W : (at.reach ?? 20) * cast.size + 10;
  const flip = (at.face ?? 1) < 0;
  const draw = SHAPES[shape];
  let t = -(options.delay ?? 0);
  let started = false;
  let cracks: ReturnType<typeof makeCracks> = [];
  let scorch: ReturnType<typeof makeScorch> = null;
  const total = () => (cracks.length || scorch ? life * CRACK_LIFE : life);
  const start = () => {
    started = true;
    cracks = makeCracks(cast, at);
    scorch = options.quiet ? null : makeScorch(cast, at);
    spawnAftermath(shape, cast, at, kit, options.quiet ? budgetScale * 0.5 : budgetScale);
    if (options.quiet) return;
    castLights(cast, at, budgetScale);
    castFeel(cast);
  };
  const paint = (u: number, fade: number) => {
    draw(cast, at, kit, u, fade);
    options.signature?.(cast, at, kit, u, fade);
  };
  return {
    update(dt) {
      t += dt;
      if (!started && t >= 0) start();
      return t < total();
    },
    drawBack() {
      if (t <= 0) return;
      drawScorch(scorch, kit, t, life * CRACK_LIFE);
      drawCracks(cracks, kit, t, life * CRACK_LIFE);
    },
    draw() {
      if (t < 0 || t > life) return;
      const u = t / life;
      const fade = (1 - smooth(FADE_FROM, 1, u)) * threatVeil(at.x, at.y, extent, t);
      place(at.x, at.y, flip);
      for (let k = afterimages; k >= 1; k--) {
        const back = u - k * AFTERIMAGE_STEP;
        if (back > 0) paint(back, fade * (0.32 / k));
      }
      paint(u, fade);
      if (!options.quiet) drawMasteryMarks(cast, kit, extent, u, fade);
      place();
    },
  };
}
