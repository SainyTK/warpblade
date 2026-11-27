import { SKY_FLASH } from "../../constants/effectLook";
import { FX_BUDGET, FX_REDUCED_MOTION } from "../../constants/skillFx";
import { sfx } from "../../services/audio";
import { prefersReducedMotion } from "../../services/reducedMotion";
import type { FxAt, FxCast } from "../../types/skillFx";
import { game, lights } from "../state";
import { hitStop, shake } from "../world";
import { lightAllowed, shakeReady, soundReady, stopReady } from "./budget";

function playLayers(cast: FxCast): void {
  const { feel, look } = cast;
  if (!soundReady(cast.id)) return;
  sfx.layer(look.sound, 1.25 - feel.rank * 0.12, 0.35 + feel.rank * 0.15);
  if (feel.sounds >= 2) sfx.layer(look.rumble, 0.9 - cast.gradeInTier * 0.1, 0.5);
  if (feel.sounds >= 3) sfx.layer("chargeRelease", 0.75, 0.6);
  if (cast.fillsScreen) sfx.layer("boom", 0.7, 0.55);
}

export function castLights(cast: FxCast, at: FxAt, budgetScale: number): void {
  const { feel, look } = cast;
  const life = feel.life * 0.8;
  if (!lightAllowed(life)) return;
  const radius = Math.min(FX_BUDGET.maxGlow, feel.light * Math.sqrt(cast.size / feel.size) * budgetScale);
  lights.add(at.x, at.y, radius, look.ramp[3], feel.lightStrength, life);
  if (feel.bloom > 0 && lightAllowed(life * 1.4)) {
    lights.add(at.x, at.y, Math.min(FX_BUDGET.maxGlow, radius * 2), look.ramp[2], feel.bloom * 0.35, life * 1.4);
  }
}

export function castFeel(cast: FxCast): void {
  const { feel } = cast;
  const reduced = prefersReducedMotion();
  if (feel.shake && shakeReady()) {
    shake(feel.shake[0], Math.min(FX_BUDGET.maxShakeAmp, feel.shake[1] * (1 + 0.25 * cast.gradeInTier)));
  }
  if (feel.stop > 0 && stopReady()) hitStop(feel.stop * (reduced ? FX_REDUCED_MOTION.stopScale : 1));
  if (feel.flash > 0 && !reduced) game.flash = Math.max(game.flash, SKY_FLASH * feel.flash);
  playLayers(cast);
}
