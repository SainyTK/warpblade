import { KILL_BURST } from "../constants/kill";
import { PAL } from "../constants/palette";
import { STAGE_WAVES } from "../constants/waves";
import { sfx } from "../services/audio";
import type { SourceId } from "../types/build";
import type { Enemy } from "../types/enemy";
import { PK } from "../types/particle";
import { WHITE } from "../utils/color";
import { TAU } from "../utils/math";
import { dropChest } from "./build/chests";
import { dropCoins } from "./coins";
import { endWaveOnLastKill } from "./endWave";
import { enemyCenter } from "./enemies/enemy";
import { kindOf } from "./enemies/kinds";
import { feat } from "./feat";
import { game, lights, particles, rng } from "./state";
import { shake } from "./world";
import { dropXp } from "./xpOrbs";

/** MP orbs by rank; half the first numbers, so MP comes back mostly from sword hits */
const ORBS = { minion: 1, mini: 5, boss: 9 } as const;
/** heart drops: half the first numbers and chances */
const HEARTS = { big: 1, other: 0.06 } as const;

/** recent kills, each fading over time, and the game time they were last counted at */
let recent = 0;
let countedAt = 0;

/** count a kill and give the share of a full burst it gets: whole when few foes fell just now, less in a crowd */
function burstShare(): number {
  recent = recent * 0.5 ** ((game.t - countedAt) / KILL_BURST.halfLife) + 1;
  countedAt = game.t;
  return Math.max(KILL_BURST.least, Math.min(1, KILL_BURST.full / recent));
}

/** elites, mini bosses and the Warden of any wave but the last leave a chest */
const leavesChest = (e: Enemy): boolean =>
  e.elite || e.rank === "mini" || (e.rank === "boss" && game.wave < STAGE_WAVES);

/**
 * a dark burst of smoke and motes, orbs that fly back to Kael, experience orbs and coins to pick up, a chest from an
 * elite or a boss, and the wave's end when it was the last foe
 */
export function killEnemy(e: Enemy, source?: SourceId): void {
  const [x, y] = enemyCenter(e);
  const S = PAL.shadow;
  const R = rng;
  const big = e.rank !== "minion" || e.elite;
  // a crowd falling at once shares one burst's worth of light and particles
  const share = big ? 1 : burstShare();
  const many = (n: number): number => Math.max(1, Math.round(n * share));
  game.kills++;
  feat({ kind: "kill", rank: e.rank, source });
  lights.add(x, y, big ? 110 : 56 * Math.sqrt(share), S[4], 0.9, big ? 0.9 : 0.5);
  if (share === 1) lights.add(x, y, 18, WHITE, 0.8, 0.1);
  for (let i = 0; i < (big ? 48 : many(16)); i++) {
    const a = R.range(0, TAU);
    const sp = R.range(40, big ? 260 : 160);
    particles.spawn(PK.MOTE, x, y, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.3, 0.7), {
      col: R.pick([S[3], S[4], S[5]]),
      size: 0.8,
    });
  }
  for (let i = 0; i < (big ? 18 : many(7)); i++)
    particles.spawn(
      PK.SMOKE,
      x + R.range(-5, 5),
      y + R.range(-5, 5),
      R.range(-25, 25),
      R.range(-30, 0),
      R.range(0.8, 1.5),
      {
        col: S[2],
        size: R.range(3, big ? 8 : 5.5),
      },
    );
  for (let i = 0; i < many(4); i++)
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
  const kind = kindOf(e.type);
  const orbs = kind.orbs ?? ORBS[e.rank];
  for (let i = 0; i < orbs; i++)
    game.pickups.push({ x, y, vx: R.range(-70, 70), vy: R.range(-140, -60), t: 0, kind: "mp" });
  const hearts = big ? HEARTS.big : R.chance(kind.heartChance ?? HEARTS.other) ? 1 : 0;
  for (let i = 0; i < hearts; i++) game.pickups.push({ x, y, vx: R.range(-50, 50), vy: -150, t: 0, kind: "hp" });
  dropCoins(e, x, y);
  if (leavesChest(e)) dropChest(x, y);
  if (big) shake(0.5, 4);
  sfx.death();
  dropXp(e.xp, x, y);
  endWaveOnLastKill();
}
