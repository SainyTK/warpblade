import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { touchHero } from "../contact";
import { MITE, MITE_HITS } from "./constants";

function crawl(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const pace = (Math.abs(dx) > 14 || !foeSees(e)) && e.halt <= 0 ? e.face * MITE.crawl : 0;
  e.vx = approach(e.vx, pace, 200 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  if (Math.abs(dx) < MITE.notice && Math.abs(hero.y - e.y) < 40) Object.assign(e, { state: "wind", st: 0 });
}

function hop(e: Enemy, dt: number): void {
  e.vy += MITE.gravity * dt;
  e.y += e.vy * dt;
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(MITE_HITS.hop * e.power, e.x - e.face * 6);
    }
  });
  if (e.y < GROUND || e.vy < 0) return;
  Object.assign(e, { state: "recover", st: 0, y: GROUND, vy: 0, vx: e.vx * 0.4 });
  dust(e.x, GROUND, 3);
}

export function updateFrostmite(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") crawl(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(3 * dt))
      particles.spawn(PK.FLAKE, e.x + fxRng.range(-4, 4), e.y - 8, fxRng.range(-6, 6), -fxRng.range(8, 16), 0.4, {
        col: FOE.crystal[3],
      });
    if (e.st >= MITE.wind * scale.windup) {
      Object.assign(e, { state: "leap", st: 0, n: 0, vx: e.face * MITE.hop, vy: -MITE.lift });
      sfx.lunge();
    }
  } else if (e.state === "leap") hop(e, dt);
  else if (e.st >= MITE.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.7) * scale.cooldown });
  if (e.state === "wind" || e.state === "recover") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "leap") e.y = GROUND;
  if (e.state === "walk") touchHero(e, MITE_HITS.touch);
  if (fxRng.chance(0.04 * ts))
    particles.spawn(PK.FLAKE, e.x + fxRng.range(-5, 5), e.y - 6, 0, -fxRng.range(3, 8), 0.6, { col: FOE.frost[3] });
}
