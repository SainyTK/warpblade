import { MAX_MP, MP_PER_HIT } from "../constants/combat";
import { PAL, SPARKS } from "../constants/palette";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import { PK } from "../types/particle";
import type { Box } from "../types/world";
import { WHITE } from "../utils/color";
import { lerp, TAU } from "../utils/math";
import { createImpact } from "./effects/impact";
import { enemyBox, enemyCenter } from "./enemies/enemy";
import { game, hero, lights, particles, rng, showBanner } from "./state";
import { boxHit, hitStop, shake } from "./world";

export function damageEnemy(e: Enemy, dmg: number, kx: number, ky: number): void {
  if (e.hp <= 0) return;
  e.hp -= dmg;
  e.flash = 0.1;
  e.vx += kx * (e.type === "husk" ? 0.5 : 1);
  if (e.type === "wisp") e.vy += ky;
  // a heavy blow interrupts a wind-up
  if (e.state === "wind" && dmg >= 20) {
    e.state = "recover";
    e.st = 0;
  }
  if (e.hp <= 0) killEnemy(e);
}

/** a dark burst of smoke and motes, and orbs that fly back to Kael */
function killEnemy(e: Enemy): void {
  const [x, y] = enemyCenter(e);
  const S = PAL.shadow;
  const R = rng;
  game.kills++;
  lights.add(x, y, 56, S[4], 0.9, 0.5);
  lights.add(x, y, 18, WHITE, 0.8, 0.1);
  for (let i = 0; i < 16; i++) {
    const a = R.range(0, TAU);
    const sp = R.range(40, 160);
    particles.spawn(PK.MOTE, x, y, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.3, 0.7), {
      col: R.pick([S[3], S[4], S[5]]),
      size: 0.8,
    });
  }
  for (let i = 0; i < 7; i++)
    particles.spawn(
      PK.SMOKE,
      x + R.range(-5, 5),
      y + R.range(-5, 5),
      R.range(-25, 25),
      R.range(-30, 0),
      R.range(0.8, 1.5),
      {
        col: S[2],
        size: R.range(3, 5.5),
      },
    );
  for (let i = 0; i < 4; i++)
    particles.spawn(
      PK.STAR,
      x + R.range(-8, 8),
      y + R.range(-8, 8),
      R.range(-30, 30),
      R.range(-50, -10),
      R.range(0.4, 0.9),
      {
        col: S[5],
        size: R.range(0.5, 2.5),
      },
    );
  const orbs = e.type === "husk" ? 4 : 2;
  for (let i = 0; i < orbs; i++)
    game.pickups.push({ x, y, vx: R.range(-70, 70), vy: R.range(-140, -60), t: 0, kind: "mp" });
  if (R.chance(e.type === "husk" ? 0.7 : 0.3))
    game.pickups.push({ x, y, vx: R.range(-50, 50), vy: -150, t: 0, kind: "hp" });
  sfx.death();
}

export function hurtHero(dmg: number, fromX: number): void {
  if (hero.inv > 0 || hero.state === "dodge" || hero.state === "warpStrike" || hero.state === "dead") return;
  hero.hp = Math.max(0, hero.hp - dmg);
  hero.inv = 1.1;
  const dir = Math.sign(hero.x - fromX) || -hero.face;
  Object.assign(hero, { vx: dir * 150, vy: -160, ground: false, anchor: null, hasSword: true, sword: null });
  hero.state = hero.hp > 0 ? "hurt" : "dead";
  hero.st = 0;
  game.fx.push(createImpact(hero.x, hero.y - 18, dir, false, SPARKS.blood));
  hitStop(0.08);
  shake(0.25, 2.5);
  sfx.hurt();
  if (hero.hp <= 0) showBanner("Kael has fallen", 2);
}

/** test a box against every enemy, once per swing; returns whether anything was hit */
export function meleeHit(box: Box, dmg: number, kx: number, ky: number, big: boolean): boolean {
  let any = false;
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.swing === game.swing || !boxHit(box, enemyBox(e))) continue;
    e.swing = game.swing;
    const [ex, ey] = enemyCenter(e);
    damageEnemy(e, dmg, kx * hero.face, ky);
    game.fx.push(createImpact(lerp(hero.x + hero.face * 8, ex, 0.6), ey, hero.face, big));
    hero.mp = Math.min(MAX_MP, hero.mp + MP_PER_HIT);
    any = true;
  }
  if (any) {
    hitStop(big ? 0.13 : 0.07);
    shake(big ? 0.2 : 0.12, big ? 2.5 : 1.5);
    sfx.hit(big);
    if (!hero.ground) hero.vy = Math.min(hero.vy, -40);
  }
  return any;
}
