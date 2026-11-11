import { WHIRLWALL } from "../../../constants/orrin/abilities";
import { BACKLINE } from "../../../constants/orrin/backline";
import { BEND_STEPS, SWING_SMEAR as S, TEAR_LOOK, WHIRL_LOOK } from "../../../constants/orrin/chainLook";
import { HOOK } from "../../../constants/orrin/hook";
import { CHAIN_BLOWS, type ChainBlowSpec, HANGING_ARC, SHOULDER_Y } from "../../../constants/orrin/string";
import { FIRE_RAMP, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { fleck, glow, glowLine, place, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Point } from "../../../types/world";
import { WHITE } from "../../../utils/color";
import { clamp, lerp, TAU } from "../../../utils/math";
import { floorArc } from "../../effects/fine";
import { drawChain, drawLinks } from "../../effects/orrin/chainLinks";
import { drawHookHead, drawWeightHead } from "../../effects/orrin/hookHead";
import { drawStake } from "../../effects/orrin/stake";
import { drawSwingSmear } from "../../effects/orrin/swingSmear";
import { drawTear } from "../../effects/orrin/tearLens";
import { enemyCenter } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { skillEvolved, skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { Chain } from "../chain";
import { backlinePoint } from "./backline";
import { hookHead } from "./hook";
import { radii } from "./maelstrom";
import { orrin, orrinHost } from "./memory";
import { fullMomentum } from "./momentum";
import { blowReach } from "./reach";
import { blowLength } from "./string";

/** the short loop of chain that hangs from his hand at rest, swaying */
const loop = new Chain(6, 2.2, 420);
rememberPerSeat(objectMemory(loop, true));

/** his chain hand in the world, as last drawn */
function handAt(): Point {
  return { x: hero.x + hero.hand[0] * hero.face, y: hero.y + hero.hand[1] };
}

/** the head at the chain's end, facing along it: the brass hook, or the spiked ball once Iron Weight has evolved */
function drawHook(at: Point, ux: number, uy: number): void {
  if (skillEvolved("o_ironweight")) return drawWeightHead(at.x, at.y);
  drawHookHead(at.x, at.y, ux, uy, hero.face);
}

/** the chain's lit edge: steel, and glowing brass at full Momentum */
const linkGlint = (): Color => (fullMomentum() ? PAL.brass[4] : HC.steelLight);

/** Friction Burn at level 7: at full Momentum the chain burns along its length */
const ablaze = (): boolean => fullMomentum() && (skillValues("o_friction").trail ?? 0) > 0;

/** flames licking up off a stretch of chain, flickering from white hot to embers, every third link */
function flameAlong(from: Point, to: Point): void {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  const n = Math.floor(d / 3);
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    const x = from.x + (to.x - from.x) * u;
    const y = from.y + (to.y - from.y) * u;
    const f = Math.sin(game.t * 30 + i * 2.3);
    if (f < -0.2) continue;
    const tall = f > 0.6 ? 2 : 1;
    for (let k = 1; k <= tall; k++) px(x, y - k, FIRE_RAMP[Math.min(FIRE_RAMP.length - 1, 2 + k * 2 + (i % 2))], 0.9);
  }
  glowLine(from.x, from.y, to.x, to.y, 5, FIRE_RAMP[4], 0.2);
}

/** a chain from one point to another, taut, ending in the hook; glowing brass at full Momentum */
function taut(from: Point, to: Point, hook = true): void {
  drawLinks(from.x, from.y, to.x, to.y, linkGlint());
  if (fullMomentum()) glowLine(from.x, from.y, to.x, to.y, 4, PAL.brass[3], 0.25);
  if (ablaze()) flameAlong(from, to);
  if (!hook) return;
  const d = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  drawHook(to, (to.x - from.x) / d, (to.y - from.y) / d);
}

/** the bent chain's path, kept between frames so drawing it allocates nothing */
const bend: Point[] = Array.from({ length: BEND_STEPS + 1 }, () => ({ x: 0, y: 0 }));

/** a chain that bends: from the hand through a lagging control point to the tip, as a quadratic, ending in the hook */
function curved(from: Point, ctrl: Point, to: Point): void {
  for (let i = 0; i <= BEND_STEPS; i++) {
    const u = i / BEND_STEPS;
    bend[i].x = (1 - u) * (1 - u) * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x;
    bend[i].y = (1 - u) * (1 - u) * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y;
  }
  drawChain(bend, bend.length, linkGlint());
  if (ablaze()) for (let i = 1; i <= BEND_STEPS; i++) flameAlong(bend[i - 1], bend[i]);
  const d = Math.hypot(to.x - ctrl.x, to.y - ctrl.y) || 1;
  drawHook(to, (to.x - ctrl.x) / d, (to.y - ctrl.y) / d);
  if (fullMomentum()) glow(to.x, to.y, 8, PAL.brass[3], 0.4);
}

/**
 * The chain during a blow: wound back and trailing before the hit frame, snapped out to the sweep's angle at full reach
 * while it strikes (bending behind the hand as it lags), and falling back into the loop after.
 */
function blowChain(
  spec: ChainBlowSpec,
  blow: "lash" | "knee" | "rising" | "circle" | "hanging",
  st: number,
  dur: number,
): void {
  const hand = handAt();
  const [ox, oy] = [hero.x, hero.y - SHOULDER_Y];
  const reach = blowReach(spec, blow);
  const span = spec.hitEnd - spec.hit;
  let angle: number;
  let r: number;
  if (st < spec.hit) {
    const k = st / spec.hit;
    angle = spec.a0 + Math.PI * (1 - k) * 0.9 * Math.sign(spec.a1 - spec.a0 || 1);
    r = lerp(10, 18, k);
  } else if (st <= spec.hitEnd + 1 / 30 || blow === "circle") {
    const turns = blow === "circle" ? Math.max(1, (dur - spec.dur) / Math.max(span, 1e-3) + 1) : 1;
    const f = span > 0 ? clamp((st - spec.hit) / span, 0, turns) : 1;
    angle = spec.a0 + (spec.a1 - spec.a0) * (f % 1 || (f >= 1 ? 1 : 0));
    r =
      st > spec.hit + span * turns + 1 / 30
        ? lerp(reach, 10, clamp((st - spec.hit - span * turns) / (dur - spec.hit - span * turns)))
        : reach;
  } else {
    const k = clamp((st - spec.hitEnd) / Math.max(1e-3, dur - spec.hitEnd));
    angle = spec.a1 + k * 0.8;
    r = lerp(reach, 10, k);
  }
  const tip = { x: ox + Math.cos(angle) * r * hero.face, y: oy + Math.sin(angle) * r };
  const lag = angle - 0.5 * Math.sign(spec.a1 - spec.a0 || 1);
  const ctrl = { x: ox + Math.cos(lag) * r * 0.55 * hero.face, y: oy + Math.sin(lag) * r * 0.55 };
  curved(hand, ctrl, tip);
}

/** the loop hanging from his hand at rest */
function restLoop(): void {
  const p = loop.points;
  drawChain(p, p.length, linkGlint());
  const a = p[p.length - 2];
  const b = p[p.length - 1];
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  drawHook(b, (b.x - a.x) / d, (b.y - a.y) / d);
}

/** a rift tear the hook bit into: it opens over a few frames and flickers in its last moments before it snaps shut */
function tear(at: Point, held: number, left: number): void {
  if (left < HOOK.bite - HOOK.biteWarn && Math.floor(game.t * 20) % 2 === 0) return;
  drawTear(at.x, at.y, TEAR_LOOK.bite, clamp(Math.min(held, left) / 0.08), game.t);
}

/** the big tear over an ultimate */
function ultTear(at: Point): void {
  drawTear(at.x, at.y, TEAR_LOOK.ult, clamp(hero.st / 0.2), game.t);
}

/**
 * Whirlwall: a loop of chain spun over his head so fast it blurs. A thin steel ring with a brass one inside it, heavier
 * on the side toward the viewer, and runs of links a third of a turn apart, each trailing a bright streak.
 */
function whirlRing(): void {
  const cx = hero.x;
  const cy = hero.y - 26;
  const r = WHIRLWALL.radius;
  const ry = r * 0.3;
  for (const half of [-1, 1]) {
    floorArc(cx, cy, r, ry, HC.steel, half < 0 ? 0.55 : 0.9, half, 0, 0);
    floorArc(cx, cy, r - 1.5, ry - 0.5, PAL.brass[2], half < 0 ? 0.35 : 0.6, half, 0, 0);
  }
  const spin = game.t * 14;
  for (let i = 0; i < WHIRL_LOOK.runs; i++) {
    const a = spin + (i * TAU) / WHIRL_LOOK.runs;
    const n = Math.ceil(WHIRL_LOOK.trail * r * RES);
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const g = a - u * WHIRL_LOOK.trail;
      const c = u < 0.15 ? WHITE : u < 0.5 ? PAL.brass[4] : HC.steelLight;
      fleck(cx + Math.cos(g) * r, cy + Math.sin(g) * ry, c, 1 - u);
      if (u < 0.5) fleck(cx + Math.cos(g) * r, cy + Math.sin(g) * ry - 0.5, c, 1 - u * 2);
    }
    const along = WHIRL_LOOK.links / r;
    drawLinks(
      cx + Math.cos(a - along) * r,
      cy + Math.sin(a - along) * ry,
      cx + Math.cos(a + along) * r,
      cy + Math.sin(a + along) * ry,
    );
  }
  const hand = handAt();
  taut(hand, { x: cx + Math.cos(spin) * r, y: cy + Math.sin(spin) * ry });
}

