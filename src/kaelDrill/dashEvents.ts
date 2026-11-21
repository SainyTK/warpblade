import { enemyBox } from "../game/enemies/enemy";
import { emitSkillEvent } from "../game/skills/events";
import { game, hero } from "../game/state";
import { boxHit, heroBox } from "../game/world";
import { sfx } from "../services/audio";
import type { Enemy } from "../types/enemy";
import type { Fighter } from "./simulation";

export function createDashEvents() {
  let face = 0;
  const foes = new Set<Enemy>();

  return (h: Fighter): void => {
    const active = h.dashTime > 0;
    if (!active && !face) {
      return;
    }
    if (!face) {
      face = h.face;
      hero.perfectUsed = false;
      sfx.dodge();
    }
    const box = heroBox();
    for (const enemy of game.enemies) {
      if (enemy.hp > 0 && boxHit(box, enemyBox(enemy))) {
        foes.add(enemy);
      }
    }
    if (!active) {
      emitSkillEvent({ type: "dash", dir: face, foes: [...foes] });
      face = 0;
      foes.clear();
    }
  };
}
