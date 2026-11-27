import { enemyCenter } from "../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../game/skills/events";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { RECOIL_TIME } from "../constants/chamber";
import { COUNTER_SHOT } from "../constants/guard";
import { muzzlePoint } from "./aim";
import { blastAt } from "./blastFoe";
import { loadRounds, roundPower } from "./chamber";
import { createMuzzleFlash } from "./effects/muzzleFlash";
import { afterCounterShot, counterBonus, counterFx } from "./skills/pointBlank";
import { calder } from "./state";

/** the sword's angle in the parry's aim key, where the round leaves the muzzle */
const AIM_ANGLE = -0.05;

/** the foe the counter shot goes into: the attacker when it stands in front, otherwise the nearest foe ahead in reach */
function target(attacker: Enemy | null): Enemy | null {
  const ahead = (e: Enemy): number => (enemyCenter(e)[0] - hero.x) * hero.face;
  if (attacker && attacker.hp > 0 && ahead(attacker) > -4 && ahead(attacker) < COUNTER_SHOT.reach * 2) return attacker;
  let best: Enemy | null = null;
  for (const e of game.enemies) {
    const d = ahead(e);
    if (e.hp <= 0 || d < -4 || d > COUNTER_SHOT.reach || Math.abs(e.y - hero.y) > 40) continue;
    if (!best || d < ahead(best)) best = e;
  }
  return best;
}

/**
 * The parry's counter shot: the blade snaps level at the attacker and a round goes off point-blank, a heavy blast that
 * staggers it. The parry loads rounds back into the chamber and makes the next J a Trigger. A shot parried with no foe
 * in reach fires into the air ahead.
 */
export function counterShot(attacker: Enemy | null): void {
  const [mx, my] = muzzlePoint(AIM_ANGLE);
  game.fx.push(createMuzzleFlash(mx, my, hero.face > 0 ? AIM_ANGLE : Math.PI - AIM_ANGLE));
  const foe = target(attacker);
  const [x, y] = foe ? enemyCenter(foe) : [mx + hero.face * 10, my];
  const bonus = counterBonus();
  const plain = progress.stats.ad * COUNTER_SHOT.power * roundPower();
  const struck = blastAt(foe, x, y, {
    damage: plain * bonus.power,
    splash: 0,
    reach: 0,
    kx: COUNTER_SHOT.kx,
    stagger: COUNTER_SHOT.stagger + bonus.stagger,
    heavy: true,
    hot: calder.hot,
    big: true,
  });
  calder.recoil = RECOIL_TIME;
  counterFx(x, y, plain * bonus.power);
  loadRounds(COUNTER_SHOT.rounds + bonus.rounds);
  hero.keenNext = true;
  afterCounterShot(foe);
  emitSkillEvent({ type: "calderBlast", x, y, foes: struck, kind: "parry" });
}
