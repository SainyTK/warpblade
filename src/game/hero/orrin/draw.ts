import { WHIRLWALL } from "../../../constants/orrin/abilities";
import { BACKLINE } from "../../../constants/orrin/backline";
import { HOOK } from "../../../constants/orrin/hook";
import { CHAIN_BLOWS, type ChainBlowSpec, HANGING_ARC, SHOULDER_Y } from "../../../constants/orrin/string";
import { FIRE_RAMP, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { ellipseRing, glow, glowLine, line, place, px } from "../../../engine/frame";
import type { Point } from "../../../types/world";
import { WHITE } from "../../../utils/color";
import { clamp, lerp, TAU } from "../../../utils/math";
import { drawLinks } from "../../effects/orrin/chainLinks";
import { enemyCenter } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { skillEvolved, skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { Chain } from "../chain";
import { backlinePoint } from "./backline";
import { hookHead } from "./hook";
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

/** the hook head: a 7 px brass sickle facing along the chain, dark edged with a glint; a spiked ball once evolved */
function drawHook(at: Point, ux: number, uy: number): void {
  const nx = -uy;
  const ny = ux;
  const B = PAL.brass;
  if (skillEvolved("o_ironweight")) {
    for (let a = 0; a < TAU; a += TAU / 8) px(at.x + Math.cos(a) * 4, at.y + Math.sin(a) * 4, HC.steelLight);
    for (let r = 0; r <= 3; r++)
      for (let a = 0; a < TAU; a += 0.6)
        px(at.x + Math.cos(a) * r, at.y + Math.sin(a) * r, r > 2 ? HC.steelDeep : HC.steelDark);
    px(at.x - 1, at.y - 1, HC.steelGlint);
    return;
  }
  // the shank, then the curve back toward the chain, then the point
  for (let k = 0; k <= 3; k++) px(at.x + ux * k, at.y + uy * k, k === 1 ? B[4] : B[3]);
  for (let k = 0; k <= 3; k++) {
    const a = (k / 3) * Math.PI;
    const x = at.x + ux * (3 + Math.sin(a) * 2) + nx * (Math.cos(a) * 2 - 2) * -1;
    const y = at.y + uy * (3 + Math.sin(a) * 2) + ny * (Math.cos(a) * 2 - 2) * -1;
    px(x, y, k === 0 ? B[4] : B[2]);
  }
  px(at.x + nx * 3 + ux * 1, at.y + ny * 3 + uy * 1, B[1]);
  px(at.x + ux * 1, at.y + uy * 1, WHITE);
}

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
  drawLinks(from.x, from.y, to.x, to.y, fullMomentum() ? PAL.brass[4] : undefined);
  if (fullMomentum()) glowLine(from.x, from.y, to.x, to.y, 4, PAL.brass[3], 0.25);
  if (ablaze()) flameAlong(from, to);
  if (!hook) return;
  const d = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  drawHook(to, (to.x - from.x) / d, (to.y - from.y) / d);
}

/** a chain that bends: from the hand through a lagging control point to the tip, as a quadratic, ending in the hook */
function curved(from: Point, ctrl: Point, to: Point): void {
  let prev = from;
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const x = (1 - u) * (1 - u) * from.x + 2 * (1 - u) * u * ctrl.x + u * u * to.x;
    const y = (1 - u) * (1 - u) * from.y + 2 * (1 - u) * u * ctrl.y + u * u * to.y;
    drawLinks(prev.x, prev.y, x, y, fullMomentum() ? PAL.brass[4] : undefined);
    if (ablaze()) flameAlong(prev, { x, y });
    prev = { x, y };
  }
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
  for (let i = 1; i < p.length; i++) drawLinks(p[i - 1].x, p[i - 1].y, p[i].x, p[i].y);
  const a = p[p.length - 2];
  const b = p[p.length - 1];
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  drawHook(b, (b.x - a.x) / d, (b.y - a.y) / d);
}

