import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { launchEnemy } from "../../../game/enemies/airborne";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { settle } from "../../../game/hero/actions";
import { refundStamina } from "../../../game/hero/stamina";
import { travelEnded } from "../../../game/hero/travelEnd";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxHit, heroBox, hitStop } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import { BRUSHLINE } from "../constants/abilities";
import { HORIZON } from "../constants/skillLook";
import { SKILL } from "../constants/skills/ids";
import { BEATS } from "../constants/timing";
import { createInkCut } from "./effects/inkCut";
import { createInkStroke } from "./effects/inkStroke";
import { sheatheFlash } from "./effects/sheatheFlash";
import { STORE_ANGLE } from "./moves/slashes";
import { sayaSound } from "./sound";
import { saya } from "./state";
import { releaseCuts, storeCut } from "./store";
import { layTrail } from "./trail";

/** the foes the leg under way has cut, so each leg cuts a foe once, and every foe the line cut. Holds foes, so the
 *  host keeps it */
const pass: { cut: Enemy[]; all: Enemy[]; leg: number } = { cut: [], all: [], leg: 0 };
rememberPerSeat(objectMemory(pass, true));

/** the beats of the form under way */
const beats = () => (saya.wide ? BEATS.lineWide : BEATS.line);
/** the dash's length, longer with Long Stroke */
const length = (): number => skillValues(SKILL.stroke).length ?? BRUSHLINE.length;
/** px a second the dash runs at, so it covers its length in its frames */
const dashSpeed = (): number => (length() / (beats().stop - beats().dash)) * progress.stats.move;

/** which leg of the dash runs now: 1 out, 2 back (the wide form), 0 none */
function legNow(): number {
  const b = BEATS.lineWide;
  const t = hero.st;
  if (t >= beats().dash && t < beats().stop) return 1;
  if (saya.wide && t >= b.back && t < b.home) return 2;
  return 0;
}

/** what each foe the line cuts stores, with Long Stroke */
const storeEach = (): number => progress.stats.ap * BRUSHLINE.store * (skillValues(SKILL.stroke).store ?? 1);

/** each foe the dash passes through takes the cut once per leg: a share at once and the rest stored */
function cutThrough(): void {
  const box = heroBox();
  const ap = progress.stats.ap;
  const heavy = !!skillValues(SKILL.stroke).guard;
  for (const e of game.enemies) {
    if (e.hp <= 0 || pass.cut.includes(e) || !boxHit(box, enemyBox(e))) continue;
    pass.cut = [...pass.cut, e];
    if (!pass.all.includes(e)) pass.all = [...pass.all, e];
    const [cx, cy] = enemyCenter(e);
    game.fx.push(createImpact(cx, cy, Math.sign(hero.vx) || hero.face, false));
    const kx = Math.sign(hero.vx) * BRUSHLINE.kx;
    dealDamage(e, ap * BRUSHLINE.now, { fromX: hero.x, kx, heavy, source: "abilities" });
    storeCut(e, storeEach(), STORE_ANGLE.line, "abilities");
    hitStop(0.03);
  }
}

/** a leg starts: where it began, a fresh list of foes cut */
function startLeg(leg: number): void {
  pass.leg = leg;
  pass.cut = [];
  if (leg === 1) {
    saya.lineFrom = hero.x;
    pass.all = [];
  }
}

/** a leg ends: the stroke is laid along it (and stays as a trail with Lingering Line), Long Stroke gives stamina back
 *  and as Ink Horizon sends the cut on along the floor, and the travel has ended */
function endLeg(): void {
  const from = pass.leg === 1 ? saya.lineFrom : saya.lineFrom + hero.face * length();
  game.fx.push(createInkStroke(from, hero.x, hero.y - 17));
  layTrail(from, hero.x, hero.y);
  const v = skillValues(SKILL.stroke);
  if (v.stamina) refundStamina(v.stamina);
  if (pass.leg === 1 && v.horizon) {
    const spec = { ...HORIZON, range: v.horizon, x: hero.x, y: hero.y - 16, dir: hero.face };
    game.fx.push(createInkCut({ ...spec, now: 0, store: storeEach(), source: "abilities" }));
  }
  pass.leg = 0;
  hero.vx = 0;
  travelEnded();
}

/** the click: every stored cut releases, and with Long Stroke's seventh level the line's foes are thrown up */
function click(): void {
  saya.clicked = true;
  sayaSound.click();
  sheatheFlash();
  releaseCuts(true);
  const launch = skillValues(SKILL.stroke).launch;
  if (launch) for (const e of pass.all) if (e.hp > 0) launchEnemy(e, launch);
}

/** Brushline under way: the dash out (and back, held), then the click */
export function runLine(): void {
  const leg = legNow();
  if (leg !== pass.leg) {
    if (pass.leg) endLeg();
    if (leg) startLeg(leg);
  }
  if (leg) {
    hero.vx = (leg === 1 ? 1 : -1) * hero.face * dashSpeed();
    hero.inv = Math.max(hero.inv, 0.05);
    cutThrough();
  }
  if (!saya.clicked && hero.st >= beats().click) click();
  if (hero.st >= beats().end) settle();
}

/** Brushline drives her speed while a leg runs */
export const lineDrives = (): boolean => hero.state === "line" && legNow() !== 0;
