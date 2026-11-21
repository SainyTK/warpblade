import { enemyCenter } from "../../game/enemies/enemy";
import { spendRiposte } from "../../game/meleeHit";
import { emitSkillEvent } from "../../game/skills/events";
import { hero } from "../../game/state";
import type { DrillSpell, Fighter, Session, Side } from "../../types/drill";
import type { Enemy } from "../../types/enemy";
import { INFUSION_HITS } from "../constants";
import { freezeEnemy, strikeEnemy } from "./enemyContact";

export function infuseSword(session: Session, spell: DrillSpell): void {
  session.fighter.swordInfusion = { spell, remainingHits: INFUSION_HITS + session.modifiers.infusionHits, age: 0 };
  emitSkillEvent({ type: "infuse", spell: spell.id });
}

export function hitWithSword(session: Session, enemy: Enemy, face: Side, damage: number, finisher = false): boolean {
  const { fighter, profile, modifiers } = session;
  const spell = fighter.swordInfusion?.spell ?? null;
  const bonus = spell ? Math.ceil((spell.damage * modifiers.spellDamage) / INFUSION_HITS) : 0;
  if (!strikeEnemy(profile, enemy, damage + bonus, fighter.x, "attacks", finisher, finisher)) {
    return false;
  }
  if (spell) {
    const [x, y] = enemyCenter(enemy);
    session.elementImpacts.push({ spell, x, y, face, age: 0, fromSword: true });
    freezeEnemy(enemy, spell.freeze);
    spell.status?.(enemy);
  }
  profile.hooks?.swordHit?.(enemy, spell);
  return true;
}

export function spendSwordBonuses(h: Fighter): void {
  if (hero.riposte > 0) {
    spendRiposte();
  }
  if (!h.swordInfusion) {
    return;
  }
  h.swordInfusion.remainingHits--;
  if (h.swordInfusion.remainingHits === 0) {
    h.swordInfusion = null;
  }
}
