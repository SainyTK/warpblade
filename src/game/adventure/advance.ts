import { CRYSTAL, PICK_DELAY_SECONDS } from "../../constants/defense";
import { HERO_START_X } from "../../constants/hero";
import { PAL } from "../../constants/palette";
import { W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { HeroSpot } from "../../types/coop";
import { PK } from "../../types/particle";
import { levelAtSecond, secondsLeft } from "../../utils/defenseClock";
import { clamp } from "../../utils/math";
import { bandWave } from "../../utils/stageArc";
import { resetBossFight, updateBossFight } from "../bossFight";
import { coop, heroSlot } from "../coopHooks";
import { feat } from "../feat";
import { openPicks } from "../progress";
import { endRun } from "../runEnd";
import { fxRng, game, hero, particles, showBanner } from "../state";
import { callsBefore, updateBigFoes } from "./bigFoes";
import { updateSiege } from "./crystal";
import { type Defense, defense } from "./defense";
import { resetStageHazard, updateStageHazard } from "./hazard";
import { placeHero, resetFalls } from "./revive";
import { updateFronts, updateSpawns } from "./spawner";

const CAMERA_FOLLOW = 9;
const BANNER = 2.2;
const CLEAR_BURST = 6;

const waveFor = (level: number): number => clamp(Math.round(bandWave(level)), 1, 30);
const cameraOn = (run: Defense, x: number): number => clamp(x - W / 2, 0, run.field.width - W);

export function startAdventureAt(section: number, offset = 0): void {
  const run = defense;
  if (!run) return;
  run.elapsed = Math.max(0, (section - 1) * 60);
  run.xpPaidTo = run.elapsed;
  run.bigFoeCall = callsBefore(run.elapsed);
  placeHero(run.crystal.x - HERO_START_X / 2 + offset);
  run.cameras.set(heroSlot(), cameraOn(run, hero.x));
  run.band = levelAtSecond(run.elapsed);
  game.wave = waveFor(run.band);
  game.lull = "fight";
  resetFalls();
  resetBossFight();
  resetStageHazard();
  showBanner(run.hyper ? `${run.stage.name}  Hyper` : run.stage.name, BANNER);
}

function heroSpots(): HeroSpot[] {
  return coop()?.heroSpots() ?? [{ slot: 0, x: hero.x, standing: hero.state !== "dead" }];
}

function followHeroes(run: Defense, spots: readonly HeroSpot[], dt: number): void {
  const pull = 1 - Math.exp(-CAMERA_FOLLOW * dt);
  for (const { slot, x, standing } of spots) {
    if (!standing) continue;
    const camera = run.cameras.get(slot) ?? cameraOn(run, x);
    run.cameras.set(slot, camera + (cameraOn(run, x) - camera) * pull);
  }
}

export function notePicksDue(): void {
  if (defense && defense.pickIn === null) defense.pickIn = PICK_DELAY_SECONDS;
}

function updatePicks(run: Defense, dt: number): void {
  if (run.pickIn === null) return;
  run.pickIn -= dt;
  if (run.pickIn > 0) return;
  run.pickIn = null;
  openPicks();
}

function holdCrystal(run: Defense): void {
  run.end = "held";
  run.endIn = CRYSTAL.shatterSeconds;
  for (const e of game.enemies) {
    for (let i = 0; i < CLEAR_BURST; i++)
      particles.spawn(PK.EMBER, e.x, e.y - 10, fxRng.range(-40, 40), fxRng.range(-100, -40), 0.6, {
        sparks: PAL.crystal,
      });
  }
  game.enemies = [];
  game.fx = game.fx.filter((f) => !f.rift);
  resetBossFight();
  feat({ kind: "waveReached", wave: game.wave });
  showBanner("Crystal held", CRYSTAL.shatterSeconds);
  sfx.levelUp();
}

function updateEnd(run: Defense, dt: number): void {
  run.endIn -= dt;
  if (run.endIn > 0) return;
  endRun(run.end === "held" ? "clear" : "fallen");
}

function updateClock(run: Defense, dt: number): void {
  run.elapsed += dt;
  run.band = levelAtSecond(run.elapsed);
  game.wave = waveFor(run.band);
  if (secondsLeft(run.elapsed) <= 0) {
    holdCrystal(run);
    return;
  }
  updateFronts(run);
  updateSpawns(run, dt);
  updateBigFoes(run);
  updatePicks(run, dt);
}

export function updateAdventure(dt: number): void {
  const run = defense;
  if (!run) return;
  followHeroes(run, heroSpots(), dt);
  updateStageHazard(dt);
  updateBossFight(dt);
  updateSiege(dt);
  if (game.mode !== "play") return;
  if (run.end) {
    updateEnd(run, dt);
    return;
  }
  updateClock(run, dt);
}
