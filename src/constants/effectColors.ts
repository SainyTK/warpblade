import type { CueWord, DamageTag } from "../types/game";
import { hex } from "../utils/color";
import { COIN_GOLD, PAL, XP_GLOW } from "./palette";

/** the dark edge around damage numbers and small feedback drawn over the fight */
export const FEEDBACK_EDGE = hex("#120d1c");

/** the ink of each kind of damage number */
export const NUMBER_INK: Record<DamageTag | CueWord, number> = {
  normal: hex("#f4f0ff"),
  crit: hex("#ffe26b"),
  back: hex("#ff9a4a"),
  air: hex("#7fe3ff"),
  burn: hex("#c98a3a"),
  block: hex("#8a84a8"),
  break: hex("#ff6a5a"),
  shatter: hex("#cbf1ff"),
  evade: hex("#b673e8"),
  perfect: hex("#a8ecff"),
  parry: hex("#ffd27a"),
  broken: hex("#ff6a5a"),
};
/** numbers of a skill's own hits in duller inks of the same hues */
export const NUMBER_INK_QUIET: Partial<Record<DamageTag | CueWord, number>> = {
  normal: hex("#a29cc4"),
  crit: hex("#c9a74e"),
  air: hex("#5fa8c0"),
};

/** the minion HP bar: the lost part, and the dark line under it */
export const HP_BAR = { empty: hex("#2a1c3a"), edge: hex("#0c0714") } as const;
/** the stars circling over a tripped foe */
export const STUN_STAR = hex("#ffe26b");
export const STUN_STAR_DIM = hex("#c98a3a");

/** an image pixel picture's colors by the letter that stands for each in its rows */
export type PixelColors = Readonly<Record<string, number>>;

const coin = (dark: number, shade: number, face: number, light: number): PixelColors => ({
  d: dark,
  g: shade,
  G: face,
  L: light,
  W: 0xffffff,
});
/** a coin showing its front, with a white glint, and its back */
export const COIN_FRONT = coin(COIN_GOLD[1], COIN_GOLD[2], COIN_GOLD[3], COIN_GOLD[4]);
export const COIN_BACK: PixelColors = { ...COIN_FRONT, W: COIN_GOLD[3], L: COIN_GOLD[3] };

/** an experience orb, and the same orb on the bright beat of its pulse */
export const XP_ORB: PixelColors = { d: XP_GLOW[1], l: XP_GLOW[2], L: XP_GLOW[3], H: XP_GLOW[4], W: XP_GLOW[4] };
export const XP_ORB_BRIGHT: PixelColors = { ...XP_ORB, W: 0xffffff, L: XP_GLOW[4] };

/** a mana or heal mote from its ramp, plain and twinkling */
const mote = (rp: readonly number[], twinkle: boolean): PixelColors => ({
  d: rp[1],
  l: rp[2],
  L: rp[3],
  H: rp[4],
  W: twinkle ? 0xffffff : rp[4],
});
export const MOTE_COLORS = {
  mp: [mote(PAL.crystal, false), mote(PAL.crystal, true)],
  hp: [mote(PAL.heal, false), mote(PAL.heal, true)],
} as const;

/** fine detail on the chest: the lit edge of the lid, plank lines, rivets and the keyhole */
export const CHEST_DETAIL = {
  lidLight: hex("#d89a56"),
  plank: hex("#6e4020"),
  rivet: hex("#fff3c0"),
  keyhole: hex("#3a2208"),
} as const;
