import { COIN_BONUS, COIN_DROP, COIN_MOTION as M } from "../constants/coins";
import { COIN_GOLD } from "../constants/palette";
import { LODESTONE_BONUS } from "../constants/shopSkills";
import { W } from "../constants/stage";
import { sfx } from "../services/audio";
import { addCoins, ownsSkill } from "../store/meta";
import type { EnemyType } from "../types/enemy";
import type { Coin } from "../types/game";
import { PK } from "../types/particle";
import { coinDrop } from "../utils/coins";
import { clamp } from "../utils/math";
import { coop } from "./coopHooks";
import { feat } from "./feat";
import { game, hero, particles, rng } from "./state";
import { surfaceBelow } from "./world";

/** a slain foe's coins burst out of it */
export function dropCoins(type: EnemyType, x: number, y: number): void {
  const bonus = COIN_BONUS + (ownsSkill("lodestone") ? LODESTONE_BONUS : 0);
  const n = coinDrop(COIN_DROP[type], bonus, rng.next());
  for (let i = 0; i < n; i++)
    game.coinDrops.push({ x, y, vx: rng.range(-60, 60), vy: rng.range(-170, -90), t: 0, rest: false });
}

/** what falls, bounces and flies to Kael: coins and experience orbs */
type Loose = Pick<Coin, "x" | "y" | "vx" | "vy" | "rest">;
type Motion = Readonly<Record<"gravity" | "bounce" | "pullAccel" | "pullSpeed", number>>;

export function fall(c: Loose, dt: number, m: Motion = M): void {
  if (c.rest) return;
  c.vy += m.gravity * dt;
  c.x = clamp(c.x + c.vx * dt, 4, W - 4);
  c.y += c.vy * dt;
  const floor = surfaceBelow(c.x, c.y - c.vy * dt) - 1;
  if (c.vy > 0 && c.y >= floor) {
    c.y = floor;
    c.vy *= -m.bounce;
    c.vx *= 0.6;
    if (Math.abs(c.vy) < 25) Object.assign(c, { vy: 0, vx: 0, rest: true });
  }
}

export function home(c: Loose, dx: number, dy: number, d: number, dt: number, m: Motion = M): void {
  c.rest = false;
  c.vx += (dx / d) * m.pullAccel * dt;
  c.vy += (dy / d) * m.pullAccel * dt;
  const sp = Math.hypot(c.vx, c.vy);
  if (sp > m.pullSpeed) {
    c.vx *= m.pullSpeed / sp;
    c.vy *= m.pullSpeed / sp;
  }
  c.x += c.vx * dt;
  c.y += c.vy * dt;
}

/** coins fall and bounce, Kael picks them up by touch, and after a moment the rest fly to him */
export function updateCoins(dt: number): void {
  const room = coop();
  for (const c of game.coinDrops) {
    room?.nearest(c.x, c.y);
    const pull = ownsSkill("lodestone") ? M.magnetPull : M.pull;
    c.t += dt;
    const dx = hero.x - c.x;
    const dy = hero.y - 18 - c.y;
    const d = Math.hypot(dx, dy) || 1;
    if (c.t >= pull && hero.state !== "dead") home(c, dx, dy, d, dt);
    else fall(c, dt);
    if (c.t < M.settle || d > M.reach || hero.state === "dead") continue;
    c.done = true;
    game.coins++;
    particles.spawn(PK.STAR, c.x, c.y, 0, -12, 0.3, { col: COIN_GOLD[3], size: 2 });
    sfx.coin();
  }
  game.coinDrops = game.coinDrops.filter((c) => !c.done);
}

/** add the run's coins to the bank, with any still on the floor, so none is lost when a run ends */
export function bankCoins(): number {
  const earned = game.coins + game.coinDrops.length;
  addCoins(earned);
  feat({ kind: "banked", coins: earned });
  game.coins = 0;
  game.coinDrops = [];
  return earned;
}
