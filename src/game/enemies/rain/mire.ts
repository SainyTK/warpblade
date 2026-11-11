import { SPARKS } from "../../../constants/palette";
import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox } from "../../world";
import { foeSees } from "../awareness";
import { enemyBox } from "../enemy";
import { facesHero, turnToHero } from "../facing";
import { RAIN_HITS, WATER_SPARKS } from "./colors";
import { createMudGlob } from "./mudGlob";

/** how far the tongue reaches, and the seconds it takes to shoot out and pull back */
export const TONGUE = { reach: 38, out: 0.1, back: 0.26 } as const;
const HOP_GRAVITY = 700;
/** seconds the throat swells before a lash or a spit, before wave scaling */
export const MIRE_WINDUP = { lash: 0.55, spit: 0.7 } as const;

/** the tongue's length this moment of a lash */
export function tongueLength(e: Enemy): number {
  if (e.state !== "lunge") return 0;
  const u = e.st < TONGUE.out ? e.st / TONGUE.out : 1 - (e.st - TONGUE.out) / (TONGUE.back - TONGUE.out);
  return TONGUE.reach * clamp(u);
}

/**
 * Mire Toads sit, then hop toward Kael in arcs. When he is close in front they puff their throat and lash a long
 * tongue; from farther off they puff and spit a mud glob that leaves a short puddle where it lands.
 */
export function updateMire(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, 0, 300 * dt);
    const ready = e.cd <= 0 && facesHero(e) && hero.state !== "dead";
    if (ready && Math.abs(dx) < 34 && Math.abs(hero.y - e.y) < 26) Object.assign(e, { state: "wind", st: 0, n: 0 });
    else if (ready && Math.abs(dx) > 60 && Math.abs(dx) < 170 && rng.chance(dt * 1.2))
      Object.assign(e, { state: "wind", st: 0, n: 1 });
    else if (e.st > 0.5 + (e.seed % 0.4) && Math.abs(dx) > 18 && foeSees(e)) {
      Object.assign(e, { state: "hop", st: 0, vy: -150, vx: Math.sign(dx) * rng.range(45, 70) });
      e.face = Math.sign(dx) || e.face;
    }
  } else if (e.state === "hop") {
    e.vy += HOP_GRAVITY * dt;
    e.y += e.vy * dt;
    if (e.y >= GROUND && e.vy > 0) {
      Object.assign(e, { y: GROUND, vy: 0, vx: e.vx * 0.2, state: "walk", st: 0 });
      dust(e.x, GROUND, 3);
      for (let i = 0; i < 3; i++)
        particles.spawn(PK.SPARK, e.x + rng.range(-5, 5), GROUND - 1, rng.range(-50, 50), -rng.range(40, 90), 0.25, {
          sparks: WATER_SPARKS,
        });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= (e.n ? MIRE_WINDUP.spit : MIRE_WINDUP.lash) * scale.windup) {
      if (e.n) {
        const lead = clamp(hero.x + hero.vx * 0.3, e.x - 160, e.x + 160);
        game.fx.push(
          createMudGlob(
            e.x + e.face * 8,
            e.y - 9,
            lead,
            0.75,
            RAIN_HITS.mireGlob * e.power,
            RAIN_HITS.mirePuddle * e.power,
          ),
        );
        Object.assign(e, { state: "shoot", st: 0 });
      } else Object.assign(e, { state: "lunge", st: 0, ax: 0 });
      sfx.swing(e.n ? 0.6 : 1.3);
    }
  } else if (e.state === "lunge") {
    const L = tongueLength(e);
    const tip = e.x + e.face * (10 + L);
    const box = [Math.min(e.x, tip) - 1, e.y - 9, Math.max(e.x, tip) + 1, e.y - 3] as const;
    eachStanding(() => {
      if (!e.ax && e.st < TONGUE.out + 0.04 && boxHit(box, heroBox())) {
        e.ax = 1;
        hurtHero(RAIN_HITS.mireTongue * e.power, e.x);
      }
    });
    if (e.st >= TONGUE.back) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "shoot") {
    if (e.st >= 0.25) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.55) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.8) * scale.cooldown });
  if (e.state !== "hop") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  if (e.state !== "hop") e.y = GROUND;
  if (rng.chance(0.04 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-6, 6), e.y - rng.range(4, 12), 0, -8, rng.range(0.3, 0.6), {
      sparks: SPARKS.shadow,
    });
  eachStanding(() => {
    if ((e.state === "walk" || e.state === "hop") && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(RAIN_HITS.mireTouch * e.power, e.x);
  });
}
