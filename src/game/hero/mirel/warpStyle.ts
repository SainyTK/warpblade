import { ARRIVAL_CLIP } from "../../../constants/clips/mirel/moveset";
import { WARP } from "../../../constants/combat";
import { ARRIVAL_BLOW, MIREL_WARP } from "../../../constants/mirel/warp";
import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { fleck, glow, hairline, line } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle, WarpTune } from "../../../types/moveset";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { sampleKeys } from "../../../utils/sampleKeys";
import { fineRing } from "../../effects/fine";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { sharedWarpStrike } from "../warp";
import { leaveEchoes } from "./echo";
import { mirel } from "./memory";
import type { StaffStrike } from "./strike";

/** the power of the arrival blow just struck, for its echo */
const arrival = { power: 0 };

/**
 * Her staff in flight, its clock ring leading at (x, y): the shaft swings behind the ring like a pendulum about the line
 * of flight, the ring's hand spins, and the ring glows teal.
 */
function drawThrownStaff(x: number, y: number, angle: number, t: number): void {
  const w = MIREL_WARP;
  const back = angle + Math.PI + Math.sin(t * TAU * w.rate) * w.swing;
  const c = Math.cos(back);
  const n = Math.sin(back);
  const at = (d: number, side: number): [number, number] => [x + c * d - n * side, y + n * d + c * side];
  const [neckX, neckY] = at(w.ring + 0.5, 0);
  const [buttX, buttY] = at(w.ring + w.length, 0);
  line(neckX, neckY, buttX, buttY, HC.hilt);
  hairline(...at(w.ring + 1.5, 0.5), ...at(w.ring + w.length - 1, 0.5), HC.glove);
  fleck(neckX, neckY, HC.trim);
  fleck(buttX, buttY, HC.trimLight);
  glow(x, y, 9, PAL.hour[3], 0.45);
  fineRing(x, y, w.ring, w.ring, HC.blade);
  fineRing(x, y, w.ring - 0.5, w.ring - 0.5, HC.bladeBack, 0.6);
  const hand = t * TAU * 3;
  hairline(x, y, x + Math.cos(hand) * (w.ring - 1), y + Math.sin(hand) * (w.ring - 1), HC.bladeEdge);
  fleck(x - w.ring * 0.6, y - w.ring * 0.7, WHITE);
}

/** the shared arrival blow, its power kept for the echo */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  arrival.power = power;
  sharedWarpStrike(power, foe, sureCrit);
}

/** her pose at the moment of the blow, for the ghost that strikes again */
const cutPose = () => sampleKeys(ARRIVAL_CLIP.keys, ARRIVAL_CLIP.hit);

/** her extra: the arrival blow leaves an echo, her ghost striking the same sweep again half a second later */
function arrived(): void {
  const s: StaffStrike = {
    blow: "warp",
    spec: ARRIVAL_BLOW,
    at: { x: hero.x, y: hero.y, face: hero.face },
    echo: false,
    grow: 0,
    scale: arrival.power * MIREL_WARP.echo,
  };
  leaveEchoes(s, false, cutPose());
}

/** Quickened: while it lasts her warp recharges faster */
function tune(): WarpTune {
  const share = skillValues("m_quicken").warp ?? 0;
  return mirel.quickLeft > 0 && share ? { recharge: WARP.cooldown * (1 - share) } : {};
}

/** Mirel's warp: her staff flung like a pendulum, the shared blow at ability power, and its echo */
export const MIREL_WARP_STYLE: WarpStyle = {
  stat: "ap",
  drawThrown: drawThrownStaff,
  strike,
  arrived,
  tune,
};
