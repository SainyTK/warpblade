import { ENEMIES } from "../../../constants/enemies";
import { ANCHOR_PIN } from "../../../constants/orrin/abilities";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, hitStop, shake, surfaceBelow } from "../../world";
import { setState, settle } from "../actions";
import { canCast } from "./castCheck";
import { orrin, orrinHost } from "./memory";

/** the nearest foe ahead within reach, or null */
function foeAhead(): Enemy | null {
  let best: Enemy | null = null;
  let bestD: number = ANCHOR_PIN.reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const d = (e.x - hero.x) * hero.face;
    if (d < -4 || d > bestD || Math.abs(enemyCenter(e)[1] - (hero.y - 16)) > 50) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** I: hurl the hook down through the foe ahead; with nobody in reach it bites the floor for half the MP */
export function pressPin(): boolean {
  const target = foeAhead();
  const mp = target ? ANCHOR_PIN.mp : ANCHOR_PIN.mp / 2;
  if (!canCast(orrin.pinCd, mp)) return true;
  hero.mp -= mp;
  orrin.pinCd = ANCHOR_PIN.cooldown;
  orrin.casting = "anchorPin";
  orrinHost.pinned = target;
  hero.vx = 0;
  setState("pin");
  sfx.rattle();
  emitSkillEvent({ type: "cast", ability: "anchorPin" });
  return true;
}

/** Rust Bite at level 4 rusts the pinned foe */
function rust(e: Enemy): void {
  const v = skillValues("o_rust");
  if (!v.pin) return;
  addStacks(e, "o_rust", {
    stacks: 1,
    max: 1,
    damage: progress.stats.ad * v.damage * 0.5,
    every: 0.5,
    duration: withCharms("duration", v.life),
  });
}

/** the hook drives down on its frame, nailing the foe to the floor with the chain drawn from the spike to it */
function drive(): void {
  const e = orrinHost.pinned;
  if (!e || e.hp <= 0) {
    const x = hero.x + hero.face * ANCHOR_PIN.miss;
    const floor = surfaceBelow(x, hero.y - 4);
    orrin.pinAt = { x, y: floor };
    orrin.pinLeft = 0.3;
    dust(x, floor, 6);
    shake(0.08, 1);
    sfx.hit(false, 0.7);
    return;
  }
  const [cx, cy] = enemyCenter(e);
  const minion = ENEMIES[e.type].rank === "minion";
  const root = withCharms("duration", minion ? ANCHOR_PIN.root : ANCHOR_PIN.bigRoot);
  dealDamage(e, progress.stats.ap * ANCHOR_PIN.power, { fromX: hero.x, kx: 0, heavy: true, source: "abilities" });
  e.pinned = Math.max(e.pinned, root);
  rust(e);
  orrin.pinAt = { x: e.x, y: surfaceBelow(e.x, e.y - 4) };
  orrin.pinLeft = root;
  game.fx.push(createImpact(cx, cy, hero.face, true));
  hitStop(0.06);
  shake(0.14, 2);
  sfx.hit(true, 0.7);
}

export function runPin(): void {
  const h = hero;
  if (!h.hitDone && h.st >= ANCHOR_PIN.hit) {
    h.hitDone = true;
    drive();
  }
  if (h.st >= ANCHOR_PIN.dur) settle();
}

/** the pin's chain fades once its root runs out or the foe falls */
export function tickPin(dt: number): void {
  if (orrin.pinLeft <= 0) return;
  orrin.pinLeft -= dt;
  const e = orrinHost.pinned;
  if (orrin.pinLeft <= 0 || (e && e.hp <= 0)) {
    orrin.pinLeft = 0;
    orrin.pinAt = null;
    orrinHost.pinned = null;
  }
}
