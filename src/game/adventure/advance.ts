import { ENEMIES } from "../../constants/enemies";
import { HERO_START_X } from "../../constants/hero";
import { GROUND, W } from "../../constants/stage";
import { ROOM_BEATS } from "../../constants/stageArc";
import { sfx } from "../../services/audio";
import { ARTS } from "../../stages/arts";
import type { BossCard } from "../../types/bossFight";
import { clamp } from "../../utils/math";
import { bandWave, bigFoeHp } from "../../utils/stageArc";
import {
  bossArrived,
  bossFightSettled,
  bossProfile,
  openBossFight,
  resetBossFight,
  updateBossFight,
} from "../bossFight";
import { createRift } from "../effects/rift";
import { kindOf } from "../enemies/kinds";
import { feat } from "../feat";
import { miniProfile } from "../miniBoss";
import { openPicks } from "../progress";
import { character, game, hero, ponytail, scarf, showBanner } from "../state";
import { summonFinale } from "./finale";
import { claimFoe, stageFoe } from "./foes";
import { resetStageHazard, updateStageHazard } from "./hazard";
import { updateMentor } from "./mentor";
import { markPerch } from "./patrol";
import { updatePits } from "./pits";
import { type BigFoeBeat, GATE_ENTRY, type RouteArea, type RouteFoe, SPAWN_LEAD } from "./route";
import { updateSpikes } from "./spikes";
import { openSurge, updateSurge } from "./surge";
import { trail } from "./trail";

const CAMERA_LEAD = 0.35;
const CAMERA_FOLLOW = 13;
const BANNER = 2.2;

type Trail = NonNullable<typeof trail>;

const waveFor = (level: number): number => clamp(Math.round(bandWave(level)), 1, 30);

function addFoe(run: Trail, foe: RouteFoe): void {
  const enemy = claimFoe(stageFoe(foe.type, foe.x, foe.y ?? GROUND, foe.level, foe.xp, foe.elite));
  markPerch(enemy);
  run.band = foe.level;
}

function placeHero(x: number): void {
  scarf.shift(x - hero.x, GROUND - hero.y);
  ponytail.shift(x - hero.x, GROUND - hero.y);
  Object.assign(hero, { x, y: GROUND, vx: 0, vy: 0, ground: true });
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
  trail.band = area.enter;
  game.wave = waveFor(area.enter);
  game.lull = "fight";
  resetBossFight();
  resetStageHazard();
  const stage = trail.route.stage;
  showBanner(trail.hyper ? `${stage.name}  Hyper` : stage.name, BANNER);
}

function finaleCard(run: Trail, beat: BigFoeBeat): BossCard {
  const art = run.route.stage.grantsArt;
  if (beat.kind === "boss" && beat.foe === run.route.stage.boss && art)
    return { label: "Rift Art", name: ARTS[art].name, sub: "", tone: "art" };
  return { label: "", name: bigFoeName(run, beat), sub: "Vanquished", tone: "fallen" };
}

const bigFoeName = (run: Trail, beat: BigFoeBeat): string =>
  beat.kind === "mini" ? run.route.stage.mini.name : ENEMIES[beat.foe].name;

function openFight(run: Trail, beat: BigFoeBeat): boolean {
  if (beat.kind === "elite") return false;
  const profile = beat.kind === "mini" ? miniProfile(run.route.stage.mini) : bossProfile(beat.foe);
  return openBossFight(profile, beat.kind, finaleCard(run, beat));
}

function openBigFoe(run: Trail, area: RouteArea, beat: BigFoeBeat): void {
  const epic = openFight(run, beat);
  const name = bigFoeName(run, beat);
  if (!epic) showBanner(beat.kind === "elite" ? `Elite ${name}` : name, BANNER);
  const rift = kindOf(beat.foe).rift;
  const x = area.exit - W * 0.26;
  const y = rift.y();
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      const elite = beat.kind === "elite";
      const foe = claimFoe(stageFoe(beat.foe, x, y, beat.level, beat.xp, elite));
      const hp = bigFoeHp(beat.level, beat.kind, run.mods);
      run.bigFoe = foe;
      if (beat.kind === "mini") foe.rank = "mini";
      if (epic) bossArrived(foe, name, hp);
      else Object.assign(foe, { max: hp, hp, title: name });
      sfx.bossRoar();
    }),
  );
}

