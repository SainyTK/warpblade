import { PAL, SPARKS } from "../../../constants/palette";
import { glow, line, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { MoveId } from "../../../types/move";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { game, progress } from "../../state";
import { skillValues } from "../query";

const ID = "k_skydance";
/** the moves of the air string, whose hits drop Comet Dance's shards */
const AIR_MOVES: ReadonlySet<MoveId> = new Set<MoveId>(["airWheel", "airScissor", "airStomp", "whirl", "meteor"]);
/** a shard falls from this far above the foe at this speed */
const SHARD = { height: 40, speed: 360 } as const;

interface Shard {
  foe: Enemy;
  x: number;
  y: number;
}

interface DanceMemory {
  shards: Shard[];
}

const memoryOf = (m: SkillMemory): DanceMemory => m as unknown as DanceMemory;

/** a shard falls on its foe; true while it is still falling */
function fall(s: Shard, dt: number): boolean {
  if (s.foe.hp <= 0) return false;
  const [x, y] = enemyCenter(s.foe);
  s.x = x;
  s.y += SHARD.speed * dt;
  if (s.y < y) return true;
  dealDamage(s.foe, progress.stats.ad * skillValues(ID).shard, { fromX: x, ky: -20, source: ID });
  game.fx.push(createImpact(x, y, 1, false, SPARKS.crystal));
  return false;
}

/** Sky Dance evolved, Comet Dance: every air hit drops a crystal shard on the foe it struck */
export const skyDance: SkillBehavior = {
  create: () => ({ shards: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.shards = m.shards.filter((s) => fall(s, dt));
  },
  draw(memory) {
    place();
    const C = PAL.crystal;
    for (const s of memoryOf(memory).shards) {
      line(s.x, s.y - 6, s.x, s.y, C[4]);
      line(s.x - 1, s.y - 4, s.x - 1, s.y - 1, C[2]);
      px(s.x, s.y, WHITE);
      glow(s.x, s.y - 2, 6, C[3], 0.4);
    }
  },
  on: {
    blow(memory, ev, state) {
      if (!state.evolved || ev.source !== "attacks" || !ev.move || !AIR_MOVES.has(ev.move)) return;
      const [x, y] = enemyCenter(ev.foe);
      memoryOf(memory).shards.push({ foe: ev.foe, x, y: y - SHARD.height });
    },
  },
};
