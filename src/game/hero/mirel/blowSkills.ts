import { ENEMIES } from "../../../constants/enemies";
import { SHOULDER_Y, STAFF_BLOWS } from "../../../constants/mirel/string";
import type { Enemy } from "../../../types/enemy";
import type { StaffBlow } from "../../../types/mirel";
import { dealDamage } from "../../damage";
import { launchEnemy } from "../../enemies/airborne";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, markFoe } from "../../enemies/skillStatus";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { mirel, mirelHost } from "./memory";
import { gainSand } from "./sand";
import type { StaffStrike } from "./strike";
import { isStill } from "./strike";
import { ringMidnight, ringTollAt } from "./tollRings";

const TOLL_SAND = 3;
/** seconds of blows Undone remembers */
const LANDED_KEEP = 2;

/** Backswing: this blow is the first after a Rewind, inside its window */
const backswingOpen = (): boolean => {
  const v = skillValues("m_backswing");
  return !!v.power && mirel.sinceRewind <= (v.window ?? 0);
};

/** pixels the blow's shape grows: Great Toll widens Toll's ring */
export const blowGrow = (blow: StaffBlow): number =>
  blow === "toll" ? withCharms("area", skillValues("m_toll").ring ?? 0) : 0;

/** the blow's power on top of its own: Great Toll for Toll, Backswing for the first blow after a Rewind */
export function blowScale(blow: StaffBlow): number {
  let scale = 1;
  if (blow === "toll") scale += skillValues("m_toll").power ?? 0;
  if (backswingOpen()) scale += skillValues("m_backswing").power ?? 0;
  return scale;
}

/** a sure crit: Backswing's blow once it crits */
export const blowSure = (): boolean => backswingOpen() && !!skillValues("m_backswing").crit;

/** Great Toll breaks guards */
export const blowHeavy = (blow: StaffBlow): boolean => blow === "toll" && !!skillValues("m_toll").guard;

/** her skills' share more on one blow or echo landing on this foe: Still Point on a still foe, Patience on echoes */
export function blowSkillScale(e: Enemy, s: StaffStrike): number {
  if (!isStill(e)) return 1;
  let scale = 1 + (skillValues("m_stillpoint").power ?? 0);
  if (s.echo) scale += skillValues("m_patience").echo ?? 0;
  return scale;
}

/** a still foe struck by a blow this frame: Still Point's echo lands at once */
let stillStruck = false;

/** Still Point's payoff on a still foe: Sand back and a mark; Frozen Instant stores the hit twice */
function stillPoint(e: Enemy, s: StaffStrike, stored: number): void {
  const v = skillValues("m_stillpoint");
  if (!v.power || !isStill(e)) return;
  if (!s.echo) stillStruck = true;
  if (v.sand) gainSand(v.sand);
  if (v.mark) markFoe(e, "m_stillpoint", withCharms("duration", v.markTime ?? 2), v.mark);
  if (v.twice && stored > 0) e.stopStore += stored;
}

/** Wither: blows (and with its level, echoes) add Age */
function wither(e: Enemy, s: StaffStrike): void {
  const v = skillValues("m_wither");
  if (!v.damage || (s.echo && !v.echo)) return;
  addStacks(e, "m_wither", {
    stacks: v.stacks,
    max: v.max,
    damage: progress.stats.ad * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  });
  if (v.slow) e.chill = Math.max(e.chill, 0.5);
}

/** Long Echo: an echo pulls the foe it hits toward where the blow struck */
function pull(e: Enemy, s: StaffStrike): void {
  const px = skillValues("m_echo").pull;
  if (!s.echo || !px || ENEMIES[e.type].rank !== "minion") return;
  const [cx] = enemyCenter(e);
  const toward = s.at.x + s.at.face * 20 - cx;
  e.x += Math.sign(toward) * Math.min(Math.abs(toward), px);
}

/** Backswing on the foe it lands on: a heal, a stagger, and Undone's replay of the rewound blows */
function backswing(e: Enemy, s: StaffStrike): void {
  if (s.echo || !backswingOpen()) return;
  const v = skillValues("m_backswing");
  if (v.heal) hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * v.heal);
  if (v.stagger) e.stagger = Math.max(e.stagger, v.stagger);
  if (v.undone && mirelHost.replay > 0) {
    const replay = mirelHost.replay;
    mirelHost.replay = 0;
    dealDamage(e, replay, { fromX: hero.x, kx: hero.face * 60, heavy: true, melee: true });
  }
}

/** her skills' answer to a blow or echo that landed, with the HP it took and the damage it stored on a stopped foe */
export function afterStaffHit(e: Enemy, s: StaffStrike, dealt: number, stored: number): void {
  stillPoint(e, s, stored);
  wither(e, s);
  pull(e, s);
  backswing(e, s);
  if (s.blow === "toll" && !s.echo && skillValues("m_toll").launch && ENEMIES[e.type].launchable) launchEnemy(e, -150);
  if (!s.echo && dealt > 0) {
    const now = game.t;
    mirelHost.landed = [...mirelHost.landed.filter((l) => now - l.t < LANDED_KEEP), { damage: dealt, t: now }];
  }
}

/** a still foe was struck by the blow just dealt, and Still Point makes its echo land at once */
export function takeInstantEcho(): boolean {
  const instant = stillStruck && !!skillValues("m_stillpoint").instant;
  stillStruck = false;
  return instant;
}

/** after the blow struck, with how many foes it landed on: Toll's Sand, its ring at the field and Midnight, and
 *  Backswing used up */
export function onBlowStruck(s: StaffStrike, foes: readonly Enemy[]): void {
  if (backswingOpen() && foes.length) mirel.sinceRewind = 9;
  if (s.blow !== "toll") return;
  const toll = skillValues("m_toll");
  if (foes.length) {
    gainSand(TOLL_SAND + (toll.sand ?? 0) * foes.length);
    emitSkillEvent({ type: "toll", foes });
  }
  const field = mirel.field;
  const ahead = STAFF_BLOWS.toll.shape.kind === "ring" ? STAFF_BLOWS.toll.shape.ahead : 0;
  // the ring's middle lands on the field's centre
  if (toll.field && field) ringTollAt(s, { x: field.x - s.at.face * ahead, y: field.y + SHOULDER_Y, face: s.at.face });
  if (toll.midnight) ringMidnight(s);
}
