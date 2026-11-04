import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp, TAU } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { facesHero, turnToHero } from "../facing";
import { ABYSS_HITS, AC, VOID, VOID_SPARKS } from "./colors";
import { createVoidOrb, ORB_GRAVITY } from "./voidOrb";
import { createVoidSpikes } from "./voidSpikes";

const BITE_RANGE = 40;
/** the wind-ups, as shares of the wave's wind-up scale */
export const MAW_WINDUP = { bite: 0.65, spit: 0.75, rear: 0.85 } as const;
/** e.n through a recovery: what it just did, so the sprite holds the right pose */
export const MAW_DID = { bite: 1, spit: 2, slam: 3 } as const;

function bite(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, vx: e.face * 150 });
  sfx.lunge();
}

function chomp(e: Enemy): void {
  game.fx.push(createImpact(e.x + e.face * 24, e.y - 16, e.face, true, VOID_SPARKS));
  const reach = e.face > 0 ? ([e.x, e.y - 34, e.x + 40, e.y] as const) : ([e.x - 40, e.y - 34, e.x, e.y] as const);
  if (boxHit(reach, heroBox())) hurtHero(ABYSS_HITS.mawBite * e.power, e.x);
  shake(0.12, 2);
  sfx.swing(0.3);
}

/** a fan of void globs lobbed to land around Kael, more of them once it is enraged */
function spit(e: Enemy, enraged: boolean): void {
  const n = enraged ? 5 : 3;
  const mx = e.x + e.face * 22;
  const my = e.y - 18;
  for (let i = 0; i < n; i++) {
    const land = clamp(hero.x + (i - (n - 1) / 2) * 26, 8, W - 8);
    const vy = -150 + i * 10;
    // the flight time down to the floor, so the glob comes down on its landing spot
    const time = (-vy + Math.sqrt(vy * vy + 2 * ORB_GRAVITY * (GROUND - 2 - my))) / ORB_GRAVITY;
    game.fx.push(createVoidOrb(mx, my, (land - mx) / time, vy, ABYSS_HITS.mawOrb * e.power));
  }
  sfx.boom();
}

function slam(e: Enemy, enraged: boolean): void {
  const fx = e.x + e.face * 20;
  game.fx.push(createFloorRing(fx, GROUND, 30, VOID, 0.45));
  game.fx.push(createVoidSpikes(fx + e.face * 14, e.face, enraged ? 9 : 7, ABYSS_HITS.mawSlam * e.power));
  dust(fx - 6, GROUND, 6, -1);
  dust(fx + 6, GROUND, 6, 1);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SHARD, fx + rng.range(-10, 10), GROUND - 1, rng.range(-90, 90), rng.range(-180, -70), 0.7, {
      col: AC.bodyLight,
      size: rng.range(1.5, 2.5),
    });
  shake(0.3, 3.5);
  sfx.boom();
}

/**
 * The Abyss Maw: a hulking crawler that is mostly mouth. Close in it gapes and lunges to bite; further off it fills its
 * gullet with light and lobs a fan of void globs at Kael, or rears up and slams a row of spikes out along the floor.
 */
export function updateMaw(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const enraged = e.hp < e.max * 0.5;
  const ws = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 12 ? e.face * (enraged ? 30 : 20) : 0, 140 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") {
      if (Math.abs(dx) < BITE_RANGE) Object.assign(e, { state: "wind", st: 0 });
      else if (Math.abs(dx) < 200) Object.assign(e, { state: rng.chance(0.5) ? "charge" : "volley", st: 0 });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, -e.face * 10, 300 * dt);
    if (e.st >= MAW_WINDUP.bite * ws.windup) bite(e);
  } else if (e.state === "lunge") {
    if (e.st >= 0.1 && e.st - dt < 0.1) chomp(e);
    if (e.st >= 0.24) Object.assign(e, { state: "recover", st: 0, n: MAW_DID.bite });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (rng.chance(0.7 * ts)) {
      const a = rng.range(0, TAU);
      const mx = e.x + e.face * 20;
      particles.spawn(
        PK.MOTE,
        mx + Math.cos(a) * 14,
        e.y - 18 + Math.sin(a) * 14,
        -Math.cos(a) * 60,
        -Math.sin(a) * 60,
        0.22,
        {
          col: VOID[4],
          size: 0.6,
        },
      );
    }
    if (e.st >= MAW_WINDUP.spit * ws.windup) {
      Object.assign(e, { state: "shoot", st: 0, vx: -e.face * 30 });
      spit(e, enraged);
    }
  } else if (e.state === "shoot") {
    if (e.st >= 0.35) Object.assign(e, { state: "recover", st: 0, n: MAW_DID.spit });
  } else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= MAW_WINDUP.rear * ws.windup) {
      Object.assign(e, { state: "recover", st: -0.15, n: MAW_DID.slam });
      slam(e, enraged);
    }
  } else if (e.st >= 0.8)
    Object.assign(e, {
      state: "walk",
      st: 0,
      n: 0,
      cd: rng.range(1, 1.8) * (enraged ? 0.65 : 1) * ws.cooldown,
    });
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 16, W - 16);
  e.y = GROUND;
  if (rng.chance(0.2 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-14, 14), e.y - rng.range(8, 34), 0, -12, rng.range(0.5, 1), {
      sparks: VOID_SPARKS,
    });
}
