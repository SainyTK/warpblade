import { PERFECT } from "../constants/combat";
import { BRAZIERS } from "../constants/stage";
import { scene, updateScenery } from "../scene/scenery";
import { PF, PK } from "../types/particle";
import { updateBlazes } from "./blazes";
import { updateChests } from "./build/chests";
import { updateFlow } from "./build/flow";
import { regenVigor } from "./build/vigor";
import { updateCoins } from "./coins";
import { coop, eachHero } from "./coopHooks";
import { updateEnemies } from "./enemies/updateEnemies";
import { celebrateEvolutions } from "./evolve";
import { updateHero } from "./hero/updateHero";
import { updateHitCount } from "./hitCount";
import { agePresses } from "./input";
import { updateDanger } from "./lowHealth";
import { updateNumbers } from "./numbers";
import { updatePickups } from "./pickups";
import { updateSkills } from "./skills/runtime";
import { game, hero, lights, particles, rng } from "./state";
import { updateWaves } from "./waves";
import { updateXpOrbs } from "./xpOrbs";

function feedBraziers(): void {
  const heat = scene().def.braziers;
  if (heat <= 0) return;
  for (const b of BRAZIERS) {
    if (rng.chance(0.6 * heat))
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
  updateScenery(dt);
  feedBraziers();
  particles.update(dt);
  lights.update(dt);
}

/** run every effect; effects spawned during the pass (a flask's floor ring, an ember from a brazier) join the list after it */
function updateEffects(dt: number): void {
  const running = game.fx;
  game.fx = [];
  const room = coop();
  const kept = running.filter((f) => {
    room?.owner(f);
    return f.update(dt);
  });
  game.fx = kept.concat(game.fx);
}

/** afterimages fade */
function ageGhosts(dt: number): void {
  for (const g of game.ghosts) g.life -= dt;
  game.ghosts = game.ghosts.filter((g) => g.life > 0);
}

/** one simulation step */
export function update(dt: number): void {
  // after a perfect dodge the world crawls while Kael moves at full speed
  const world = game.slow > 0 ? dt * PERFECT.timeScale : dt;
  game.slow = Math.max(0, game.slow - dt);
  game.t += world;
  eachHero(celebrateEvolutions);
  updateScenery(dt);
  eachHero(() => updateHero(dt));
  updateDanger(dt);
  eachHero(() => {
    updateFlow(dt);
    updateHitCount(dt);
    regenVigor(dt);
  });
  updateSkills(world);
  updateEnemies(world);
  updatePickups(dt);
  updateChests(dt);
  updateCoins(dt);
  updateXpOrbs(dt);
  coop()?.anyStanding();
  updateWaves(dt);
  updateEffects(world);
  eachHero(() => ageGhosts(dt));
  updateBlazes(world);
  updateNumbers(dt);
  feedBraziers();
  particles.update(world);
  lights.update(world);
  game.shake = Math.max(0, game.shake - dt);
  game.flash = Math.max(0, game.flash - dt);
  game.banner.time = Math.max(0, game.banner.time - dt);
  eachHero(() => agePresses(hero.state === "move"));
}
