import { DAMAGE_NUMBERS as N, NUMBER_WORDS, WORD_LIFT } from "../constants/damageNumbers";
import { GLYPH } from "../constants/font";
import { textWidth } from "../engine/font";
import type { Enemy } from "../types/enemy";
import type { DamageNumber, DamageTag } from "../types/game";
import { numberFigure } from "../utils/numberFigure";
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
 * small hits reads as one growing figure, and crits stay apart from plain hits. Quiet numbers are for a skill's own hits: smaller, slower and dimmer than the hero's own.
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
  const shape = { x, value, tag, big, quiet };
  game.numbers.push({
    x,
    y: freeY(shape, box[1] - 2),
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

type NumberShape = Pick<DamageNumber, "x" | "value" | "tag" | "big" | "quiet">;

/** the art pixels a number covers with its word, as left, top, right, bottom */
function numberRect(n: NumberShape, y: number): [number, number, number, number] {
  const scale = n.big ? 2 : 1;
  const word = n.value && !n.quiet ? NUMBER_WORDS[n.tag] : "";
  const w = Math.max(textWidth(n.value ? numberFigure(n.value) : NUMBER_WORDS[n.tag], scale), textWidth(word));
  const top = word ? y - WORD_LIFT : y;
  return [n.x - w / 2 - 1, top - 1, n.x + w / 2 + 1, y + GLYPH.h * scale + 1];
}

/** the lowest height from `y` up where a new number overlaps none of the fresh ones, so a crowd of hits stacks */
function freeY(n: NumberShape, y: number): number {
  const fresh = game.numbers.filter((o) => o.age < N.stackFresh).map((o) => numberRect(o, o.y));
  for (let i = 0; i < N.stackTries; i++, y -= N.stackStep) {
    const [l, t, r, b] = numberRect(n, y);
    if (!fresh.some(([ol, ot, or, ob]) => l < or && r > ol && t < ob && b > ot)) return y;
  }
  return y;
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
