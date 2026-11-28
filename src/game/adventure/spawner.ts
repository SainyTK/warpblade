import {
  BELOW_RIFT_DISTANCE,
  COOP_ALIVE_CAP_SCALE,
  FIELD,
  FRONTS,
  type Front,
  SIDE_STYLE,
  SIDE_WARNING_SECONDS,
  SKY_RIFT_DISTANCE,
  SURGING_SIDE_SHARE,
} from "../../constants/defense";
import { ENEMIES } from "../../constants/enemies";
import { FOE_BAND } from "../../constants/stageArc";
import { sfx } from "../../services/audio";
import type { DefenseSide } from "../../types/defense";
import type { EnemyType } from "../../types/enemy";
import { aliveCap, foesPerSecond, frontAt, levelAtSecond, packSize } from "../../utils/defenseClock";
import { ladderChoices, pickLadderFoe } from "../../utils/ladder";
import { xpBudget } from "../../utils/stageArc";
import { coop } from "../coopHooks";
import { createRift } from "../effects/rift";
import { kindOf } from "../enemies/kinds";
import { game, showBanner } from "../state";
import { type Defense, defense } from "./defense";
import { claimFoe, stageFoe } from "./foes";

const PACK_STAGGER = 0.35;
const PACK_SPREAD = 10;
const SIDE_BANNER = 2;

function rungLevel(run: Defense, level: number, back: number): number {
  const rungs = [...new Set(run.stage.ladder.map((entry) => entry.level).filter((l) => l <= level))].sort(
    (a, b) => b - a,
  );
  return rungs[Math.min(back, rungs.length - 1)] ?? level;
}

export function ladderFoeFor(run: Defense, level: number, flies: boolean, back = 0): EnemyType {
  const at = rungLevel(run, level, back);
  const fitting = ladderChoices(run.stage.ladder, at, (foe) => kindOf(foe).flies === flies);
  const choices = fitting.length ? fitting : ladderChoices(run.stage.ladder, at);
  return pickLadderFoe(choices, run.random.next());
}

const sidesText = (sides: readonly DefenseSide[]): string => sides.map((side) => SIDE_STYLE[side].label).join(" and ");

function chooseSides(run: Defense, front: Front): DefenseSide[] {
  if (front.openAtOnce >= front.sides.length) return [...front.sides];
  const fresh = front.sides.filter((side) => !run.fronts.open.includes(side));
  const pool = run.random.shuffle([...fresh]);
  const rest = run.random.shuffle(front.sides.filter((side) => !fresh.includes(side)));
  return [...pool, ...rest].slice(0, front.openAtOnce);
}

function openFront(run: Defense, index: number): void {
  const front = FRONTS[index];
  const fronts = run.fronts;
  fronts.index = index;
  fronts.open = fronts.next ?? chooseSides(run, front);
  fronts.next = null;
  fronts.turnAt = front.turnEvery ? run.elapsed + front.turnEvery : Number.POSITIVE_INFINITY;
  fronts.surging = null;
  fronts.surgeAt = front.surgeEvery ? run.elapsed + front.surgeEvery : Number.POSITIVE_INFINITY;
  showBanner(`Foes from the ${sidesText(fronts.open)}`, SIDE_BANNER);
  sfx.surge();
}

function turnFronts(run: Defense, front: Front): void {
  const fronts = run.fronts;
  if (!fronts.next && run.elapsed >= fronts.turnAt - SIDE_WARNING_SECONDS) {
    fronts.next = chooseSides(run, front);
    showBanner(`Next from the ${sidesText(fronts.next)}`, SIDE_BANNER);
  }
  if (fronts.next && run.elapsed >= fronts.turnAt) {
    fronts.open = fronts.next;
    fronts.next = null;
    fronts.turnAt = run.elapsed + (front.turnEvery ?? Number.POSITIVE_INFINITY);
    sfx.surge();
  }
}

function surgeFronts(run: Defense, front: Front): void {
  const fronts = run.fronts;
  if (run.elapsed < fronts.surgeAt) return;
  fronts.surging = run.random.pick(front.sides);
  fronts.surgeAt = run.elapsed + (front.surgeEvery ?? Number.POSITIVE_INFINITY);
  showBanner(`${SIDE_STYLE[fronts.surging].label} surges`, SIDE_BANNER);
  sfx.surge();
}

