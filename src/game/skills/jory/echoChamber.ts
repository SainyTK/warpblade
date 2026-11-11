import { COMBO } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { bayerAt, fleck, place, toScreenX, toScreenY } from "../../../engine/frame";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "j_echo";

interface Dome {
  x: number;
  floor: number;
  left: number;
  /** seconds since its last echo, for the pulse */
  pulse: number;
}

/** the dome: a half ring of cobalt over the floor, pulsing on each echo */
function drawDome(d: Dome, r: number): void {
  const k = Math.max(0, 1 - d.pulse / 0.25);
  const n = Math.ceil(r * 3);
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * Math.PI;
    const x = d.x + Math.cos(a) * r;
    const y = d.floor + Math.sin(a) * r * 0.55;
    const sx = Math.floor(toScreenX(x) * RES);
    const sy = Math.floor(toScreenY(y) * RES);
    if (bayerAt(sx, sy) > 0.55 + k * 0.4) continue;
    fleck(x, y, k > 0.2 ? PAL.beat[5] : PAL.beat[3], 0.5 + k);
  }
}

/**
 * Echo Chamber: a spell on I that raises a dome of sound at his feet; on each beat, foes inside take a share of his last
 * landed blow again (Cathedral: of his last two).
 */
export const echoSkill: SkillBehavior = {
  create: () => ({ last: [0, 0] as number[], dome: null as Dome | null }),
  update(m, _s, dt) {
    const d = m.dome as Dome | null;
    if (!d) return;
    d.pulse += dt;
    if (skillValues(ID).follow) d.x = hero.x;
  },
  draw(m) {
    const d = m.dome as Dome | null;
    if (!d) return;
    place();
    drawDome(d, withCharms("area", skillValues(ID).radius ?? 80));
  },
  on: {
    blow(m, event) {
      const last = m.last as number[];
      m.last = [event.damage, last[0]];
    },
    cast(m, event) {
      if (event.ability !== ID) return;
      m.dome = { x: hero.x, floor: hero.y, left: skillValues(ID).beats ?? 8, pulse: 9 };
    },
    tick(m) {
      const d = m.dome as Dome | null;
      if (!d) return;
      const v = skillValues(ID);
      const r = withCharms("area", v.radius ?? 80);
      const [a, b] = m.last as number[];
      const damage = (v.share ?? 0) * (a + (v.cathedral ? b : 0));
      for (const e of game.enemies) {
        if (e.hp <= 0) continue;
        const [cx, cy] = enemyCenter(e);
        if (Math.abs(cx - d.x) > r || cy < d.floor - r * 0.6) continue;
        if (damage > 0)
          dealDamage(e, damage, { fromX: d.x, source: ID, stagger: v.stagger ? COMBO.stagger : undefined });
        if (v.slow) e.chill = Math.max(e.chill, v.slow);
      }
      d.pulse = 0;
      d.left--;
      if (d.left <= 0) m.dome = null;
    },
  },
};
