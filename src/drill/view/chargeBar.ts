import { FEEDBACK_EDGE } from "../../constants/effectColors";
import { W } from "../../constants/stage";
import { place, polygon } from "../../engine/frame";
import { drawFineText, fineTextWidth } from "../../scene/numberText";
import type { DrillTier, Session } from "../../types/drill";
import { scale } from "../../utils/color";
import { clamp } from "../../utils/math";
import { CHARGE_START } from "../constants";
import { canPayTier, chargedTier, payableTier } from "../simulation";

const BAR = { width: 52, height: 5, lift: 52, margin: 30, top: 16, labelGap: 8, markOver: 2 } as const;
const TEXT_CELL = 2;
const INK = {
  frame: 0x0b0814,
  track: 0x221c36,
  warmup: 0xb5d5ff,
  mark: 0xe8e6f6,
  unpaid: 0x4a4466,
  muted: 0x8a84a8,
  cooling: 0x5c5678,
} as const;

function rect(x: number, y: number, width: number, height: number, color: number, alpha = 1): void {
  if (width <= 0 || height <= 0) {
    return;
  }
  polygon(
    [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ],
    color,
    alpha,
  );
}

function label(text: string, x: number, y: number, color: number, cameraX: number): void {
  const word = text.toUpperCase();
  const half = fineTextWidth(word, TEXT_CELL) / 2 + 2;
  const center = clamp(x, cameraX + half, cameraX + W - half);
  drawFineText(word, center, y, color, scale(color, 0.78), FEEDBACK_EDGE, TEXT_CELL);
}

function headline(session: Session, held: number): { text: string; color: number } {
  const { profile, fighter } = session;
  if (fighter.chargeRecharge.remaining > 0) {
    return { text: "Recharging", color: INK.muted };
  }
  const tier = payableTier(profile, held);
  if (tier) {
    return { text: tier.name, color: tier.color };
  }
  const reached = chargedTier(profile, held);
  if (reached) {
    return { text: "No MP", color: INK.muted };
  }
  return { text: profile.tiers[0].name, color: INK.muted };
}

function markColor(tier: DrillTier, held: number, cooling: boolean): number {
  if (cooling || !canPayTier(tier)) {
    return INK.unpaid;
  }
  return held >= tier.threshold ? tier.color : INK.mark;
}

export function drawChargeBar(session: Session, cameraX: number): void {
  const { fighter, profile } = session;
  const held = fighter.chargeHeldFor;
  if (held === null || held < CHARGE_START) {
    return;
  }
  const full = profile.tiers[profile.tiers.length - 1].threshold;
  const cooling = fighter.chargeRecharge.remaining > 0;
  const center = Math.round(clamp(fighter.x, cameraX + BAR.margin, cameraX + W - BAR.margin));
  const top = Math.round(Math.max(BAR.top, fighter.y - BAR.lift));
  const left = center - BAR.width / 2;
  const share = clamp(held / full);
  const fill = cooling ? INK.cooling : (payableTier(profile, held)?.color ?? INK.warmup);
  place();
  rect(left - 1, top - 1, BAR.width + 2, BAR.height + 2, INK.frame);
  rect(left, top, BAR.width, BAR.height, INK.track);
  const firstUnpaid = profile.tiers.find((tier) => !canPayTier(tier));
  if (firstUnpaid && !cooling) {
    const from = left + (firstUnpaid.threshold / full) * BAR.width;
    rect(from, top, left + BAR.width - from, BAR.height, INK.unpaid, 0.6);
  }
  rect(left, top, BAR.width * share, BAR.height, fill);
  rect(left, top, BAR.width * share, 1, 0xffffff, cooling ? 0.15 : 0.45);
  for (const tier of profile.tiers) {
    const x = Math.round(left + (tier.threshold / full) * BAR.width) - 1;
    rect(x - 0.5, top - BAR.markOver, 2, BAR.height + BAR.markOver * 2, INK.frame);
    rect(x, top - BAR.markOver, 1, BAR.height + BAR.markOver * 2, markColor(tier, held, cooling));
  }
  const { text, color } = headline(session, held);
  label(text, center, top - BAR.labelGap, color, cameraX);
}
