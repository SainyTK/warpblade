import { PAL, WAX } from "../../../../constants/palette";
import { disc, glow, line, place, px } from "../../../../engine/frame";
import { sfx } from "../../../../services/audio";
import { PK } from "../../../../types/particle";
import type { BiteZone } from "../../../../types/wenna";
import { dealDamage } from "../../../damage";
import { ignite } from "../../../enemies/burn";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { kindOf } from "../../../enemies/kinds";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../../state";
import { shake, surfaceBelow } from "../../../world";
import { lure } from "../../sable/spells/decoy";
import { wennaHost } from "../memory";
import { cappedWicks, spawnWick, wickCap } from "../wicks";

const ID = "w_effigy";
/** it stands this far ahead of her, this tall, and a held foe stops this far from its middle */
const EFFIGY = { ahead: 40, height: 26, hold: 7 } as const;

/** foes the effigy holds stop at its edge, like at a Wick */
function holdAt(x: number, y: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.air || kindOf(e.type).flies || Math.abs(e.y - y) > 4) continue;
    const b = enemyBox(e);
    const off = (b[0] + b[2]) / 2 - e.x;
    const gap = (b[2] - b[0]) / 2 + EFFIGY.hold;
    const d = e.x + off - x;
    if (Math.abs(d) < gap) e.x = x + (Math.sign(d) || 1) * gap - off;
  }
}

/** the effigy bursts: a ring of flame, and with Martyr's Light two Wicks rise out of the wax */
function burst(x: number, y: number): void {
  const v = skillValues(ID);
  const radius = withCharms("area", v.radius ?? 40);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, (cy - (y - 12)) * 1.3) > radius) continue;
    dealDamage(e, progress.stats.ap * v.power, {
      fromX: x,
      kx: Math.sign(cx - x) * 110,
      ky: -60,
      heavy: true,
      source: ID,
    });
    if (v.ignite) ignite(e, 3);
  }
  for (let i = 0; i < 16; i++)
    particles.spawn(PK.SPARK, x, y - 14, rng.range(-110, 110), -rng.range(20, 140), rng.range(0.3, 0.6), {
      col: rng.chance(0.5) ? PAL.wick[4] : WAX[3],
    });
  lights.add(x, y - 12, radius * 1.4, PAL.wick[4], 0.9, 0.3);
  shake(0.15, 2.5);
  sfx.boom();
  if (!v.martyr) return;
  for (const dx of [-10, 10]) if (cappedWicks().length < wickCap()) spawnWick(x + dx, y, "skill");
}

/** Wax Effigy: a tall wax figure ahead lures ground minions, then bursts */
export function castEffigy(): void {
  const v = skillValues(ID);
  const x = hero.x + hero.face * EFFIGY.ahead;
  const y = surfaceBelow(x, hero.y - 2);
  const life = withCharms("duration", v.life ?? 4);
  const reach = withCharms("area", v.lure);
  const zone: BiteZone = { x, y, half: 30, rate: 1 + (v.bite ?? 0), left: life };
  if (zone.rate > 1) wennaHost.zones.push(zone);
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      lure(x, reach, dt);
      if (v.hold) holdAt(x, y);
      if (t < life) return true;
      burst(x, y);
      return false;
    },
    draw() {
      place();
      const rise = Math.min(1, t * 4);
      const top = y - EFFIGY.height * rise;
      const sway = Math.sin(t * 2.4) * 0.5;
      for (let yy = Math.round(top) + 4; yy <= y; yy++) {
        const k = (yy - top) / EFFIGY.height;
        const half = 2 + k * 2.2;
        line(x - half + sway * (1 - k), yy, x + half + sway * (1 - k), yy, k > 0.85 ? WAX[1] : WAX[2]);
        px(Math.round(x - half), yy, WAX[0]);
        px(Math.round(x + half), yy, WAX[0]);
      }
      // arms raised and a crown of three flames
      line(x - 3, top + 9, x - 7, top + 4, WAX[1]);
      line(x + 3, top + 9, x + 7, top + 4, WAX[1]);
      const flick = Math.floor(t * 10) % 3;
      for (const dx of [-3, 0, 3]) {
        const fy = top + (dx === 0 ? -1 : 1) - (flick === (dx + 3) / 3 ? 1 : 0);
        disc(x + dx + sway, fy, 1.4, PAL.wick[3], 1);
        px(Math.round(x + dx + sway), Math.round(fy), PAL.wick[5]);
      }
      const near = life - t < 0.6 && Math.floor(t * 12) % 2 === 0;
      glow(x, top + 2, near ? 16 : 10, PAL.wick[4], near ? 0.5 : 0.28);
    },
  });
}
