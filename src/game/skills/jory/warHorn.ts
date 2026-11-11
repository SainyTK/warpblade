import { PAL, SPARKS } from "../../../constants/palette";
import { blendScreen, fleck, glow, hairline, line, place, px, toScreenX, toScreenY } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { ease } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { jory } from "../../hero/jory/memory";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";

const ID = "j_horn";
/** where the bearer stands, behind him past the drummers' file, how fast it keeps up, and seconds it takes to show and
 *  to fade */
const BEARER = { dx: -36, dy: -1, follow: 7, show: 0.25, fade: 0.45 } as const;
/** the herald stands ahead of him, clear of the drummers that march behind */
const HERALD = { dx: 20, dy: 0 } as const;
/** the cone: its half height at the mouth, how much it widens per px, how hard it pushes, and its knockdown */
const CONE = { mouth: 8, spread: 0.36, knock: 60, launch: -120 } as const;
/** the horn's mouth, from the bearer's feet */
const MOUTH = { dx: 9, dy: -10 } as const;
/** the blast's arcs: seconds to run the cone, gaps between the arcs in px, and seconds the horn stays raised after */
const BLAST = { life: 0.34, arcs: [0, 6, 12], raised: 0.35 } as const;
/** the herald sounds on every this many beats */
const HERALD_EVERY = 8;

interface Bearer {
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** blasts still to sound, one on each beat; the herald never runs out */
  blasts: number;
  herald: boolean;
  /** seconds since it came, since its last blast, and since it sounded its last */
  t: number;
  blown: number;
  gone: number;
  /** the way its last blast went */
  face: number;
}

interface HornMemory {
  cd: number;
  bearer: Bearer | null;
  herald: Bearer | null;
}

const memoryOf = (m: SkillMemory): HornMemory => m as unknown as HornMemory;

function bearer(at: { dx: number; dy: number }, blasts: number, herald: boolean): Bearer {
  return {
    x: hero.x + at.dx * hero.face,
    y: hero.y + at.dy,
    dx: at.dx,
    dy: at.dy,
    blasts,
    herald,
    t: 0,
    blown: BLAST.raised,
    gone: 0,
    face: hero.face,
  };
}

/** a foe's middle lies in the cone that opens from (x, y) toward dir and reaches this far */
function inCone(ex: number, ey: number, x: number, y: number, dir: number, reach: number): boolean {
  const along = (ex - x) * dir;
  if (along < -4 || along > reach) return false;
  return Math.abs(ey - y) <= CONE.mouth + Math.max(0, along) * CONE.spread;
}

/** cobalt arcs that spread along the cone from the horn's mouth, with dust lifted off the floor under them */
function createHornBlast(x: number, y: number, floor: number, dir: number, reach: number): Effect {
  let t = 0;
  const seed = Math.floor(x * 3 + reach);
  lights.add(x, y, reach * 0.6, PAL.beat[3], 0.45, BLAST.life);
  lights.add(x, y, 10, WHITE, 0.5, 0.08);
  return {
    update(dt) {
      t += dt;
      if (rng.chance(0.6)) {
        const r = reach * ease.outCubic(Math.min(1, t / BLAST.life));
        particles.spawn(
          PK.DUST,
          x + dir * r,
          floor - 1,
          dir * rng.range(10, 40),
          -rng.range(10, 26),
          rng.range(0.2, 0.4),
        );
      }
      return t < BLAST.life;
    },
    draw() {
      place();
      const u = t / BLAST.life;
      const front = reach * ease.outCubic(u);
      const k = 1 - u;
      for (let a = 0; a < BLAST.arcs.length; a++) {
        const r = front - BLAST.arcs[a];
        if (r < 3) continue;
        const half = CONE.mouth + r * CONE.spread;
        const n = Math.ceil(half * 2 * 2.2);
        const c = PAL.beat[5 - a];
        for (let i = 0; i <= n; i++) {
          const v = i / n;
          if (a > 0 && grain(i + a * 17, seed) < 0.25 * a) continue;
          const dy = (v * 2 - 1) * half;
          // each arc bows out at its middle, like a curved sound line
          const bow = (1 - (v * 2 - 1) ** 2) * Math.min(6, r * 0.15);
          if (a === 0) px(x + dir * (r + bow) - 0.5, y + dy - 0.5, c, k * 1.4);
          else fleck(x + dir * (r + bow), y + dy, c, k * (1.6 - a * 0.4));
        }
      }
      if (t < 0.08) glow(x, y, 7, WHITE, 0.6);
      glow(x + dir * front * 0.6, y, front * 0.4 + 4, PAL.beat[3], 0.14 * k);
    },
  };
}

