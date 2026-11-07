import { RUST } from "../../../constants/hulda/rust";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { consumeStacks } from "../../enemies/skillStatus";
import { skin } from "../../hero/skin";
import { game, hero, particles, progress, rng } from "../../state";
import { skillValues } from "../query";
import { distance2 } from "../targets";
import { rustFoe, rustOn, sprayRust } from "./rustSpray";

const ID = "h_rustShards";

/** Rust Reckoning: every foe near her gives up its rust at once for heavy damage, then fresh shards fly */
function reckon(): void {
  const per = skillValues(ID).reckoning;
  if (!per) return;
  const r = RUST.reckonReach;
  for (const e of game.enemies) {
    if (e.hp <= 0 || distance2(e, hero.x, hero.y - 16) > r * r) continue;
    const n = consumeStacks(e, ID) + consumeStacks(e, "h_ironHide");
    if (!n) continue;
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * per * n, { fromX: hero.x, kx: 0, heavy: n >= 3, source: ID });
    game.fx.push(createImpact(cx, cy, Math.sign(cx - hero.x) || 1, n >= 3, skin.sparks));
  }
}

/** rusted foes shed a fleck of rust now and then, so the player can see who carries it */
function flecks(dt: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !rustOn(e) || !rng.chance(dt / RUST.fleck)) continue;
    const [cx, cy] = enemyCenter(e);
    particles.spawn(PK.EMBER, cx + rng.range(-4, 4), cy + rng.range(-4, 4), rng.range(-6, 6), rng.range(5, 20), 0.5, {
      col: skin.ramp[rng.int(2, 3)],
      size: 1,
    });
  }
}

/** Rust Shards: blows on her armour spray rust that eats the attacker; it softens their blows, her fists spread it, and
 *  evolved, every counter and broken plate consumes it */
export const rustShards: SkillBehavior = {
  create: () => ({}),
  update(_memory, _state, dt) {
    flecks(dt);
  },
  on: {
    armour(_memory, event) {
      const v = skillValues(ID);
      if (event.kind !== "plate" && !v.any) return;
      if (event.kind === "plate") reckon();
      sprayRust(hero.x - hero.face * 2, hero.y - 20, 1);
    },
    counter() {
      if (!skillValues(ID).reckoning) return;
      reckon();
      sprayRust(hero.x, hero.y - 20, 1);
    },
    blow(_memory, event) {
      if (!skillValues(ID).onBlow || event.source !== "attacks" || !event.melee || !rustOn(event.foe)) return;
      rustFoe(event.foe, 1);
    },
  },
};
