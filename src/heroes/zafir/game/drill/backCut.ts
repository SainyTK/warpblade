import { WARP } from "../../../../constants/combat";
import { drillSession } from "../../../../drill";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, progress } from "../../../../game/state";
import type { DrillSpell, DrillStrikeId } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { ARRIVAL_CUT, BEHIND_SHARE } from "../../constants/drill/strikes";

type Land = (foe: Enemy, infusion: DrillSpell | null) => void;

const EDGE = 6;

export function cutBehind(kind: DrillStrikeId | "warp", land: Land): boolean {
  const session = drillSession();
  if (!session) {
    return false;
  }
  const { profile, modifiers, fighter: h } = session;
  const strike = kind === "warp" ? null : profile.strikes[kind];
  const reach = (strike?.reach ?? ARRIVAL_CUT.reach) * modifiers.strikeReach;
  const height = strike?.height ?? ARRIVAL_CUT.height;
  const power = strike
    ? strike.damage * modifiers.strikeDamage * (strike.finisher ? modifiers.finisherDamage : 1)
    : WARP.power * ARRIVAL_CUT.power * modifiers.warpDamage;
  const infusion = h.swordInfusion?.spell ?? null;
  let landed = false;
  for (const foe of game.enemies) {
    const back = (h.x - foe.x) * h.face;
    if (foe.hp <= 0 || back <= EDGE || back > reach + EDGE || Math.abs(foe.y - h.y) > height) {
      continue;
    }
    const hit = dealDamage(foe, progress.stats.ad * power * BEHIND_SHARE, {
      fromX: h.x,
      source: "attacks",
      melee: true,
      finisher: !!strike?.finisher,
    });
    if (hit !== "hit") {
      continue;
    }
    landed = true;
    if (infusion) {
      const [x, y] = enemyCenter(foe);
      session.elementImpacts.push({ spell: infusion, x, y, face: h.face === 1 ? -1 : 1, age: 0, fromSword: true });
      infusion.status?.(foe);
    }
    land(foe, infusion);
  }
  return landed;
}