function warnNextFront(run: Defense, coming: Front): void {
  const fronts = run.fronts;
  fronts.next = chooseSides(run, coming);
  showBanner(`Next from the ${sidesText(fronts.next)}`, SIDE_BANNER);
}

export function updateFronts(run: Defense): void {
  const front = frontAt(run.elapsed);
  const index = FRONTS.indexOf(front);
  if (index !== run.fronts.index) {
    openFront(run, index);
    return;
  }
  const coming = FRONTS[index + 1];
  if (coming && !run.fronts.next && run.elapsed >= coming.from - SIDE_WARNING_SECONDS) warnNextFront(run, coming);
  if (front.turnEvery) turnFronts(run, front);
  if (front.surgeEvery) surgeFronts(run, front);
}

function packSide(run: Defense): DefenseSide {
  const { open, surging } = run.fronts;
  if (surging && run.random.chance(SURGING_SIDE_SHARE)) return surging;
  return run.random.pick(open);
}

function spawnX(run: Defense, side: DefenseSide): number {
  const { width, center } = run.field;
  if (side === "west") return FIELD.spawnInset;
  if (side === "east") return width - FIELD.spawnInset;
  const reach = side === "sky" ? SKY_RIFT_DISTANCE : BELOW_RIFT_DISTANCE;
  const way = run.random.chance(0.5) ? -1 : 1;
  return center + way * run.random.range(reach.near, reach.far);
}

function eliteNext(run: Defense, side: DefenseSide): boolean {
  const every = SIDE_STYLE[side].eliteEvery;
  run.sideFoes[side]++;
  const sideElite = every > 0 && run.sideFoes[side] % every === 0;
  const total = run.sideFoes.west + run.sideFoes.east + run.sideFoes.sky + run.sideFoes.below;
  return sideElite || total % run.mods.eliteEvery === 0;
}

function sendPack(run: Defense, side: DefenseSide, soloSize: number, interval: number): void {
  const style = SIDE_STYLE[side];
  const level = levelAtSecond(run.elapsed);
  const solo = Array.from({ length: soloSize }, () => ladderFoeFor(run, level, style.flies, style.rungsBack));
  const foes = coop()?.scaleFoes(solo) ?? solo;
  const elites = foes.map(() => eliteNext(run, side));
  const until = run.elapsed + interval;
  const xp = xpBudget(
    levelAtSecond(run.xpPaidTo),
    levelAtSecond(until),
    foes.map((type, i) => ({ level, weight: ENEMIES[type].xp * (elites[i] ? FOE_BAND.eliteWeight : 1) })),
  );
  run.xpPaidTo = until;
  const x = spawnX(run, side);
  foes.forEach((type, i) => {
    const rift = kindOf(type).rift;
    const y = rift.y();
    const at = x + run.random.range(-PACK_SPREAD, PACK_SPREAD);
    run.foesSpawned++;
    game.fx.push(
      createRift(at, rift.riftY(y), rift.height, i * PACK_STAGGER, () => {
        claimFoe(stageFoe(type, at, y, level, xp[i], elites[i]));
      }),
    );
  });
}

const alive = (): number => game.enemies.filter((e) => e.hp > 0).length + game.fx.filter((f) => f.rift).length;

export function updateSpawns(run: Defense, dt: number): void {
  run.packIn -= dt;
  if (run.packIn > 0) return;
  const side = packSide(run);
  const size = Math.max(1, Math.round(packSize(run.elapsed) * SIDE_STYLE[side].packScale));
  const interval = size / (foesPerSecond(run.elapsed) * run.mods.crowd);
  run.packIn = interval;
  if (alive() >= aliveCap(run.elapsed) * (coop() ? COOP_ALIVE_CAP_SCALE : 1)) return;
  sendPack(run, side, size, interval);
}

export const openSides = (): readonly DefenseSide[] => defense?.fronts.open ?? [];
export const nextSides = (): readonly DefenseSide[] => defense?.fronts.next ?? [];
