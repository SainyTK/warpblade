import { stageBounds } from "../../game/adventure";
import { enemyBox } from "../../game/enemies/enemy";
import { emitSkillEvent } from "../../game/skills/events";
import { withCharms } from "../../game/skills/query";
import { game } from "../../game/state";
import { surfaceBelow } from "../../game/world";
import { sfx } from "../../services/audio";
import type { DrillSpell, ElementImpact, ElementProjectile, Session, Side } from "../../types/drill";
import { clamp } from "../../utils/math";
import { SPELL_HEIGHT, SPELL_IMPACT_TIME, TARGET_RADIUS } from "../constants";
import { freezeEnemy, strikeEnemy } from "./enemyContact";

function damageArea(session: Session, { spell, x, y }: ElementImpact): void {
  const { spellDamage, spellArea } = session.modifiers;
  const radius = withCharms("area", spell.radius * spellArea);
  const centerY = spell.speed === null ? y - SPELL_HEIGHT : y;
  for (const enemy of game.enemies) {
    const [left, top, right, bottom] = enemyBox(enemy);
    if (x + radius < left || x - radius > right || centerY + 6 < top || centerY - 6 > bottom) {
      continue;
    }
    if (strikeEnemy(session.profile, enemy, spell.damage * spellDamage, x, "abilities")) {
      freezeEnemy(enemy, spell.freeze);
      spell.status?.(enemy);
    }
  }
}

function impact(session: Session, spell: DrillSpell, x: number, y: number, face: Side): void {
  const blast: ElementImpact = { spell, x, y, face, age: 0, fromSword: false };
  session.elementImpacts.push(blast);
  if (spell.speed !== null) {
    damageArea(session, blast);
  }
}

export function launchSpell(session: Session, spell: DrillSpell): void {
  const h = session.fighter;
  const { x, y, face } = h;
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: spell.id });
  if (spell.speed !== null) {
    session.elementProjectiles.push({ spell, x: x + face * 8, y: y - SPELL_HEIGHT, face, distance: 0 });
    return;
  }
  let closest = spell.range + TARGET_RADIUS;
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
  impact(session, spell, target?.x ?? miss, target?.y ?? surfaceBelow(miss, y), face);
}

function travel(session: Session, bolt: ElementProjectile, dt: number): boolean {
  const { speed, range } = bolt.spell;
  const step = Math.min(withCharms("speed", speed ?? 0) * dt, range - bolt.distance);
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
    impact(session, bolt.spell, target?.x ?? bolt.x, bolt.y, bolt.face);
    return false;
  }
  return true;
}

export function tickSpellStrikes(session: Session, dt: number): void {
  for (const blast of session.elementImpacts) {
    const before = blast.age;
    blast.age += dt;
    const { speed, delay } = blast.spell;
    if (speed === null && !blast.fromSword && before < delay && blast.age >= delay) {
      damageArea(session, blast);
    }
  }
  session.elementImpacts = session.elementImpacts.filter((blast) => blast.age < SPELL_IMPACT_TIME);
  session.elementProjectiles = session.elementProjectiles.filter((bolt) => travel(session, bolt, dt));
}
