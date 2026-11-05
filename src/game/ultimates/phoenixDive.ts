import { EMBER } from "../../constants/characters/ysra/look";
import { W } from "../../constants/stage";
import { ULT_LEVELS, ULT_LOCK } from "../../constants/ultimate";
import { ellipseRing, glow, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { ease, lerp } from "../../utils/math";
import { dealDamage } from "../damage";
import { emberBurst } from "../effects/emberBurst";
import { createImpact } from "../effects/impact";
import { drawPhoenix } from "../effects/phoenix";
import { ignite } from "../enemies/burn";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, lights, particles, progress, rng } from "../state";
import { hitStop, shake } from "../world";
import { densestSpot } from "./densestSpot";
import { ultTargets } from "./targets";

const CRASHES = [1, 1, 2, 3] as const;
/** seconds for each beat of a crash: rise out of sight, hang there while the mark burns, dive, stand in the blast */
const RISE = 0.2;
const HOVER = 0.14;
const DIVE = 0.14;
const STAND = 0.12;
/** out of sight above the top of the screen */
const SKY = -60;
/** the dive comes in at a slant from this far back */
const SLANT = 56;
const RADIUS = 46;
/** fire floods the floor this far either side of a crash */
const FLOOD = 50;
const FLOOD_STEP = 10;
const MAX_FLOOR_FIRES = 24;
const BURN = 3;

type Beat = "rise" | "hover" | "dive" | "stand";
const LENGTH: Record<Beat, number> = { rise: RISE, hover: HOVER, dive: DIVE, stand: STAND };

/**
 * Phoenix Dive: she leaps out of sight, then falls as a phoenix of forge-fire on the spot where the most foes stand,
 * bursting there and flooding the floor with fire. Level 3 crashes twice, level 4 three times, each onto the thickest
 * crowd left. She is held in the ultimate and cannot be hurt until she stands on the floor after the last crash, which
 * runs past the usual lock at levels 3 and 4: she is out of sight the whole time and the player sees only the phoenix.
 */
