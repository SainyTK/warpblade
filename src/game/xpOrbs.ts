import { PAL } from "../constants/palette";
import { XP_ORB_MOTION as M, XP_ORB } from "../constants/progression";
import { sfx } from "../services/audio";
import type { XpOrb } from "../types/game";
import { PK } from "../types/particle";
import { waveScale } from "../utils/progression";
import { fall, home } from "./coins";
import { coop } from "./coopHooks";
import { gainXp } from "./progress";
import { game, hero, particles, rng } from "./state";

/** the orb lying nearest a point */
function nearestOrb(x: number, y: number): XpOrb {
  let best = game.xpOrbs[0];
  for (const o of game.xpOrbs) if (Math.hypot(o.x - x, o.y - y) < Math.hypot(best.x - x, best.y - y)) best = o;
  return best;
}

/**
 * a slain foe's experience bursts out of it as orbs, as many for a kill late in the run as early; with many orbs about,
 * fewer, and with a crowd of them it joins the nearest one
 */
export function dropXp(amount: number, x: number, y: number): void {
  if (amount <= 0) return;
  const lying = game.xpOrbs.length;
  if (lying >= XP_ORB.crowd) {
    nearestOrb(x, y).value += amount;
    return;
  }
  const most = Math.max(1, Math.round(XP_ORB.most * (1 - lying / XP_ORB.crowd)));
  const n = Math.max(1, Math.min(most, Math.round(amount / (XP_ORB.share * waveScale(game.wave).xp))));
  const each = amount / n;
  for (let i = 0; i < n; i++)
    game.xpOrbs.push({ x, y, vx: rng.range(-70, 70), vy: rng.range(-180, -90), t: 0, value: each, rest: false });
}

/** orbs fall and bounce, Kael picks them up by touch, and after a while the rest fly to him */
export function updateXpOrbs(dt: number): void {
  let gained = 0;
  const room = coop();
  for (const o of game.xpOrbs) {
    room?.nearest(o.x, o.y);
    o.t += dt;
    const dx = hero.x - o.x;
    const dy = hero.y - 18 - o.y;
    const d = Math.hypot(dx, dy) || 1;
    if (o.t >= M.pull && hero.state !== "dead") home(o, dx, dy, d, dt, M);
    else fall(o, dt, M);
    if (o.t < M.settle || d > M.reach || hero.state === "dead") continue;
    o.done = true;
    gained += o.value;
    particles.spawn(PK.STAR, o.x, o.y, 0, -12, 0.3, { col: PAL.heal[4], size: 2 });
  }
  if (!gained) return;
  game.xpOrbs = game.xpOrbs.filter((o) => !o.done);
  sfx.pickup();
  if (room) room.shareXp(gained);
  else gainXp(gained);
}
