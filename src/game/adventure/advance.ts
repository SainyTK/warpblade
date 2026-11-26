import { ENEMIES } from "../../constants/enemies";
import { HERO_START_X } from "../../constants/hero";
import { GROUND, W } from "../../constants/stage";
import { ELITE } from "../../constants/waves";
import { sfx } from "../../services/audio";
import { RIFT_STAGES, STAGES } from "../../stages";
import { ARTS } from "../../stages/arts";
import type { BossCard } from "../../types/bossFight";
import type { StageId } from "../../types/campaign";
import type { EnemyType } from "../../types/enemy";
import { openStages } from "../../utils/campaign";
import { clamp } from "../../utils/math";
import { earnArt } from "../arts";
import { bossArrived, bossFightSettled, openBossFight, resetBossFight, updateBossFight } from "../bossFight";
import { createRift } from "../effects/rift";
import { makeEnemy } from "../enemies/enemy";
import { kindOf } from "../enemies/kinds";
import { feat } from "../feat";
import { endRun } from "../runEnd";
import { character, game, hero, ponytail, progress, scarf, showBanner } from "../state";
import { resetStageHazard, updateStageHazard } from "./hazard";
import { updateMentor } from "./mentor";
import { markPerch } from "./patrol";
import { updatePits } from "./pits";
import { GATE_ENTRY, type RouteArea, SPAWN_LEAD, STAGE_XP } from "./route";
import { updateSpikes } from "./spikes";
import { openSurge, updateSurge } from "./surge";
import { loadStage, trail } from "./trail";

const CAMERA_LEAD = 0.35;
const CAMERA_FOLLOW = 13;
const BOSS_WARNING = 2.2;
const CLEAR_DELAY = 1.1;
const STAGE_CLEAR_DELAY = 2.4;

type Trail = NonNullable<typeof trail>;

const waveFor = (threat: number): number => clamp(Math.round(threat), 1, 30);

function addFoe(run: Trail, area: RouteArea, type: EnemyType, x: number, y: number, elite = false) {
  const enemy = makeEnemy(type, x, y, area.threat, STAGE_XP);
  enemy.power *= trail?.route.stage.foeDamage ?? 1;
  enemy.max = Math.round(enemy.max * area.hpScale);
  enemy.hp = enemy.max;
  if (elite) {
    Object.assign(enemy, { elite, max: Math.round(enemy.max * ELITE.hp), xp: Math.round(enemy.xp * ELITE.xp) });
    enemy.hp = enemy.max;
  }
  run.authored.add(enemy);
  markPerch(enemy);
  game.enemies.push(enemy);
  return enemy;
}

function placeHero(x: number): void {
  scarf.shift(x - hero.x, GROUND - hero.y);
  ponytail.shift(x - hero.x, GROUND - hero.y);
  Object.assign(hero, { x, y: GROUND, vx: 0, vy: 0, ground: true });
}

function announceStage(run: Trail): void {
  const stage = run.route.stage;
  showBanner(stage.name, BOSS_WARNING);
}

export function startAdventureAt(section: number): void {
  if (!trail) return;
  trail.area = clamp(section - 1, 0, trail.route.areas.length - 1);
  const area = trail.route.areas[trail.area];
  placeHero(area.start + HERO_START_X);
  trail.camera = area.start;
  trail.left = area.start;
  trail.farthest = hero.x;
  trail.safeX = hero.x;
  game.wave = waveFor(area.threat);
  game.lull = "fight";
  resetBossFight();
  resetStageHazard();
  announceStage(trail);
}

export function enterStage(id: StageId): void {
  if (!trail) return;
  loadStage(id);
  game.enemies = [];
  game.fx = [];
  game.pickups = [];
  game.blazes = [];
  game.coins += game.coinDrops.filter((coin) => !coin.done).length;
  game.coinDrops = [];
  hero.hp = progress.stats.hp;
  hero.mp = progress.stats.mp;
  game.mode = "play";
  startAdventureAt(1);
}

function finaleCard(run: Trail, foe: EnemyType): BossCard {
  const art = run.route.stage.grantsArt;
  if (art) return { label: "Rift Art", name: ARTS[art].name, sub: "", tone: "art" };
  return { label: "", name: ENEMIES[foe].name, sub: "Vanquished", tone: "fallen" };
}

