import { PAL } from "../../../../constants/palette";
import { W } from "../../../../constants/stage";
import { hairline, place } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import type { Wick } from "../../../../types/wenna";
import { dealDamage } from "../../../damage";
import { drawFlameBolt } from "../../../effects/wenna/flameBolt";
import { ignite } from "../../../enemies/burn";
import { enemyCenter } from "../../../enemies/enemy";
import { skillValues } from "../../../skills/query";
import { nearestFoe, touches } from "../../../skills/targets";
import { game, lights, particles, progress, rng } from "../../../state";
import { quarries } from "../quarry";
import { isUp, liveWicks } from "../wicks";

const ID = "w_lampVolley";
/** a bolt's speed, how long it flies, Starfire's turn rate and burst */
const BOLT = { speed: 210, life: 1.2, turn: 7, burst: 24 } as const;

/** one flame bolt a Wick spits */
function spit(w: Wick, target: Enemy, delay: number): void {
  const v = skillValues(ID);
  const [tx, ty] = enemyCenter(target);
  let x = w.x;
  let y = w.y - 12;
  let a = Math.atan2(ty - y, tx - x);
  let t = -delay;
  let pierce = v.pierce ?? 0;
  const struck = new Set<Enemy>();
  const trail: [number, number][] = [];
  const hit = (e: Enemy): void => {
    struck.add(e);
    dealDamage(e, progress.stats.ap * v.power, { fromX: x, kx: Math.cos(a) * 40, source: "abilities" });
    if (v.ignite) ignite(e, 2);
  };
  const burst = (): void => {
    for (const e of game.enemies) {
      const [cx, cy] = enemyCenter(e);
      if (e.hp > 0 && !struck.has(e) && Math.hypot(cx - x, cy - y) < BOLT.burst)
        dealDamage(e, progress.stats.ap * v.power * 0.5, { fromX: x, source: "abilities" });
    }
    lights.add(x, y, BOLT.burst, PAL.wick[4], 0.7, 0.2);
    for (let i = 0; i < 8; i++)
      particles.spawn(PK.SPARK, x, y, rng.range(-80, 80), rng.range(-80, 40), 0.3, { col: PAL.wick[4] });
  };
  game.fx.push({
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (v.starfire) {
        const foe = target.hp > 0 && !struck.has(target) ? target : nearestFoe(x, y, [...struck]);
        if (foe) {
          const [fx, fy] = enemyCenter(foe);
          const want = Math.atan2(fy - y, fx - x);
          let d = want - a;
          while (d > Math.PI) d -= Math.PI * 2;
          while (d < -Math.PI) d += Math.PI * 2;
          a += Math.max(-BOLT.turn * dt, Math.min(BOLT.turn * dt, d));
        }
      }
      x += Math.cos(a) * BOLT.speed * dt;
      y += Math.sin(a) * BOLT.speed * dt;
      trail.unshift([x, y]);
      trail.length = Math.min(trail.length, 5);
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !touches(e, x, y, 2)) continue;
        hit(e);
        if (v.starfire) burst();
        if (pierce-- <= 0) return false;
      }
      return t < BOLT.life && x > -8 && x < W + 8 && y > -8 && y < 190;
    },
    draw() {
      if (t < 0) return;
      place();
      for (let i = 1; i < trail.length; i++)
        hairline(trail[i - 1][0], trail[i - 1][1], trail[i][0], trail[i][1], PAL.wick[3 - Math.min(2, i)], 1 - i / 5);
      drawFlameBolt(x, y, Math.cos(a) * BOLT.speed, Math.sin(a) * BOLT.speed);
    },
  });
}

/** Lamp Volley: every Wick spits a flame bolt (two with its level) at her Quarry or the foe nearest it */
export function castLampVolley(): void {
  const v = skillValues(ID);
  const bolts = Math.max(1, Math.round(v.bolts ?? 1));
  const marked = quarries()[0] ?? null;
  for (const w of liveWicks()) {
    if (!isUp(w)) continue;
    const target = marked ?? nearestFoe(w.x, w.y - 8);
    if (!target) continue;
    w.lunge = 0.15;
    for (let i = 0; i < bolts; i++) spit(w, target, i * 0.12);
  }
  sfx.cast();
}
