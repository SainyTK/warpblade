import { W } from "../../../constants/stage";
import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { createSlash } from "../../../game/effects/slash";
import { enemyCenter } from "../../../game/enemies/enemy";
import { settle } from "../../../game/hero/actions";
import { leaveAfterimages } from "../../../game/hero/afterimages";
import { travelEnded } from "../../../game/hero/travelEnd";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { game, hero, ponytail, progress, scarf } from "../../../game/state";
import { surfaceBelow } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { STITCH } from "../constants/abilities";
import { DUSK_SPARKS } from "../look/colors";
import { ARRIVE_A, ARRIVE_B } from "./moves/slashes";
import { stitchSigil } from "./skills/duskSigil";
import { vesperSound } from "./sound";
import { vesper } from "./state";

/** the stitch under way: the foes still to cut, where she started, and the time into the current leg. Holds foes, so only
 *  the host keeps it */
const run: { foes: Enemy[]; from: [number, number]; leg: number; damage: number; back: boolean } = {
  foes: [],
  from: [0, 0],
  leg: 0,
  damage: 0,
  back: false,
};
rememberPerSeat(objectMemory(run, true));

/** the foes in reach, nearest first, at most `most` */
export function stitchTargets(reach: number, most: number): Enemy[] {
  return game.enemies
    .filter(
      (e) => e.hp > 0 && Math.abs(e.x - hero.x) <= reach && Math.abs(enemyCenter(e)[1] - (hero.y - 16)) <= reach * 0.6,
    )
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, most);
}

/** she appears at a point, her afterimages and ropes following */
function stepTo(x: number, y: number): void {
  const nx = clamp(x, 8, W - 8);
  leaveAfterimages(hero.x, hero.y, nx, y);
  scarf.shift(nx - hero.x, y - hero.y);
  ponytail.shift(nx - hero.x, y - hero.y);
  hero.x = nx;
  hero.y = y;
  hero.vx = 0;
  hero.vy = 0;
}

/** start the stitch on these foes; false when there are none */
export function startStitch(foes: Enemy[], power: number): boolean {
  if (!foes.length) return false;
  run.foes = foes;
  run.from = [hero.x, hero.y];
  run.leg = 0;
  run.back = false;
  run.damage = progress.stats.ap * STITCH.power * power;
  return true;
}

/** one cut on arriving at a foe: a cross of both blades, ability damage, and her skills' share */
function cut(e: Enemy): void {
  const [x, y] = enemyCenter(e);
  const side = Math.sign(x - run.from[0]) || hero.face;
  stepTo(x - side * 10, Math.min(run.from[1], e.y));
  hero.face = side;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, ARRIVE_A));
  game.fx.push(createSlash(hero.x, hero.y, hero.face, ARRIVE_B));
  game.fx.push(createImpact(x, y, side, false, DUSK_SPARKS));
  dealDamage(e, run.damage, { fromX: hero.x, kx: side * 30, ky: -40, heavy: true, source: "abilities" });
  stitchSigil(e);
  vesperSound.dart();
}

/** the stitch runs: a leg to each foe in turn, then back to where she started, untouchable all the way */
export function runStitch(dt: number): void {
  hero.inv = Math.max(hero.inv, 0.1);
  vesper.fade = Math.max(vesper.fade, 0.05);
  run.leg += dt;
  if (!run.back) {
    if (run.leg < STITCH.leg) return;
    run.leg = 0;
    const next = run.foes.shift();
    if (next && next.hp > 0) cut(next);
    if (!run.foes.length) run.back = true;
    return;
  }
  if (run.leg < STITCH.back) return;
  stepTo(run.from[0], run.from[1]);
  hero.ground = Math.abs(hero.y - surfaceBelow(hero.x, hero.y - 1)) < 0.5;
  travelEnded();
  settle();
}
