import { EVOLVE_CELEBRATION as C } from "../constants/evolutions";
import { COIN_GOLD } from "../constants/palette";
import { sfx } from "../services/audio";
import { PK } from "../types/particle";
import { createFloorRing } from "./effects/floorRing";
import { objectMemory, rememberPerSeat } from "./seatMemory";
import { fxRng, game, hero, lights, particles, showBanner } from "./state";

/** names of evolutions gained in a pick or a chest still open, celebrated once play resumes */
const pending: { waiting: string[] } = { waiting: [] };
rememberPerSeat(objectMemory(pending));

export function queueEvolution(name: string): void {
  pending.waiting = [...pending.waiting, name];
}

export function forgetEvolutions(): void {
  pending.waiting = [];
}

/** the hero flashes gold: a floor ring, a light, rising stars and the evolution's name */
function celebrate(name: string): void {
  game.fx.push(createFloorRing(hero.x, hero.y, C.ring, COIN_GOLD, C.ringLife));
  lights.add(hero.x, hero.y - 18, C.light, COIN_GOLD[3], C.lightK, C.lightLife);
  for (let i = 0; i < C.stars; i++)
    particles.spawn(
      PK.STAR,
      hero.x + fxRng.range(-10, 10),
      hero.y - fxRng.range(0, 30),
      0,
      -fxRng.range(20, 60),
      fxRng.range(0.5, 1),
      {
        col: fxRng.pick([COIN_GOLD[3], COIN_GOLD[4]]),
        size: fxRng.range(1, 2.5),
      },
    );
  showBanner(name, C.banner);
  sfx.levelUp();
}

/** called each step of play: celebrate what the last pick or chest evolved */
export function celebrateEvolutions(): void {
  if (!pending.waiting.length) return;
  for (const name of pending.waiting) celebrate(name);
  pending.waiting = [];
}
