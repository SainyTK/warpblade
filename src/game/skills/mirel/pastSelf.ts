import { STAFF_CLIPS } from "../../../constants/clips/mirel/staff";
import { STAFF_BLOWS, STAFF_STRING } from "../../../constants/mirel/string";
import { PAL } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import { blit } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import type { StaffBlow } from "../../../types/mirel";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import type { SpriteImage } from "../../../types/sprite";
import { sampleKeys } from "../../../utils/sampleKeys";
import { ghostCanvas } from "../../hero/afterimages";
import { drawHero } from "../../hero/drawHero";
import { heroLook } from "../../hero/look";
import { leaveEchoes } from "../../hero/mirel/echo";
import { type StaffStrike, strikeShape } from "../../hero/mirel/strike";
import { game, hero, rng } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "m_pastself";
/** seconds between the ghost's blows, and how fast its taunt draws foes to it */
const GHOST = { every: 0.35, pull: 30, reach: 70, fade: 0.3 } as const;

interface Ghost {
  x: number;
  y: number;
  face: number;
  /** seconds since it appeared, and the blows it has struck */
  t: number;
  struck: number;
  /** blows it strikes in all, and its taunt */
  blows: number;
  taunt: number;
  /** the pose of each blow it strikes, drawn once */
  poses: Readonly<Record<StaffBlow, SpriteImage>>;
  current: StaffBlow;
}

interface GhostMemory {
  ghosts: Ghost[];
  cd: number;
}

const memoryOf = (m: SkillMemory): GhostMemory => m as unknown as GhostMemory;

/** her own pose at the hit frame of each blow, as ghost sprites */
function blowPoses(): Readonly<Record<StaffBlow, SpriteImage>> {
  const draw = (b: StaffBlow): SpriteImage => {
    drawHero(ghostCanvas, sampleKeys(STAFF_CLIPS[b].keys, STAFF_BLOWS[b].hit), heroLook(2));
    return ghostCanvas.snapshot();
  };
  return { tick: draw("tick"), tock: draw("tock"), toll: draw("toll"), pendant: draw("pendant") };
}

/** the ghost strikes the next blow of the string; Many Selves leaves its echoes too */
function strike(g: Ghost): void {
  const v = skillValues(ID);
  const blow = STAFF_STRING[g.struck % STAFF_STRING.length];
  g.current = blow;
  g.struck++;
  const struck = new Set<Enemy>();
  const s: StaffStrike = {
    blow,
    spec: STAFF_BLOWS[blow],
    at: { x: g.x, y: g.y, face: g.face },
    echo: false,
    grow: 0,
    scale: v.power,
    source: ID,
  };
  strikeShape(
    s,
    (e) => struck.has(e),
    (e) => struck.add(e),
  );
  if (v.many) leaveEchoes(s);
}

/** the taunt draws foes near the ghost toward it */
function taunt(g: Ghost, dt: number): void {
  if (g.t > g.taunt) return;
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.rank !== "minion" || Math.abs(e.x - g.x) > GHOST.reach) continue;
    e.x += Math.sign(g.x - e.x) * Math.min(Math.abs(g.x - e.x), GHOST.pull * dt);
  }
}

/**
 * Past Self: a Stopped Moment may leave a ghost where she parried, which strikes her string; levels raise the chance and the
 * ghost's power, let it draw foes in and strike twice. Many Selves leaves one with every Stopped Moment, and its blows echo.
 */
export const pastSelf: SkillBehavior = {
  create: () => ({ ghosts: [], cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
    m.ghosts = m.ghosts.filter((g) => {
      g.t += dt;
      taunt(g, dt);
      if (g.struck < g.blows && g.t >= GHOST.every * (g.struck + 1)) strike(g);
      return g.t < GHOST.every * (g.blows + 1) + GHOST.fade;
    });
  },
  drawBack(memory) {
    for (const g of memoryOf(memory).ghosts) {
      const end = GHOST.every * (g.blows + 1);
      const k = g.t < end ? Math.min(1, g.t * 6) : Math.max(0, 1 - (g.t - end) / GHOST.fade);
      blit(g.poses[g.current], g.x, g.y, g.face < 0, {
        alpha: 0.55 * k,
        tint: PAL.hour[4],
        tintAmount: 0.6,
        soft: true,
      });
      place();
      glow(g.x, g.y - 16, 14, PAL.hour[3], 0.2 * k);
    }
  },
  on: {
    rewind(memory, event, state) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (!state.evolved && (m.cd > 0 || !rng.chance(v.chance))) return;
      m.cd = withCharms("cooldown", v.cooldown);
      m.ghosts.push({
        x: event.from.x,
        y: event.from.y,
        face: hero.face,
        t: 0,
        struck: 0,
        blows: STAFF_STRING.length * Math.max(1, Math.round(v.replays)),
        taunt: withCharms("duration", v.taunt),
        poses: blowPoses(),
        current: "tick",
      });
    },
  },
};