/** one blast of the horn toward dir: every foe in the cone is struck, and minions are knocked down with its level */
function blast(b: Bearer, dir: number): void {
  const v = skillValues(ID);
  const mx = b.x + dir * MOUTH.dx;
  const my = b.y + MOUTH.dy;
  // the cone reaches its length ahead of him, however far behind him the horn sounds from
  const reach = withCharms("area", v.cone) + Math.max(0, (hero.x - mx) * dir);
  b.face = dir;
  b.blown = 0;
  game.fx.push(createHornBlast(mx, my, b.y, dir, reach));
  shake(0.08, 1);
  for (const e of foesOnScreen()) {
    const [ex, ey] = enemyCenter(e);
    if (!inCone(ex, ey, mx, my, dir, reach)) continue;
    dealDamage(e, progress.stats.ad * v.power, {
      fromX: mx,
      kx: dir * CONE.knock,
      launch: v.knock && e.rank === "minion" ? CONE.launch : undefined,
      source: ID,
    });
    if (v.slow && e.hp > 0) e.chill = Math.max(e.chill, v.slow);
    game.fx.push(createImpact(ex, ey, dir, false, SPARKS.beat));
  }
}

/** it keeps beside him, and is gone once faded */
function follow(b: Bearer, dt: number): boolean {
  b.t += dt;
  b.blown += dt;
  if (b.blasts <= 0 && b.blown > BLAST.raised) b.gone += dt;
  b.x += (hero.x + b.dx * hero.face - b.x) * Math.min(1, dt * BEARER.follow);
  if (hero.ground) b.y += (hero.y + b.dy - b.y) * Math.min(1, dt * BEARER.follow);
  if (b.blown > BLAST.raised) b.face = hero.face;
  return b.gone < BEARER.fade;
}

/**
 * A hooded horn-bearer about 11 px tall standing on (x, y), facing right, one string per row from the top: a navy
 * outline (o), a cobalt robe (b) lit on the side it faces (l) and a white eye (w) under the hood. The last row is the
 * hem, which trails off in wisps.
 */
const BEARER_ART = [
  "..ooo..",
  ".obbbo.",
  ".obblwo",
  "..obbo.",
  ".obbblo",
  ".obbblo",
  ".obbbl.",
  ".obbblo",
  "obbbblo",
  "obbbbbo",
  "o.b.b.o",
] as const;
/** the ramp step behind each letter of the art */
const BEARER_SHADE: Readonly<Record<string, number>> = { o: 1, b: 3, l: 4 };
/** the horn: its length in px, how deep its curl dips, how wide its bell opens, and how it tilts held and raised */
const HORN = { length: 6, curl: 1.8, bell: 1.8, low: 0.7, high: -0.35 } as const;

/** one art pixel laid over what is behind it, so the figure shows the scenery through it */
function ghost(x: number, y: number, c: number, a: number): void {
  blendScreen(toScreenX(x), toScreenY(y), c, a);
}

