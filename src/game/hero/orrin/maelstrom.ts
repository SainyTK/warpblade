import { HOOK } from "../../../constants/orrin/hook";
import { MAELSTROM as M } from "../../../constants/orrin/special";
import { PAL, SPARKS } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, rng } from "../../state";
import { setState, settle } from "../actions";
import { orrin, orrinHost } from "./memory";
import { crashRing, ultHit } from "./ultStrike";

const SKILL = "o_maelstrom";
/** his path keeps under the top of the screen and over the floor */
const TOP = 14;

/** the circle's size: wide as the skill's radius, as tall as the stage allows */
function radii(): { rx: number; ry: number; cy: number } {
  const rx = withCharms("area", skillValues(SKILL).radius ?? 96);
  const cy = (TOP + GROUND - HOOK.grip) / 2;
  return { rx, ry: Math.min(rx, cy - TOP), cy };
}

/** Maelstrom: a tear opens over the middle of the fight and he swings full vertical turns round it */
export function castMaelstrom(level: number): void {
  const { cy } = radii();
  orrin.ultAt = { x: hero.x, y: cy };
  orrin.ultLevel = level;
  orrinHost.passed = [];
  setState("maelstrom");
}

/** the angle round the tear at time u: starting straight below, turning toward his facing */
const angleAt = (u: number): number => (u / M.turn) * TAU;

/** chain shards fly out from his hand each turn */
function shards(): void {
  for (let i = 0; i < 6; i++) {
    const a = rng.range(0, TAU);
    particles.spawn(PK.SHARD, hero.x, hero.y - 16, Math.cos(a) * 160, Math.sin(a) * 160, 0.4, { col: PAL.brass[3] });
  }
}

/**
 * The turns: he circles the tear, the chain sweeping the whole circle; every foe inside it is struck once a turn,
 * pulled toward the middle with level 3. The last turn ends in a crash ring, and evolved, the foes gathered in the
 * middle burst together.
 */
export function runMaelstrom(dt: number): void {
  const h = hero;
  const at = orrin.ultAt;
  if (!at) return settle();
  const v = skillValues(SKILL);
  const { rx, ry } = radii();
  h.inv = Math.max(h.inv, 0.1);
  if (h.st < M.windup) {
    h.vx = 0;
    h.vy = 0;
    return;
  }
  const u = h.st - M.windup;
  const turns = v.turns ?? 2;
  if (u < turns * M.turn) {
    const turn = Math.floor(u / M.turn);
    if (Math.floor((u - dt) / M.turn) !== turn || u - dt < 0) {
      orrinHost.passed = [];
      sfx.swing(0.6);
      lights.add(at.x, at.y, 70, PAL.volt[3], 0.6, 0.3);
      if (v.shards) shards();
    }
    const a = angleAt(u + dt);
    const tx = at.x + Math.sin(a) * rx * h.face;
    const ty = at.y + Math.cos(a) * ry + HOOK.grip;
    h.vx = (tx - h.x) / dt;
    h.vy = (ty - h.y) / dt;
    h.ground = false;
    const sweep = Math.atan2(h.y - HOOK.grip - at.y, h.x - at.x);
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      const [cx, cy] = enemyCenter(e);
      const nx = (cx - at.x) / rx;
      const ny = (cy - at.y) / ry;
      if (nx * nx + ny * ny > 1.1) continue;
      if (v.pull) e.x += (at.x - cx) * Math.min(1, dt * 1.5);
      if (orrinHost.passed.includes(e)) continue;
      const fa = Math.atan2(cy - at.y, cx - at.x);
      let gap = Math.abs(fa - sweep) % TAU;
      if (gap > Math.PI) gap = TAU - gap;
      if (gap > 0.5) continue;
      orrinHost.passed = [...orrinHost.passed, e];
      ultHit(e, v.power ?? 0.6, at.x);
    }
    return;
  }
  h.vx = 0;
  h.vy = Math.max(h.vy, 320);
  if (!h.ground && u < turns * M.turn + 0.6) return;
  if (v.crash) crashRing(v.crash, rx);
  if (v.burst) {
    for (const e of game.enemies) {
      const [cx] = enemyCenter(e);
      if (e.hp > 0 && Math.abs(cx - at.x) < rx * 0.5) ultHit(e, v.burst, at.x);
    }
    for (let i = 0; i < 16; i++)
      particles.spawn(PK.SPARK, at.x, GROUND - 16, rng.range(-240, 240), rng.range(-240, 40), 0.4, { sparks: SPARKS.brass });
  }
  orrin.ultAt = null;
  settle();
}
