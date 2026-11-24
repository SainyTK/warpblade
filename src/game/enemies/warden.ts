import { ENEMY_HITS } from "../../constants/enemies";
import { SPARKS } from "../../constants/palette";
import { GROUND } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { eraOf } from "../../utils/eras";
import { approach, clamp } from "../../utils/math";
import { clampStageX, stageThreat } from "../adventure";
import { eachStanding } from "../coopHooks";
import { createRift } from "../effects/rift";
import { createShadowOrb } from "../effects/shadowOrb";
import { hurtHero } from "../hurtHero";
import { fxRng, game, hero, particles, rng } from "../state";
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
  // the warden calls the flyers of the era it fights in
  const flyer = eraOf(game.wave).flyer;
  const minions = game.enemies.filter((m) => m.type === flyer).length;
  for (let i = 0; i < Math.min(2, MAX_SUMMONS - minions); i++) {
    const x = clampStageX(hero.x + (i ? 70 : -70), 20);
    const y = rng.range(50, 90);
    game.fx.push(
      createRift(x, y, 11, i * 0.2, () => game.enemies.push(makeEnemy(flyer, x, y, stageThreat(game.wave), 0.25))),
    );
  }
}

/** The Rift Warden hovers above the floor: it fires shadow orbs, calls wisps through rifts and dives at Kael. */
export function updateWarden(e: Enemy, dt: number, ts: number): void {
  if (e.phase === 1 && e.hp < e.max * 0.5) e.phase = 2;
  const fast = e.phase === 2 ? 0.7 : 1;
  const dx = hero.x - e.x;
  if (e.state === "drift") {
    turnToHero(e, dt);
    const tx = clampStageX(hero.x - e.side * 80, 30);
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
    eachStanding(() => {
      if (boxHit(enemyBox(e), heroBox())) hurtHero(ENEMY_HITS.wardenDive * e.power, e.x);
    });
    if (e.st >= 0.55) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.8) Object.assign(e, { state: "drift", st: 0, cd: rng.range(1.2, 2.2) * fast, side: -e.side });
  if (e.state !== "dive") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 20);
  e.y = clamp(e.y + e.vy * dt, 26, GROUND - 22);
  if (fxRng.chance(0.4 * ts))
    particles.spawn(
      PK.EMBER,
      e.x + fxRng.range(-12, 12),
      e.y + fxRng.range(6, 14),
      fxRng.range(-8, 8),
      fxRng.range(-10, 10),
      fxRng.range(0.5, 1),
      {
        sparks: SPARKS.shadow,
      },
    );
}
