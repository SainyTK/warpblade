import { fleck, glow, place, polygon } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";

const ID = "br_splinter";
const MARK_TIME = 2;
const SPLINTER = { speed: 230, reach: 4, sight: 110, orbit: 14, spin: 3, rest: 0.18, size: 1.6, pierce: 30 } as const;

interface Splinter {
  x: number;
  y: number;
  left: number;
  wait: number;
  target: Enemy | null;
  angle: number;
  halo: boolean;
}

const splintersOf = (m: SkillMemory): Splinter[] => m.splinters as Splinter[];

function restAt(s: Splinter, t: number): [number, number] {
  const a = s.angle + t * SPLINTER.spin;
  return [hero.x + Math.cos(a) * SPLINTER.orbit, hero.y - 24 + Math.sin(a) * SPLINTER.orbit * 0.5];
}

function chip(m: SkillMemory, halo: boolean): void {
  splintersOf(m).push({
    x: hero.x + hero.face * 10,
    y: hero.y - 20,
    left: skillValues(ID).strikes,
    wait: 0,
    target: null,
    angle: rng.range(0, TAU),
    halo,
  });
}

function call(m: SkillMemory, chance: number, count: number): void {
  const v = skillValues(ID);
  if (!rng.chance(chance)) {
    return;
  }
  for (let i = 0; i < count; i++) {
    if (splintersOf(m).filter((s) => !s.halo).length >= withBuild("amount", v.count)) {
      return;
    }
    chip(m, false);
  }
}

function strike(s: Splinter, foe: Enemy): void {
  const v = skillValues(ID);
  const dir = Math.sign(foe.x - s.x) || 1;
  dealDamage(foe, progress.stats.ad * v.power, { fromX: s.x, kx: dir * 30, source: ID });
  game.fx.push(createImpact(s.x, s.y, dir, false, CRIMSON_SPARKS));
  if (v.mark) {
    markFoe(foe, ID, withBuild("duration", MARK_TIME), v.mark);
  }
  if (!v.pierce) {
    return;
  }
  const next = nearestFoe(foe.x, foe.y - 10, [foe]);
  if (next && Math.abs(next.x - foe.x) < SPLINTER.pierce) {
    dealDamage(next, progress.stats.ad * v.power, { fromX: s.x, kx: dir * 30, source: ID });
  }
}

function fly(m: SkillMemory, s: Splinter, dt: number): void {
  s.wait = Math.max(0, s.wait - dt);
  if (s.target && s.target.hp <= 0) {
    s.target = null;
  }
  if (!s.target && s.wait <= 0) {
    const foe = nearestFoe(hero.x, hero.y - 16);
    if (foe && Math.abs(foe.x - hero.x) < SPLINTER.sight) {
      s.target = foe;
    }
  }
  const [tx, ty] = s.target ? enemyCenter(s.target) : restAt(s, m.t as number);
  const d = Math.hypot(tx - s.x, ty - s.y) || 1;
  const step = Math.min(d, SPLINTER.speed * dt);
  s.x += ((tx - s.x) / d) * step;
  s.y += ((ty - s.y) / d) * step;
  if (!s.target || d > SPLINTER.reach) {
    return;
  }
  strike(s, s.target);
  s.target = null;
  s.wait = SPLINTER.rest;
  if (!s.halo) {
    s.left--;
  }
}

export const heartSplinter: SkillBehavior = {
  create: () => ({ splinters: [], cd: 0, t: 0 }),
  update(m, _state, dt) {
    m.cd = Math.max(0, (m.cd as number) - dt);
    m.t = (m.t as number) + dt;
    const splinters = splintersOf(m);
    if (skillEvolved(ID)) {
      while (splinters.filter((s) => s.halo).length < skillValues(ID).count) {
        chip(m, true);
      }
    }
    for (const s of splinters) {
      fly(m, s, dt);
    }
    m.splinters = splinters.filter((s) => s.halo || s.left > 0);
  },
  draw(m) {
    place();
    for (const s of splintersOf(m)) {
      const r = SPLINTER.size;
      polygon(
        [
          [s.x, s.y - r * 1.4],
          [s.x + r, s.y],
          [s.x, s.y + r * 1.4],
          [s.x - r, s.y],
        ],
        CRIMSON[3],
      );
      fleck(s.x - 0.5, s.y - 0.5, WHITE);
      glow(s.x, s.y, 7, CRIMSON[4], 0.35);
    }
  },
  on: {
    warp(m) {
      const v = skillValues(ID);
      call(m, v.chance, v.warp);
    },
    blow(m, e) {
      const v = skillValues(ID);
      if (!e.finisher || !e.melee || !v.finisher || (m.cd as number) > 0) {
        return;
      }
      m.cd = v.cooldown;
      call(m, v.finisher, 1);
    },
  },
};
