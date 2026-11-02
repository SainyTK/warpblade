import { game } from "./state";

/** damage numbers drift up, slow down and expire */
export function updateNumbers(dt: number): void {
  for (const n of game.numbers) {
    n.life -= dt;
    n.age += dt;
    n.y += n.vy * dt;
    n.vy = Math.min(0, n.vy + 110 * dt);
  }
  game.numbers = game.numbers.filter((n) => n.life > 0);
}