/** each step, the rest loop follows his hand */
export function stepChainLoop(dt: number): void {
  const hand = handAt();
  loop.step(hand.x, hand.y, dt, -hero.vx * 1.2);
}

/** the smear his body leaves along the arc of a fast swing or an ultimate's pass, round the point he hangs from */
function swingSmear(at: Point, rx: number, ry: number, strength: number): void {
  // his feet hang a grip below the chain's arc, and the smear follows the middle of his body
  const cy = at.y + HOOK.grip - S.bodyY;
  const dx = hero.x - at.x;
  const dy = hero.y - S.bodyY - cy;
  const round = rx === ry ? Math.hypot(dx, dy) : 0;
  const angle = Math.atan2(dx / (round || rx), dy / (round || ry));
  const turning = hero.vx * Math.cos(angle) - hero.vy * Math.sin(angle);
  drawSwingSmear({ x: at.x, y: cy, rx: round || rx, ry: round || ry, angle }, Math.sign(turning) || 1, strength);
}

/** behind him and the foes: the tears, and the smear of his swing */
export function drawOrrinBack(): void {
  place();
  if (orrin.latch === "air" && orrin.latchAt) tear(orrin.latchAt, orrin.latchT, orrin.biteLeft);
  const speed = Math.hypot(hero.vx, hero.vy);
  if (hero.state === "swing" && orrin.latchAt)
    swingSmear(orrin.latchAt, 1, 1, clamp((speed - S.from) / (S.full - S.from)));
  if (!orrin.ultAt) return;
  if (hero.state === "pendulum") {
    ultTear(orrin.ultAt);
    if (speed > S.from) swingSmear(orrin.ultAt, 1, 1, 1);
  }
  if (hero.state === "maelstrom") {
    ultTear(orrin.ultAt);
    const { rx, ry } = radii();
    if (speed > S.from) swingSmear(orrin.ultAt, rx, ry, 1);
  }
}

