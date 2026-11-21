import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { game, progress } from "../../../../game/state";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { createTracerLine } from "../effects/tracerLine";
import { drawChainBlast, drawChainBolt } from "./looks/chain";
import { drawChargeBlast, drawChargeBolt } from "./looks/charge";
import { drawShellBlast, drawShellBolt } from "./looks/shell";
import { foesNear } from "./targets";

const BURN = { every: 0.5, duration: 3, max: 4, share: 0.12 };
const ARC = { reach: 60, share: 0.5 };

function burn(foe: Enemy): void {
  addStacks(foe, "ca_flare", {
    stacks: 1,
    max: BURN.max,
    damage: progress.stats.ap * BURN.share,
    every: BURN.every,
    duration: BURN.duration,
  });
}

function arc(foe: Enemy): void {
  foe.shock = Math.max(foe.shock, 1.2);
  const [x, y] = enemyCenter(foe);
  const next = foesNear(x, y, ARC.reach, [foe])[0];
  if (!next) {
    return;
  }
  const [nx, ny] = enemyCenter(next);
  game.fx.push(createTracerLine(x, y, nx, ny));
  next.shock = Math.max(next.shock, 0.8);
  dealDamage(next, progress.stats.ap * ARC.share, { fromX: x, kx: 20, ky: -20, source: "abilities" });
}

function breach(foe: Enemy): void {
  staggerFoe(foe, 0.45);
}

export const CALDER_SPELLS: readonly DrillSpell[] = [
  {
    id: "flare",
    name: "Phosphor Shell",
    color: 0x7dffb0,
    core: 0xe8fff0,
    damage: 30,
    speed: 190,
    delay: 0,
    range: 130,
    radius: 24,
    look: "flame",
    freeze: 0,
    status: burn,
    drawBolt: drawShellBolt,
    drawBlast: drawShellBlast,
  },
  {
    id: "chain",
    name: "Chain Shot",
    color: 0xc8d4e0,
    core: 0xffffff,
    damage: 26,
    speed: 290,
    delay: 0,
    range: 150,
    radius: 14,
    look: "spark",
    freeze: 0,
    status: arc,
    drawBolt: drawChainBolt,
    drawBlast: drawChainBlast,
  },
  {
    id: "charge",
    name: "Blast Charge",
    color: 0xff9a4a,
    core: 0xffe066,
    damage: 50,
    speed: null,
    delay: 0.22,
    range: 120,
    radius: 30,
    look: "flame",
    freeze: 0,
    status: breach,
    drawBolt: drawChargeBolt,
    drawBlast: drawChargeBlast,
  },
];
