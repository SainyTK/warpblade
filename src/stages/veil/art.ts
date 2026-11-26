import { dealDamage } from "../../game/damage";
import { enemyCenter } from "../../game/enemies/enemy";
import { game, progress } from "../../game/state";
import type { ArtDef } from "../../types/art";
import { createLanceArc, drawLanceBolt, drawLanceImpact } from "./artLook";

const SHOCK = { base: 0.6, perLevel: 0.15 } as const;
const CHAIN = { fromLevel: 3, reach: 64, share: 0.6, perLevel: 0.2 } as const;

function chain(x: number, y: number, level: number): void {
  const jumps = level - CHAIN.fromLevel + 1;
  if (jumps <= 0) return;
  const near = game.enemies
    .filter((e) => e.hp > 0)
    .map((e) => ({ e, at: enemyCenter(e) }))
    .filter(({ at }) => Math.hypot(at[0] - x, at[1] - y) > 6 && Math.hypot(at[0] - x, at[1] - y) < CHAIN.reach)
    .sort((a, b) => Math.hypot(a.at[0] - x, a.at[1] - y) - Math.hypot(b.at[0] - x, b.at[1] - y))
    .slice(0, jumps);
  for (const { e, at } of near) {
    game.fx.push(createLanceArc(x, y, at[0], at[1]));
    dealDamage(e, progress.stats.ap * (CHAIN.share + CHAIN.perLevel * level), { source: "abilities", fromX: x });
    e.shock = Math.max(e.shock, SHOCK.base);
  }
}

export const riftlance: ArtDef = {
  id: "riftlance",
  name: "Rift Lance",
  element: "storm",
  color: 0xc39bff,
  core: 0xfff3a6,
  look: "spark",
  levels: [
    {
      cardText: "A lance of rift lightning that shocks.",
      damageTimesAttack: 4.0,
      radius: 22,
      range: 130,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "More damage, longer shock.",
      damageTimesAttack: 5.0,
      radius: 25,
      range: 140,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "Arcs on to one more foe.",
      damageTimesAttack: 6.4,
      radius: 28,
      range: 150,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "Arcs on to two more foes.",
      damageTimesAttack: 8.0,
      radius: 32,
      range: 160,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
    {
      cardText: "Full storm: arcs to three.",
      damageTimesAttack: 11.0,
      radius: 38,
      range: 175,
      speed: 260,
      delay: 0,
      freeze: 0,
    },
  ],
  status(foe, level) {
    foe.shock = Math.max(foe.shock, SHOCK.base + SHOCK.perLevel * level);
  },
  burst: chain,
  drawBolt: drawLanceBolt,
  drawImpact: drawLanceImpact,
};
