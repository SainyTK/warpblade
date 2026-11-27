import { MINI_MOVES } from "../../constants/miniBoss";
import { sfx } from "../../services/audio";
import type { MiniBossDef, MiniMove } from "../../types/campaign";
import type { Enemy } from "../../types/enemy";
import { clampStageX, summonFoe } from "../adventure";
import { createRift } from "../effects/rift";
import { lightLook } from "../enemies/abyss/strikeLook";
import { createVoidPillar } from "../enemies/abyss/voidPillar";
import { createVoidSpikes } from "../enemies/abyss/voidSpikes";
import { kindOf } from "../enemies/kinds";
import { game, hero, rng } from "../state";
import { shake } from "../world";

const raging = (e: Enemy): boolean => e.phase > 1;

function pillars(def: MiniBossDef, e: Enemy): void {
  const m = MINI_MOVES.pillars;
  const n = raging(e) ? m.enraged : m.count;
  const look = lightLook(def.light);
  for (let i = 0; i < n; i++) {
    const x = clampStageX(hero.x + (i - (n - 1) / 2) * m.gap + rng.range(-5, 5), 10);
    game.fx.push(createVoidPillar(x, i * m.beat, m.hit * e.power, look));
  }
  sfx.cast();
}

function spikes(def: MiniBossDef, e: Enemy): void {
  const m = MINI_MOVES.spikes;
  const n = raging(e) ? m.enraged : m.count;
  const look = lightLook(def.light);
  for (const dir of [-1, 1]) game.fx.push(createVoidSpikes(e.x + dir * m.start, dir, n, m.hit * e.power, look));
  shake(0.3, 3);
  sfx.boom();
}

function call(def: MiniBossDef, e: Enemy): void {
  const m = MINI_MOVES.call;
  const n = raging(e) ? m.enraged : m.count;
  for (let i = 0; i < n; i++) {
    const type = def.adds[i % def.adds.length];
    const rift = kindOf(type).rift;
    const side = i % 2 ? 1 : -1;
    const x = clampStageX(hero.x + side * m.spread * (1 + Math.floor(i / 2) * 0.5), 20);
    const y = rift.y();
    game.fx.push(
      createRift(x, rift.riftY(y), rift.height, i * 0.2, () => game.enemies.push(summonFoe(type, x, y, m.xpShare))),
    );
  }
  sfx.surge();
}

const MOVES: Readonly<Record<MiniMove, (def: MiniBossDef, e: Enemy) => void>> = { pillars, spikes, call };

export function castMiniMove(def: MiniBossDef, e: Enemy, count: number): void {
  const move = def.moves[count % def.moves.length];
  MOVES[move](def, e);
}
