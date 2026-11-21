import { stageBounds } from "../../game/adventure";
import { enemyBox } from "../../game/enemies/enemy";
import { emitSkillEvent } from "../../game/skills/events";
import { withCharms } from "../../game/skills/query";
import { game } from "../../game/state";
import { surfaceBelow } from "../../game/world";
import { sfx } from "../../services/audio";
import { clamp } from "../../utils/math";
import { SPELL_HEIGHT, TARGET_RADIUS } from "../constants";
import { SPELL_IMPACT_TIME, SPELLS, type SpellKind } from "../spells";
import { freezeEnemy, strikeEnemy } from "./enemyContact";
import type { ElementImpact, ElementProjectile, Session, Side } from "./model";

function damageArea({ kind, x, y }: ElementImpact): void {
  const { damage } = SPELLS[kind];
  const radius = withCharms("area", SPELLS[kind].radius);
  const centerY = kind === "thunder" ? y - SPELL_HEIGHT : y;
  for (const enemy of game.enemies) {
    const [left, top, right, bottom] = enemyBox(enemy);
    if (x + radius < left || x - radius > right || centerY + 6 < top || centerY - 6 > bottom) {
      continue;
    }
    if (strikeEnemy(enemy, damage, x, "abilities") && kind === "ice") {
      freezeEnemy(enemy, SPELLS.ice.freeze);
    }
  }
}

function impact(session: Session, kind: SpellKind, x: number, y: number, face: Side): void {
  const blast: ElementImpact = { kind, x, y, face, age: 0, fromSword: false };
  session.elementImpacts.push(blast);
  if (kind !== "thunder") {
    damageArea(blast);
  }
}

export function launchSpell(session: Session, kind: SpellKind): void {
  const h = session.fighter;
  const { x, y, face } = h;
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: kind === "thunder" ? "volt" : kind });
  if (kind !== "thunder") {
    session.elementProjectiles.push({ kind, x: x + face * 8, y: y - SPELL_HEIGHT, face, distance: 0 });
    return;
  }
  let closest = SPELLS.thunder.range + TARGET_RADIUS;
  let target = null;
  for (const enemy of game.enemies) {
    const ahead = (enemy.x - x) * face;
    if (enemy.hp > 0 && ahead >= -TARGET_RADIUS && ahead <= closest && Math.abs(enemy.y - y) <= 70) {
      target = enemy;
      closest = ahead;
    }
  }
  const { left, right } = stageBounds();
  const miss = clamp(x + face * 45, left + TARGET_RADIUS, right - TARGET_RADIUS);
  impact(session, kind, target?.x ?? miss, target?.y ?? surfaceBelow(miss, y), face);
}

function travel(session: Session, bolt: ElementProjectile, dt: number): boolean {
  const { speed, range } = SPELLS[bolt.kind];
  const step = Math.min(withCharms("speed", speed) * dt, range - bolt.distance);
  const previous = bolt.x;
  const { left, right } = stageBounds();
  bolt.x = clamp(previous + bolt.face * step, left, right);
  bolt.distance += step;
  const traveled = (bolt.x - previous) * bolt.face;
  let target;
  let nearest = traveled + TARGET_RADIUS;
  for (const enemy of game.enemies) {
    const [left, top, right, bottom] = enemyBox(enemy);
    const edge = ((bolt.face > 0 ? left : right) - previous) * bolt.face;
    const far = ((bolt.face > 0 ? right : left) - previous) * bolt.face;
    if (enemy.hp > 0 && far >= 0 && edge <= nearest && bolt.y >= top - 4 && bolt.y <= bottom + 4) {
      target = enemy;
      nearest = edge;
    }
  }
  if (target || bolt.distance >= range || bolt.x === left || bolt.x === right) {
    impact(session, bolt.kind, target?.x ?? bolt.x, bolt.y, bolt.face);
    return false;
  }
  return true;
}

export function tickSpellStrikes(session: Session, dt: number): void {
  for (const blast of session.elementImpacts) {
    const before = blast.age;
    blast.age += dt;
    if (
      blast.kind === "thunder" &&
      !blast.fromSword &&
      before < SPELLS.thunder.delay &&
      blast.age >= SPELLS.thunder.delay
    ) {
      damageArea(blast);
    }
  }
  session.elementImpacts = session.elementImpacts.filter((blast) => blast.age < SPELL_IMPACT_TIME);
  session.elementProjectiles = session.elementProjectiles.filter((bolt) => travel(session, bolt, dt));
}
