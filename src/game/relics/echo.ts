import { PAL } from "../../constants/palette";
import { RELICS } from "../../constants/relics";
import { ECHO_FLIGHT } from "../../constants/relics/echo";
import { fleck, glow, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import type { Color, Ramp } from "../../types/color";
import type { Enemy } from "../../types/enemy";
import { buildStats, relicStats } from "../../utils/build";
import { WHITE } from "../../utils/color";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { enemyBox } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { game, hero, lights, progress } from "../state";
import { boxHit } from "../world";

/** one crescent in flight */
interface Crescent {
  x: number;
  y: number;
  /** the side it set out to: 1 right, -1 left */
  dir: number;
  /** its pace now, in art pixels per second along x; Phantom Arc's turns negative on the way back */
  vx: number;
  /** the pace it set out at */
  v0: number;
  t: number;
  r: number;
  /** Phantom Arc's crescents fly home to the hero */
  phantom: boolean;
  /** foes struck on this pass; a crescent coming back may strike them again */
  struck: WeakSet<Enemy>;
  turned: boolean;
}

interface EchoMemory extends RelicMemory {
  /** the hero's landed hits already counted */
  seen: number;
  /** hits toward the next volley */
  count: number;
  /** volleys owed, sent one every `ECHO_FLIGHT.gap` */
  owed: number;
  gap: number;
  crescents: Crescent[];
}

/** hits per volley: the raw table's `amount`, which Multitude does not change */
const hitsPerVolley = (level: number, evolved: boolean): number => {
  const def = RELICS.echo;
  return (evolved ? def.evolution.stats : def.levels[clamp(level, 1, def.levels.length) - 1]).amount ?? 1;
};

function volley(m: EchoMemory, evolved: boolean, size: number, speed: number): void {
  const n = 1 + buildStats(progress.build).amount;
  const dirs = evolved ? [hero.face, -hero.face] : [hero.face];
  const v0 = ECHO_FLIGHT.speed * speed * (evolved ? 2 : 1);
  for (const dir of dirs)
    for (let i = 0; i < n; i++)
      m.crescents.push({
        x: hero.x + dir * 6,
        y: hero.y - ECHO_FLIGHT.height + (i - (n - 1) / 2) * ECHO_FLIGHT.stack,
        dir,
        vx: dir * v0,
        v0,
        t: 0,
        r: ECHO_FLIGHT.radius * size,
        phantom: evolved,
        struck: new WeakSet(),
        turned: false,
      });
  lights.add(hero.x + hero.face * 10, hero.y - ECHO_FLIGHT.height, 26, skin.ramp[4], 0.35, 0.15);
  sfx.evade();
}

/** a crescent's reach: a little narrower than it is tall */
const reach = (c: Crescent): [number, number, number, number] => [
  c.x - c.r * 0.7,
  c.y - c.r * 1.1,
  c.x + c.r * 0.7,
  c.y + c.r * 1.1,
];

function fly(c: Crescent, damage: number, dt: number): void {
  c.t += dt;
  if (c.phantom) {
    // flung out fast, slowed to a stop at the halfway mark, then drawn home to the hero
    const half = ECHO_FLIGHT.phantomLife / 2;
    if (c.t < half) c.vx = c.dir * c.v0 * (1 - c.t / half);
    else {
      if (!c.turned) {
        c.turned = true;
        c.struck = new WeakSet();
      }
      const home = hero.x - c.x;
      c.vx = clamp(c.vx + Math.sign(home) * c.v0 * 4 * dt, -c.v0, c.v0);
      c.y += (hero.y - ECHO_FLIGHT.height - c.y) * Math.min(1, dt * 4);
    }
  }
  c.x += c.vx * dt;
  const box = reach(c);
  for (const e of game.enemies) {
    if (e.hp <= 0 || c.struck.has(e) || !boxHit(box, enemyBox(e))) continue;
    c.struck.add(e);
    const going = Math.sign(c.vx) || c.dir;
    dealDamage(e, damage, { source: "echo", fromX: c.x - going * 10, kx: going * 60 });
  }
}

/** done when its flight is over, or when Phantom Arc's crescent is back at the hero */
const spent = (c: Crescent): boolean =>
  c.phantom ? c.t > ECHO_FLIGHT.phantomLife * 1.4 || (c.turned && Math.abs(hero.x - c.x) < 8) : c.t > ECHO_FLIGHT.life;

/** Echo Blade: every few hits of the hero's own send a crescent ahead; Phantom Arc sends them both ways and back */
export const echo: RelicBehavior = {
  create: (): EchoMemory => ({ seen: progress.build.heroHits, count: 0, owed: 0, gap: 0, crescents: [] }),
  update(memory, level, evolved, dt) {
    const m = memory as EchoMemory;
    const s = relicStats("echo", level, evolved, buildStats(progress.build));
    const every = hitsPerVolley(level, evolved);
    m.count += progress.build.heroHits - m.seen;
    m.seen = progress.build.heroHits;
    while (m.count >= every) {
      m.count -= every;
      m.owed = Math.min(ECHO_FLIGHT.queue, m.owed + 1);
    }
    m.gap -= dt;
    if (m.owed > 0 && m.gap <= 0 && hero.state !== "dead") {
      m.owed--;
      m.gap = ECHO_FLIGHT.gap;
      volley(m, evolved, s.area, s.speed);
    }
    for (const c of m.crescents) fly(c, s.damage, dt);
    m.crescents = m.crescents.filter((c) => !spent(c));
  },
  draw(memory) {
    const m = memory as EchoMemory;
    place();
    for (const c of m.crescents) drawCrescent(c);
  },
};

/** the arc of a crescent: thick in the middle, tapering to points, its outer rim pale */
function arc(c: Crescent, x: number, R: Ramp, rim: Color, a: number): void {
  const going = Math.sign(c.vx) || c.dir;
  const span = 1.15;
  const w = Math.max(1.5, c.r * 0.38);
  const cx = x - going * c.r * 0.55;
  const step = 0.5 / c.r;
  for (let g = -span; g <= span; g += step) {
    const thick = w * Math.cos((g / span) * (Math.PI / 2)) ** 0.8;
    const ca = Math.cos(g) * going;
    const sa = Math.sin(g) * 1.2;
    for (let d = 0; d < thick; d += 0.5) {
      const q = d / Math.max(thick, 1);
      const col = d < 0.5 ? rim : R[clamp(Math.round(5 - q * 3), 1, R.length - 1)];
      fleck(cx + ca * (c.r - d), c.y + sa * (c.r - d), col, a);
    }
  }
}

/** a ghost of the hero's own slash in their weapon colour; Phantom Arc's carry a shadow edge and a longer wake */
function drawCrescent(c: Crescent): void {
  const R = skin.ramp;
  const going = Math.sign(c.vx) || c.dir;
  const fade = c.phantom ? 1 : 1 - clamp((c.t - ECHO_FLIGHT.life * 0.7) / (ECHO_FLIGHT.life * 0.3));
  const wake = c.phantom ? [10, 22] : [6, 12];
  wake.forEach((back, i) => arc(c, c.x - going * back, c.phantom ? PAL.shadow : R, R[3], fade * (0.45 - i * 0.12)));
  if (c.phantom) arc(c, c.x - going * 2, PAL.shadow, PAL.shadow[5], fade * 0.9);
  arc(c, c.x, R, WHITE, fade * 0.9);
  px(c.x + going * c.r * 0.4, c.y, WHITE, fade);
  glow(c.x, c.y, c.r * 2, R[4], 0.3 * fade);
}
