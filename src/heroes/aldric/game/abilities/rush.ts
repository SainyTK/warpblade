import { createFloorRing } from "../../../../game/effects/floorRing";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { emitSkillEvent } from "../../../../game/skills/events";
import { skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { boxAhead, dust, shake } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { RUSH } from "../../constants/abilities";
import { DAWN_RAMP } from "../../constants/light";
import { aldric } from "../state";
import { foesIn, foesNear, strikeEach } from "../strike";
import "../../types/events";

/** the foes this rush has already struck, and whether its travel has ended; it holds foes, so only the host keeps it */
const rush: { struck: Set<Enemy>; ended: boolean } = { struck: new Set(), ended: false };
rememberPerSeat(objectMemory(rush, true));

/** a rush starts: nothing struck yet */
export function startRush(): void {
  rush.struck = new Set();
  rush.ended = false;
}

/** the rush ends: a skid of dust, the wide form's burst of light, and the travel it was ends */
function endRush(): void {
  rush.ended = true;
  hero.vx = 0;
  dust(hero.x, hero.y, 5, -hero.face);
  if (aldric.castWide) {
    const r = RUSH.burstRadius * (1 + (skillValues("al_step").burst ?? 0));
    strikeEach(
      foesNear(hero.x + hero.face * 10, hero.y - 16, r),
      progress.stats.ap * RUSH.burstPower * aldric.castPower,
      {
        fromX: hero.x,
        kx: 90,
        ky: -60,
        heavy: true,
        source: "abilities",
      },
    );
    game.fx.push(createFloorRing(hero.x + hero.face * 10, hero.y, r, DAWN_RAMP, 0.4));
    shake(0.14, 1.8);
  }
  emitSkillEvent({ type: "bash", foe: [...rush.struck][0] ?? null, hits: rush.struck.size });
  travelEnded();
}

/** Shield Rush under way: after its load he drives forward behind the shield, and every foe he meets is struck once and
 *  carried a little with him */
export function runRush(): void {
  const h = hero;
  const from = RUSH.load;
  const to = RUSH.load + RUSH.travel;
  if (h.st < from) {
    h.vx = 0;
    return;
  }
  if (h.st < to) {
    h.vx = h.face * RUSH.speed * progress.stats.move;
    const hit = foesIn(boxAhead(-2, -34, 20, 0), h.x, rush.struck);
    for (const e of hit) rush.struck.add(e);
    strikeEach(hit, progress.stats.ap * RUSH.power * aldric.castPower, {
      fromX: h.x - h.face * 10,
      kx: RUSH.carry,
      ky: -20,
      stagger: RUSH.stagger,
      heavy: true,
      melee: true,
      source: "abilities",
    });
    if (hit.length) shake(0.08, 1.2);
    return;
  }
  if (!rush.ended) endRush();
  h.vx = 0;
}