/**
 * Anchor Pin, in front of the foes so their bodies never hide it: a steel stake with a brass cap driven into the floor
 * just in front of the foe, and a run of glinting links from it to the foe's side.
 */
function drawPin(): void {
  const pinned = orrinHost.pinned;
  const at = orrin.pinAt;
  if (!at || !pinned || pinned.hp <= 0) return;
  const [cx, cy] = enemyCenter(pinned);
  const side = Math.sign(cx - at.x) || 1;
  drawLinks(at.x, at.y - 3, cx - side * 3, cy + 2, PAL.brass[4]);
  drawStake(at.x, at.y);
}

/** in front of him: the chain from his hand, in whatever shape the state gives it */
export function drawOrrin(): void {
  place();
  drawPin();
  const h = hero;
  const hand = handAt();
  if (orrin.arc >= 0) return blowChain(HANGING_ARC, "hanging", orrin.arc, HANGING_ARC.dur);
  switch (h.state) {
    case "lash":
      return blowChain(CHAIN_BLOWS[orrin.current], orrin.current, h.st, blowLength(orrin.current));
    case "hookThrow": {
      const head = hookHead();
      if (head) return taut(hand, head);
      return restLoop();
    }
    case "swing":
    case "pendulum":
    case "maelstrom": {
      const at = h.state === "swing" ? orrin.latchAt : orrin.ultAt;
      if (!at || (h.state !== "swing" && h.st < 0.2)) return restLoop();
      // an ultimate's chain carries the tear's light down to his hand
      if (h.state !== "swing") glowLine(hand.x, hand.y, at.x, at.y, 5, PAL.volt[2], 0.3);
      return taut(hand, at, h.state === "swing" && orrin.latch !== "air");
    }
    case "zip": {
      if (orrin.climbTo && orrin.latchAt) return taut(hand, orrin.latchAt);
      const foe = orrinHost.zipFoe;
      if (!foe) return restLoop();
      const [cx, cy] = enemyCenter(foe);
      return taut(hand, { x: cx, y: cy });
    }
    case "backline":
      if (h.st < BACKLINE.time) return taut(hand, { x: backlinePoint(), y: h.y - 1 });
      return restLoop();
    case "whirl":
      return whirlRing();
    default:
      return restLoop();
  }
}
