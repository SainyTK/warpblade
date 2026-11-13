import { ENEMIES } from "../../../constants/enemies";
import { STILLFIELD } from "../../../constants/mirel/field";
import { MIREL_JUMP_RISE } from "../../../constants/mirel/motion";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { StillfieldView } from "../../../types/mirel";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { staggerFoe } from "../../enemies/stagger";
import { feat } from "../../feat";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { surfaceBelow } from "../../world";
import { setState } from "../actions";
import { createFieldLook } from "./fieldLook";
import { mirel, mirelHost } from "./memory";
import { hasSand, spendSand } from "./sand";

const PACE = "m_pace";

/** a number for each field opened, so its look knows when it has closed */
let nextId = 1;

/** the field's radius: Steady Pace widens it */
export const fieldRadius = (): number => withCharms("area", STILLFIELD.radius + (skillValues(PACE).radius ?? 0));

/** Sand the press costs, and a second while it stands: Patience lowers both */
const costScale = (): number => 1 - (skillValues("m_patience").field ?? 0);

/** a foe's centre is inside a field */
export function insideField(e: Enemy, f: { x: number; y: number; radius: number }): boolean {
  const [cx, cy] = enemyCenter(e);
  return Math.hypot(cx - f.x, cy - f.y) <= f.radius;
}

/**
 * How high a field aimed up stands. Up is also her jump, so aiming from the floor lifts her first: within a jump of the
 * floor the field is measured from the floor she left, so it lands where she aimed it from; higher up, from her.
 */
function aboveHeight(): number {
  const h = hero;
  const floor = surfaceBelow(h.x, h.y - 1);
  const from = floor - h.y <= MIREL_JUMP_RISE + 2 ? floor : h.y;
  return from - STILLFIELD.above;
}

/** where a new field stands: ahead at chest height, above her with W held, on her with S held (Calm Eye: always on her) */
function placeField(radius: number): { x: number; y: number } {
  const h = hero;
  const chest = h.y - STILLFIELD.chest;
  if (skillValues(PACE).eye || isHeld("down")) return { x: h.x, y: chest };
  if (isHeld("up")) return { x: h.x, y: aboveHeight() };
  const x = clamp(h.x + h.face * STILLFIELD.ahead, radius * 0.5, W - radius * 0.5);
  return { x, y: chest };
}

/** the snap as a field closes: every foe inside takes ability power, is pushed out from its centre, minions stagger */
export function snapField(x: number, y: number, radius: number): number {
  let foes = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !insideField(e, { x, y, radius })) continue;
    foes++;
    const [cx] = enemyCenter(e);
    const dir = Math.sign(cx - x) || hero.face;
    const weight = ENEMIES[e.type].weight;
    e.x = clamp(e.x + dir * STILLFIELD.push * (1 - weight), 8, W - 8);
    staggerFoe(e, STILLFIELD.stagger);
    dealDamage(e, progress.stats.ap * STILLFIELD.snap, { fromX: x, kx: dir * 40, source: "abilities" });
  }
  return foes;
}

/** a field opens with its look, which holds its time field open while it stands */
function open(view: StillfieldView, held: boolean, life: number): void {
  game.fx.push(createFieldLook(view, held, life));
  emitSkillEvent({ type: "field", open: true, foes: 0, x: view.x, y: view.y, radius: view.radius });
}

/** a free field a skill opens (Sky Clock, Long Rewind): it costs nothing, stands `seconds` and snaps as it closes */
export function openFreeField(x: number, y: number, seconds: number, radius = fieldRadius()): void {
  open({ id: nextId++, x, y, radius, t: 0 }, false, seconds);
  sfx.chime(2);
}

/** Sand a field costs to open now */
export const fieldCost = (): number => STILLFIELD.open * costScale();

/** I: one field at a time, with a wait after the last one closed; seconds before the next can open */
export const fieldWait = (): number => (mirel.field ? STILLFIELD.cooldown : mirel.fieldCd);

/**
 * I with the Stillfield, paid in Sand: tapped, it stands a while and snaps shut; held, it stays while I is held. It opens
 * from almost anything she is doing, and only from standing does she stop to hold the staff out.
 */
export function castField(wide: boolean): boolean {
  const s = hero.state;
  if (s === "dead" || s === "hurt" || s === "charge" || s === "rewind") return false;
  spendSand(fieldCost());
  const radius = fieldRadius();
  const at = placeField(radius);
  const view: StillfieldView = { id: nextId++, ...at, radius, t: 0 };
  mirel.field = view;
  mirel.fieldLetGo = !wide;
  mirel.fieldLeast = wide ? STILLFIELD.least : STILLFIELD.tapped;
  mirel.fieldKills = 0;
  mirelHost.inside = [];
  open(view, true, STILLFIELD.most);
  if (hero.ground && (s === "idle" || s === "walk")) {
    hero.vx = 0;
    setState("stillCast");
  }
  sfx.chime(1);
  emitSkillEvent({ type: "cast", ability: "stillfield" });
  return true;
}

/** the held field closes: with its snap, unless she fell; the wait before the next starts */
export function closeField(snap: boolean): void {
  const f = mirel.field;
  if (!f) return;
  mirel.field = null;
  mirel.fieldCd = STILLFIELD.cooldown;
  const foes = snap ? snapField(f.x, f.y, f.radius) : 0;
  if (snap) sfx.hit(true, 1.4);
  if (mirel.fieldKills) feat({ kind: "fieldKills", kills: mirel.fieldKills });
  mirelHost.inside = [];
  emitSkillEvent({ type: "field", open: false, foes, x: f.x, y: f.y, radius: f.radius });
}

/** foes that fell inside the field since the last step count toward Hold the Hour */
function countFallen(f: StillfieldView): void {
  const fallen = mirelHost.inside.filter((e) => e.hp <= 0).length;
  if (fallen) mirel.fieldKills += fallen;
  mirelHost.inside = game.enemies.filter((e) => e.hp > 0 && insideField(e, f));
}

/** Steady Pace's field drifts after her, Calm Eye's sits on her */
function follow(f: StillfieldView, dt: number): StillfieldView {
  const v = skillValues(PACE);
  const chest = hero.y - STILLFIELD.chest;
  if (v.eye) return { ...f, x: hero.x, y: chest };
  if (!v.follow) return f;
  const dx = hero.x - f.x;
  const step = Math.min(Math.abs(dx), v.follow * dt);
  return { ...f, x: f.x + Math.sign(dx) * step };
}

/**
 * The field each step: a held one drains Sand while I is held and closes on letting go once it has stood its least
 * time; a tapped one stands its own time. Either closes at its most time or when Sand runs out, and a fall closes it at
 * once with no snap.
 */
export function tickField(dt: number): void {
  mirel.fieldCd = Math.max(0, mirel.fieldCd - dt);
  const f = mirel.field;
  if (!f) return;
  if (hero.state === "dead") return closeField(false);
  const t = f.t + dt;
  mirel.field = { ...follow(f, dt), t };
  countFallen(mirel.field);
  if (!isHeld("cast")) mirel.fieldLetGo = true;
  const drain = STILLFIELD.perSecond * costScale() * dt;
  const dry = !hasSand(drain);
  if (!mirel.fieldLetGo && !dry) spendSand(drain);
  if (t < mirel.fieldLeast) return;
  if (mirel.fieldLetGo || dry || t >= STILLFIELD.most) closeField(true);
}

/** the cast pose on the press is short and leaves her free */
export function runStillCast(): void {
  if (hero.st >= STILLFIELD.cast) setState(hero.ground ? "idle" : "fall");
}
