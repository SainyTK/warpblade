import { W } from "../../../../constants/stage";
import { glow, line, place, polygon, px } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { hex } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { enemyCenter } from "../../../enemies/enemy";
import { kindOf } from "../../../enemies/kinds";
import { skillValues } from "../../../skills/query";
import { nearestFoe } from "../../../skills/targets";
import { game, hero, lights, particles, progress, rng } from "../../../state";
import { shake } from "../../../world";
import { looseBolt } from "../loose";
import { sable } from "../memory";
import { setSnare } from "./snare";
import type { SableSpell } from "./spell";

const STRAW = hex("#d8b860");
const STRAW_DARK = hex("#9a7a3a");
const HOOD = hex("#3c5226");
const HOOD_LIGHT = hex("#5e7a3a");
const SMOKE = hex("#8a9a8a");
/** pixels a second a lured foe is drawn toward the decoy */
const LURE_PACE = 26;
/** Bait Pit's snares sit this far either side of the decoy */
const PIT = [-22, -12, 12, 22] as const;

/** a lured foe walks toward the decoy and faces it; big foes and foes in the air are not fooled */
export function lure(x: number, reach: number, dt: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.air || e.rank !== "minion" || kindOf(e.type).flies) continue;
    const dx = x - e.x;
    if (Math.abs(dx) > reach || Math.abs(dx) < 6) continue;
    e.face = Math.sign(dx);
    e.x += Math.sign(dx) * LURE_PACE * dt;
  }
}

/** smoke left by the burst: foes standing in it are slowed */
function smoke(x: number, y: number, radius: number, seconds: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      for (const e of game.enemies)
        if (e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) < radius) e.chill = Math.max(e.chill, 0.3);
      if (rng.chance(0.4))
        particles.spawn(PK.SMOKE, x + rng.range(-radius, radius), y - rng.range(2, 14), 0, -6, rng.range(0.6, 1), {
          size: rng.range(1.2, 2),
        });
      return t < seconds;
    },
    drawBack() {
      place();
      glow(x, y - 6, radius * 0.6, SMOKE, 0.12 * Math.min(1, seconds - t));
    },
    draw() {},
  });
}

/** one straw decoy in her spare hood: it lures foes, shoots back, stuns foes that reach it, then bursts */
function setDecoy(x: number, y: number): void {
  const v = skillValues("s_decoy");
  const stunned = new Set<Enemy>();
  let t = 0;
  let shot = v.every;
  if (v.snares) for (const dx of PIT) setSnare(x + dx, y, false);
  game.fx.push({
    update(dt) {
      t += dt;
      lure(x, v.lure, dt);
      if (v.stun)
        for (const e of game.enemies)
          if (e.hp > 0 && !stunned.has(e) && Math.abs(enemyCenter(e)[0] - x) < 8) {
            stunned.add(e);
            e.stun = Math.max(e.stun, v.stun);
          }
      shot -= dt;
      if (v.shoot && shot <= 0) {
        shot = v.every;
        const e = nearestFoe(x, y - 14);
        if (e) {
          const [cx, cy] = enemyCenter(e);
          looseBolt({
            x,
            y: y - 14,
            angle: Math.atan2(cy - y + 14, cx - x),
            share: 1,
            power: v.shoot,
            prime: null,
            plain: true,
            source: "s_decoy",
          });
        }
      }
      if (t < v.life) return true;
      for (const e of game.enemies) {
        const [cx, cy] = enemyCenter(e);
        if (e.hp > 0 && Math.hypot(cx - x, (cy - y) * 1.4) < v.radius)
          dealDamage(e, progress.stats.ap * v.burst, {
            fromX: x,
            kx: Math.sign(cx - x) * 120,
            ky: -60,
            heavy: true,
            source: "s_decoy",
          });
      }
      for (let i = 0; i < 14; i++)
        particles.spawn(PK.SPARK, x, y - 10, rng.range(-90, 90), -rng.range(30, 120), rng.range(0.3, 0.6), {
          col: STRAW,
        });
      lights.add(x, y - 10, v.radius, STRAW, 0.9, 0.25);
      shake(0.15, 2);
      sfx.boom();
      if (v.smoke) smoke(x, y, v.radius, v.smoke);
      return false;
    },
    draw() {
      place();
      const sway = Math.sin(t * 3) * 0.6;
      line(x, y, x, y - 18, STRAW_DARK);
      line(x - 6, y - 13, x + 6, y - 13, STRAW_DARK);
      polygon(
        [
          [x - 5 + sway, y - 4],
          [x + 5 + sway, y - 4],
          [x + 3, y - 15],
          [x - 3, y - 15],
        ],
        HOOD,
      );
      polygon(
        [
          [x - 3, y - 15],
          [x + 3, y - 15],
          [x + 1, y - 21],
          [x - 2, y - 20],
        ],
        HOOD_LIGHT,
      );
      for (const s of [-6, -5, 5, 6]) px(x + s, y - 13 + Math.abs(s) - 5, STRAW);
      px(x, y - 17, STRAW);
      // it flickers before it bursts
      if (v.life - t < 0.6 && Math.floor(t * 12) % 2 === 0) glow(x, y - 10, 8, STRAW, 0.4);
    },
  });
}

/** Straw Decoy on her I rotation */
export const DECOY_SPELL: SableSpell = {
  label: "DECOY",
  tint: "#d8c890",
  mp: () => skillValues("s_decoy").mp,
  cooldown: () => skillValues("s_decoy").cooldown,
  left: () => sable.decoyCd,
  spend: (s) => {
    sable.decoyCd = s;
  },
  room: () => true,
  release() {
    const n = skillValues("s_decoy").decoys;
    for (let i = 0; i < n; i++) setDecoy(clamp(hero.x + hero.face * (16 + i * 28), 10, W - 10), hero.y);
    sfx.tone(200, 140, 0.08, "square", 0.05);
  },
};
