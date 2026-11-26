import { KEEN } from "../../../constants/combo";
import { dealDamage } from "../../../game/damage";
import { createSlash } from "../../../game/effects/slash";
import { enemyCenter } from "../../../game/enemies/enemy";
import { movePayoff } from "../../../game/skills/payoff";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { game, hero, lights, progress } from "../../../game/state";
import { hitStop, shake } from "../../../game/world";
import type { MoveHit } from "../../../types/move";
import { WHITE } from "../../../utils/color";
import { SAND_RAMP } from "../constants/palette";
import { WHIRL } from "../constants/whirl";
import type { ZafirMoveId } from "../types/moves";
import { createSandWave } from "./effects/sandWave";
import { RING_CUT } from "./moves/slashes";
import { sandSound } from "./sound";
import { zafir } from "./state";
import { gainWhirl } from "./whirl";
import { openWounds } from "./wounds";

/** the spins of the ground string */
export const STRING_SPINS: ReadonlySet<string> = new Set<ZafirMoveId>([
  "sweepTurn",
  "risingTurn",
  "twinTurn",
  "duneCyclone",
]);

/** how far a sand crescent and a gust fly, how far the cyclone's pull reaches and how hard it draws */
const CRESCENT_RANGE = 80;
const GUST_RANGE = 110;
const PULL = { reach: 60, speed: 140 } as const;

/** Whirling Edge: a spin reaches farther, its slash with it */
export function shapeSpin(id: string, hit: MoveHit): MoveHit {
  const reach = skillValues("za_whirling").reach;
  if (!reach || !STRING_SPINS.has(id)) return hit;
  const [x0, y0, x1, y1] = hit.box;
  return { ...hit, box: [x0, y0, x1 * reach, y1], slash: hit.slash && { ...hit.slash, R: hit.slash.R * reach } };
}

/** Whirling Edge from level 6: the cyclone draws foes round him in before it throws them up */
export function cyclonePull(): void {
  if (!skillValues("za_whirling").pull) return;
  for (const e of foesOnScreen()) if (Math.abs(e.x - hero.x) < PULL.reach) e.vx += Math.sign(hero.x - e.x) * PULL.speed;
}

/** Whirling Edge: a spin's last blow throws a sand crescent out each side, two each at full Whirl once evolved */
function throwCrescents(): void {
  const v = skillValues("za_whirling");
  if (!v.crescent) return;
  const pairs = skillEvolved("za_whirling") && zafir.whirl >= WHIRL.most * 0.8 ? 2 : 1;
  for (let i = 0; i < pairs; i++)
    for (const dir of [1, -1])
      game.fx.push(
        createSandWave({
          x: hero.x + dir * 8,
          y: hero.y - 14 - i * 8,
          dir,
          damage: progress.stats.ad * v.crescent,
          range: withBuild("area", CRESCENT_RANGE),
          pierce: !!v.pierce,
          wounds: 0,
        }),
      );
}

/** Sirocco Timing: a Keen spin sends a hot gust after the foe it paid off on, and evolved, a noon ring every few */
function keenSpin(): void {
  const v = skillValues("za_sirocco");
  if (v.whirl) gainWhirl(v.whirl);
  if (v.wave)
    game.fx.push(
      createSandWave({
        x: hero.x + hero.face * 10,
        y: hero.y - 18,
        dir: hero.face,
        damage: progress.stats.ad * v.wave,
        range: GUST_RANGE,
        pierce: true,
        wounds: 1,
        payoff: movePayoff(),
      }),
    );
  if (skillEvolved("za_sirocco") && zafir.keenStreak % v.noonEvery === 0) noonRing();
}

/** Desert Noon: a blazing ring on the foe the Keen spin paid off on */
function noonRing(): void {
  const foe = [...movePayoff()].find((e) => e.hp > 0);
  if (!foe) return;
  const [x, y] = enemyCenter(foe);
  game.fx.push(createSlash(x, y + 18, 1, { ...RING_CUT, R: 20, W: 10, ramp: SAND_RAMP }));
  lights.add(x, y, 60, SAND_RAMP[5], 1, 0.35);
  lights.add(x, y, 16, WHITE, 0.9, 0.12);
  dealDamage(foe, progress.stats.ad * skillValues("za_sirocco").noon, {
    fromX: hero.x,
    ky: -60,
    heavy: true,
    melee: true,
  });
  hitStop(0.12);
  shake(0.3, 3);
  sandSound.gust(0.16);
}

/** Two-Faced Cut: a blow that cut both sides at once */
function bothSides(): void {
  const v = skillValues("za_twofaced");
  if (v.both) gainWhirl(v.both);
  if (v.keenBoth) hero.keenNext = true;
  if (!v.bothWounds) return;
  for (const e of foesOnScreen()) if (Math.abs(e.x - hero.x) < 34) openWounds(e, 1);
}

/** Sirocco Timing's Keen window, or the shared one */
export const keenWindow = (): number => skillValues("za_sirocco").window ?? KEEN.window;

/**
 * A blow of a move is out: a spin that cut both sides pays Two-Faced Cut; after a move's last blow, Whirling Edge throws
 * its crescents and a Keen spin pays Sirocco Timing.
 */
export function afterBlow(id: string, last: boolean, hits: number): void {
  if (zafir.sides === 3) bothSides();
  zafir.sides = 0;
  if (!last) return;
  const keen = hero.keen && hits > 0;
  zafir.keenStreak = keen ? zafir.keenStreak + 1 : 0;
  if (!STRING_SPINS.has(id)) return;
  throwCrescents();
  if (keen) keenSpin();
}
