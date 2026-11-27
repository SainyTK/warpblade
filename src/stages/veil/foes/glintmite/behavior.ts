import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { game, hero, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { MITE, MITE_HITS } from "./constants";

function strike(e: Enemy): void {
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(MITE_HITS.hop * e.power, e.x);
  });
}

function hop(e: Enemy, dt: number): void {
  e.vy += MITE.gravity * dt;
  e.y = Math.min(GROUND, e.y + e.vy * dt);
  strike(e);
  if (e.y < GROUND || e.vy < 0) return;
  Object.assign(e, { state: "recover", st: 0, vy: 0, vx: e.vx * 0.3 });
  dust(e.x, GROUND, 2);
}

export function updateGlintmite(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const go = e.halt <= 0 && (!foeSees(e) || Math.abs(dx) > 14);
    e.vx = approach(e.vx, go ? e.face * MITE.skitter : 0, 220 * dt);
    const near = Math.abs(dx) < MITE.notice && Math.abs(hero.y - e.y) < 30;
    if (e.cd <= 0 && near && facesHero(e) && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= MITE.wind * scale.windup && e.pinned <= 0) {
      Object.assign(e, { state: "hop", st: 0, n: 0, vx: e.face * MITE.hop, vy: -MITE.rise });
      sfx.lunge();
      dust(e.x, GROUND, 2, -e.face);
    }
  } else if (e.state === "hop") hop(e, dt);
  else {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.st >= MITE.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.9, 1.6) * scale.cooldown });
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  if (e.state !== "hop") e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(MITE_HITS.touch * e.power, e.x);
  });
}
