import { BEAT } from "../../../constants/jory/beat";
import { PAL } from "../../../constants/palette";
import { ellipseRing, fleck, glow, hairline, place, px } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";
import { hero } from "../../state";
import { parryOpen } from "../heroGuard";
import { beatShare, onDownbeat, tier } from "./beat";
import { jory } from "./memory";

/** the metronome's pivot above his head, its arm's length and how far it swings each way, in radians */
const METRONOME = { above: 40, arm: 7, swing: 0.55 } as const;
/** the guard's wall of sound: an upright half ring in front of the drum, its reach ahead, half height and middle height */
const WARD = { ahead: 9, rx: 4, ry: 15, mid: 17 } as const;
/** at Crescendo the ring is doubled this far outside the first */
const DOUBLE_OUT = 4;

/** the beat has just played: the ring and the lamp flash for two frames */
export const flashing = (): boolean => jory.phase < BEAT.flash;

/**
 * The beat at his feet: an ellipse closing from 26 to 14 px wide over each beat, flashing white-hot on the beat, 2 px
 * wider on a bar's downbeat, and doubled at Crescendo. Drawn on the floor, in front of the scene and behind the foes.
 */
export function drawJoryFloor(): void {
  if (hero.state === "dead") return;
  place();
  const u = beatShare();
  const flash = flashing();
  const wide = flash && onDownbeat() ? 2 : 0;
  const w = flash ? BEAT.ringFrom + wide : BEAT.ringFrom + (BEAT.ringTo - BEAT.ringFrom) * u;
  const rx = w / 2;
  const ry = BEAT.ringHeight / 2;
  const c = flash ? PAL.beat[5] : PAL.beat[3];
  const a = flash ? 1 : 0.55 + 0.35 * u;
  ellipseRing(hero.x, hero.y, rx, ry, c, a);
  if (tier() >= 4) ellipseRing(hero.x, hero.y, rx + DOUBLE_OUT, ry + 0.5, flash ? PAL.beat[5] : PAL.beat[4], a * 0.7);
  if (flash) glow(hero.x, hero.y, w * 0.6, PAL.beat[3], 0.25);
}

/** Steady Hand's metronome: a small cobalt arm over his head that swings to the other side on every beat */
function drawMetronome(): void {
  if (jory.steadyBeats <= 0) return;
  const side = jory.beats % 2 === 0 ? 1 : -1;
  // the arm swings across through the beat and settles at the far side as the next beat lands
  const u = beatShare();
  const angle = -side * METRONOME.swing + side * 2 * METRONOME.swing * Math.min(1, u * 1.15);
  const x = hero.x;
  const y = hero.y - METRONOME.above;
  const tx = x + Math.sin(angle) * METRONOME.arm;
  const ty = y - Math.cos(angle) * METRONOME.arm;
  place();
  px(x - 1, y, PAL.beat[2]);
  px(x, y, PAL.beat[3]);
  px(x + 1, y, PAL.beat[2]);
  hairline(x, y, tx, ty, PAL.beat[4]);
  px(tx, ty, flashing() ? PAL.beat[5] : PAL.beat[4]);
}

/**
 * While he guards, the drum's hum stands as a thin upright half ring of sound in front of him that pulses with the beat,
 * white while a fresh press can still parry.
 */
function drawGuardWard(): void {
  if (hero.state !== "guard") return;
  place();
  const open = parryOpen();
  const pulse = flashing() ? 1 : 0.45 + 0.3 * (1 - beatShare());
  const cx = hero.x + hero.face * WARD.ahead;
  const cy = hero.y - WARD.mid;
  const n = Math.ceil(WARD.ry * 6);
  for (let i = 0; i <= n; i++) {
    const g = -Math.PI / 2 + (i / n) * Math.PI;
    const x = cx + hero.face * Math.cos(g) * WARD.rx;
    const y = cy + Math.sin(g) * WARD.ry;
    fleck(x, y, open ? WHITE : PAL.beat[4], open ? 1 : pulse);
    fleck(x - hero.face * 1.5, y, PAL.beat[3], pulse * 0.5);
  }
  glow(cx, cy, 10, PAL.beat[3], open ? 0.35 : 0.15 * pulse);
}

/** drawn over him: Steady Hand's metronome and the guard's wall of sound */
export function drawJory(): void {
  drawMetronome();
  drawGuardWard();
}
