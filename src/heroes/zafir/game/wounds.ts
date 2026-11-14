import { fleck, hairline, place } from "../../../engine/frame";
import { enemyCenter } from "../../../game/enemies/enemy";
import { addStacks, stacksOf } from "../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { game, particles, progress, rng } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WOUND_RED } from "../constants/palette";
import { WOUND, WOUND_SOURCE } from "../constants/wounds";

/** the most wounds a foe carries: the base, or Deep Wounds' */
export const woundMost = (): number => skillValues("za_deep").most ?? WOUND.most;

/** open `n` wounds on a foe; each bleeds on its own, Deep Wounds bleeds them harder and longer */
export function openWounds(e: Enemy, n: number): void {
  if (n <= 0 || e.hp <= 0) return;
  const deep = skillValues("za_deep");
  addStacks(e, WOUND_SOURCE, {
    stacks: n,
    max: woundMost(),
    damage: progress.stats.ad * (deep.per ?? WOUND.per),
    every: deep.every ?? WOUND.every,
    duration: withCharms("duration", deep.life ?? WOUND.life),
  });
}

/** how many wounds a foe has open */
export const woundsOf = (e: Enemy): number => stacksOf(e, WOUND_SOURCE);

/** a bleeding foe sheds a drop now and then, more the more wounds it has; drops are play, so they step with the game */
export function shedDrops(): void {
  for (const e of foesOnScreen()) {
    const n = woundsOf(e);
    if (!n || !rng.chance(0.04 * n)) continue;
    const [x, y] = enemyCenter(e);
    particles.spawn(PK.SHARD, x + rng.range(-4, 4), y + rng.range(-3, 3), rng.range(-15, 15), rng.range(-30, 0), 0.45, {
      col: rng.pick(WOUND_RED.slice(1)),
      size: rng.range(0.8, 1.4),
    });
  }
}

/** the open wounds on each foe: short red cuts across its body, one per wound, each with a bright fresh edge */
export function drawWounds(): void {
  place();
  for (const e of game.enemies) {
    const n = Math.min(woundMost(), woundsOf(e));
    if (!n || e.hp <= 0) continue;
    const [x, y] = enemyCenter(e);
    for (let i = 0; i < n; i++) {
      const ox = x - 4 + ((i * 5 + Math.floor(e.seed * 7)) % 9);
      const oy = y - 4 + ((i * 3) % 7);
      hairline(ox - 1.5, oy - 1, ox + 1.5, oy + 1, WOUND_RED[2]);
      hairline(ox - 1, oy - 1, ox + 1.5, oy + 0.5, WOUND_RED[1]);
      fleck(ox - 1, oy - 1, WOUND_RED[0]);
    }
  }
}
