import type { SlashShape } from "../../../../types/effect";

/** Oath cut: a falling cut across the chest from over the shoulder */
export const OATH: SlashShape = { cx: 5, cy: -21, R: 23, sy: 0.6, rot: -0.3, a0: -2.5, a1: 0.9, W: 8 };
/** Crest breaker: a near-vertical arc from high behind the head down to the floor in front */
export const CREST: SlashShape = {
  cx: 7,
  cy: -20,
  R: 25,
  sy: 0.85,
  rot: -0.1,
  a0: -2.4,
  a1: 1.3,
  W: 12,
  hold: 0.07,
  trail: 0.28,
};
/** Sky cut: a flat cut in the air from over the shoulder */
export const SKY: SlashShape = { cx: 4, cy: -21, R: 22, sy: 0.35, rot: -0.1, a0: -2.8, a1: 0.4, W: 7 };
