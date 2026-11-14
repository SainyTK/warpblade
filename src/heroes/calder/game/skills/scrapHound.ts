import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { hero, progress, rng } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { hex } from "../../../../utils/color";
import { PHOSPHOR } from "../../constants/colors";
import { blastAt } from "../blastFoe";

const ID = "ca_hound";
/** a hound's run speed, how close it bites from, how far it strays from Calder when no foe is near, its blast reach */
const HOUND = { speed: 150, bite: 10, heel: 18, boom: 30, gravity: 600, reach: 14, leap: -260 } as const;
/** Scrap Pack's hounds never wind down */
const FOREVER = 600;
const BODY = hex("#686f74");
const DARK = hex("#2a2f33");
const BRASS = hex("#c99a3c");

interface Hound {
  x: number;
  y: number;
  vy: number;
  face: number;
  left: number;
  next: number;
  step: number;
}
interface HoundMemory {
  cd: number;
  hounds: Hound[];
}
const memoryOf = (m: SkillMemory): HoundMemory => m as unknown as HoundMemory;

function call(m: HoundMemory): void {
  const v = skillValues(ID);
  m.hounds.push({
    x: hero.x,
    y: hero.y,
    vy: 0,
    face: hero.face,
    left: withCharms("duration", v.life),
    next: 0,
    step: 0,
  });
  while (m.hounds.length > withCharms("amount", v.most)) m.hounds.shift();
}

/** a hound runs at the nearest foe on the floor and bites it; with none near it trots back to Calder's heel */
function run(h: Hound, dt: number): void {
  const v = skillValues(ID);
  const foe = nearestFoe(h.x, h.y - 6);
  const [tx, ty] = foe ? enemyCenter(foe) : [hero.x - hero.face * HOUND.heel, h.y];
  const gap = tx - h.x;
  h.face = Math.sign(gap) || h.face;
  if (Math.abs(gap) > (foe ? HOUND.bite : 2)) {
    h.x += h.face * Math.min(Math.abs(gap), HOUND.speed * dt);
    h.step += dt;
  }
  const floor = surfaceBelow(h.x, h.y - 2);
  h.vy += HOUND.gravity * dt;
  h.y = Math.min(floor, h.y + h.vy * dt);
  if (h.y >= floor) h.vy = 0;
  // from level 6 a hound under a flying foe leaps at it
  const high = h.y - HOUND.reach - ty;
  if (foe && v.leap && h.y >= floor && high > 0 && Math.abs(gap) <= HOUND.bite) h.vy = HOUND.leap;
  h.next -= dt;
  if (!foe || Math.abs(gap) > HOUND.bite || Math.abs(h.y - 4 - ty) > HOUND.reach || h.next > 0) return;
  h.next = v.every;
  dealDamage(foe, progress.stats.ad * v.power, { fromX: h.x, kx: h.face * 20, ky: -10, source: ID });
  if (v.stagger && foe.rank === "minion") staggerFoe(foe, v.stagger);
}

/** Scrap Hound: a kill may call a clockwork hound that runs down and bites the nearest foe; it blows up as it winds
 *  down from level 7, and Scrap Pack keeps three at Calder's side */
export const scrapHound: SkillBehavior = {
  create: () => ({ cd: 0, hounds: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    const v = skillValues(ID);
    if (state.evolved && m.hounds.length < v.most) {
      call(m);
      m.hounds[m.hounds.length - 1].left = FOREVER;
    }
    for (const h of m.hounds) {
      h.left -= dt;
      run(h, dt);
      if (h.left <= 0 && v.boom)
        blastAt(null, h.x, h.y - 4, {
          damage: 0,
          splash: progress.stats.ad * v.boom,
          reach: HOUND.boom,
          kx: 80,
          hot: false,
          big: true,
          source: ID,
        });
    }
    m.hounds = m.hounds.filter((h) => h.left > 0);
  },
  draw(memory) {
    place();
    for (const h of memoryOf(memory).hounds) {
      const f = h.face;
      const leg = Math.floor(h.step * 12) % 2;
      for (let i = -3; i <= 3; i += 0.5) {
        fleck(h.x + f * i, h.y - 4, BODY);
        fleck(h.x + f * i, h.y - 3.5, DARK);
      }
      for (const lx of [-2.5, 2.5]) fleck(h.x + f * (lx + (leg ? 0.5 : -0.5)), h.y - 1, DARK);
      for (const lx of [-2.5, 2.5]) fleck(h.x + f * lx, h.y - 2, DARK);
      fleck(h.x + f * 3.5, h.y - 5, BODY);
      fleck(h.x + f * 4, h.y - 5, BODY);
      fleck(h.x + f * 4, h.y - 5.5, PHOSPHOR[5]);
      fleck(h.x - f * 3.5, h.y - 5, BRASS);
    }
  },
  on: {
    kill(memory) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (skillEvolved(ID) || m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = v.cooldown;
      call(m);
    },
  },
};
