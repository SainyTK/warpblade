import { CHAIN_BLOWS, type ChainBlowSpec, HANGING_ARC, SHOULDER_Y, TIP_BAND } from "../../../constants/orrin/string";
import { PAL, SPARKS } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { clamp, TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createSlash } from "../../effects/slash";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { orrin } from "../../hero/orrin/memory";
import { gainMomentum } from "../../hero/orrin/momentum";
import { bearingFrom, inSpan } from "../../hero/orrin/reach";
import { game, hero, progress } from "../../state";
import { boxHit, hitStop, shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { drawShadeChain, drawTwinShade, type ShadePose } from "./twinShade";

const ID = "o_twin";
/** seconds of each beat: the wind-up, the spin, the swing on its chain, the Hanging Arc's stroke, the hold and fade */
const BEAT = { wind: 0.1, spin: 0.2, swing: 0.45, stroke: 0.1, hold: 0.1, fade: 0.25 } as const;
/** the swing: how high the shade's hook bites above it, and how far across it swings */
const SWING = { up: 36, across: 64, power: 0.7 } as const;
/** the gap between shades a Slip calls, and the delay between their starts */
const SPREAD = { gap: 16, delay: 0.08 } as const;
/** seconds after a Slip in which his next Hanging Arc is copied */
const COPY_WINDOW = 4;
/** a shade's ramp for its spin and its stroke */
const SHADE_RAMP = PAL.brass;

type Beat = "wait" | "wind" | "spin" | "swing" | "wind2" | "spin2" | "stroke" | "hold" | "fade";

interface Shade {
  x: number;
  y: number;
  face: number;
  /** a Full Circle shade, or a copy of a Hanging Arc */
  kind: "circle" | "arc";
  /** the beats it plays, in order, and where it is in them */
  beats: Beat[];
  beat: number;
  t: number;
  /** foes the beat under way already struck */
  struck: Enemy[];
  /** Mirror Dance: its tips always crit */
  crit: boolean;
  /** where its chain hook bit for the swing, and where the swing started */
  pivot: { x: number; y: number } | null;
  from: { x: number; y: number };
}

interface TwinMemory {
  shades: Shade[];
  /** seconds left in which his next Hanging Arc calls a copying shade, and how many */
  copyLeft: number;
  copies: number;
  /** his Hanging Arc's clock last step, to see a new one start */
  arcWas: number;
}

const memoryOf = (m: SkillMemory): TwinMemory => m as unknown as TwinMemory;

const BEAT_TIME: Record<Beat, number> = {
  wait: 0,
  wind: BEAT.wind,
  spin: BEAT.spin,
  swing: BEAT.swing,
  wind2: BEAT.wind * 0.8,
  spin2: BEAT.spin,
  stroke: BEAT.stroke,
  hold: BEAT.hold,
  fade: BEAT.fade,
};

/** one foe met by the shade's chain, at the tip or closer in */
function strikeFoe(s: Shade, e: Enemy, spec: ChainBlowSpec, tip: boolean, scale: number): void {
  const v = skillValues(ID);
  const [cx, cy] = enemyCenter(e);
  const dir = Math.sign(cx - s.x) || s.face;
  dealDamage(e, progress.stats.ad * v.power * scale * (tip ? spec.tipPower : spec.innerPower), {
    fromX: s.x,
    kx: spec.kx * dir,
    ky: spec.ky,
    stun: tip ? spec.stun : undefined,
    heavy: tip,
    sureCrit: tip && s.crit,
    source: ID,
  });
  game.fx.push(createImpact(cx - dir * 3, cy, dir, tip, SPARKS.brass));
}

/** the shade's chain sweeps a span round its shoulder: every foe in reach in the span is struck once a beat */
function sweep(s: Shade, spec: ChainBlowSpec, s0: number, s1: number): void {
  const reach = withCharms("area", spec.reach);
  let tips = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || s.struck.includes(e)) continue;
    const b = bearingFrom(s.x, s.y - SHOULDER_Y, s.face, e);
    if (b.near > reach || b.far < spec.inner || !inSpan(b, s0, s1)) continue;
    s.struck.push(e);
    const tip = b.near >= reach - TIP_BAND;
    if (tip) tips++;
    strikeFoe(s, e, spec, tip, 1);
  }
  if (tips) hitStop(0.03);
}

