import { PAL } from "../constants/palette";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import { PK } from "../types/particle";
import { WHITE } from "../utils/color";
import { TAU } from "../utils/math";
import { dropCoins } from "./coins";
import { endWaveOnLastKill } from "./endWave";
import { enemyCenter } from "./enemies/enemy";
import { gainXp } from "./progress";
import { game, lights, particles, rng } from "./state";
import { shake } from "./world";

const ORBS = { minion: 2, mini: 10, boss: 18 } as const;

/** a dark burst of smoke and motes, orbs that fly back to Kael, experience, and the wave's end when it was the last foe */
export function killEnemy(e: Enemy): void {
  const [x, y] = enemyCenter(e);
  const S = PAL.shadow;
  const R = rng;
  const big = e.rank !== "minion";
  game.kills++;
  lights.add(x, y, big ? 110 : 56, S[4], 0.9, big ? 0.9 : 0.5);
  lights.add(x, y, 18, WHITE, 0.8, 0.1);
  for (let i = 0; i < (big ? 48 : 16); i++) {
    const a = R.range(0, TAU);
    const sp = R.range(40, big ? 260 : 160);
    particles.spawn(PK.MOTE, x, y, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.3, 0.7), {
      col: R.pick([S[3], S[4], S[5]]),
      size: 0.8,
    });
  }
  for (let i = 0; i < (big ? 18 : 7); i++)
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
  const orbs = e.type === "husk" ? 4 : ORBS[e.rank];
  for (let i = 0; i < orbs; i++)
    game.pickups.push({ x, y, vx: R.range(-70, 70), vy: R.range(-140, -60), t: 0, kind: "mp" });
  const hearts = big ? 2 : R.chance(e.type === "husk" ? 0.4 : 0.12) ? 1 : 0;
  for (let i = 0; i < hearts; i++) game.pickups.push({ x, y, vx: R.range(-50, 50), vy: -150, t: 0, kind: "hp" });
  dropCoins(e.type, x, y);
  if (big) shake(0.5, 4);
  sfx.death();
  gainXp(e.xp);
  endWaveOnLastKill();
}
