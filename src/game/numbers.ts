import { DAMAGE_NUMBERS as N } from "../constants/damageNumbers";
import type { Enemy } from "../types/enemy";
import type { DamageNumber, DamageTag } from "../types/game";
import { enemyBox } from "./enemies/enemy";
import { game, rng } from "./state";

/** a number over the same foe, of the same kind, size and loudness, that popped within the merge window: crits only join crits */
const mergeable = (n: DamageNumber, e: Enemy, tag: DamageTag, big: boolean, quiet: boolean): boolean =>
  n.foe === e && n.tag === tag && n.big === big && n.quiet === quiet && n.age < N.merge;

/** past the cap, the oldest quiet number gives way, else the oldest plain one, else the oldest; words always stay */
function makeRoom(): void {
  const shown = game.numbers.filter((n) => n.value);
  if (shown.length < N.cap) return;
  const drop = shown.find((n) => n.quiet) ?? shown.find((n) => !n.big) ?? shown[0];
  game.numbers.splice(game.numbers.indexOf(drop), 1);
}

/**
 * A hit's number over the foe. Hits of one kind on the same foe within a moment add into one number, so a stream of
 * small hits reads as one growing figure, and crits stay apart from plain hits. Quiet numbers are for relics: smaller, slower and dimmer than the hero's own.
 */
export function popNumber(e: Enemy, value: number, tag: DamageTag, big: boolean, quiet: boolean): void {
  const into = game.numbers.find((n) => mergeable(n, e, tag, big, quiet));
  if (into) {
    into.value += value;
    into.life = big ? N.bigLife : N.life;
    return;
  }
  makeRoom();
  const box = enemyBox(e);
  const x = (box[0] + box[2]) / 2 + rng.range(-4, 4);
  const crowd = game.numbers.filter((n) => Math.abs(n.x - x) < N.stackNear && n.age < N.stackFresh).length;
  game.numbers.push({
    x,
    y: box[1] - 2 - crowd * N.stackStep,
    age: 0,
    vy: big ? N.bigRise : quiet ? N.quietRise : N.rise,
    value,
    tag,
    big,
    quiet,
    foe: e,
    life: big ? N.bigLife : N.life,
  });
}

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
