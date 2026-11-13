import { ENEMIES } from "../../../constants/enemies";
import { HOOK } from "../../../constants/orrin/hook";
import { GRAND_PENDULUM as G } from "../../../constants/orrin/special";
import { PAL, SPARKS } from "../../../constants/palette";
import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { Point } from "../../../types/world";
import { clamp, lerp, TAU } from "../../../utils/math";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { withCharms } from "../../skills/query";
import { game, hero, lights, particles, rng } from "../../state";
import { boxHit, heroBox, surfaceBelow } from "../../world";
import { setState, settle } from "../actions";
import { ultimateValues } from "../ultimate";
import { orrin, orrinHost } from "./memory";
import { crashRing, ultHit } from "./ultStrike";

/** the special as the Grand Pendulum skill shapes it; with no skill, two passes and a crash */
interface Shape {
  passes: number;
  power: number;
  pull: boolean;
  radius: number;
  shards: number;
  crash: number;
  stun: number;
  turns: number;
  burst: number;
}

function shape(): Shape {
  const v = ultimateValues();
  return {
    passes: v.passes ?? G.passes,
    power: v.power ?? G.power,
    pull: (v.pull ?? 0) > 0,
    radius: withCharms("area", v.radius ?? G.radius),
    shards: v.shards ?? 0,
    crash: v.crash ?? G.crash,
    stun: v.stun ?? 0,
    turns: v.turns ?? 0,
    burst: v.burst ?? 0,
  };
}

/** Grand Pendulum: a tear opens over him; he swings wide passes under it, loops full turns with the skill, then crashes */
export function castGrandPendulum(level: number): void {
  const h = hero;
  const s = shape();
  const floor = h.ground ? h.y : surfaceBelow(h.x, h.y);
  const cy = Math.min(h.y - G.height - HOOK.grip, floor - 2 - HOOK.grip - s.radius);
  const y = Math.max(12, cy);
  // the arc's bottom clears the floor under him; he passes through the platforms on the way, as his swing does
  const r = Math.min(s.radius, Math.max(30, floor - 2 - HOOK.grip - y));
  // the tear opens far enough in from the stage's sides that his widest swing stays on the stage
  const side = Math.min(W / 2, r + G.edge);
  const tear = { x: clamp(h.x, side, W - side), y };
  orrin.ultTear = tear;
  orrin.ultAt = tear;
  orrin.ultLevel = level;
  orrin.ultRadius = r;
  orrinHost.passed = [];
  setState("pendulum");
}

/** the angle of pass `i` at share `k` of it: each pass swings from one side to the other, eased at both ends */
const passAngle = (i: number, k: number): number => (i % 2 ? 1 : -1) * -G.amplitude * Math.cos(Math.PI * k);

/** where his feet are at a swing angle round a centre, on an ellipse `rx` wide and `ry` tall */
function onArc(at: Point, angle: number, rx: number, ry: number): Point {
  return { x: at.x + Math.sin(angle) * rx * hero.face, y: at.y + Math.cos(angle) * ry + HOOK.grip };
}

/** where he is at time u into the swinging, and the tear's centre and the ellipse he swings on then */
function placeAt(u: number, s: Shape): { at: Point; angle: number; rx: number; ry: number } {
  const r = orrin.ultRadius;
  const tear = orrin.ultTear;
  const passes = s.passes * G.pass;
  if (u < passes) {
    const i = Math.min(s.passes - 1, Math.floor(u / G.pass));
    return { at: tear, angle: passAngle(i, (u - i * G.pass) / G.pass), rx: r, ry: r };
  }
  // the turns: the tear drops to the middle of the stage, and he loops on round it the way the last pass went
  const v = u - passes;
  const mid = (G.top + GROUND - HOOK.grip) / 2;
  const k = clamp(v / G.settle);
  const at = { x: tear.x, y: lerp(tear.y, mid, k) };
  const ry = lerp(r, Math.min(r, mid - G.top), k);
  const last = s.passes - 1;
  const end = passAngle(last, 1);
  const way = last % 2 ? -1 : 1;
  return { at, angle: end + way * TAU * (v / G.turn), rx: r, ry };
}

