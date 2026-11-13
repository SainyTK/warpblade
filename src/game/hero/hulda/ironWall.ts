import { GRIT } from "../../../constants/hulda/grit";
import { WALL } from "../../../constants/hulda/spells";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { createIronBurst } from "../../effects/ironBurst";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { setState, settle } from "../actions";
import { skin } from "../skin";
import { castGate } from "./castGate";
import { thudLight } from "./effects/thud";
import { gainFury } from "./fury";
import { gainGrit } from "./grit";
import { hulda } from "./memory";

const ID = "h_ironWall";

/** seconds the brace lasts */
export const braceTime = (): number => skillValues(ID).brace;

/** I with Iron Wall: brace, paid with MP; on the floor */
export function pressBrace(): boolean {
  const h = hero;
  const v = skillValues(ID);
  if (!castGate()) return false;
  h.mp -= v.mp;
  hulda.wallCd = v.cooldown;
  hulda.braced = 0;
  h.vx = 0;
  setState("brace");
  sfx.tone(110, 90, 0.1, "square", 0.05);
  emitSkillEvent({ type: "cast", ability: ID });
  return true;
}

/** a blow the brace took: it loads the release, and with the skill's level refills a plate; the safe time is short so
 *  more blows can load it */
export function braceTook(): void {
  const v = skillValues(ID);
  hulda.braced = Math.min(v.stacks, hulda.braced + 1);
  hero.inv = Math.min(hero.inv, WALL.safe);
  if (v.plate) gainGrit(GRIT.plate);
  thudLight(hero.x + hero.face * 5, hero.y - 18, "small");
}

/** foes the release reaches: a box ahead, or a ring round her */
function struck(ring: boolean): Enemy[] {
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    const dx = (cx - hero.x) * hero.face;
    if (Math.abs(cy - (hero.y - 16)) > 26) return false;
    return ring ? Math.abs(dx) <= WALL.ring : dx >= -4 && dx <= WALL.ahead;
  });
}

/** the loaded blow goes out: per blow taken, or a light shove when none was */
function release(): void {
  const v = skillValues(ID);
  const loaded = hulda.braced > 0;
  const power = loaded ? v.power * hulda.braced : v.empty;
  const ring = v.ring === 1;
  const foes = struck(ring);
  for (const e of foes) {
    const [cx, cy] = enemyCenter(e);
    const dir = Math.sign(cx - hero.x) || hero.face;
    dealDamage(e, progress.stats.ad * power, {
      fromX: hero.x,
      kx: dir * WALL.kx,
      stun: loaded ? WALL.stun : 0,
      heavy: loaded,
      melee: true,
      source: "abilities",
    });
    game.fx.push(createImpact(cx, cy, dir, loaded));
  }
  const x = hero.x + (ring ? 0 : hero.face * 10);
  game.fx.push(
    createIronBurst(x, hero.y - 17, hero.face, ring, WALL.ahead * (loaded ? 0.8 + 0.2 * hulda.braced : 0.5), skin.ramp),
  );
  if (ring) game.fx.push(createFloorRing(hero.x, hero.y, WALL.ring + 8, skin.ramp, 0.4));
  if (!loaded) return;
  hitStop(0.06 + 0.02 * hulda.braced);
  shake(0.2 + 0.05 * hulda.braced, 2 + hulda.braced);
  sfx.boom();
  gainFury(v.fury);
  emitSkillEvent({ type: "counter", foe: foes[0] ?? null });
}

/** the brace holds, then the release punch lands on its frame */
export function runBrace(): void {
  const h = hero;
  h.vx = 0;
  const brace = braceTime();
  if (!h.hitDone && h.st >= brace + WALL.hit) {
    h.hitDone = true;
    release();
  }
  if (h.st >= brace + WALL.release) settle();
}
