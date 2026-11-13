import { ENEMIES } from "../../../constants/enemies";
import { PAL, WAX } from "../../../constants/palette";
import { RES, W } from "../../../constants/stage";
import { ULT_LEVELS, ULT_REACH } from "../../../constants/ultimate";
import { GREAT_WICK } from "../../../constants/wenna/special";
import { CANDLE_ART, CANDLE_FLAMES, FLAME_LETTERS, WAX_LETTERS } from "../../../constants/wenna/stamps";
import { glow, place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { stampPixels } from "../../effects/fine";
import { createFloorRing } from "../../effects/floorRing";
import { createFlameWave } from "../../effects/wenna/flameWave";
import { launchEnemy } from "../../enemies/airborne";
import { enemyCenter } from "../../enemies/enemy";
import { withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { hitStop, shake, surfaceBelow } from "../../world";
import { setState } from "../actions";
import { ultimateValues } from "../ultimate";
import { drawGreatWick } from "./drawGreatWick";
import { wenna } from "./memory";
import { byWick } from "./wickKills";
import { cappedWicks, isUp, liveWicks, spawnWick, wickCap } from "./wicks";

/** the reach at most, so the whole-screen level covers the stage from wherever she stands */
const SCREEN = 400;

/** the foes inside a level's reach: ahead at levels 1 and 2, both sides at 3, the whole stage at 4 */
function inReach(x: number, face: number, reach: number, level: number): Enemy[] {
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const dx = enemyCenter(e)[0] - x;
    if (Math.abs(dx) > reach) return false;
    return level >= 3 || dx * face >= -12;
  });
}

/** one great blow on a foe: thrown away and up */
function smite(e: Enemy, x: number, power: number, knock: boolean): void {
  const dir = Math.sign(enemyCenter(e)[0] - x) || hero.face;
  dealDamage(e, progress.stats.ap * power, { fromX: x, kx: dir * GREAT_WICK.kx, heavy: true, source: "ultimate" });
  if (knock && e.hp > 0 && ENEMIES[e.type].launchable) launchEnemy(e, GREAT_WICK.ky * 1.6);
}

/** the giant Wick's melt leaves new Wicks round where it stood, past her cap by up to two */
function meltInto(x: number, y: number, count: number, life: number): void {
  const room = wickCap() + GREAT_WICK.pastCap - cappedWicks().length;
  const n = Math.max(0, Math.min(count, room));
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 12;
    spawnWick(x + dx, y, "great", { extra: true, life: withCharms("duration", life) });
  }
}

/** a burst of wax and violet sparks as the arm lands */
function splash(x: number, y: number, reach: number): void {
  game.fx.push(createFloorRing(x, y, Math.min(reach, 160), PAL.wick, 0.5));
  for (let i = 0; i < 20; i++)
    particles.spawn(PK.SPARK, x, y - 20, rng.range(-160, 160), -rng.range(40, 180), rng.range(0.3, 0.7), {
      col: rng.pick([PAL.wick[4], PAL.wick[5], WAX[3]]),
    });
  lights.add(x, y - 20, 70, PAL.wick[3], 0.4, 0.35);
}

/** one candle of the field, rising out of the floor and flaring */
function candleAt(x: number, y: number, delay: number): void {
  let t = -delay;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < GREAT_WICK.candleLife;
    },
    draw() {
      if (t < 0) return;
      place();
      const shown = Math.min(1, t * 8);
      const fade = Math.min(1, (GREAT_WICK.candleLife - t) * 4);
      const h = CANDLE_ART.length / RES;
      stampPixels(CANDLE_ART, x, y - h / 2, WAX_LETTERS, fade * shown);
      stampPixels(
        CANDLE_FLAMES[Math.floor(t * 12) % CANDLE_FLAMES.length],
        x,
        y - h - 1.25,
        FLAME_LETTERS,
        fade * shown,
      );
      glow(x, y - h - 1, 6, PAL.wick[4], 0.35 * fade);
    },
  });
}

/**
 * Its levels raise a field of candles across the reach, every foe in it struck for a share of a swing; Night of Lamps
 * fills the whole stage and strikes every foe three times.
 */
function candleField(x: number, face: number, reach: number, level: number, hit: number): void {
  const v = ultimateValues();
  if (!v.candles) return;
  const night = !!v.night;
  const span = night ? SCREEN : reach;
  for (let cx = Math.max(4, x - span); cx <= Math.min(W - 4, x + span); cx += GREAT_WICK.candleGap) {
    if (level < 3 && !night && (cx - x) * face < -12) continue;
    candleAt(cx, surfaceBelow(cx, hero.y - 1), Math.abs(cx - x) / GREAT_WICK.candleSpeed);
  }
  const foes = night ? game.enemies.filter((e) => e.hp > 0) : inReach(x, face, reach, level);
  for (let i = 0; i < (night ? GREAT_WICK.nightStrikes : 1); i++)
    for (const e of foes) smite(e, x, hit * v.candles, false);
}

