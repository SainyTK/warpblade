import { ENEMIES } from "../../constants/enemies";
import { HERO_START_X } from "../../constants/hero";
import { GROUND, W } from "../../constants/stage";
import { ELITE } from "../../constants/waves";
import { sfx } from "../../services/audio";
import type { EnemyType } from "../../types/enemy";
import { eraOf } from "../../utils/eras";
import { clamp } from "../../utils/math";
import { createRift } from "../effects/rift";
import { makeEnemy } from "../enemies/enemy";
import { kindOf } from "../enemies/kinds";
import { feat } from "../feat";
import { endRun } from "../runEnd";
import { character, game, hero, ponytail, scarf, showBanner } from "../state";
import { updateMentor } from "./mentor";
import { markPerch } from "./patrol";
import { EXIT_X, GATE_ENTRY, ROUTE, SPAWN_LEAD, STAGE_WIDTH, STAGE_XP } from "./route";
import { updateSpikes } from "./spikes";
import { trail } from "./trail";

const CAMERA_LEAD = 0.35;
const CAMERA_FOLLOW = 13;
const BOSS_WARNING = 2.2;
const CLEAR_DELAY = 1.1;

type Trail = NonNullable<typeof trail>;
type Area = (typeof ROUTE)[number];

function addFoe(run: Trail, area: Area, type: EnemyType, x: number, y: number, elite = false) {
  const enemy = makeEnemy(type, x, y, area.threat, STAGE_XP);
  if (elite) {
    Object.assign(enemy, { elite, max: Math.round(enemy.max * ELITE.hp), xp: Math.round(enemy.xp * ELITE.xp) });
    enemy.hp = enemy.max;
  }
  run.authored.add(enemy);
  markPerch(enemy);
  game.enemies.push(enemy);
  return enemy;
}

function placeAtSection(x: number): void {
  scarf.shift(x - hero.x, 0);
  ponytail.shift(x - hero.x, 0);
  hero.x = x;
}

export function startAdventureAt(section: number): void {
  if (!trail) return;
  trail.area = clamp(section - 1, 0, ROUTE.length - 1);
  const area = ROUTE[trail.area];
  placeAtSection(area.start + HERO_START_X);
  trail.camera = area.start;
  trail.left = area.start;
  trail.farthest = hero.x;
  game.wave = eraOf(area.tier).first;
  game.lull = "fight";
  showBanner(eraOf(area.tier).name, BOSS_WARNING);
}

function openBossRoom(run: Trail, area: Area): void {
  run.left = area.entrance;
  run.gate = area.exit;
  game.wave = area.tier;
  game.enemies = game.enemies.filter((enemy) => enemy.x >= area.entrance && enemy.hp > 0);
  feat({ kind: "waveReached", wave: area.tier });
  showBanner(ENEMIES[area.boss].name, BOSS_WARNING);
  const rift = kindOf(area.boss).rift;
  const x = area.exit - W * 0.26;
  const y = rift.y();
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      run.boss = addFoe(run, area, area.boss, x, y);
    }),
  );
}

function clearBossRoom(run: Trail, area: Area): void {
  run.bossesDefeated++;
  run.area++;
  run.nextFoe = 0;
  run.gate = null;
  run.boss = null;
  game.cleared = area.tier;
  game.clearedAt = game.clock;
  feat({ kind: "waveCleared", wave: area.tier, hero: character.id });
  showBanner(run.area === ROUTE.length ? "Exit open" : "Gate open", BOSS_WARNING);
  sfx.levelUp();
}

function advanceRoute(run: Trail): void {
  const area = ROUTE[run.area];
  if (!area) {
    if (hero.x < EXIT_X) return;
    run.farthest = EXIT_X;
    game.mode = "clear";
    game.waveTimer = CLEAR_DELAY;
    showBanner("Stage clear", CLEAR_DELAY);
    return;
  }
  if (run.gate !== null) {
    if (run.boss && run.boss.hp <= 0) clearBossRoom(run, area);
    return;
  }
  if (hero.x < area.start) return;
  const era = eraOf(area.tier);
  if (game.wave < era.first) {
    game.wave = era.first;
    showBanner(era.name, BOSS_WARNING);
  }
  let next = area.foes[run.nextFoe];
  while (next && next.x <= hero.x + SPAWN_LEAD) {
    addFoe(run, area, next.type, next.x, next.y ?? GROUND, next.elite);
    run.nextFoe++;
    next = area.foes[run.nextFoe];
  }
  if (hero.x >= area.entrance + GATE_ENTRY) openBossRoom(run, area);
}

export function updateAdventure(dt: number): void {
  if (!trail) return;
  const target = trail.gate === null ? clamp(hero.x - W * CAMERA_LEAD, 0, STAGE_WIDTH - W) : trail.left;
  trail.camera += (target - trail.camera) * (1 - Math.exp(-CAMERA_FOLLOW * dt));
  updateSpikes();
  if (hero.state === "dead") return;
  if (game.mode === "clear") {
    game.waveTimer -= dt;
    if (game.waveTimer <= 0) endRun("clear");
    return;
  }
  trail.farthest = Math.max(trail.farthest, hero.x);
  updateMentor();
  if (game.mode === "play") advanceRoute(trail);
}
