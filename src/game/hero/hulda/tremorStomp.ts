import { ENEMIES } from "../../../constants/enemies";
import { STOMP } from "../../../constants/hulda/spells";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { dealDamage } from "../../damage";
import { createFloorCrack } from "../../effects/floorCrack";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, shake } from "../../world";
import { setState, settle } from "../actions";
import { skin } from "../skin";
import { castGate } from "./castGate";
import { floorThud } from "./effects/thud";
import { gainGrit } from "./grit";
import { hulda } from "./memory";

const ID = "h_tremorStomp";

/** one tremor: where it runs from, how far, how hard, and what it does to minions and fliers */
interface Tremor {
  x: number;
  floor: number;
  radius: number;
  damage: number;
  launch: boolean;
  fliers: boolean;
}

/** I with Tremor Stomp: a stomp, paid with MP; on the floor */
export function pressStomp(): boolean {
  const h = hero;
  const v = skillValues(ID);
  if (!castGate()) return false;
  h.mp -= v.mp;
  hulda.stompCd = v.cooldown;
  h.vx = 0;
  setState("stomp");
  emitSkillEvent({ type: "cast", ability: ID });
  return true;
}

/** the tremor runs out along the floor: every foe standing on it in reach takes it once; fliers over it are shaken down */
function tremble(t: Tremor): void {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx] = enemyCenter(e);
    if (Math.abs(cx - t.x) > t.radius) continue;
    const flies = kindOf(e.type).flies;
    if (flies) {
      if (!t.fliers) continue;
      e.y += STOMP.shake;
      e.stun = Math.max(e.stun, STOMP.flierStun);
    } else if (e.air || Math.abs(e.y - t.floor) > STOMP.floor) continue;
    const minion = ENEMIES[e.type].launchable;
    dealDamage(e, t.damage, {
      fromX: t.x,
      kx: Math.sign(cx - t.x) * 40,
      stun: STOMP.stun,
      launch: t.launch && minion && !flies ? STOMP.launch : undefined,
      heavy: true,
      source: "abilities",
    });
    game.fx.push(createImpact(cx, e.y - 4, Math.sign(cx - t.x) || 1, false));
  }
  const x0 = Math.max(0, t.x - t.radius);
  const x1 = Math.min(W, t.x + t.radius);
  const ring = Math.min(t.radius, W);
  // a wide ring is drawn flat, so its far half stays a few pixels behind her feet
  game.fx.push(createFloorRing(t.x, t.floor, ring, skin.ramp, 0.45, Math.min(0.2, STOMP.ringDepth / ring)));
  game.fx.push(createFloorCrack(t.x, x0, t.floor, t.radius * 4, skin.ramp));
  game.fx.push(createFloorCrack(t.x, x1, t.floor, t.radius * 4, skin.ramp));
  floorThud(t.x, t.floor, "big");
  dust(t.x, t.floor, 8);
  shake(0.18, 2);
  sfx.boom();
}

/** the second tremor waits a moment, then runs wider */
function later(t: Tremor, wait: number): Effect {
  let left = wait;
  return {
    update(dt) {
      left -= dt;
      if (left > 0) return true;
      tremble(t);
      return false;
    },
    draw() {},
  };
}

/** her foot comes down on its frame: the first tremor, the second a moment later, and Grit */
function stomp(): void {
  const v = skillValues(ID);
  const wide = v.wide === 1;
  const base = {
    x: hero.x,
    floor: hero.y,
    damage: progress.stats.ad * v.power,
    launch: v.launch === 1,
    fliers: v.fliers === 1,
  };
  tremble({ ...base, radius: wide ? W : v.near });
  if (v.far > 0) game.fx.push(later({ ...base, radius: wide ? W : v.far }, STOMP.gap));
  if (v.grit) gainGrit(v.grit);
}

/** the stomp lands on its frame, then she settles */
export function runStomp(): void {
  const h = hero;
  h.vx = 0;
  if (!h.hitDone && h.st >= STOMP.hit) {
    h.hitDone = true;
    stomp();
  }
  if (h.st >= STOMP.dur) settle();
}