function startBeat(run: Trail, area: RouteArea): void {
  const beat = area.beats[run.beat];
  if (!beat) return;
  if (beat.kind === "surge") {
    run.band = beat.from;
    game.wave = waveFor(beat.from);
    run.surge = openSurge(beat);
    showBanner("Rift surge", BANNER);
    sfx.surge();
    return;
  }
  run.band = beat.level;
  game.wave = waveFor(beat.level);
  openBigFoe(run, area, beat);
}

function openRoom(run: Trail, area: RouteArea): void {
  run.left = area.entrance;
  run.gate = area.exit;
  run.beat = 0;
  run.lull = 0;
  game.enemies = game.enemies.filter((enemy) => enemy.x >= area.entrance && enemy.hp > 0);
  feat({ kind: "waveReached", wave: game.wave });
  startBeat(run, area);
}

function beatCleared(run: Trail, area: RouteArea, dt: number): boolean {
  const beat = area.beats[run.beat];
  if (!beat) return false;
  if (beat.kind === "surge") return !!run.surge && updateSurge(run.surge, area, dt);
  return !!run.bigFoe && run.bigFoe.hp <= 0 && bossFightSettled();
}

function clearBeat(run: Trail, area: RouteArea): void {
  const beat = area.beats[run.beat];
  if (beat && beat.kind !== "surge") run.bigFoesDefeated++;
  if (beat?.kind === "mini") run.miniDefeated = true;
  run.surge = null;
  run.bigFoe = null;
  run.beat++;
  game.cleared++;
  game.clearedAt = game.clock;
  feat({ kind: "waveCleared", wave: game.wave, hero: character.id });
  const lastArea = run.area === run.route.areas.length - 1;
  if (run.beat < area.beats.length) {
    run.lull = ROOM_BEATS.pause;
    const said = beat?.kind === "surge" ? "Surge clear" : beat?.kind === "elite" ? "Elite down" : "";
    if (said) showBanner(said, ROOM_BEATS.pause);
    sfx.gate();
    return;
  }
  if (lastArea) {
    run.finale = true;
    summonFinale(run, area);
    return;
  }
  run.area++;
  run.nextFoe = 0;
  run.gate = null;
  run.lull = ROOM_BEATS.pause;
  showBanner("Gate open", BANNER);
  sfx.gate();
}

function updateLull(run: Trail, area: RouteArea, dt: number): void {
  const before = run.lull;
  run.lull = Math.max(0, run.lull - dt);
  const picksAt = ROOM_BEATS.pause - ROOM_BEATS.pickDelay;
  if (before > picksAt && run.lull <= picksAt) openPicks();
  if (run.lull > 0 || run.gate === null) return;
  startBeat(run, area);
}

function advanceRoute(run: Trail, dt: number): void {
  if (run.finale) return;
  const area = run.route.areas[run.area];
  if (!area) return;
  if (run.lull > 0) {
    updateLull(run, area, dt);
    return;
  }
  if (run.gate !== null) {
    if (beatCleared(run, area, dt)) clearBeat(run, area);
    return;
  }
  if (hero.x < area.start) return;
  let next = area.foes[run.nextFoe];
  while (next && next.x <= hero.x + SPAWN_LEAD) {
    addFoe(run, next);
    run.nextFoe++;
    next = area.foes[run.nextFoe];
  }
  if (hero.x >= area.entrance + GATE_ENTRY) openRoom(run, area);
}

export function updateAdventure(dt: number): void {
  if (!trail) return;
  const target = trail.gate === null ? clamp(hero.x - W * CAMERA_LEAD, 0, trail.route.width - W) : trail.left;
  trail.camera += (target - trail.camera) * (1 - Math.exp(-CAMERA_FOLLOW * dt));
  updateSpikes();
  updateStageHazard(dt);
  updateBossFight(dt);
  if (hero.state === "dead") return;
  trail.farthest = Math.max(trail.farthest, hero.x);
  updatePits();
  updateMentor();
  if (game.mode === "play") advanceRoute(trail, dt);
}
