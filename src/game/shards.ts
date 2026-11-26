import { PAL } from "../constants/palette";
import { SHARD_MOTION as M, SHARD_DROP, SHARD_GAIN, SHARD_NAME } from "../constants/vitals";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import type { Shard, ShardKind } from "../types/game";
import { PK } from "../types/particle";
import { isAdventure, surgeEnding } from "./adventure";
import { fall, home } from "./coins";
import { coop } from "./coopHooks";
import { createFloorRing } from "./effects/floorRing";
import { fightOver } from "./endWave";
import { refreshGrowing } from "./progress";
import { fxRng, game, hero, lights, particles, progress, rng, showBanner } from "./state";

const SHARD_RAMP = { heart: PAL.heart, mana: PAL.crystal } as const;

function endsRoom(): boolean {
  return isAdventure() ? surgeEnding() : fightOver();
}

function shardsFor(e: Enemy): ShardKind[] {
  if (e.rank !== "minion" && !e.elite) return ["heart", "mana"];
  const kinds: ShardKind[] = endsRoom() ? ["heart"] : [];
  const chance = e.elite ? SHARD_DROP.eliteChance : SHARD_DROP.minionChance;
  if (!kinds.includes("heart") && rng.chance(chance)) kinds.push("heart");
  if (rng.chance(chance)) kinds.push("mana");
  return kinds;
}

export function dropShards(e: Enemy, x: number, y: number): void {
  const kinds = shardsFor(e);
  kinds.forEach((kind, i) => {
    const side = kinds.length > 1 ? (i === 0 ? -1 : 1) : 0;
    game.shards.push({ x, y, vx: side * 40 + rng.range(-15, 15), vy: rng.range(-190, -150), t: 0, kind, rest: false });
  });
}

function gainShard(s: Shard): void {
  if (s.kind === "heart") progress.heartShards++;
  else progress.manaShards++;
  refreshGrowing();
  const rp = SHARD_RAMP[s.kind];
  const label = s.kind === "heart" ? "HP" : "MP";
  const room = coop();
  const who = room ? `P${room.slot() + 1} ` : "";
  showBanner(`${who}${SHARD_NAME[s.kind]} +${SHARD_GAIN[s.kind]} max ${label}`, 1.6);
  game.fx.push(createFloorRing(hero.x, hero.y, 26, rp, 0.5));
  lights.add(hero.x, hero.y - 18, 50, rp[4], 0.9, 0.5);
  for (let i = 0; i < 14; i++)
    particles.spawn(PK.STAR, s.x, s.y, fxRng.range(-50, 50), -fxRng.range(20, 80), fxRng.range(0.4, 0.8), {
      col: fxRng.pick([rp[3], rp[4]]),
      size: fxRng.range(1, 2.5),
    });
  sfx.levelUp();
}

export function updateShards(dt: number): void {
  if (!game.shards.length) return;
  const room = coop();
  for (const s of game.shards) {
    room?.nearest(s.x, s.y);
    s.t += dt;
    const dx = hero.x - s.x;
    const dy = hero.y - 18 - s.y;
    const d = Math.hypot(dx, dy) || 1;
    if (s.t >= M.pull && hero.state !== "dead") home(s, dx, dy, d, dt, M);
    else fall(s, dt, M);
    if (s.t < M.settle || d > M.reach || hero.state === "dead") continue;
    s.done = true;
    gainShard(s);
  }
  game.shards = game.shards.filter((s) => !s.done);
}
