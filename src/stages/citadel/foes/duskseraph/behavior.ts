import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { ECLIPSE } from "../colors";
import { shroudFoe, shroudKeeper } from "../shroud";
import { createVoidBolt } from "../voidBolt";
import { SERAPH, SERAPH_HITS } from "./constants";
import { createShroudLink } from "./shroudLink";

const handAt = (e: Enemy): [number, number] => [e.x + e.face * 6, e.y - 4];
const aimAt = (e: Enemy): number => {
  const [hx, hy] = handAt(e);
  return Math.atan2(hero.y - 14 - hy, hero.x - hx);
};

function unshrouded(e: Enemy): Enemy | undefined {
  return game.enemies.find(
    (o) =>
      o !== e && o.hp > 0 && o.type !== "duskseraph" && !shroudKeeper(o) && Math.abs(o.x - e.x) < SERAPH.shroudReach,
  );
}

function drift(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * SERAPH.hover + Math.sin(game.t * 0.7 + e.seed) * 12;
  const ty = Math.min(hero.y, GROUND) - SERAPH.height + Math.sin(game.t * 1.9 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.1, -48, 48), 150 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.3, -45, 45), 150 * dt);
  if (e.cd > 0 || hero.state === "dead" || !foeSees(e) || Math.abs(dx) > SERAPH.reach) return;
  const ward = e.n === 0 ? unshrouded(e) : undefined;
  if (ward) {
    Object.assign(e, { state: "summon", st: 0 });
    sfx.chime(4);
    return;
  }
  Object.assign(e, { state: "wind", st: 0, ax: aimAt(e) });
  sfx.chime(0);
}

function shroud(e: Enemy): void {
  const ward = unshrouded(e);
  e.n = 1;
  Object.assign(e, { state: "recover", st: SERAPH.recover * 0.5 });
  if (!ward) return;
  shroudFoe(ward, e);
  game.fx.push(createShroudLink(ward, e));
  sfx.cast();
}

function volley(e: Enemy): void {
  const [hx, hy] = handAt(e);
  for (let i = -1; i <= 1; i++)
    game.fx.push(createVoidBolt(hx, hy, e.ax + i * SERAPH.spread, SERAPH.boltSpeed, SERAPH_HITS.bolt * e.power));
  Object.assign(e, { state: "shoot", st: 0, n: 0, vx: -Math.cos(e.ax) * 40 });
  sfx.lunge();
}

export function updateDuskseraph(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, -10, 200 * dt);
    if (fxRng.chance(0.6 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-10, 10), e.y - 14 + fxRng.range(-6, 6), 0, -10, 0.4, {
        col: ECLIPSE[4],
        size: 0.6,
      });
    if (e.st >= SERAPH.shroudWind * scale.windup) shroud(e);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    if (e.st < SERAPH.wind * SERAPH.track * scale.windup) {
      e.face = Math.sign(hero.x - e.x) || e.face;
      e.ax = aimAt(e);
    }
    if (fxRng.chance(0.5 * ts)) {
      const [hx, hy] = handAt(e);
      const a = fxRng.range(0, Math.PI * 2);
      particles.spawn(PK.MOTE, hx + Math.cos(a) * 8, hy + Math.sin(a) * 8, -Math.cos(a) * 30, -Math.sin(a) * 30, 0.25, {
        col: VOID_SPARKS[1],
        size: 0.5,
      });
    }
    if (e.st >= SERAPH.wind * scale.windup) volley(e);
  } else if (e.state === "shoot") {
    if (e.st >= SERAPH.shoot) Object.assign(e, { state: "recover", st: 0 });
  } else {
    const low = GROUND - SERAPH.sink;
    e.vy = approach(e.vy, clamp((low - e.y) * 2, -40, 70), 200 * dt);
    if (e.st >= SERAPH.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.4, 2.2) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, 22, GROUND - 16);
  if (fxRng.chance(0.15 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-5, 5), e.y + 12, fxRng.range(-4, 4), fxRng.range(6, 14), 0.6, {
      sparks: VOID_SPARKS,
    });
}
