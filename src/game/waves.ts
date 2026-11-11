import { ENEMIES } from "../constants/enemies";
import { W } from "../constants/stage";
import { ELITE, FINALE, OPENING_STAGGER, REFILL_DELAY, SPAWN, STAGE_WAVES } from "../constants/waves";
import { sfx } from "../services/audio";
import { saveBest } from "../services/bestScore";
import type { EnemyType } from "../types/enemy";
import type { Point } from "../types/world";
import { eraOf } from "../utils/eras";
import { pickSpawn } from "../utils/spawnPoint";
import { aliveCap, streamLeft, wavePlan } from "../utils/waves";
import { coop, eachStanding } from "./coopHooks";
import { createRift } from "./effects/rift";
import { endWave, fightOver, settleWave } from "./endWave";
import { makeEnemy } from "./enemies/enemy";
import { kindOf } from "./enemies/kinds";
import { feat } from "./feat";
import { endRun } from "./runEnd";
import { game, hero, rng, showBanner } from "./state";
import { shake } from "./world";

/** rifts opened and not yet let through their foe, so the next one keeps away from them too */
let opening: Point[] = [];

/** a place for a rift away from every standing hero and spread from the foes and rifts already there */
function spawnPoint(type: EnemyType): Point {
  const r = kindOf(type).rift;
  const flies = kindOf(type).flies;
  const heroes: number[] = [];
  eachStanding(() => heroes.push(hero.x));
  const taken = [
    ...game.enemies.filter((e) => e.hp > 0 && kindOf(e.type).flies === flies).map((e) => ({ x: e.x, y: e.y })),
    ...opening,
  ];
  const candidates = Array.from({ length: SPAWN.tries }, () => ({
    x: rng.range(SPAWN.margin, W - SPAWN.margin),
    y: r.y(),
  }));
  return pickSpawn(candidates, heroes, taken, SPAWN.heroGap);
}

/** open a rift that lets one foe through after `delay`; an elite comes tougher, worth more, and glinting gold */
function openRift(type: EnemyType, delay: number, elite = false): void {
  const r = kindOf(type).rift;
  // a boss comes through on the far side of the stage from the hero
  const at = ENEMIES[type].rank === "boss" ? { x: hero.x < W / 2 ? W - 70 : 70, y: r.y() } : spawnPoint(type);
  opening.push(at);
  const room = coop();
  game.fx.push(
    createRift(at.x, r.riftY(at.y), r.height, delay, () => {
      opening = opening.filter((p) => p !== at);
      const e = makeEnemy(type, at.x, at.y, game.wave);
      if (elite) Object.assign(e, { elite, max: e.max * ELITE.hp, xp: Math.round(e.xp * ELITE.xp) });
      e.hp = e.max = room ? room.scaleFoeHp(e.rank, e.max) : e.max;
      game.enemies.push(e);
    }),
  );
}

/** the next foe of the stream comes through a rift */
function sendNext(delay: number): void {
  const s = game.stream;
  openRift(s.foes[s.sent], delay, s.sent === s.elite);
  s.sent++;
}

/** places freed by fallen foes fill again, each a moment after it frees, until the stream has all come through */
function updateStream(dt: number): void {
  const s = game.stream;
  const standing = game.enemies.filter((e) => e.hp > 0).length + game.fx.filter((f) => f.rift).length;
  const free = Math.min(s.cap - standing - s.refills.length, streamLeft(s) - s.refills.length);
  for (let i = 0; i < free; i++) s.refills.push(REFILL_DELAY);
  for (let i = 0; i < s.refills.length; i++) s.refills[i] -= dt;
  const due = s.refills.filter((t) => t <= 0).length;
  s.refills = s.refills.filter((t) => t > 0);
  for (let i = 0; i < due; i++) sendNext(0);
}

function startWave(): void {
  game.wave++;
  game.lull = "fight";
  feat({ kind: "waveReached", wave: game.wave });
  if (game.wave > game.best) {
    game.best = game.wave;
    saveBest(game.best);
  }
  const plan = wavePlan(game.wave);
  const room = coop();
  const foes = room ? room.scaleFoes(plan.stream) : plan.stream;
  const share = plan.stream.length ? foes.length / plan.stream.length : 1;
  game.stream = { foes, sent: 0, elite: plan.elite, cap: aliveCap(game.wave, share), refills: [] };
  opening = [];
  const era = eraOf(game.wave);
  // a new era announces itself, unless a boss wave has its own name to show
  const title = plan.leader
    ? `Wave ${game.wave}: ${ENEMIES[plan.leader].name}`
    : era.first === game.wave && game.wave > 1
      ? `Wave ${game.wave}: ${era.name}`
      : `Wave ${game.wave}`;
  showBanner(title, title === `Wave ${game.wave}` ? 1.4 : 2.2);
  // the leader comes first, then as many of the stream as there are places, a beat apart
  if (plan.leader) openRift(plan.leader, 0);
  const first = Math.min(game.stream.cap - (plan.leader ? 1 : 0), foes.length);
  for (let i = 0; i < first; i++) sendNext((i + (plan.leader ? 1 : 0)) * OPENING_STAGGER);
}

/** what came after the last boss has fallen too: the banner shows, then the run ends */
function clearStage(): void {
  game.mode = "clear";
  game.waveTimer = FINALE.clear;
  showBanner(`${ENEMIES[FINALE.foe].name} sleeps`, FINALE.clear);
  sfx.levelUp();
}

/**
 * The last wave is fought out. Its boss's fall looks like the stage's end for a moment; then one more foe comes
 * through, and the stage is cleared only when that one falls too.
 */
function updateFinale(dt: number): void {
  if (game.finale === "none") {
    game.finale = "quiet";
    game.waveTimer = FINALE.quiet;
    showBanner(`Stage ${game.stage} clear`, FINALE.quiet);
    sfx.levelUp();
    return;
  }
  if (game.finale === "beyond") {
    clearStage();
    return;
  }
  game.waveTimer -= dt;
  if (game.waveTimer > 0) return;
  game.finale = "beyond";
  showBanner(ENEMIES[FINALE.foe].name, 2.6);
  shake(0.6, 3);
  sfx.boom();
  openRift(FINALE.foe, 0.4);
}

/** fight a wave as it streams in; once it is clear, wait (the picks open a beat in), then open rifts for the next wave */
export function updateWaves(dt: number): void {
  if (hero.state === "dead") return;
  if (game.mode === "clear") {
    game.waveTimer -= dt;
    if (game.waveTimer <= 0) endRun("beyond");
    return;
  }
  if (game.lull === "fight") updateStream(dt);
  if (!fightOver()) return;
  if (game.lull === "fight") {
    if (game.wave >= STAGE_WAVES) updateFinale(dt);
    else endWave();
    return;
  }
  game.waveTimer -= dt;
  settleWave();
  if (game.waveTimer > 0) return;
  startWave();
}
