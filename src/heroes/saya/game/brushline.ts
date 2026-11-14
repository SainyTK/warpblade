import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { settle } from "../../../game/hero/actions";
import { travelEnded } from "../../../game/hero/travelEnd";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { game, hero, progress } from "../../../game/state";
import { boxHit, heroBox, hitStop } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import { BRUSHLINE } from "../constants/abilities";
import { BEATS } from "../constants/timing";
import { createInkStroke } from "./effects/inkStroke";
import { sheatheFlash } from "./effects/sheatheFlash";
import { STORE_ANGLE } from "./moves/slashes";
import { sayaSound } from "./sound";
import { saya } from "./state";
import { releaseCuts, storeCut } from "./store";

/** the foes the pass under way has cut, so each pass cuts a foe once. Holds foes, so the host keeps it */
const pass: { cut: Enemy[]; leg: number } = { cut: [], leg: 0 };
rememberPerSeat(objectMemory(pass, true));

/** the beats of the form under way */
const beats = () => (saya.wide ? BEATS.lineWide : BEATS.line);
/** px a second the dash runs at, so it covers its length in its frames */
const dashSpeed = (): number => (BRUSHLINE.length / (beats().stop - beats().dash)) * progress.stats.move;

/** which leg of the dash runs now: 1 out, 2 back (the wide form), 0 none */
function legNow(): number {
  const b = BEATS.lineWide;
  const t = hero.st;
  if (t >= beats().dash && t < beats().stop) return 1;
  if (saya.wide && t >= b.back && t < b.home) return 2;
  return 0;
}

/** each foe the dash passes through takes the cut once per leg: a share at once and the rest stored */
function cutThrough(): void {
  const box = heroBox();
  const ap = progress.stats.ap;
  for (const e of game.enemies) {
    if (e.hp <= 0 || pass.cut.includes(e) || !boxHit(box, enemyBox(e))) continue;
    pass.cut = [...pass.cut, e];
    const [cx, cy] = enemyCenter(e);
    game.fx.push(createImpact(cx, cy, Math.sign(hero.vx) || hero.face, false));
    dealDamage(e, ap * BRUSHLINE.now, { fromX: hero.x, kx: Math.sign(hero.vx) * BRUSHLINE.kx, source: "abilities" });
    storeCut(e, ap * BRUSHLINE.store, STORE_ANGLE.line, "abilities");
    hitStop(0.03);
  }
}

/** a leg starts: where it began, a fresh list of foes cut */
function startLeg(leg: number): void {
  pass.leg = leg;
  pass.cut = [];
  if (leg === 1) saya.lineFrom = hero.x;
}

/** a leg ends: the stroke is laid along it and the travel has ended */
function endLeg(): void {
  const from = pass.leg === 1 ? saya.lineFrom : saya.lineFrom + hero.face * BRUSHLINE.length;
  game.fx.push(createInkStroke(from, hero.x, hero.y - 17));
  pass.leg = 0;
  hero.vx = 0;
  travelEnded();
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
  if (!saya.clicked && hero.st >= beats().click) {
    saya.clicked = true;
    sayaSound.click();
    sheatheFlash();
    releaseCuts(true);
  }
  if (hero.st >= beats().end) settle();
}

/** Brushline drives her speed while a leg runs */
export const lineDrives = (): boolean => hero.state === "line" && legNow() !== 0;
