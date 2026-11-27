import { fleck, hairline, place } from "../../../engine/frame";
import { enemyCenter } from "../../../game/enemies/enemy";
import { addStacks, stacksOf } from "../../../game/enemies/skillStatus";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { fxRng, game, particles, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WOUND_RED } from "../constants/palette";
import { WOUND, WOUND_SOURCE } from "../constants/wounds";
import { zafirFx } from "./skillFx";

/** the most wounds a foe carries: the base, or Deep Wounds' */
export const woundMost = (): number => skillValues("za_deep").most ?? WOUND.most;

const DEEP_GAP = 0.6;
const deepShown = new WeakMap<Enemy, number>();

/** Deep Wounds: a foe's wounds opening deeper shows as a bleeding mark on it, at most once in a while per foe */
function deepMark(e: Enemy, deep: Readonly<Record<string, number>>): void {
  if (!skillLevel("za_deep") || (deepShown.get(e) ?? -1) > game.t) return;
  deepShown.set(e, game.t + DEEP_GAP);
  const [x, y] = enemyCenter(e);
  const ticks = (deep.life ?? WOUND.life) / (deep.every ?? WOUND.every);
  const damage = progress.stats.ad * (deep.per ?? WOUND.per) * ticks * woundsOf(e);
  const shape = skillEvolved("za_deep") ? "burst" : "mark";
  zafirFx("za_deep", shape, { x, y, reach: 8 + woundsOf(e) }, { mark: "bleed", damage });
}

/** open `n` wounds on a foe; each bleeds on its own, Deep Wounds bleeds them harder and longer */
export function openWounds(e: Enemy, n: number): void {
  if (n <= 0 || e.hp <= 0) return;
  const deep = skillValues("za_deep");
  addStacks(e, WOUND_SOURCE, {
    stacks: n,
    max: woundMost(),
    damage: progress.stats.ad * (deep.per ?? WOUND.per),
    every: deep.every ?? WOUND.every,
    duration: withBuild("duration", deep.life ?? WOUND.life),
  });
  deepMark(e, deep);
}

/** how many wounds a foe has open */
export const woundsOf = (e: Enemy): number => stacksOf(e, WOUND_SOURCE);

/** a bleeding foe sheds a drop now and then, more the more wounds it has; drops spawn in the game step, never in a draw */
export function shedDrops(): void {
  for (const e of foesOnScreen()) {
    const n = woundsOf(e);
    if (!n || !fxRng.chance(0.04 * n)) continue;
    const [x, y] = enemyCenter(e);
    particles.spawn(
      PK.SHARD,
      x + fxRng.range(-4, 4),
      y + fxRng.range(-3, 3),
      fxRng.range(-15, 15),
      fxRng.range(-30, 0),
      0.45,
      {
        col: fxRng.pick(WOUND_RED.slice(1)),
        size: fxRng.range(0.8, 1.4),
      },
    );
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