/** the swing: the shade swings under its hook across the foes, its body kicking each one it passes */
function swingKicks(s: Shade): void {
  const box: [number, number, number, number] = [s.x - 6, s.y - 32, s.x + 6, s.y];
  for (const e of game.enemies) {
    if (e.hp <= 0 || s.struck.includes(e) || !boxHit(box, enemyBox(e))) continue;
    s.struck.push(e);
    const dir = s.face;
    dealDamage(e, progress.stats.ad * skillValues(ID).power * SWING.power, {
      fromX: s.x - dir * 8,
      kx: dir * 150,
      ky: -50,
      heavy: true,
      source: ID,
    });
    const [cx, cy] = enemyCenter(e);
    game.fx.push(createImpact(cx, cy, dir, true, SPARKS.brass));
  }
}

/** a beat starts: the spin's ring, the swing's hook */
function startBeat(s: Shade): void {
  const b = s.beats[s.beat];
  s.t = 0;
  s.struck = [];
  if (b === "spin" || b === "spin2") {
    const R = withCharms("area", CHAIN_BLOWS.circle.reach);
    game.fx.push(
      createSlash(s.x, s.y, s.face, {
        cx: 0,
        cy: -SHOULDER_Y,
        R,
        sy: 0.35,
        rot: 0,
        a0: -Math.PI / 2,
        a1: -Math.PI / 2 + TAU * 0.98,
        W: 4,
        sweep: BEAT.spin,
        trail: 0.12,
        ramp: SHADE_RAMP,
      }),
    );
    sfx.swing(0.85);
  }
  if (b === "stroke") {
    game.fx.push(
      createSlash(s.x, s.y, s.face, {
        cx: 0,
        cy: -SHOULDER_Y,
        R: withCharms("area", HANGING_ARC.reach),
        sy: 1,
        rot: 0,
        a0: HANGING_ARC.a0,
        a1: HANGING_ARC.a1,
        W: 3,
        sweep: BEAT.stroke,
        trail: 0.12,
        ramp: SHADE_RAMP,
      }),
    );
    sfx.swing(1.1);
  }
  if (b === "swing") {
    s.from = { x: s.x, y: s.y };
    s.pivot = {
      x: clamp(s.x + (s.face * SWING.across) / 2, 8, W - 8),
      y: s.y - 32 - SWING.up,
    };
  }
}

/** the beat under way plays out; false once the shade has faded */
function play(s: Shade, dt: number): boolean {
  s.t += dt;
  const b = s.beats[s.beat];
  const u = BEAT_TIME[b] > 0 ? clamp(s.t / BEAT_TIME[b]) : 1;
  const prev = BEAT_TIME[b] > 0 ? clamp((s.t - dt) / BEAT_TIME[b]) : 0;
  if (b === "spin" || b === "spin2") sweep(s, CHAIN_BLOWS.circle, -Math.PI / 2 + TAU * prev, -Math.PI / 2 + TAU * u);
  if (b === "stroke") {
    const a = HANGING_ARC.a0;
    const span = HANGING_ARC.a1 - a;
    sweep(s, HANGING_ARC, a + span * prev, a + span * u);
  }
  if (b === "swing" && s.pivot) {
    // across under the hook along a circle, from where it stood to as far the other side
    const r = Math.hypot(s.from.x - s.pivot.x, s.from.y - s.pivot.y);
    const a0 = Math.atan2(s.from.x - s.pivot.x, s.from.y - s.pivot.y);
    const a = a0 + -2 * a0 * (0.5 - 0.5 * Math.cos(Math.PI * u));
    s.x = clamp(s.pivot.x + Math.sin(a) * r, 8, W - 8);
    // the bottom of the arc skims the ground it started on, never below it
    s.y = Math.min(s.from.y, s.pivot.y + Math.cos(a) * r);
    swingKicks(s);
  }
  if (s.t < BEAT_TIME[b]) return true;
  if (s.beat >= s.beats.length - 1) return false;
  s.beat++;
  startBeat(s);
  return true;
}