export function castPhoenixDive(level: number): void {
  const crashes = CRASHES[level - 1];
  const damage = (ULT_LEVELS[level - 1].power * progress.stats.ad) / crashes;
  let beat: Beat = "rise";
  let t = 0;
  let crash = 0;
  let from = { x: hero.x, y: hero.y };
  let spot = densestSpot(ultTargets(level));
  let side = Math.sign(spot.x - hero.x) || hero.face;
  let done = false;

  const diveFrom = () => ({ x: spot.x - side * SLANT, y: SKY });
  const land = () => {
    crash++;
    hero.x = spot.x;
    hero.y = spot.floor;
    hero.face = side;
    emberBurst(spot.x, spot.floor - 6, RADIUS * 0.8, spot.floor);
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      const [cx, cy] = enemyCenter(e);
      if (Math.hypot(cx - spot.x, (cy - spot.floor + 10) * 1.4) > RADIUS) continue;
      const dir = Math.sign(cx - spot.x) || side;
      dealDamage(e, damage, { fromX: spot.x, kx: dir * 150, launch: -190, heavy: true });
      ignite(e, BURN);
      game.fx.push(createImpact(cx, cy, dir, true));
    }
    for (let x = spot.x - FLOOD; x <= spot.x + FLOOD; x += FLOOD_STEP)
      if (x > 4 && x < W - 4 && game.blazes.length < MAX_FLOOR_FIRES)
        game.blazes.push({ x, y: spot.floor, life: 2.6, max: 2.6, tick: 0 });
    // the wings spread along the floor both ways
    for (let i = 0; i < 40; i++) {
      const dir = rng.chance(0.5) ? 1 : -1;
      particles.spawn(
        PK.FIRE,
        spot.x,
        spot.floor - rng.range(1, 8),
        dir * rng.range(80, 260),
        -rng.range(5, 40),
        rng.range(0.3, 0.6),
        {
          col: 0,
          size: rng.range(1.6, 3),
          flag: rng.chance(0.3) ? PF.SMOKES : 0,
        },
      );
    }
    hitStop(0.07);
    shake(0.35, 5);
    sfx.boom();
    sfx.hit(true, 0.7);
  };
  const next = (b: Beat) => {
    beat = b;
    t = 0;
  };
  const effect: Effect = {
    update(dt) {
      if (done) return false;
      // she was taken out of the ultimate (the run ended): let her fall from where she is
      if (hero.state !== "ultimate") return false;
      t += dt;
      hero.st = Math.min(hero.st, ULT_LOCK - 0.02);
      hero.inv = Math.max(hero.inv, 0.1);
      hero.vx = 0;
      hero.vy = 0;
      const u = Math.min(1, t / LENGTH[beat]);
      if (beat === "rise") {
        hero.ground = false;
        hero.x = from.x;
        hero.y = lerp(from.y, SKY, u * u);
        for (let i = 0; i < 4; i++)
          particles.spawn(
            PK.FIRE,
            hero.x + rng.range(-3, 3),
            hero.y - rng.range(0, 20),
            rng.range(-15, 15),
            rng.range(20, 60),
            rng.range(0.2, 0.4),
            {
              col: 0,
              size: rng.range(1.4, 2.6),
            },
          );
        if (u >= 1) next("hover");
      } else if (beat === "hover") {
        hero.y = SKY - 40;
        if (u >= 1) {
          next("dive");
          sfx.lunge();
        }
      } else if (beat === "dive") {
        const s = diveFrom();
        hero.x = spot.x;
        hero.y = SKY - 40;
        const k = ease.outQuad(u);
        const px = lerp(s.x, spot.x, k);
        const py = lerp(s.y, spot.floor - 8, k);
        for (let i = 0; i < 5; i++)
          particles.spawn(
            PK.FIRE,
            px + rng.range(-4, 4),
            py + rng.range(-4, 4),
            rng.range(-30, 30),
            -rng.range(10, 50),
            rng.range(0.2, 0.45),
            {
              col: 0,
              size: rng.range(1.6, 3),
              flag: rng.chance(0.2) ? PF.SMOKES : 0,
            },
          );
        lights.add(px, py, 50, EMBER[4], 0.6, 0.05);
        if (u >= 1) {
          land();
          hero.ground = true;
          next("stand");
        }
      } else if (beat === "stand") {
        hero.x = spot.x;
        hero.y = spot.floor;
        hero.ground = true;
        if (u >= 1) {
          if (crash >= crashes) {
            done = true;
            hero.st = ULT_LOCK;
            hero.inv = Math.max(hero.inv, 0.3);
            return false;
          }
          from = { x: hero.x, y: hero.y };
          spot = densestSpot(ultTargets(level));
          side = Math.sign(spot.x - hero.x) || hero.face;
          next("rise");
        }
      }
      return true;
    },
    drawBack() {
      // the mark on the floor where she will crash, burning brighter until she does
      if (beat !== "hover" && beat !== "dive") return;
      place();
      const k = beat === "hover" ? t / HOVER : 1;
      const r = RADIUS * (0.5 + 0.5 * k);
      ellipseRing(spot.x, spot.floor, r, r * 0.22, EMBER[3], 0.5 + 0.5 * k);
      ellipseRing(spot.x, spot.floor, r * 0.6, r * 0.13, EMBER[4], k);
      glow(spot.x, spot.floor - 2, r, EMBER[3], 0.25 + 0.25 * k);
    },
    draw() {
      if (beat !== "dive") return;
      const s = diveFrom();
      const k = ease.outQuad(Math.min(1, t / DIVE));
      const ex = spot.x;
      const ey = spot.floor - 8;
      const len = Math.hypot(ex - s.x, ey - s.y) || 1;
      drawPhoenix(lerp(s.x, ex, k), lerp(s.y, ey, k), (ex - s.x) / len, (ey - s.y) / len, 0.4 + 0.6 * k, game.t * 30);
    },
  };
  game.fx.push(effect);
}
