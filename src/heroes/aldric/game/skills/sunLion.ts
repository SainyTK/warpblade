import { GROUND } from "../../../../constants/stage";
import { disc, glow, hairline, line, place, polygon } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter, walks } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";
import { LION } from "../../constants/skillNumbers";
import { createDelayedRing } from "../effects/delayedRing";

const ID = "al_lion";
/** Pride of Dawn's lions never leave */
const FOREVER = 600;

interface Lion {
  x: number;
  y: number;
  face: number;
  left: number;
  next: number;
  /** the pounce under way: its foe, where it left from and seconds into it; null when walking */
  leap: { foe: Enemy; fromX: number; t: number } | null;
}

const lionsOf = (m: SkillMemory): Lion[] => m.lions as Lion[];

/** a lion lands its pounce: the blow, the knock-down and the mark */
function land(l: Lion, foe: Enemy): void {
  const v = skillValues(ID);
  if (foe.hp <= 0) return;
  dealDamage(foe, progress.stats.ad * v.power, {
    source: ID,
    fromX: l.x - l.face * 6,
    kx: l.face * 50,
    ky: -30,
    stun: v.stun ?? 0,
  });
  game.fx.push(createImpact(...enemyCenter(foe), l.face, false, DAWN_SPARKS));
  if (v.mark) markFoe(foe, ID, withBuild("duration", LION.mark), v.mark);
}

/** a lion walks after Aldric, and pounces on the nearest foe in reach when it is ready */
function step(l: Lion, dt: number, i: number): void {
  l.left -= dt;
  l.next -= dt;
  if (l.leap) {
    l.leap.t += dt;
    const u = Math.min(1, l.leap.t / LION.leap);
    const tx = enemyCenter(l.leap.foe)[0] - l.face * 6;
    l.x = l.leap.fromX + (tx - l.leap.fromX) * u;
    l.y = GROUND - Math.sin(u * Math.PI) * 16;
    if (u < 1) return;
    land(l, l.leap.foe);
    l.leap = null;
    l.y = GROUND;
    return;
  }
  const foe = nearestFoe(l.x, l.y - 6);
  if (foe && Math.abs(foe.x - l.x) < LION.reach && walks(foe) && l.next <= 0) {
    l.next = withBuild("cooldown", skillValues(ID).every);
    l.face = Math.sign(foe.x - l.x) || l.face;
    l.leap = { foe, fromX: l.x, t: 0 };
    return;
  }
  const tx = foe && Math.abs(foe.x - l.x) < LION.reach * 1.5 ? foe.x : hero.x - hero.face * (14 + i * 12);
  const d = tx - l.x;
  if (Math.abs(d) > 3) {
    l.face = Math.sign(d);
    l.x += l.face * Math.min(Math.abs(d), LION.speed * dt);
  }
}

/** a new lion beside Aldric, roaring as it comes from its fourth level */
function summon(m: SkillMemory, life: number): void {
  const v = skillValues(ID);
  const l: Lion = { x: hero.x - hero.face * 10, y: GROUND, face: hero.face, left: life, next: 0.3, leap: null };
  lionsOf(m).push(l);
  if (v.roar)
    game.fx.push(
      createDelayedRing(l.x, GROUND, withBuild("area", LION.roar), 0, progress.stats.ad * v.roar, {
        kx: 50,
        ky: -30,
        source: ID,
      }),
    );
}

/** a lion of light, its outline dark gold: a long body lit along its back, a mane round its head, four striding
 *  legs and a tail with a bright tuft */
function drawLion(l: Lion): void {
  const k = Math.min(1, l.left / 0.5);
  const { x, y, face: f } = l;
  const run = l.leap ? 1 : Math.sin(game.t * 9 + x);
  for (const [lx, sw] of [
    [-6, run],
    [-3.5, -run],
    [3, -run],
    [5.5, run],
  ] as const) {
    line(x + lx * f, y - 5, x + (lx + sw * 1.8) * f, y, DAWN_RAMP[1], k);
    line(x + lx * f, y - 5, x + (lx + sw * 1.6) * f, y - 0.5, DAWN_RAMP[3], k);
  }
  const body: [number, number][] = [
    [x - 9 * f, y - 8],
    [x + 5 * f, y - 10],
    [x + 6 * f, y - 4],
    [x - 9 * f, y - 4],
  ];
  polygon(body, DAWN_RAMP[3], k);
  hairline(x - 8 * f, y - 8.5, x + 4 * f, y - 10, DAWN_RAMP[5], k);
  hairline(x - 9 * f, y - 7, x - 13 * f, y - 11, DAWN_RAMP[3], k);
  disc(x - 13 * f, y - 11.5, 1.2, DAWN_RAMP[5], k);
  disc(x + 7 * f, y - 10, 4.6, DAWN_RAMP[1], k);
  disc(x + 7 * f, y - 10, 4, DAWN_RAMP[2], k);
  disc(x + 8.5 * f, y - 10, 2.4, DAWN_RAMP[4], k);
  hairline(x + 9 * f, y - 11, x + 9.5 * f, y - 11, WHITE, k);
  glow(x, y - 7, 14, DAWN_RAMP[4], 0.35 * k);
}

/** Sun Lion: a foe falling may call a lion of light that walks with Aldric and pounces on foes; as Pride of Dawn three
 *  are always with him */
export const sunLion: SkillBehavior = {
  create: () => ({ cd: 0, lions: [] }),
  update(m, { evolved }, dt) {
    const v = skillValues(ID);
    m.cd = Math.max(0, (m.cd as number) - dt);
    if (evolved) while (lionsOf(m).length < v.most) summon(m, FOREVER);
    lionsOf(m).forEach((l, i) => step(l, dt, i));
    m.lions = lionsOf(m).filter((l) => l.left > 0);
  },
  draw(m) {
    place();
    for (const l of lionsOf(m)) drawLion(l);
  },
  on: {
    kill(m, _ev, { evolved }) {
      const v = skillValues(ID);
      if (evolved || (m.cd as number) > 0 || !rng.chance(v.chance)) return;
      m.cd = withBuild("cooldown", v.cooldown);
      const life = withBuild("duration", v.life);
      const lions = lionsOf(m);
      if (lions.length < withBuild("amount", v.most)) summon(m, life);
      else lions.sort((a, b) => a.left - b.left)[0].left = life;
    },
  },
};
