import { enemyCenter } from "../../game/enemies/enemy";
import { spendRiposte } from "../../game/meleeHit";
import { hero } from "../../game/state";
import type { Enemy } from "../../types/enemy";
import { INFUSION_HITS, SPELLS, type SpellKind } from "../spells";
import { freezeEnemy, strikeEnemy } from "./enemyContact";
import type { Fighter, Session, Side } from "./model";

export function infuseSword(h: Fighter, kind: SpellKind): void {
  h.swordInfusion = { kind, remainingHits: INFUSION_HITS, age: 0 };
}

export function hitWithSword(session: Session, enemy: Enemy, face: Side, damage: number, finisher = false): boolean {
  const kind = session.fighter.swordInfusion?.kind;
  const bonus = kind ? Math.ceil(SPELLS[kind].damage / INFUSION_HITS) : 0;
  if (!strikeEnemy(enemy, damage + bonus, session.fighter.x, "attacks", finisher, finisher)) {
    return false;
  }
  if (kind) {
    const [x, y] = enemyCenter(enemy);
    session.elementImpacts.push({ kind, x, y, face, age: 0, fromSword: true });
    if (kind === "ice") {
      freezeEnemy(enemy, SPELLS.ice.freeze);
    }
  }
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
