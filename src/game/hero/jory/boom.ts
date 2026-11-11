import { COMBO } from "../../../constants/combat";
import { BOOM } from "../../../constants/jory/moves";
import { PAL, SPARKS } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createBoomRing } from "../../effects/jory/boomRing";
import { enemyCenter } from "../../enemies/enemy";
import { lowerWard, raiseWard, type ShotWard } from "../../shotWards";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, particles, progress, rng } from "../../state";
import { shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { rewardPerfectDodge } from "../perfectDodge";
import { refuseDash } from "../stamina";
import { judge } from "./beat";
import { jory } from "./memory";
import { inRecovery } from "./string";

/** the drum head sits this high above his feet, where the ring leaves from */
const DRUM_Y = 14;

/** K: Boom, judged against the beat; a press with too little stamina gets the tired puff and is not judged */
export function pressBoom(): boolean {
  const h = hero;
  if (!isFree() && !inRecovery()) return false;
  if (jory.boomWait > 0) return false;
  const cost = !h.ground && skillValues("j_leap").boom ? 0 : BOOM.stamina;
  if (h.stamina < cost) {
    refuseDash();
    return true;
  }
  const judged = judge("K");
  h.stamina -= cost;
  h.staminaWait = 0.5;
  jory.boomWait = BOOM.wait;
  jory.boomOnBeat = judged.onBeat;
  jory.boomGuard = judged.onBeat ? BOOM.guard : 0;
  jory.boomDodged = false;
  if (h.ground) h.vx = 0;
  setState("boom");
  return true;
}

/** a foe pushed out to `to` pixels from him over the push's time, side to side only */
function pushOut(e: Enemy, to: number): void {
  const side = Math.sign(e.x - hero.x) || hero.face;
  const from = e.x;
  const goal = clamp(hero.x + side * to, 10, W - 10);
  if (Math.abs(goal - hero.x) <= Math.abs(from - hero.x)) return;
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      const u = Math.min(1, t / BOOM.push);
      if (e.hp > 0) e.x = from + (goal - from) * (1 - (1 - u) ** 2);
      return u < 1;
    },
    draw() {},
  });
}

/** an on-beat Boom drowns every foe shot near him for its untouchable moment, each with a cobalt spark */
function drownShots(): void {
  const ward: ShotWard = {
    at: () => ({ x: hero.x, y: hero.y - DRUM_Y }),
    radius: withCharms("area", BOOM.shots),
    broke(x, y) {
      for (let i = 0; i < 6; i++)
        particles.spawn(PK.SPARK, x, y, rng.range(-90, 90), rng.range(-90, 40), rng.range(0.15, 0.3), {
          sparks: SPARKS.beat,
        });
    },
  };
  raiseWard(ward);
  let left = BOOM.guard;
  game.fx.push({
    update(dt) {
      left -= dt;
      if (left > 0) return true;
      lowerWard(ward);
      return false;
    },
    draw() {},
  });
}

/** the Boom strikes: every foe in the ring takes the hit, minions and elites are pushed out and staggered */
function strike(): void {
  const onBeat = jory.boomOnBeat;
  const r = withCharms("area", (onBeat ? BOOM.ring : BOOM.offRing) * (1 + (skillValues("j_eardrum").wider ?? 0)));
  const cy = hero.y - DRUM_Y;
  const foes: Enemy[] = [];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - hero.x, (ey - cy) * 0.8) > r + 4) continue;
    foes.push(e);
    const pushed = e.rank === "minion";
    dealDamage(e, progress.stats.ap * BOOM.ap + progress.stats.ad * BOOM.ad, {
      fromX: hero.x,
      stagger: pushed ? COMBO.stagger : undefined,
      source: "abilities",
    });
    if (pushed && e.hp > 0) pushOut(e, e.elite ? BOOM.pushElite : BOOM.pushMinion);
  }
  if (onBeat) drownShots();
  game.fx.push(createBoomRing(hero.x, cy, hero.y, r, onBeat));
  game.fx.push(createFloorRing(hero.x, hero.y, r, PAL.beat, 0.3));
  shake(onBeat ? 0.14 : 0.08, onBeat ? 2 : 1);
  sfx.boom();
  emitSkillEvent({ type: "boom", onBeat, foes });
}

/** the Boom under way: a two frame load, the strike, then the recovery */
export function runBoom(): void {
  const h = hero;
  if (h.ground) h.vx = 0;
  if (!h.hitDone && h.st >= BOOM.hit) {
    h.hitDone = true;
    strike();
  }
  if (h.st >= BOOM.dur) settle();
}

/** a blow met him in an on-beat Boom's untouchable moment: nothing lands, and the first is a perfect dodge */
export function boomAbsorbs(): boolean {
  if (jory.boomGuard <= 0) return false;
  if (!jory.boomDodged) {
    jory.boomDodged = true;
    rewardPerfectDodge();
    sfx.perfect();
  }
  return true;
}

/** the waits run down */
export function tickBoom(dt: number): void {
  jory.boomWait = Math.max(0, jory.boomWait - dt);
  jory.boomGuard = Math.max(0, jory.boomGuard - dt);
}
