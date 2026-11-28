import { GROUND } from "../../constants/stage";
import { place } from "../../engine/frame";
import { inStageView, stageExitX } from "../../game/adventure";
import { eachStanding, heroSlot } from "../../game/coopHooks";
import { heroGuarded } from "../../game/hero/guard";
import { hurtHero } from "../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../game/state";
import type { StageHazard } from "../../types/campaign";
import { PK } from "../../types/particle";
import { inView } from "../../utils/views";
import { FORGE_SPARKS } from "./colors";
import { ventCycle } from "./vents/cycle";
import { drawVentGrate, drawVentJet, drawVentWarning } from "./vents/drawVent";
import { VENT_XS } from "./vents/sites";

const JET_HALF = 5;
const HERO_HEIGHT = 30;
const DAMAGE = { first: 14, extra: 10 } as const;
const MARGIN = 24;

const struck = new Map<string, number>();

function scald(x: number, eruption: number, height: number): void {
  const key = `${x}:${heroSlot()}`;
  if (struck.get(key) === eruption) return;
  if (Math.abs(hero.x - x) >= JET_HALF || hero.y <= GROUND - height || hero.y - HERO_HEIGHT >= GROUND) return;
  if (hero.inv > 0 || heroGuarded()) return;
  struck.set(key, eruption);
  hurtHero(DAMAGE.first + DAMAGE.extra * (x / stageExitX()), x);
}

function steam(x: number, warning: number, height: number, dt: number): void {
  if (warning > 0 && fxRng.chance(dt * 10 * warning))
    particles.spawn(PK.SMOKE, x + fxRng.range(-3, 3), GROUND - 1, fxRng.range(-4, 4), -fxRng.range(8, 18), 0.7, {
      col: 0x3a2622,
      size: fxRng.range(1.5, 2.5),
    });
  if (height > 0 && fxRng.chance(dt * 30))
    particles.spawn(PK.SPARK, x, GROUND - height, fxRng.range(-50, 50), -fxRng.range(20, 80), fxRng.range(0.3, 0.6), {
      sparks: FORGE_SPARKS.molten,
    });
}

export const foundryVents: StageHazard = {
  reset() {
    struck.clear();
  },
  update(dt) {
    for (const x of VENT_XS) {
      if (!inStageView(x, MARGIN)) continue;
      const v = ventCycle(game.t, x);
      steam(x, v.warning, v.height, dt);
      if (game.mode === "play" && v.height > 0) eachStanding(() => scald(x, v.eruption, v.height));
    }
  },
  drawBack(cameraX, t) {
    place();
    for (const x of VENT_XS) {
      if (!inView(cameraX, x, MARGIN)) continue;
      const v = ventCycle(t, x);
      drawVentGrate(x, v, t);
      drawVentWarning(x, v, t);
      drawVentJet(x, v, t);
    }
  },
};
