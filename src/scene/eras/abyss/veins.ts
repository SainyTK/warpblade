import { GROUND, PLATFORMS, RES, W } from "../../../constants/stage";
import { glow, place } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { halo, type Only } from "./brush";
import { CRACK_EDGE, CRIMSON, type RiftHue, VIOLET } from "./colors";
import { TOWERS } from "./towers";

/**
 * Rift light in the stone: veins that climb the towers from their feet and cracks that split the floor and the slabs,
 * each white at its heart, dimmer toward its ends, shedding light on the stone around it and breathing each frame.
 */

/** a place a vein starts, in art pixels, where its light breathes */
interface Pulse {
  x: number;
  y: number;
  c: Color;
  phase: number;
}
const pulses: Pulse[] = [];

interface Step {
  x: number;
  y: number;
  /** how far along its own run this step is, 0 to 1 */
  u: number;
  trunk: boolean;
}

const FLOOR: Only = [LAYER.ground];
const SLAB: Only = [LAYER.slab];
const TOWER: Only = [LAYER.tower];
/** how much of its run a fork keeps, and the shortest run that still forks */
const FORK = { keeps: 0.5, shortest: 8 };
/** the light a vein sheds on the stone around it */
const SHED = { radius: 4.5, every: 2 };

/** how a vein burns: how often it forks per image pixel, how far along it stays white and then lit, and the light it sheds */
interface Burn {
  fork: number;
  hotUntil: number;
  litUntil: number;
  shed: number;
  /** how solid the vein is painted, 0 to 1 */
  solid: number;
}
/** a crack in the floor burns bright under the fight; a vein up a tower stays dim behind it */
const CRACK: Burn = { fork: 0.045, hotUntil: 0.3, litUntil: 0.68, shed: 0.2, solid: 1 };
const CLIMBER: Burn = { fork: 0.022, hotUntil: 0, litUntil: 0.1, shed: 0.08, solid: 0.62 };

/**
 * walk one vein from (x, y) along `heading`, wandering and forking, and note every image pixel it crosses; `from` is
 * how far gone the vein already is where this run starts, 0 for the vein itself
 */
function walk(
  r: Rng,
  x: number,
  y: number,
  heading: number,
  length: number,
  fork: number,
  from: number,
  out: Step[],
): void {
  let cx = x;
  let cy = y;
  let turn = heading + r.range(-0.5, 0.5);
  for (let i = 0; i < length; i++) {
    const u = from + ((1 - from) * i) / length;
    out.push({ x: Math.round(cx), y: Math.round(cy), u, trunk: from === 0 });
    cx += Math.cos(turn);
    cy += Math.sin(turn);
    if (i % 3 === 2) {
      // each kink wanders off, pulled back toward the vein's own heading
      turn = heading + (turn - heading) * 0.4 + r.range(-0.9, 0.9);
    }
    if (length - i > FORK.shortest && r.chance(fork)) {
      const side = r.chance(0.5) ? 1 : -1;
      // a fork starts as far gone as the vein it leaves, with a little more so the two never read as one
      walk(r, cx, cy, heading + side * r.range(0.5, 1.1), Math.floor((length - i) * FORK.keeps), fork, u + 0.02, out);
    }
  }
}

/** paint one vein and its forks on the given layers: shed light first, then the dark lips, then the bright heart */
function vein(
  p: PlatePaint,
  r: Rng,
  x: number,
  y: number,
  heading: number,
  length: number,
  hue: RiftHue,
  burn: Burn,
  only: Only,
): void {
  const steps: Step[] = [];
  walk(r, x, y, heading, Math.round(length), burn.fork, 0, steps);
  steps.forEach((s, i) => {
    if (i % SHED.every === 0) {
      halo(p, s.x, s.y, SHED.radius, hue.glow, burn.shed * (1 - s.u * 0.7), only);
    }
  });
  for (const s of steps) {
    p.blend(s.x + 1, s.y + 1, CRACK_EDGE, 0.6, only);
  }
  for (const s of steps) {
    const c = s.u < burn.hotUntil ? hue.hot : s.u < burn.litUntil ? hue.lit : hue.body;
    p.blend(s.x, s.y, c, (1 - s.u * 0.5) * burn.solid, only);
    if (s.trunk && s.u < 0.3) {
      p.blend(s.x + 1, s.y, s.u < burn.litUntil ? hue.lit : hue.body, burn.solid, only);
    }
  }
}

const hueAt = (i: number): RiftHue => (i % 3 === 1 ? VIOLET : CRIMSON);

/** cracks of rift light down through the floor and the slabs, more and longer toward the era's end */
function paintCracks(p: PlatePaint, r: Rng, k: number): void {
  const n = 6 + Math.round(k * 7);
  for (let i = 0; i < n; i++) {
    const x = Math.round(((i + r.range(0.1, 0.9)) / n) * W);
    const hue = hueAt(i);
    vein(p, r, x * RES, (GROUND + 2) * RES, Math.PI / 2, (r.range(7, 13) + k * 9) * RES, hue, CRACK, FLOOR);
    pulses.push({ x, y: GROUND + 4, c: hue.glow, phase: r.range(0, 6) });
  }
  for (const slab of PLATFORMS) {
    const m = 1 + Math.round(k * 2);
    for (let i = 0; i < m; i++) {
      const x = Math.round(r.range(slab.x0 + 6, slab.x1 - 6));
      const hue = hueAt(i + 1);
      vein(p, r, x * RES, (slab.y + 2) * RES, Math.PI / 2, (r.range(4, 7) + k * 3) * RES, hue, CRACK, SLAB);
      pulses.push({ x, y: slab.y + 4, c: hue.glow, phase: r.range(0, 6) });
    }
  }
}

/** veins of rift light climbing the towers from their feet, higher toward the era's end */
function paintTowerVeins(p: PlatePaint, r: Rng, k: number): void {
  TOWERS.forEach(([tx, tw], t) => {
    const n = 1 + Math.round(k * 0.8 + (t % 2) * 0.4);
    for (let i = 0; i < n; i++) {
      const x = Math.round(tx + r.range(2, tw - 3));
      const hue = hueAt(t + i);
      vein(p, r, x * RES, GROUND * RES - 1, -Math.PI / 2, (r.range(14, 24) + k * 22) * RES, hue, CLIMBER, TOWER);
      pulses.push({ x, y: GROUND - 6, c: hue.glow, phase: r.range(0, 6) });
    }
  });
}

/** static: every vein and crack of the scene */
export function paintVeins(p: PlatePaint, r: Rng, k: number): void {
  pulses.length = 0;
  paintTowerVeins(p, r, k);
  paintCracks(p, r, k);
}

/** how far a vein's breathing light reaches, in art pixels */
const PULSE_RADIUS = 7;

/** each frame: the veins breathe a slow glow where they rise */
export function drawVeinLight(t: number, k: number): void {
  place();
  const strength = 0.8 + k * 0.4;
  for (const g of pulses) {
    glow(g.x, g.y, PULSE_RADIUS, g.c, (0.1 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.1 + g.phase))) * strength);
  }
}
