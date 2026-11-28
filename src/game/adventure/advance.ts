import { CRYSTAL, PICK_DELAY_SECONDS } from "../../constants/defense";
import { HERO_START_X } from "../../constants/hero";
import { PAL } from "../../constants/palette";
import { W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import { levelAtSecond, secondsLeft } from "../../utils/defenseClock";
import { clamp } from "../../utils/math";
import { bandWave } from "../../utils/stageArc";
import { resetBossFight, updateBossFight } from "../bossFight";
import { coop } from "../coopHooks";
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
const PARTY_EDGE = 16;
const PARTY_SPAN = W - PARTY_EDGE * 2;
const CLEAR_BURST = 6;

const waveFor = (level: number): number => clamp(Math.round(bandWave(level)), 1, 30);

export function startAdventureAt(section: number, offset = 0): void {
  const run = defense;
  if (!run) return;
  run.elapsed = Math.max(0, (section - 1) * 60);
  run.xpPaidTo = run.elapsed;
  run.bigFoeCall = callsBefore(run.elapsed);
  placeHero(run.crystal.x - HERO_START_X / 2 + offset);
  run.camera = clamp(hero.x - W / 2, 0, run.field.width - W);
  run.band = levelAtSecond(run.elapsed);
  game.wave = waveFor(run.band);
  game.lull = "fight";
  resetFalls();
  resetBossFight();
  resetStageHazard();
  showBanner(run.hyper ? `${run.stage.name}  Hyper` : run.stage.name, BANNER);
}

function partyXs(): number[] {
  const room = coop();
  if (room) return room.standingXs();
  return hero.state === "dead" ? [] : [hero.x];
}

function followParty(run: Defense, xs: readonly number[], dt: number): void {
  if (!xs.length) return;
  const lead = Math.max(...xs);
  const rear = Math.min(...xs);
  run.leash = xs.length > 1 ? { left: lead - PARTY_SPAN, right: rear + PARTY_SPAN } : null;
  const target = clamp((lead + rear) / 2 - W / 2, 0, run.field.width - W);
  run.camera += (target - run.camera) * (1 - Math.exp(-CAMERA_FOLLOW * dt));
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
  followParty(run, partyXs(), dt);
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