/** the curled horn from its mouthpiece at (mx, my), tilted by angle and facing f: a tube that dips and a bell */
function drawHorn(mx: number, my: number, angle: number, f: number, show: number): readonly [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const at = (u: number): readonly [number, number] => {
    const lx = u * HORN.length;
    const ly = Math.sin(u * Math.PI) * HORN.curl;
    return [mx + f * (lx * cos - ly * sin), my + lx * sin + ly * cos];
  };
  let [x0, y0] = at(0);
  for (let i = 1; i <= 8; i++) {
    const [x1, y1] = at(i / 8);
    line(x0 - 0.5, y0 - 0.5, x1 - 0.5, y1 - 0.5, i > 5 ? PAL.beat[5] : PAL.beat[4], show);
    x0 = x1;
    y0 = y1;
  }
  // the bell opens across the end of the tube
  const nx = -sin * f;
  const ny = cos;
  hairline(x0 - nx * HORN.bell, y0 - ny * HORN.bell, x0 + nx * HORN.bell, y0 + ny * HORN.bell, PAL.beat[5], show);
  return [x0, y0];
}

/**
 * A ghostly horn-bearer: the translucent hooded figure, and a curled horn it holds low at its side and raises to its
 * mouth to sound, the bell toward where it blows, in a soft glow
 */
function drawBearer(b: Bearer): void {
  const show = Math.min(1, b.t / BEARER.show) * (1 - b.gone / BEARER.fade);
  if (show <= 0) return;
  const a = show * 0.85;
  const f = b.face;
  const x = Math.round(b.x);
  const y = Math.round(b.y);
  const top = y - BEARER_ART.length;
  glow(x, y - 6, 11, PAL.beat[3], 0.25 * show);
  for (let r = 0; r < BEARER_ART.length; r++) {
    const row = BEARER_ART[r];
    // the hem trails behind as it drifts, and thins out
    const hem = r === BEARER_ART.length - 1;
    const sway = hem && Math.sin(b.t * 5) > 0 ? -f : 0;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === ".") continue;
      const cx = x + (i - 3) * f + sway;
      if (ch === "w") ghost(cx, top + r, WHITE, Math.min(1, a * 1.3));
      else ghost(cx, top + r, PAL.beat[BEARER_SHADE[ch]], hem ? a * 0.5 : ch === "o" ? a : a * 0.85);
    }
  }
  // the horn: raised to the mouth while it sounds, otherwise held low at its side
  const raised = b.blown < BLAST.raised ? 1 - (b.blown / BLAST.raised) ** 3 : 0;
  const mx = x + f * (raised > 0 ? 2.5 : 1.5) + 0.5;
  const my = raised > 0 ? top + 3.5 : y - 6.5;
  const [bx, by] = drawHorn(mx, my, raised > 0 ? HORN.high : HORN.low, f, show);
  if (raised > 0) glow(bx, by, 6, PAL.beat[4], 0.5 * raised * show);
}

/**
 * War Horn: a kill may call a ghostly horn-bearer beside him who sounds blasts of sound in a cone ahead of where he
 * faces, one on each following beat; with its levels more often, harder, wider, more blasts and knocking minions down.
 * Herald keeps a herald beside him all run who sounds both ways on every 8th beat.
 */
export const warHornSkill: SkillBehavior = {
  create: () => ({ cd: 0, bearer: null, herald: null }),
  update(memory, { evolved }, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    if ((evolved || skillValues(ID).herald) && !m.herald) m.herald = bearer(HERALD, Number.POSITIVE_INFINITY, true);
    if (m.bearer && !follow(m.bearer, dt)) m.bearer = null;
    if (m.herald) follow(m.herald, dt);
  },
  draw(memory) {
    place();
    const m = memoryOf(memory);
    if (m.herald) drawBearer(m.herald);
    if (m.bearer) drawBearer(m.bearer);
  },
  on: {
    kill(memory) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      const blasts = Math.round(withCharms("amount", v.blasts));
      if (m.bearer && m.bearer.gone <= 0) m.bearer.blasts = Math.max(m.bearer.blasts, blasts);
      else m.bearer = bearer(BEARER, blasts, false);
    },
    tick(memory) {
      const m = memoryOf(memory);
      const b = m.bearer;
      if (b && b.blasts > 0 && b.t >= BEARER.show) {
        blast(b, hero.face);
        b.blasts--;
      }
      if (m.herald && jory.beats % HERALD_EVERY === 0) {
        blast(m.herald, hero.face);
        blast(m.herald, -hero.face);
      }
    },
  },
};
