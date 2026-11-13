import { ENEMIES } from "../../../constants/enemies";
import { ANCHOR_PIN } from "../../../constants/orrin/abilities";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { Point } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, hitStop, shake, surfaceBelow } from "../../world";
import { setState, settle } from "../actions";
import { castsWide, startAbility } from "./castCheck";
import { orrin, orrinHost } from "./memory";
import { RUST_ID, rustFoe } from "./rust";

/** pixels in front of the foe's body the stake goes in */
const PIN_GAP = 4;

/** a foe the hook can nail to the floor: standing on a surface, not in the air, not a kind that flies */
function pinnable(e: Enemy): boolean {
  if (e.hp <= 0 || e.air || kindOf(e.type).flies) return false;
  if (Math.abs(e.y - surfaceBelow(e.x, e.y - 4)) > 1) return false;
  return Math.abs(enemyCenter(e)[1] - (hero.y - 16)) <= 50;
}

/** the nearest pinnable foe ahead within reach, or none */
function foeAhead(): Enemy[] {
  let best: Enemy | null = null;
  let bestD: number = ANCHOR_PIN.reach;
  for (const e of game.enemies) {
    if (!pinnable(e)) continue;
    const d = (e.x - hero.x) * hero.face;
    if (d < -4 || d > bestD) continue;
    best = e;
    bestD = d;
  }
  return best ? [best] : [];
}

/** Stake Line, the wide form: the nearest pinnable foes within reach on either side */
function foesAround(): Enemy[] {
  return game.enemies
    .filter((e) => pinnable(e) && Math.abs(e.x - hero.x) <= ANCHOR_PIN.reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, ANCHOR_PIN.wideFoes);
}

/**
 * I: hurl the hook down through the foe ahead; with nobody in reach it bites the floor for half the MP. Held, Stake
 * Line: the chain splits and nails the nearest foes on both sides.
 */
export function castPin(wide: boolean): boolean {
  const big = castsWide(wide, ANCHOR_PIN.mp);
  const targets = big ? foesAround() : foeAhead();
  const mp = targets.length ? ANCHOR_PIN.mp : ANCHOR_PIN.mp / 2;
  if (!startAbility(mp, big)) return false;
  orrin.pinCd = ANCHOR_PIN.cooldown;
  orrin.casting = "anchorPin";
  orrin.wide = big;
  orrinHost.pinned = targets;
  orrin.pinAt = [];
  hero.vx = 0;
  setState("pin");
  sfx.rattle();
  emitSkillEvent({ type: "cast", ability: "anchorPin" });
  return true;
}

/** the hook bit the floor with nobody to pin: dust and a short-lived stake */
function missFloor(): void {
  const x = hero.x + hero.face * ANCHOR_PIN.miss;
  const floor = surfaceBelow(x, hero.y - 4);
  orrin.pinAt = [{ x, y: floor }];
  orrin.pinLeft = 0.3;
  dust(x, floor, 6);
  shake(0.08, 1);
  sfx.hit(false, 0.7);
}

/** one foe nailed down: the hit, the root, Rust Bite's rust, and the stake just in front of its near side */
function nail(e: Enemy, share: number): { at: Point; root: number } {
  const [cx, cy] = enemyCenter(e);
  const minion = ENEMIES[e.type].rank === "minion";
  const root = withCharms("duration", minion ? ANCHOR_PIN.root : ANCHOR_PIN.bigRoot);
  dealDamage(e, progress.stats.ap * ANCHOR_PIN.power * share, {
    fromX: hero.x,
    kx: 0,
    heavy: true,
    source: "abilities",
  });
  e.pinned = Math.max(e.pinned, root);
  if (skillValues(RUST_ID).pin) rustFoe(e);
  // the stake goes in on the foe's side toward him, where the foe's body cannot hide it
  const side = Math.sign(e.x - hero.x) || hero.face;
  const [x0, , x1] = enemyBox(e);
  const near = side > 0 ? x0 - PIN_GAP : x1 + PIN_GAP;
  game.fx.push(createImpact(cx, cy, side, true));
  return { at: { x: near, y: surfaceBelow(near, e.y - 4) }, root };
}

/** the hook drives down on its frame, nailing each foe to the floor with the chain drawn from its spike to it */
function drive(): void {
  const foes = orrinHost.pinned.filter((e) => e.hp > 0);
  if (!foes.length) return missFloor();
  const share = orrin.wide ? ANCHOR_PIN.wideShare : 1;
  const nailed = foes.map((e) => nail(e, share));
  orrinHost.pinned = foes;
  orrin.pinAt = nailed.map((n) => n.at);
  orrin.pinLeft = Math.max(...nailed.map((n) => n.root));
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

/** the pins' chains fade once the root runs out or every pinned foe has fallen */
export function tickPin(dt: number): void {
  if (orrin.pinLeft <= 0) return;
  orrin.pinLeft -= dt;
  const standing = orrinHost.pinned.some((e) => e.hp > 0);
  if (orrin.pinLeft <= 0 || (orrinHost.pinned.length && !standing)) {
    orrin.pinLeft = 0;
    orrin.pinAt = [];
    orrinHost.pinned = [];
  }
}