/**
 * A rift tear the hook bit into: a 6 px lens of volt light, a dark indigo rim round a pale core, with two sparks
 * drifting off its ends. It opens over a few frames and flickers in its last moments before it snaps shut.
 */
function tear(at: Point, held: number, left: number): void {
  const V = PAL.volt;
  if (left < HOOK.bite - HOOK.biteWarn && Math.floor(game.t * 20) % 2 === 0) return;
  const open = clamp(Math.min(held, left) / 0.08);
  const h = Math.round(3 * open);
  glow(at.x, at.y, 14, V[2], 0.45 * open);
  for (let dy = -h; dy <= h; dy++) {
    const wide = Math.abs(dy) < h - 1;
    px(at.x - (wide ? 2 : 1), at.y + dy, V[0]);
    px(at.x + (wide ? 2 : 1), at.y + dy, V[0]);
    if (wide) {
      px(at.x - 1, at.y + dy, V[2]);
      px(at.x + 1, at.y + dy, V[1]);
    }
    px(at.x, at.y + dy, Math.abs(dy) <= 1 ? WHITE : V[3]);
  }
  px(at.x, at.y - h - 1, V[0]);
  px(at.x, at.y + h + 1, V[0]);
  const drift = (game.t * 6) % 3;
  px(at.x + 2 + drift, at.y - h - drift * 0.5, V[4], 1 - drift / 3);
  px(at.x - 2 - drift, at.y + h + drift * 0.5, V[3], 1 - drift / 3);
}

/** the big tear over an ultimate */
function ultTear(at: Point): void {
  const V = PAL.volt;
  const open = clamp(hero.st / 0.2);
  line(at.x, at.y - 7 * open, at.x, at.y + 7 * open, V[3]);
  line(at.x - 1, at.y - 4 * open, at.x - 1, at.y + 4 * open, V[2], 0.7);
  px(at.x, at.y, WHITE);
  glow(at.x, at.y, 30, V[3], 0.5 * open);
}

/** Whirlwall: a blurred loop of chain spun over his head, a faint brass ring and three link ghosts a third apart */
function whirlRing(): void {
  const cx = hero.x;
  const cy = hero.y - 26;
  const r = WHIRLWALL.radius;
  ellipseRing(cx, cy, r, r * 0.3, PAL.brass[2], 0.35);
  ellipseRing(cx, cy, r - 1, r * 0.3 - 0.5, HC.steel, 0.5);
  const spin = game.t * 14;
  for (let i = 0; i < 3; i++) {
    const a = spin + (i * TAU) / 3;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.3;
    drawLinks(x - Math.sin(a) * 3, y, x + Math.sin(a) * 3, y + 0.5);
    px(x, y, PAL.brass[4]);
  }
  const hand = handAt();
  const a = spin;
  taut(hand, { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.3 });
}

/** each step, the rest loop follows his hand */
export function stepChainLoop(dt: number): void {
  const hand = handAt();
  loop.step(hand.x, hand.y, dt, -hero.vx * 1.2);
}

/** behind him and the foes: the tears and the pin's chain */
export function drawOrrinBack(): void {
  place();
  if (orrin.latch === "air" && orrin.latchAt) tear(orrin.latchAt, orrin.latchT, orrin.biteLeft);
  if (orrin.ultAt && (hero.state === "pendulum" || hero.state === "maelstrom")) ultTear(orrin.ultAt);
  const pinned = orrinHost.pinned;
  if (orrin.pinAt && pinned && pinned.hp > 0) {
    const [cx, cy] = enemyCenter(pinned);
    drawLinks(orrin.pinAt.x, orrin.pinAt.y - 1, cx, cy);
    px(orrin.pinAt.x, orrin.pinAt.y - 1, PAL.brass[4]);
  }
}

/** in front of him: the chain from his hand, in whatever shape the state gives it */
export function drawOrrin(): void {
  place();
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
      if (at && (h.state === "swing" || h.st >= 0.2))
        return taut(hand, at, h.state === "swing" && orrin.latch !== "air");
      return restLoop();
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