/** each pass or turn strikes every foe his body and chain meet, once each */
function strikePass(at: Point, power: number): void {
  const box = heroBox();
  for (const e of game.enemies) {
    if (e.hp <= 0 || orrinHost.passed.includes(e)) continue;
    const b = enemyBox(e);
    const onChain = [0.35, 0.6, 0.85].some((u) => {
      const x = at.x + (hero.x - at.x) * u;
      const y = at.y + (hero.y - HOOK.grip - at.y) * u;
      return x > b[0] - 3 && x < b[2] + 3 && y > b[1] - 3 && y < b[3] + 3;
    });
    if (!onChain && !boxHit(box, b)) continue;
    orrinHost.passed = [...orrinHost.passed, e];
    ultHit(e, power, hero.x);
  }
}

/** a pass drags the foes under the arc toward the bottom of it; the heaviest foes stand their ground */
function pull(at: Point, dt: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || ENEMIES[e.type].weight >= 1) continue;
    const [cx] = enemyCenter(e);
    if (Math.abs(cx - at.x) > orrin.ultRadius) continue;
    e.x += (at.x - cx) * Math.min(1, dt * 1.5);
  }
}

/** chain shards rain from his hand onto the floor beneath the arc, striking each foe standing there */
function shards(at: Point, share: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.air || Math.abs(enemyCenter(e)[0] - at.x) > orrin.ultRadius) continue;
    ultHit(e, share, at.x);
  }
  for (let i = 0; i < 8; i++) {
    const a = rng.range(0.2, Math.PI - 0.2);
    particles.spawn(PK.SHARD, hero.x, hero.y - 16, Math.cos(a) * 160, Math.sin(a) * 160, 0.4, { col: PAL.brass[3] });
  }
}

/** the evolved end: every foe drawn in under the tear bursts together */
function burst(at: Point, share: number): void {
  for (const e of game.enemies) {
    const [cx] = enemyCenter(e);
    if (e.hp > 0 && Math.abs(cx - at.x) < orrin.ultRadius * 0.5) ultHit(e, share, at.x);
  }
  for (let i = 0; i < 16; i++)
    particles.spawn(PK.SPARK, at.x, GROUND - 16, rng.range(-240, 240), rng.range(-240, 40), 0.4, {
      sparks: SPARKS.brass,
    });
}

/**
 * The special's flow: a crouch under the opening tear, the passes along the arc, the turns round the tear with the
 * skill, and the drop to the floor that sets off the crash ring. He cannot be hurt until he lands.
 */
export function runPendulum(dt: number): void {
  const h = hero;
  if (!orrin.ultAt) return settle();
  const s = shape();
  h.inv = Math.max(h.inv, 0.1);
  if (h.st < G.windup) {
    h.vx = 0;
    h.vy = 0;
    return;
  }
  const u = h.st - G.windup;
  const swinging = s.passes * G.pass + s.turns * G.turn;
  if (u < swinging) {
    const now = placeAt(u, s);
    const span = u < s.passes * G.pass ? G.pass : G.turn;
    const from = u < s.passes * G.pass ? 0 : s.passes * G.pass;
    if (u - dt <= 0 || Math.floor((u - from) / span) !== Math.floor((u - dt - from) / span)) {
      orrinHost.passed = [];
      sfx.swing(0.7);
      lights.add(now.at.x, now.at.y, 60, PAL.volt[3], 0.7, 0.3);
      if (s.shards) shards(now.at, s.shards);
    }
    orrin.ultAt = { x: now.at.x, y: now.at.y };
    // the passes sweep through the low platforms instead of landing on them
    h.drop = Math.max(h.drop, 0.05);
    const next = placeAt(u + dt, s);
    const to = onArc(next.at, next.angle, next.rx, next.ry);
    h.vx = (to.x - h.x) / dt;
    h.vy = (to.y - h.y) / dt;
    h.ground = false;
    if (s.pull && u < s.passes * G.pass) pull(now.at, dt);
    strikePass(now.at, s.power);
    return;
  }
  // he lets go at the end of the swinging and drops
  h.vx = 0;
  h.vy = Math.max(h.vy, 320);
  if (!h.ground && u < swinging + G.fall) return;
  crashRing(s.crash, undefined, s.stun);
  if (s.burst) burst(orrin.ultAt, s.burst);
  orrin.ultAt = null;
  settle();
}
