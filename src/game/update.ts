import { PERFECT } from "../constants/combat";
import { BRAZIERS } from "../constants/stage";
import { PF, PK } from "../types/particle";
import { updateBlazes } from "./blazes";
import { updateCoins } from "./coins";
import { updateEnemies } from "./enemies/updateEnemies";
import { updateHero } from "./hero/updateHero";
import { agePresses } from "./input";
import { updateNumbers } from "./numbers";
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

/** the scene alone, with no one in it moving: braziers burn and the light flickers behind the start menu */
export function updateAmbience(dt: number): void {
  game.t += dt;
  feedBraziers();
  particles.update(dt);
  lights.update(dt);
}

/** one simulation step */
export function update(dt: number): void {
  // after a perfect dodge the world crawls while Kael moves at full speed
  const world = game.slow > 0 ? dt * PERFECT.timeScale : dt;
  game.slow = Math.max(0, game.slow - dt);
  game.t += world;
  updateHero(dt);
  updateEnemies(world);
  updatePickups(dt);
  updateCoins(dt);
  updateWaves(dt);
  game.fx = game.fx.filter((f) => f.update(world));
  for (const g of game.ghosts) g.life -= dt;
  game.ghosts = game.ghosts.filter((g) => g.life > 0);
  updateBlazes(world);
  updateNumbers(dt);
  feedBraziers();
  particles.update(world);
  lights.update(world);
  game.shake = Math.max(0, game.shake - dt);
  game.flash = Math.max(0, game.flash - dt);
  game.banner.time = Math.max(0, game.banner.time - dt);
  agePresses();
}
