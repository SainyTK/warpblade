import { type EffectSlot, effectFrameAt, effectSprite, stampEffectSprite } from "../../effectArt";
import { place } from "../../engine/frame";
import type { DrillProfile, ElementImpact, ElementProjectile, Fighter, SkillCast } from "../../types/drill";
import type { Vec } from "../../types/rig";
import { clamp, ease, smooth } from "../../utils/math";
import { SPELL_IMPACT_TIME } from "../constants";

const TIER_FLASH = 0.18;

function spriteOf(profile: DrillProfile, slot: EffectSlot | undefined) {
  return profile.art && slot ? effectSprite(profile.art, slot) : undefined;
}

export function drawBoltArt(profile: DrillProfile, { spell, x, y, face, distance }: ElementProjectile): void {
  const sprite = spriteOf(profile, spell.art);
  if (!sprite) {
    return;
  }
  place(x, y, face < 0);
  stampEffectSprite(sprite, 0, 0, { frame: effectFrameAt(sprite, distance / 240), alpha: 0.95 });
  place();
}

export function drawImpactArt(profile: DrillProfile, { spell, x, y, face, age, fromSword }: ElementImpact): void {
  const sprite = spriteOf(profile, spell.art);
  if (!sprite) {
    return;
  }
  const progress = clamp(age / SPELL_IMPACT_TIME);
  const grow = (fromSword ? 0.6 : 1) * (0.7 + 0.5 * ease.outCubic(progress));
  place(x, y, face < 0);
  stampEffectSprite(sprite, 0, 0, {
    frame: effectFrameAt(sprite, age),
    scale: grow,
    alpha: 1 - smooth(0.35, 1, progress),
    blend: "additive",
  });
  place();
}

export function drawInfusionArt(profile: DrillProfile, h: Fighter, hand: Vec, angle: number, reach: number): void {
  const sprite = spriteOf(profile, h.swordInfusion ? "infusion" : undefined);
  if (!sprite || !h.swordInfusion) {
    return;
  }
  const middle = reach * 0.55;
  const [, , width] = sprite.frames[0];
  place(h.x, h.y, h.face < 0);
  stampEffectSprite(sprite, hand[0] + Math.cos(angle) * middle, hand[1] + Math.sin(angle) * middle, {
    frame: effectFrameAt(sprite, h.swordInfusion.age),
    scale: (reach + 6) / width,
    rotation: angle,
    blend: "additive",
    alpha: 0.85,
  });
  place();
}

export function drawTierArt(profile: DrillProfile, cast: SkillCast, progress: number, fade: number): void {
  const { tier, x, y, face } = cast;
  const sprite = spriteOf(profile, tier.art);
  if (!sprite) {
    return;
  }
  const [, , width, height] = sprite.frames[0];
  const fit = (tier.around ? tier.reach * 2 : tier.reach) / width;
  const scale = fit * (0.55 + 0.45 * ease.outCubic(smooth(0, 0.16, progress)));
  const ahead = tier.around ? 0 : tier.reach * 0.5;
  place(x, y, face < 0);
  stampEffectSprite(sprite, ahead, (-height * scale) / 2, {
    frame: effectFrameAt(sprite, progress, false),
    scale,
    alpha: fade,
  });
  const flash = 1 - smooth(0, TIER_FLASH, progress);
  if (flash > 0) {
    stampEffectSprite(sprite, ahead, (-height * scale) / 2, { scale: scale * 1.08, alpha: flash, blend: "additive" });
  }
  place();
}