function openBossRoom(run: Trail, area: RouteArea, foe: EnemyType): void {
  const epic = openBossFight(foe, finaleCard(run, foe));
  if (!epic) showBanner(ENEMIES[foe].name, BOSS_WARNING);
  const rift = kindOf(foe).rift;
  const x = area.exit - W * 0.26;
  const y = rift.y();
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      const boss = addFoe(run, area, foe, x, y);
      run.boss = boss;
      if (epic) bossArrived(boss, ENEMIES[foe].name);
    }),
  );
}

function openRoom(run: Trail, area: RouteArea): void {
  run.left = area.entrance;
  run.gate = area.exit;
  game.wave = waveFor(area.threat);
  game.enemies = game.enemies.filter((enemy) => enemy.x >= area.entrance && enemy.hp > 0);
  feat({ kind: "waveReached", wave: game.wave });
  if (area.room.kind === "boss") {
    openBossRoom(run, area, area.room.foe);
    return;
  }
  run.surge = openSurge(area);
  showBanner("Rift surge", BOSS_WARNING);
}

function finishStage(run: Trail): void {
  const stage = run.route.stage;
  if (!run.cleared.includes(stage.id)) run.cleared.push(stage.id);
  if (stage.grantsArt) earnArt(stage.grantsArt);
}

function clearRoom(run: Trail, area: RouteArea): void {
  const last = run.area === run.route.areas.length - 1;
  if (area.room.kind === "boss") run.bossesDefeated++;
  run.area++;
  run.nextFoe = 0;
  run.gate = null;
  run.boss = null;
  run.surge = null;
  game.cleared++;
  game.clearedAt = game.clock;
  feat({ kind: "waveCleared", wave: game.wave, hero: character.id });
  if (last) finishStage(run);
  else showBanner("Gate open", BOSS_WARNING);
  sfx.levelUp();
}

function roomCleared(run: Trail, area: RouteArea, dt: number): boolean {
  if (area.room.kind === "boss") return !!run.boss && run.boss.hp <= 0 && bossFightSettled();
  return !!run.surge && updateSurge(run.surge, area, dt);
}

function reachExit(run: Trail): void {
  run.farthest = run.route.exitX;
  game.mode = "clear";
  const final = run.route.stage.kind === "citadel";
  game.waveTimer = final ? CLEAR_DELAY : STAGE_CLEAR_DELAY;
  showBanner(final ? "Campaign clear" : "Stage clear", game.waveTimer);
}

function advanceRoute(run: Trail, dt: number): void {
  const area = run.route.areas[run.area];
  if (!area) {
    if (hero.x >= run.route.exitX) reachExit(run);
    return;
  }
  if (run.gate !== null) {
    if (roomCleared(run, area, dt)) clearRoom(run, area);
    return;
  }
  if (hero.x < area.start) return;
  let next = area.foes[run.nextFoe];
  while (next && next.x <= hero.x + SPAWN_LEAD) {
    addFoe(run, area, next.type, next.x, next.y ?? GROUND, next.elite);
    run.nextFoe++;
    next = area.foes[run.nextFoe];
  }
  if (hero.x >= area.entrance + GATE_ENTRY) openRoom(run, area);
}

export const mapChoices = (): StageId[] => openStages(RIFT_STAGES, trail?.cleared ?? []);

function leaveStage(run: Trail): void {
  if (run.route.stage.kind === "citadel") {
    endRun("clear");
    return;
  }
  game.mode = "map";
}

export function updateAdventure(dt: number): void {
  if (!trail) return;
  const target = trail.gate === null ? clamp(hero.x - W * CAMERA_LEAD, 0, trail.route.width - W) : trail.left;
  trail.camera += (target - trail.camera) * (1 - Math.exp(-CAMERA_FOLLOW * dt));
  updateSpikes();
  updateStageHazard(dt);
  updateBossFight(dt);
  if (hero.state === "dead") return;
  if (game.mode === "clear") {
    game.waveTimer -= dt;
    if (game.waveTimer <= 0) leaveStage(trail);
    return;
  }
  trail.farthest = Math.max(trail.farthest, hero.x);
  updatePits();
  updateMentor();
  if (game.mode === "play") advanceRoute(trail, dt);
}

export const stageName = (id: StageId): string => STAGES[id].name;
