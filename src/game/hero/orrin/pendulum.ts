import { HOOK } from "../../../constants/orrin/hook";
import { GRAND_PENDULUM as G } from "../../../constants/orrin/special";
import { PAL } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Point } from "../../../types/world";
import { enemyBox } from "../../enemies/enemy";
import { game, hero, lights } from "../../state";
import { boxHit, heroBox, surfaceBelow } from "../../world";
import { setState, settle } from "../actions";
import { orrin, orrinHost } from "./memory";
import { crashRing, ultHit } from "./ultStrike";

/** the widest angle of a pass either side of straight down */
const AMPLITUDE = (65 * Math.PI) / 180;

/** Grand Pendulum: a tear opens over him; he swings two wide passes under it, then lets go and crashes down */
export function castGrandPendulum(level: number): void {
  const h = hero;
  const floor = h.ground ? h.y : surfaceBelow(h.x, h.y);
  const cy = Math.min(h.y - G.height - HOOK.grip, floor - 2 - HOOK.grip - G.radius);
  orrin.ultAt = { x: h.x, y: Math.max(12, cy) };
  orrin.ultLevel = level;
  // the arc's bottom clears the floor under him; he passes through the platforms on the way, as his swing does
  orrin.ultRadius = Math.min(G.radius, Math.max(30, floor - 2 - HOOK.grip - orrin.ultAt.y));
  orrinHost.passed = [];
  setState("pendulum");
}

/** the angle of the swing at time u into the passes: across from behind him to ahead, then back */
function swingAngle(u: number): number {
  const half = G.passes / 2;
  const k = u < half ? u / half : (u - half) / half;
  const a = -AMPLITUDE * Math.cos(Math.PI * k);
  return u < half ? a : -a;
}

/** where his feet are at a swing angle, round the tear */
function onArc(at: Point, angle: number): Point {
  const r = orrin.ultRadius;
  return { x: at.x + Math.sin(angle) * r * hero.face, y: at.y + Math.cos(angle) * r + HOOK.grip };
}

/** each pass strikes every foe his body and chain meet, once a pass */
function strikePass(at: Point): void {
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
    ultHit(e, G.pass, hero.x);
  }
}

/**
 * The special's flow: a crouch under the opening tear, the two passes along the arc, and the drop to the floor that
 * sets off the crash ring. He cannot be hurt until he lands.
 */
export function runPendulum(dt: number): void {
  const h = hero;
  const at = orrin.ultAt;
  if (!at) return settle();
  h.inv = Math.max(h.inv, 0.1);
  if (h.st < G.windup) {
    h.vx = 0;
    h.vy = 0;
    return;
  }
  const u = h.st - G.windup;
  if (u < G.passes) {
    if (u - dt <= 0 || (u >= G.passes / 2 && u - dt < G.passes / 2)) {
      orrinHost.passed = [];
      sfx.swing(0.7);
      lights.add(at.x, at.y, 60, PAL.volt[3], 0.7, 0.3);
    }
    // the passes sweep through the low platforms instead of landing on them
    h.drop = Math.max(h.drop, 0.05);
    const to = onArc(at, swingAngle(u + dt));
    h.vx = (to.x - h.x) / dt;
    h.vy = (to.y - h.y) / dt;
    h.ground = false;
    strikePass(at);
    return;
  }
  // he lets go at the end of the second pass and drops
  h.vx = 0;
  h.vy = Math.max(h.vy, 320);
  if (!h.ground && u < G.passes + G.fall) return;
  crashRing(1);
  orrin.ultAt = null;
  settle();
}

/** the special drives him and holds him off gravity until the crash */
export const pendulumDrives = (): boolean => hero.state === "pendulum";
