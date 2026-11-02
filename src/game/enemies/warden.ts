import { ENEMY_HITS } from "../../constants/enemies";
import { SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { approach, clamp } from "../../utils/math";
import { createRift } from "../effects/rift";
import { createShadowOrb } from "../effects/shadowOrb";
import { hurtHero } from "../hurtHero";
import { game, hero, particles, rng } from "../state";
import { boxHit, heroBox } from "../world";
import { enemyBox, makeEnemy } from "./enemy";
import { turnToHero } from "./facing";

const ORB_SPEED = 115;
const MAX_SUMMONS = 4;

function fireVolley(e: Enemy): void {
  const n = e.phase === 2 ? 5 : 3;
  const base = Math.atan2(hero.y - 16 - e.y, hero.x - e.x);
  for (let i = 0; i < n; i++) {
    const a = base + (i - (n - 1) / 2) * 0.28;
    game.fx.push(
      createShadowOrb(
        e.x + e.face * 8,
        e.y + 4,
        Math.cos(a) * ORB_SPEED,
        Math.sin(a) * ORB_SPEED,
        ENEMY_HITS.wardenOrb * e.power,
      ),
    );
  }
  sfx.cast();
}

function summon(): void {
  const minions = game.enemies.filter((m) => m.type === "wisp").length;
  for (let i = 0; i < Math.min(2, MAX_SUMMONS - minions); i++) {
    const x = clamp(hero.x + (i ? 70 : -70), 20, W - 20);
    const y = rng.range(50, 90);
    game.fx.push(createRift(x, y, 11, i * 0.2, () => game.enemies.push(makeEnemy("wisp", x, y, game.wave, 0.25))));
  }
}

/** The Rift Warden hovers above the floor: it fires shadow orbs, calls wisps through rifts and dives at Kael. */
export function updateWarden(e: Enemy, dt: number, ts: number): void {
  if (e.phase === 1 && e.hp < e.max * 0.5) e.phase = 2;
  const fast = e.phase === 2 ? 0.7 : 1;
  const dx = hero.x - e.x;
  if (e.state === "drift") {
    turnToHero(e, dt);
    const tx = clamp(hero.x - e.side * 80, 30, W - 30);
    const ty = 54 + Math.sin(game.t * 1.3 + e.seed) * 10;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -60, 60), 150 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.2, -40, 40), 150 * dt);
    if (e.cd <= 0 && hero.state !== "dead") {
      const roll = rng.next();
      const state = roll < 0.45 ? "volley" : roll < 0.7 ? "summon" : "wind";
      Object.assign(e, { state, st: 0 });
    }
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= 0.6 * fast && e.st - dt < 0.6 * fast) fireVolley(e);
    if (e.phase === 2 && e.st >= 0.9 && e.st - dt < 0.9) fireVolley(e);
    if (e.st >= 1.1) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= 0.5 && e.st - dt < 0.5) summon();
    if (e.st >= 1) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, -Math.sign(dx) * 25, 200 * dt);
    if (e.st >= 0.55 * fast) {
      const dy = hero.y - 14 - e.y;
      const d = Math.hypot(dx, dy) || 1;
      Object.assign(e, { state: "dive", st: 0, vx: (dx / d) * 250, vy: (dy / d) * 250, face: Math.sign(dx) || e.face });
      sfx.lunge();
    }
  } else if (e.state === "dive") {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(ENEMY_HITS.wardenDive * e.power, e.x);
    if (e.st >= 0.55) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.8) Object.assign(e, { state: "drift", st: 0, cd: rng.range(1.2, 2.2) * fast, side: -e.side });
  if (e.state !== "dive") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clamp(e.x + e.vx * dt, 20, W - 20);
  e.y = clamp(e.y + e.vy * dt, 26, GROUND - 22);
  if (rng.chance(0.4 * ts))
    particles.spawn(
      PK.EMBER,
      e.x + rng.range(-12, 12),
      e.y + rng.range(6, 14),
      rng.range(-8, 8),
      rng.range(-10, 10),
      rng.range(0.5, 1),
      {
        sparks: SPARKS.shadow,
      },
    );
}