/** with its levels every Wick she has flares with the swing, and stands as a Great Wick a while */
function wakeWicks(hit: number): void {
  const v = ultimateValues();
  for (const w of liveWicks()) {
    if (!isUp(w)) continue;
    if (v.great) w.great = withCharms("duration", v.great);
    if (!v.flare) continue;
    byWick(() => {
      for (const e of game.enemies) {
        const [cx, cy] = enemyCenter(e);
        if (e.hp > 0 && Math.hypot(cx - w.x, cy - w.y) < GREAT_WICK.flareReach)
          dealDamage(e, progress.stats.ap * hit * v.flare, { fromX: w.x, source: "ultimate" });
      }
    });
    lights.add(w.x, w.y - 12, 40, PAL.wick[4], 0.9, 0.3);
  }
}

/** the arm lands across the reach: every foe in it is thrown away and up */
function swingLands(x: number, y: number, face: number, reach: number, level: number, hit: number): void {
  byWick(() => {
    for (const e of inReach(x, face, reach, level)) smite(e, x, hit, true);
  });
  splash(x + face * 20, y, reach);
  game.fx.push(createFlameWave(x, y, face, reach, level >= 3));
  shake(0.35, 5);
  hitStop(0.08);
  sfx.boom();
}

/** how far the arm has come round at time `t`: up and across on the first swing, back the other way on the next */
function armAt(t: number, swings: number): number {
  const into = t - GREAT_WICK.swing + 0.12;
  const turn = Math.min(swings - 1, Math.max(0, Math.floor(into / GREAT_WICK.again)));
  const k = Math.max(0, Math.min(1, (into - turn * GREAT_WICK.again) / 0.16));
  return turn % 2 === 0 ? k : 1 - k;
}

/**
 * Great Wick: she plants the pole and a giant Wick rises out of a pool of wax, swings one great arm across the level's
 * reach, then melts into new Wicks. Her Great Wick skill makes it swing harder and back again, raises a field of candles,
 * wakes every Wick she has, and melts it into more Wicks.
 */
export function castGreatWick(level: number): void {
  const v = ultimateValues();
  wenna.ultLevel = level;
  setState("greatWick");
  const face = hero.face;
  const x = hero.x + face * 14;
  const y = surfaceBelow(x, hero.y - 1);
  const reach = withCharms("area", Math.min(SCREEN, ULT_REACH[level - 1]));
  const hit = ULT_LEVELS[level - 1].power * (v.power ?? 1);
  const swings = Math.max(1, Math.round(v.swings ?? 1));
  const end = GREAT_WICK.swing + (swings - 1) * GREAT_WICK.again;
  let t = 0;
  let swung = 0;
  game.fx.push(createFloorRing(x, y, 18, [WAX[0], WAX[1], WAX[2], WAX[3], PAL.wick[4]], 0.6, 0.3));
  game.fx.push({
    update(dt) {
      t += dt;
      if (swung < swings && t >= GREAT_WICK.swing + swung * GREAT_WICK.again) {
        if (swung === 0) {
          candleField(x, face, reach, level, hit);
          wakeWicks(hit);
        }
        swingLands(x, y, face, reach, level, hit);
        swung++;
      }
      if (t >= end + GREAT_WICK.melt) {
        meltInto(x, y, GREAT_WICK.wicks[level - 1] + (v.more ?? 0), GREAT_WICK.wickLife);
        return false;
      }
      return true;
    },
    draw() {
      const rise = Math.max(0, Math.min(1, (t - GREAT_WICK.windup) / GREAT_WICK.rise));
      const melt = Math.max(0, (t - end - 0.1) / (GREAT_WICK.melt - 0.1));
      if (t < GREAT_WICK.windup) {
        place();
        glow(x, y - 2, 10 + t * 30, PAL.wick[3], 0.3);
        return;
      }
      drawGreatWick(x, y, rise, armAt(t, swings), Math.min(1, melt), face);
    },
  });
}

/** the cast pose holds a moment, then she is free while the Great Wick swings */
export function runGreatWick(): void {
  const h = hero;
  h.vx = 0;
  if (h.st >= GREAT_WICK.hold) setState(h.ground ? "idle" : "fall");
}
