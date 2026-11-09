import { ENEMIES } from "../../../constants/enemies";
import { PAL, WAX } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { ULT_LEVELS, ULT_REACH } from "../../../constants/ultimate";
import { GREAT_WICK } from "../../../constants/wenna/special";
import { glow, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { launchEnemy } from "../../enemies/airborne";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { hitStop, shake, surfaceBelow } from "../../world";
import { setState } from "../actions";
import { drawGreatWick } from "./drawWick";
import { wenna } from "./memory";
import { byWick } from "./wickKills";
import { cappedWicks, isUp, liveWicks, spawnWick, wickCap } from "./wicks";

const THOUSAND = "w_thousand";
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

/**
 * Great Wick: she plants the pole and a giant Wick rises out of a pool of wax, swings one great arm across the level's
 * reach, then melts into one to four new Wicks.
 */
export function castGreatWick(level: number): void {
  wenna.ultLevel = level;
  setState("greatWick");
  const face = hero.face;
  const x = hero.x + face * 14;
  const y = surfaceBelow(x, hero.y - 1);
  const reach = withCharms("area", Math.min(SCREEN, ULT_REACH[level - 1]));
  const power = ULT_LEVELS[level - 1].power;
  let t = 0;
  let swung = false;
  game.fx.push(createFloorRing(x, y, 18, [WAX[0], WAX[1], WAX[2], WAX[3], PAL.wick[4]], 0.6, 0.3));
  game.fx.push({
    update(dt) {
      t += dt;
      if (!swung && t >= GREAT_WICK.swing) {
        swung = true;
        byWick(() => {
          for (const e of inReach(x, face, reach, level)) smite(e, x, power, true);
        });
        splash(x + face * 20, y, reach);
        shake(0.35, 5);
        hitStop(0.08);
        sfx.boom();
      }
      if (t >= GREAT_WICK.swing + GREAT_WICK.melt) {
        meltInto(x, y, GREAT_WICK.wicks[level - 1], GREAT_WICK.wickLife);
        return false;
      }
      return true;
    },
    draw() {
      const rise = Math.max(0, Math.min(1, (t - GREAT_WICK.windup) / GREAT_WICK.rise));
      const swing = Math.max(0, Math.min(1, (t - GREAT_WICK.swing + 0.12) / 0.16));
      const melt = Math.max(0, (t - GREAT_WICK.swing - 0.1) / (GREAT_WICK.melt - 0.1));
      if (t < GREAT_WICK.windup) {
        place();
        glow(x, y - 2, 10 + t * 30, PAL.wick[3], 0.3);
        return;
      }
      drawGreatWick(x, y, rise, swing, Math.min(1, melt), face);
    },
  });
}

/** one candle of Thousand Candles, rising out of the floor and flaring */
function candleAt(x: number, y: number, delay: number): void {
  let t = -delay;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < 0.7;
    },
    draw() {
      if (t < 0) return;
      place();
      const rise = Math.min(1, t * 8);
      const fade = Math.min(1, (0.7 - t) * 4);
      const h = Math.round(6 * rise);
      for (let i = 0; i < h; i++) px(Math.round(x), y - i, i === 0 ? WAX[1] : WAX[2], fade);
      px(Math.round(x), y - h - 1, PAL.wick[4], fade);
      px(Math.round(x), y - h - 2, PAL.wick[5], fade * 0.8);
      glow(x, y - h - 1, 5, PAL.wick[4], 0.35 * fade);
    },
  });
}

/**
 * Thousand Candles: a field of candles rises across the reach and every foe in it takes the level's power, then every
 * Wick she has flares for a share of it. With its levels her Wicks stand as Great Wicks a while, the candles knock foes
 * up and leave Wicks behind; Night of Lamps fills the whole stage and strikes every foe three times.
 */
export function castThousandCandles(level: number): void {
  const v = skillValues(THOUSAND);
  wenna.ultLevel = level;
  setState("thousand");
  const x = hero.x;
  const night = !!v.night;
  const reach = night ? SCREEN : withCharms("area", Math.min(SCREEN, ULT_REACH[level - 1]));
  const hit = ULT_LEVELS[level - 1].power * (v.power ?? 1);
  const x0 = Math.max(4, x - reach);
  const x1 = Math.min(W - 4, x + reach);
  for (let cx = x0; cx <= x1; cx += 7) {
    if (level < 3 && !night && (cx - x) * hero.face < -12) continue;
    candleAt(cx, surfaceBelow(cx, hero.y - 1), Math.abs(cx - x) / 600);
  }
  let t = 0;
  let struck = false;
  game.fx.push({
    update(dt) {
      t += dt;
      if (struck || t < 0.25) return t < 0.25;
      struck = true;
      const foes = night ? game.enemies.filter((e) => e.hp > 0) : inReach(x, hero.face, reach, level);
      for (let i = 0; i < (night ? 3 : 1); i++) for (const e of foes) smite(e, x, hit, !!v.knock || i === 0);
      for (const w of liveWicks()) {
        if (!isUp(w)) continue;
        if (v.great) w.great = withCharms("duration", v.great);
        byWick(() => {
          for (const e of game.enemies) {
            const [cx, cy] = enemyCenter(e);
            if (e.hp > 0 && Math.hypot(cx - w.x, cy - w.y) < 40)
              dealDamage(e, progress.stats.ap * hit * (v.flare ?? 0.5), { fromX: w.x, source: "ultimate" });
          }
        });
        lights.add(w.x, w.y - 12, 40, PAL.wick[4], 0.9, 0.3);
      }
      if (v.leave) meltInto(x, hero.y, Math.round(v.leave), GREAT_WICK.wickLife);
      lights.add(x, hero.y - 20, 120, PAL.wick[3], 0.45, 0.4);
      shake(0.4, 5);
      hitStop(0.08);
      sfx.boom();
      return false;
    },
    draw() {},
  });
}

/** the cast pose holds a moment, then she is free while the Great Wick swings */
export function runGreatWick(): void {
  const h = hero;
  h.vx = 0;
  if (h.st >= GREAT_WICK.hold) setState(h.ground ? "idle" : "fall");
}
