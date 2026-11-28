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
import { coop, eachHero, eachStanding } from "../coopHooks";
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
import { type BigFoeBeat, GATE_ENTRY, type RouteArea, type RouteFoe, type RoutePack, SPAWN_LEAD } from "./route";
import { updateSpikes } from "./spikes";
import { drawStragglersDown } from "./stragglers";
import { openSurge, updateSurge } from "./surge";
import { trail } from "./trail";

const CAMERA_LEAD = 0.35;
const CAMERA_FOLLOW = 13;
const BANNER = 2.2;
const PARTY_EDGE = 16;
const PARTY_SPAN = W - PARTY_EDGE * 2;
const ROOM_GATHER = 24;

type Trail = NonNullable<typeof trail>;

const waveFor = (level: number): number => clamp(Math.round(bandWave(level)), 1, 30);

function addFoe(run: Trail, foe: RouteFoe): void {
  const enemy = claimFoe(stageFoe(foe.type, foe.x, foe.y ?? GROUND, foe.level, foe.xp, foe.elite));
  run.packFoes.push(enemy);
  run.band = foe.level;
}

function placeHero(x: number): void {
  scarf.shift(x - hero.x, GROUND - hero.y);
  ponytail.shift(x - hero.x, GROUND - hero.y);
  Object.assign(hero, { x, y: GROUND, vx: 0, vy: 0, ground: true });
}

export function startAdventureAt(section: number, offset = 0): void {
  if (!trail) return;
  trail.area = clamp(section - 1, 0, trail.route.areas.length - 1);
  const area = trail.route.areas[trail.area];
  placeHero(area.start + HERO_START_X + offset);
  trail.camera = area.start;
  trail.left = area.start;
  trail.farthest = hero.x;
  trail.pack = 0;
  trail.packFoes = [];
  trail.hold = null;
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

function openBigFoe(run: Trail, x: number, beat: BigFoeBeat): void {
  const epic = openFight(run, beat);
  const name = bigFoeName(run, beat);
  if (!epic) showBanner(beat.kind === "elite" ? `Elite ${name}` : name, BANNER);
  const rift = kindOf(beat.foe).rift;
  const y = rift.y();
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      const elite = beat.kind === "elite";
      const foe = claimFoe(stageFoe(beat.foe, x, y, beat.level, beat.xp, elite));
      run.bigFoe = foe;
      if (beat.kind === "mini") foe.rank = "mini";
      const soloHp = bigFoeHp(beat.level, beat.kind, run.mods);
      const hp = coop()?.scaleFoeHp(foe.rank, soloHp) ?? soloHp;
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
    showBanner(`Rift surge  Wave 1/${beat.waves.length}`, BANNER);
    sfx.surge();
    return;
  }
  run.band = beat.level;
  game.wave = waveFor(beat.level);
  openBigFoe(run, area.exit - W * 0.26, beat);
}

function gatherInRoom(area: RouteArea): void {
  const inside = area.entrance + ROOM_GATHER;
  eachHero(() => {
    if (hero.x >= inside) return;
    placeHero(inside);
  });
}

function openRoom(run: Trail, area: RouteArea): void {
  run.left = area.entrance;
  run.gate = area.exit;
  run.leash = null;
  gatherInRoom(area);
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
  run.surge = null;
  run.bigFoe = null;
  run.beat++;
  game.cleared++;
  game.clearedAt = game.clock;
  feat({ kind: "waveCleared", wave: game.wave, hero: character.id });
  coop()?.waveCleared();
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
  run.pack = 0;
  run.packFoes = [];
  run.hold = null;
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

function advanceRoute(run: Trail, lead: number, dt: number): void {
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
  if (lead < area.start) return;
  updateRoad(run, area, lead, dt);
  if (run.hold === null && run.pack >= area.packs.length && lead >= area.entrance + GATE_ENTRY) openRoom(run, area);
}

const packStart = (pack: RoutePack): number => Math.min(pack.mini?.x ?? pack.hold, ...pack.foes.map((foe) => foe.x));

function engagePack(run: Trail, pack: RoutePack): void {
  run.hold = pack.hold;
  run.packFoes = [];
  for (const foe of pack.foes) addFoe(run, foe);
  if (!pack.mini) return;
  run.band = pack.mini.level;
  game.wave = waveFor(pack.mini.level);
  openBigFoe(run, pack.mini.x, pack.mini);
}

function packCleared(run: Trail, pack: RoutePack): boolean {
  if (run.packFoes.some((foe) => foe.hp > 0)) return false;
  if (!pack.mini) return true;
  return !!run.bigFoe && run.bigFoe.hp <= 0 && bossFightSettled();
}

function clearPack(run: Trail, pack: RoutePack): void {
  run.hold = null;
  run.packFoes = [];
  run.pack++;
  if (!pack.mini) return;
  run.bigFoe = null;
  run.bigFoesDefeated++;
  run.miniDefeated = true;
  game.cleared++;
  game.clearedAt = game.clock;
  feat({ kind: "waveCleared", wave: game.wave, hero: character.id });
  coop()?.waveCleared();
  openPicks();
  sfx.gate();
}

function updateRoad(run: Trail, area: RouteArea, lead: number, dt: number): void {
  const pack = area.packs[run.pack];
  if (!pack) return;
  if (run.hold === null) {
    if (lead + SPAWN_LEAD >= packStart(pack)) engagePack(run, pack);
    return;
  }
  if (packCleared(run, pack)) {
    clearPack(run, pack);
    return;
  }
  const left = run.packFoes.filter((foe) => foe.hp > 0);
  if (left.every((foe) => kindOf(foe.type).flies)) drawStragglersDown(left, dt);
}

function partyXs(): number[] {
  const room = coop();
  if (room) return room.standingXs();
  return hero.state === "dead" ? [] : [hero.x];
}

function followParty(run: Trail, xs: readonly number[], dt: number): void {
  const walking = run.gate === null && xs.length > 0;
  const lead = walking ? Math.max(...xs) : 0;
  const rear = walking ? Math.min(...xs) : 0;
  run.leash = walking && xs.length > 1 ? { left: lead - PARTY_SPAN, right: rear + PARTY_SPAN } : null;
  if (run.gate === null && !xs.length) return;
  const target = walking
    ? clamp(Math.min(lead - W * CAMERA_LEAD, rear - PARTY_EDGE), 0, run.route.width - W)
    : run.left;
  run.camera += (target - run.camera) * (1 - Math.exp(-CAMERA_FOLLOW * dt));
}

export function updateAdventure(dt: number): void {
  if (!trail) return;
  const xs = partyXs();
  followParty(trail, xs, dt);
  eachStanding(updateSpikes);
  updateStageHazard(dt);
  updateBossFight(dt);
  if (!xs.length) return;
  const lead = Math.max(...xs);
  trail.farthest = Math.max(trail.farthest, lead);
  eachStanding(updateMentor);
  if (game.mode === "play") advanceRoute(trail, lead, dt);
}
