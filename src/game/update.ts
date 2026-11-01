import { BRAZIERS } from "../constants/stage";
import { PF, PK } from "../types/particle";
import { updateBlazes, updateEnemies } from "./enemies/updateEnemies";
import { updateHero } from "./hero/updateHero";
import { updatePickups } from "./pickups";
import { game, lights, particles, rng } from "./state";
import { updateWaves } from "./waves";

function feedBraziers(): void {
  for (const b of BRAZIERS) {
    if (rng.chance(0.6))
      particles.spawn(
        PK.FIRE,
        b.x + rng.range(-2, 2),
        b.y - 7,
        rng.range(-4, 4),
        -rng.range(8, 20),
        rng.range(0.2, 0.45),
        {
          col: 0,
          size: rng.range(1, 1.9),
          flag: rng.chance(0.12) ? PF.SMOKES : 0,
        },
      );
    if (rng.chance(0.03))
      particles.spawn(PK.EMBER, b.x, b.y - 10, rng.range(-10, 10), -rng.range(20, 40), rng.range(0.8, 1.6));
  }
}

/** one simulation step */
export function update(dt: number): void {
  game.t += dt;
  updateHero(dt);
  updateEnemies(dt);
  updatePickups(dt);
  updateWaves(dt);
  game.fx = game.fx.filter((f) => f.update(dt));
  for (const g of game.ghosts) g.life -= dt;
  game.ghosts = game.ghosts.filter((g) => g.life > 0);
  updateBlazes(dt);
  feedBraziers();
  particles.update(dt);
  lights.update(dt);
  game.shake = Math.max(0, game.shake - dt);
  game.flash = Math.max(0, game.flash - dt);
  game.banner.time = Math.max(0, game.banner.time - dt);
}
