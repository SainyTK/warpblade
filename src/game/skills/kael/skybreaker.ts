import { ENEMY_AIR } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { UPPERCUT } from "../../hero/moves/slashes";
import { showPhantom } from "../../hero/phantom";
import { game, particles, progress, rng } from "../../state";
import { dust, shake } from "../../world";
import { skillValues, withCharms } from "../query";
import { foesOnScreen } from "../targets";

const ID = "k_skyward";

interface Launched {
  foe: Enemy;
  /** Heavenfall's phantom has spiked it */
  spiked: boolean;
}

interface SkyMemory {
  launched: Launched[];
}

const memoryOf = (m: SkillMemory): SkyMemory => m as unknown as SkyMemory;

/** Heavenfall: at the top of its flight a crystal phantom above the foe spikes it back down */
function spike(e: Enemy): void {
  const v = skillValues(ID);
  const [x, y] = enemyCenter(e);
  showPhantom(x, y - 6, Math.sign(e.vx) || 1, 0.35);
  game.fx.push(createSlash(x, y, 1, { ...UPPERCUT, rot: Math.PI, R: 22, W: 9, ramp: PAL.crystal }));
  dealDamage(e, progress.stats.ad * v.spike, { fromX: x, spike: true, heavy: true, source: ID });
  e.vy = ENEMY_AIR.spike;
  sfx.hit(true, 0.8);
}

/** a launched foe hits the floor: it crashes on the foes near it, and as Heavenfall a shockwave rings out */
function crash(e: Enemy, evolved: boolean): void {
  const v = skillValues(ID);
  const x = e.x;
  const reach = withCharms("area", evolved ? Math.max(v.crashReach, v.shockReach) : v.crashReach);
  game.fx.push(createFloorRing(x, GROUND, reach, evolved ? PAL.crystal : PAL.shadow, 0.4));
  dust(x - 6, GROUND, 5, -1);
  dust(x + 6, GROUND, 5, 1);
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SHARD, x, GROUND - 2, rng.range(-120, 120), rng.range(-160, -60), rng.range(0.3, 0.6), {
      col: rng.pick(PAL.crystal.slice(2)),
      size: rng.range(1, 2.4),
    });
  shake(evolved ? 0.25 : 0.15, evolved ? 3 : 2);
  for (const f of foesOnScreen()) {
    if (f === e || Math.abs(enemyCenter(f)[0] - x) > reach || f.y < GROUND - 60) continue;
    dealDamage(f, progress.stats.ad * v.crash, { fromX: x, kx: Math.sign(f.x - x) * 80, ky: -60, source: ID });
  }
}

/** Skybreaker: foes its launch threw up crash on their neighbours when they land; as Heavenfall a phantom spikes them
 *  down from the top of their flight */
export const skybreaker: SkillBehavior = {
  create: () => ({ launched: [] }),
  update(memory, { evolved }) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    for (const l of m.launched) {
      if (evolved && !l.spiked && l.foe.air && l.foe.vy >= 0 && l.foe.hp > 0) {
        l.spiked = true;
        spike(l.foe);
      }
      if (!l.foe.air && l.foe.hp > 0 && (v.crash || evolved)) crash(l.foe, evolved);
    }
    m.launched = m.launched.filter((l) => l.foe.air && l.foe.hp > 0);
  },
  on: {
    blow(memory, ev) {
      if (ev.move !== "skybreaker" || !ev.foe.air) return;
      const m = memoryOf(memory);
      if (!m.launched.some((l) => l.foe === ev.foe)) m.launched.push({ foe: ev.foe, spiked: false });
    },
  },
};
