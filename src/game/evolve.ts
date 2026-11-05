import { EVOLVE_CELEBRATION as C } from "../constants/evolutions";
import { COIN_GOLD } from "../constants/palette";
import { sfx } from "../services/audio";
import { PK } from "../types/particle";
import type { SkillNode } from "../types/skill";
import { createFloorRing } from "./effects/floorRing";
import { game, hero, lights, particles, rng, showBanner } from "./state";

/** evolutions learned in the pick still open, celebrated once play resumes */
let waiting: SkillNode[] = [];

export function queueEvolution(node: SkillNode): void {
  waiting.push(node);
}

export function forgetEvolutions(): void {
  waiting = [];
}

/** the hero flashes gold: a floor ring, a light, rising stars and the evolution's name */
function celebrate(node: SkillNode): void {
  game.fx.push(createFloorRing(hero.x, hero.y, C.ring, COIN_GOLD, C.ringLife));
  lights.add(hero.x, hero.y - 18, C.light, COIN_GOLD[3], C.lightK, C.lightLife);
  for (let i = 0; i < C.stars; i++)
    particles.spawn(
      PK.STAR,
      hero.x + rng.range(-10, 10),
      hero.y - rng.range(0, 30),
      0,
      -rng.range(20, 60),
      rng.range(0.5, 1),
      {
        col: rng.pick([COIN_GOLD[3], COIN_GOLD[4]]),
        size: rng.range(1, 2.5),
      },
    );
  showBanner(node.name, C.banner);
  sfx.levelUp();
}

/** called each step of play: celebrate what the last pick evolved */
export function celebrateEvolutions(): void {
  if (!waiting.length) return;
  for (const node of waiting) celebrate(node);
  waiting = [];
}