/** a shade appears at a point, `delay` seconds late */
function call(m: TwinMemory, kind: Shade["kind"], x: number, y: number, delay: number): void {
  const v = skillValues(ID);
  const beats: Beat[] =
    kind === "arc"
      ? ["wait", "wind", "stroke", "hold", "fade"]
      : v.swing
        ? ["wait", "wind", "spin", "swing", "wind2", "spin2", "hold", "fade"]
        : ["wait", "wind", "spin", "hold", "fade"];
  const s: Shade = {
    x: clamp(x, 8, W - 8),
    y,
    face: hero.face,
    kind,
    beats,
    beat: 0,
    t: -delay,
    struck: [],
    crit: !!v.mirror,
    pivot: null,
    from: { x, y },
  };
  m.shades.push(s);
}

/** what a shade looks like now */
function poseOf(s: Shade): ShadePose {
  const b = s.beats[s.beat];
  if (b === "spin" || b === "spin2") return s.t / BEAT.spin < 0.5 ? "spin" : "spinBack";
  if (b === "swing") return "hang";
  if (b === "stroke" || (b === "hold" && s.kind === "arc")) return "arc";
  if (s.kind === "arc" && b === "wind") return "hang";
  return "wind";
}

/** how solid a shade is now: it fades in on its first beat and out on its last */
function alphaOf(s: Shade): number {
  const b = s.beats[s.beat];
  if (b === "wait") return 0;
  if (s.beat === 1) return clamp(s.t / BEAT.wind);
  if (b === "fade") return 1 - clamp(s.t / BEAT.fade);
  return 1;
}

/** the shade's chain while it spins or swings */
function drawChain(s: Shade, alpha: number): void {
  const b = s.beats[s.beat];
  const ox = s.x;
  const oy = s.y - SHOULDER_Y;
  if (b === "spin" || b === "spin2") {
    const a = -Math.PI / 2 + TAU * clamp(s.t / BEAT.spin);
    const r = withCharms("area", CHAIN_BLOWS.circle.reach);
    drawShadeChain(ox, oy, ox + Math.cos(a) * r * s.face, oy + Math.sin(a) * r * 0.35, alpha);
  } else if (b === "swing" && s.pivot) drawShadeChain(s.x, s.y - 24, s.pivot.x, s.pivot.y, alpha);
  else if (b === "stroke") {
    const a = HANGING_ARC.a0 + (HANGING_ARC.a1 - HANGING_ARC.a0) * clamp(s.t / BEAT.stroke);
    const r = withCharms("area", HANGING_ARC.reach);
    drawShadeChain(ox, oy, ox + Math.cos(a) * r * s.face, oy + Math.sin(a) * r, alpha);
  }
}

/**
 * Twin Chain: a Slip (a blow dodged just after letting go of a fast swing) or a perfect dodge calls a brass shade of
 * Orrin, which spins a Full Circle; levels add Momentum, a second shade, a swing and a second spin, a copy of his next
 * Hanging Arc and harder blows. Mirror Dance calls three shades whose tip hits always crit.
 */
export const twinChain: SkillBehavior = {
  create: () => ({ shades: [], copyLeft: 0, copies: 0, arcWas: -1 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.copyLeft = Math.max(0, m.copyLeft - dt);
    if (m.arcWas < 0 && orrin.arc >= 0 && m.copyLeft > 0) {
      for (let i = 0; i < m.copies; i++)
        call(m, "arc", hero.x - hero.face * (12 + i * SPREAD.gap), hero.y - i * 6, 0.06 + i * SPREAD.delay);
      m.copyLeft = 0;
    }
    m.arcWas = orrin.arc;
    m.shades = m.shades.filter((s) => play(s, dt));
  },
  drawBack(memory) {
    for (const s of memoryOf(memory).shades) {
      const a = alphaOf(s);
      drawTwinShade(s.x, s.y, s.face, poseOf(s), a);
      drawChain(s, a);
    }
  },
  on: {
    perfectDodge(memory) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      const count = Math.round(withCharms("amount", v.count));
      // where he let go: a moment back along his flight
      const back = orrin.sinceRelease < 0.25 ? orrin.sinceRelease : 0;
      const x = hero.x - hero.vx * back;
      const y = Math.min(hero.y - hero.vy * back, hero.y + 4);
      const offsets = [0, -1, 1];
      for (let i = 0; i < count; i++) {
        call(m, "circle", x + offsets[i % 3] * SPREAD.gap * Math.ceil(i / 3 + 0.01), y, i * SPREAD.delay);
        if (v.momentum) gainMomentum(v.momentum);
      }
      if (v.copy) {
        m.copyLeft = COPY_WINDOW;
        m.copies = count;
      }
      shake(0.08, 1);
    },
  },
};
