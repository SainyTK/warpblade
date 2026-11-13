import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game, hero, particles, rng } from "../../state";
import { ABYSS_HITS, VOID_SPARKS } from "./colors";
import { createGaze } from "./gaze";
import { createSightLance, LANCE } from "./sightLance";
import { createVoidOrb, ORB_GRAVITY } from "./voidOrb";

/** where it hovers, and how low it lies once its lid has shut */
const HOVER = { y: 56, bob: 6, side: 70, floor: GROUND - 20 } as const;
/** the lances it burns down at the hero: how many, how far apart they land and how long between them */
const LANCES = { count: 3, enraged: 5, gap: 30, beat: 0.09 } as const;
/** the tears it weeps: globs of void that arc down around the hero, how many and how far apart they land */
const TEARS = { count: 4, enraged: 6, gap: 24, rise: -15 } as const;
/** seconds its lid swells before the tears fall */
export const TEAR_WINDUP = 0.6;
/** it gazes after this many other actions */
const GAZE_EVERY = 2;
/** seconds its lid stays shut once the gaze has failed it, lying on the floor */
export const SHUT = 8;
/** shut, each of the hero's own blows takes this share of its whole HP */
export const UNBLINKING_SHUT_SHARE = 0.03;

/**
 * e.n: gazes in a row that found nothing (the drawing droops the lid by it). e.ax: actions since its last gaze.
 * What a gaze can and cannot find is in gaze.ts. It fights alone and nothing of its own is in the air while it gazes.
 */

function burnLances(e: Enemy): void {
  const n = e.phase === 2 ? LANCES.enraged : LANCES.count;
  for (let i = 0; i < n; i++) {
    const x = clamp(hero.x + (i - (n - 1) / 2) * LANCES.gap, 6, W - 6);
    game.fx.push(createSightLance(e, x, i * LANCES.beat, ABYSS_HITS.unblinkingLance * e.power));
  }
  sfx.chime(0);
}

/** globs of void fall from under its lid and come down in a row around the hero */
function weep(e: Enemy): void {
  const n = e.phase === 2 ? TEARS.enraged : TEARS.count;
  const y = e.y + 12;
  for (let i = 0; i < n; i++) {
    const land = clamp(hero.x + (i - (n - 1) / 2) * TEARS.gap + rng.range(-6, 6), 8, W - 8);
    const vy = TEARS.rise - i * 12;
    // the flight time down to the floor, so the glob comes down on its landing spot
    const time = (-vy + Math.sqrt(vy * vy + 2 * ORB_GRAVITY * (GROUND - 2 - y))) / ORB_GRAVITY;
    game.fx.push(createVoidOrb(e.x, y, (land - e.x) / time, vy, ABYSS_HITS.unblinkingTear * e.power));
  }
  sfx.boom();
}

/** what it does next: its gaze after every few other actions, else lances or tears */
function chooseAction(e: Enemy): void {
  if (e.ax >= GAZE_EVERY) {
    Object.assign(e, { state: "charge", st: 0, ax: 0 });
    game.fx.push(createGaze(e, ABYSS_HITS.unblinkingGaze * e.power));
    return;
  }
  e.ax++;
  if (rng.chance(0.4)) {
    Object.assign(e, { state: "summon", st: 0 });
    return;
  }
  Object.assign(e, { state: "wind", st: 0 });
  burnLances(e);
}

/**
 * The Unblinking, what comes after the last wave's boss: a great eye with HP no run can wear down
 * (kinds/unblinking.ts), whose every attack all but kills. It hovers out of reach, burns lances of sight down where the hero stands, weeps globs of void
 * that fall around them, and every few actions sweeps its gaze across the whole stage. Only its own gaze can shut it: see gaze.ts. Shut, it
 * lies on the floor for `SHUT` seconds, where each blow takes a share of its HP, then opens and rises again.
 */
export function updateUnblinking(e: Enemy, dt: number, ts: number): void {
  if (e.phase === 1 && e.hp < e.max * 0.5) e.phase = 2;
  const ws = waveScale(game.wave);
  const dx = hero.x - e.x;
  if (e.state === "drift") {
    e.face = Math.sign(dx) || e.face;
    const tx = clamp(hero.x - e.side * HOVER.side, 50, W - 50);
    const ty = HOVER.y + Math.sin(game.t * 1.1 + e.seed) * HOVER.bob;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.1, -45, 45), 120 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -60, 60), 200 * dt);
    if (e.cd <= 0 && hero.state !== "dead") chooseAction(e);
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= LANCE.warn) Object.assign(e, { state: "beam", st: 0 });
  } else if (e.state === "beam") {
    const last = ((e.phase === 2 ? LANCES.enraged : LANCES.count) - 1) * LANCES.beat;
    if (e.st >= last + LANCE.burn) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= TEAR_WINDUP && e.st - dt < TEAR_WINDUP) weep(e);
    if (e.st >= 1) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge" || e.state === "volley") {
    // the gaze itself runs in gaze.ts, which also ends these states; the eye holds still over the middle of the stage
    e.vx = approach(e.vx, clamp((W / 2 - e.x) * 1.5, -60, 60), 200 * dt);
    e.vy = approach(e.vy, clamp((HOVER.y - 8 - e.y) * 2, -60, 60), 200 * dt);
  } else if (e.state === "blink") {
    e.vx = approach(e.vx, 0, 300 * dt);
    e.vy = e.y < HOVER.floor ? e.vy + 420 * dt : 0;
    if (e.st >= SHUT) {
      Object.assign(e, { state: "recover", st: 0, ax: 0 });
      sfx.cast();
    }
  } else if (e.st >= 0.8)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1.3, 2.1) * (e.phase === 2 ? 0.7 : 1) * ws.cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  if (e.state !== "blink") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clamp(e.x + e.vx * dt, 30, W - 30);
  e.y = clamp(e.y + e.vy * dt, 30, HOVER.floor);
  if (e.state !== "blink" && rng.chance(0.5 * ts))
    particles.spawn(
      PK.EMBER,
      e.x + rng.range(-22, 22),
      e.y + rng.range(-16, 16),
      rng.range(-10, 10),
      rng.range(4, 16),
      rng.range(0.5, 1),
      { sparks: VOID_SPARKS },
    );
}
