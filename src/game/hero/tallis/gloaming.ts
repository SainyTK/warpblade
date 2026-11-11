import { PAL } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { SMOKE_KNOT } from "../../../constants/tallis/abilities";
import { GLOAMING } from "../../../constants/tallis/special";
import { ULT_LEVELS, ULT_REACH } from "../../../constants/ultimate";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { skillValues, withCharms } from "../../skills/query";
import { foesOnScreen } from "../../skills/targets";
import { game, hero, lights, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { setState } from "../actions";
import { skin } from "../skin";
import { countBackKill } from "./blowSkills";
import { raiseCloud } from "./clouds";
import { createDark } from "./dark";
import { gloamMax } from "./gloam";
import { createGloamShade, createGloamThread } from "./gloamLook";
import { tallis, tallisHost } from "./memory";
import { raiseVeil } from "./veil";

/** the whole-screen level reaches this far, which covers the stage from anywhere */
const SCREEN = 400;
/** the slashes of a visit take no longer than this all together, however many foes there are */
const ALL_VISITS = 1.4;

/** the reach of the level, both sides of him */
const reachOf = (level: number): number => withCharms("area", Math.min(SCREEN, ULT_REACH[Math.max(0, level - 1)]));

/** foes within the level's reach, nearest first */
function inReach(level: number): Enemy[] {
  const r = reachOf(level);
  return foesOnScreen()
    .filter((e) => Math.abs(enemyCenter(e)[0] - hero.x) <= r)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

function begin(level: number, targets: Enemy[], state: "gloaming" | "eclipse"): void {
  tallis.ultLevel = level;
  tallis.ultAt = { x: hero.x, y: hero.y };
  tallisHost.targets = targets;
  tallisHost.visited = 0;
  if (tallisHost.dark) tallisHost.dark.fading = true;
  tallisHost.dark = createDark(targets);
  setState(state);
}

/** Gloaming: 1, 2, 4 or 8 foes by level, nearest first */
export function castGloaming(level: number): void {
  begin(level, inReach(level).slice(0, GLOAMING.counts[level - 1]), "gloaming");
}

/** Eclipse: every foe in the level's reach, or on the whole stage once evolved */
export function castEclipse(level: number): void {
  const v = skillValues("t_eclipse");
  begin(level, v.stage ? foesOnScreen() : inReach(level), "eclipse");
}

/** seconds on each foe: Gloaming's beat, shortened so a crowd never takes too long */
const visitTime = (): number => Math.min(GLOAMING.each, ALL_VISITS / Math.max(1, tallisHost.targets.length));

/** he appears behind a foe, on its back side, facing it */
function appearBehind(e: Enemy): void {
  const [, cy] = enemyCenter(e);
  hero.x = clamp(e.x - e.face * GLOAMING.behind, 8, W - 8);
  hero.y = kindOf(e.type).flies ? cy + 14 : e.y;
  hero.face = e.face;
  hero.vx = 0;
  hero.vy = 0;
}

/** one visit: the crescent slash and the stabs from behind */
function stab(e: Enemy): void {
  const from = { x: hero.x, y: hero.y, face: hero.face };
  appearBehind(e);
  if (tallisHost.visited > 1) game.fx.push(createGloamShade(from.x, from.y, from.face));
  game.fx.push(createGloamThread(from.x, from.y - 14, hero.x, hero.y - 14));
  const eclipse = hero.state === "eclipse";
  const v = eclipse ? skillValues("t_eclipse") : {};
  const power = ULT_LEVELS[tallis.ultLevel - 1].power * GLOAMING.share * (progress.stats.ad + progress.stats.ap);
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      cx: 8,
      cy: -16,
      R: 13,
      sy: 0.8,
      rot: 0.3,
      a0: -1.8,
      a1: 1.1,
      W: 3,
      ramp: skin.ramp,
    }),
  );
  const hits = v.hits || 1;
  for (let i = 0; i < hits && e.hp > 0; i++) {
    const before = e.hp;
    dealDamage(e, power * (v.power ?? 1), {
      fromX: e.x - e.face * 6,
      source: "ultimate",
      melee: true,
      stun: v.stun && e.rank === "minion" ? v.stun : undefined,
    });
    if (before > 0 && e.hp <= 0) countBackKill();
  }
  hitStop(0.04);
  sfx.hit(true, 1.2);
  const [cx, cy] = enemyCenter(e);
  lights.add(cx, cy, 26, PAL.gloam[4], 0.7, 0.15);
}

/** back where he crouched, as the light comes back; Eclipse raises the Veil and may refill Gloam */
function finish(): void {
  const at = tallis.ultAt ?? { x: hero.x, y: hero.y };
  hero.x = at.x;
  hero.y = at.y;
  hero.vx = 0;
  hero.vy = 0;
  if (tallisHost.dark) tallisHost.dark.fading = true;
  shake(0.25, GLOAMING.shake);
  if (hero.state === "eclipse") {
    const v = skillValues("t_eclipse");
    if (v.refill) tallis.gloam = gloamMax();
    if (v.smoke)
      raiseCloud(hero.x, hero.y, SMOKE_KNOT.width, SMOKE_KNOT.height, withCharms("duration", SMOKE_KNOT.life));
    if (!tallis.veil) raiseVeil("free");
  }
  tallisHost.targets = [];
  setState(hero.ground ? "idle" : "fall");
}

/**
 * The special or ultimate under way: the crouch while the scene darkens, then a visit behind each foe in turn with a
 * slash, then back where he crouched. Nothing touches him from the release to the return.
 */
export function runGloaming(): void {
  const h = hero;
  h.vx = 0;
  h.vy = 0;
  if (h.st < GLOAMING.windup) return;
  const targets = tallisHost.targets;
  const each = visitTime();
  const due = Math.min(targets.length, Math.floor((h.st - GLOAMING.windup) / each) + 1);
  while (tallisHost.visited < due) {
    const e = targets[tallisHost.visited];
    tallisHost.visited++;
    if (e.hp > 0) stab(e);
  }
  // with no foe in reach he slashes the air where he crouched, and the MP is spent all the same
  if (!targets.length && !h.hitDone) {
    h.hitDone = true;
    game.fx.push(
      createSlash(h.x, h.y, h.face, {
        cx: 8,
        cy: -16,
        R: 13,
        sy: 0.8,
        rot: 0.3,
        a0: -1.8,
        a1: 1.1,
        W: 3,
        ramp: skin.ramp,
      }),
    );
    sfx.swing(0.8);
  }
  if (h.st >= GLOAMING.windup + Math.max(1, targets.length) * each + 0.06) finish();
}

/** a fresh run or a fall mid-special: the dark lifts */
export function liftDark(): void {
  if (tallisHost.dark) tallisHost.dark.fading = true;
}

/** the dark has lifted: let it go */
export function forgetDark(): void {
  if (tallisHost.dark?.fading && tallisHost.dark.k <= 0) tallisHost.dark = null;
}
