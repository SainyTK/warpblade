import { SURGE } from "../../constants/campaign";
import type { EnemyType } from "../../types/enemy";
import { levelBetween, xpBudget } from "../../utils/stageArc";
import { coop } from "../coopHooks";
import { createRift } from "../effects/rift";
import { kindOf } from "../enemies/kinds";
import { game, hero, showBanner } from "../state";
import { claimFoe, stageFoe } from "./foes";
import { foeWeight, ladderFoe, type RouteArea, type SurgeBeat } from "./route";
import { drawStragglersDown } from "./stragglers";
import { type Surge, type SurgeWave, trail } from "./trail";

const WAVE_BANNER = 1.1;

const isElite = (index: number): boolean => index > 0 && index % (trail?.mods.eliteEvery ?? SURGE.eliteEvery) === 0;

function waveFoes(size: number, from: number, to: number): { foes: EnemyType[]; levels: number[] } {
  const run = trail;
  const levels = Array.from({ length: size }, (_, i) => levelBetween(from, to, i / Math.max(1, size - 1)));
  const solo = levels.map((level) => (run ? ladderFoe(run.route.stage, level, run.random) : "thornback"));
  const foes = coop()?.scaleFoes(solo) ?? solo;
  return { foes, levels: foes.map((_, i) => levels[Math.min(i, levels.length - 1)]) };
}

export function openSurge(beat: SurgeBeat): Surge {
  const span = beat.to - beat.from;
  const total = beat.waves.reduce((n, size) => n + size, 0);
  let done = 0;
  const drafts = beat.waves.map((size) => {
    const from = beat.from + (span * done) / total;
    done += size;
    return waveFoes(size, from, beat.from + (span * done) / total);
  });
  let index = 0;
  const elites = drafts.map((draft) => draft.foes.map(() => isElite(index++)));
  const xp = xpBudget(
    beat.from,
    beat.to,
    drafts.flatMap((draft, w) =>
      draft.foes.map((type, i) => ({ level: draft.levels[i], weight: foeWeight(type, elites[w][i]) })),
    ),
  );
  let next = 0;
  const waves: SurgeWave[] = drafts.map((draft, w) => ({
    ...draft,
    xp: draft.foes.map(() => xp[next++]),
    elites: elites[w],
  }));
  const surge: Surge = { beat, waves, wave: 0, sent: 0, delays: [], pause: 0 };
  queueWave(surge);
  return surge;
}

function queueWave(surge: Surge): void {
  surge.sent = 0;
  surge.delays = surge.waves[surge.wave].foes.map((_, i) => i * SURGE.opening);
}

function spawnX(area: RouteArea): number {
  const random = trail?.random;
  const left = area.entrance + SURGE.spawnMargin;
  const right = area.exit - SURGE.spawnMargin;
  for (let tries = 0; tries < 8; tries++) {
    const x = random ? random.range(left, right) : (left + right) / 2;
    if (Math.abs(x - hero.x) >= SURGE.heroGap) return x;
  }
  return hero.x < (left + right) / 2 ? right : left;
}

function sendFoe(wave: SurgeWave, index: number, area: RouteArea): void {
  const type = wave.foes[index];
  const rift = kindOf(type).rift;
  const x = spawnX(area);
  const y = rift.y();
  if (trail) trail.band = wave.levels[index];
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      claimFoe(stageFoe(type, x, y, wave.levels[index], wave.xp[index], wave.elites[index]));
    }),
  );
}

const standing = (): number => game.enemies.filter((e) => e.hp > 0).length + game.fx.filter((f) => f.rift).length;

export function updateSurge(surge: Surge, area: RouteArea, dt: number): boolean {
  if (surge.pause > 0) {
    surge.pause = Math.max(0, surge.pause - dt);
    return false;
  }
  const wave = surge.waves[surge.wave];
  surge.delays = surge.delays.map((t) => t - dt);
  while (surge.sent < wave.foes.length && surge.delays[surge.sent] <= 0) sendFoe(wave, surge.sent++, area);
  if (surge.sent < wave.foes.length) return false;
  drawStragglersDown(game.enemies, dt);
  if (standing() > 0) return false;
  if (surge.wave + 1 >= surge.waves.length) return true;
  surge.wave++;
  surge.pause = SURGE.wavePause;
  queueWave(surge);
  showBanner(`Wave ${surge.wave + 1}/${surge.waves.length}`, WAVE_BANNER);
  return false;
}

export function surgeEnding(): boolean {
  const surge = trail?.surge;
  if (!surge || surge.wave + 1 < surge.waves.length || surge.sent < surge.waves[surge.wave].foes.length) return false;
  return game.enemies.every((e) => e.hp <= 0) && !game.fx.some((f) => f.rift);
}
