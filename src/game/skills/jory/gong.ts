import { DRUM, PAL } from "../../../constants/palette";
import { circle, fleck, glow, hairline, place, px } from "../../../engine/frame";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { consumeStacks } from "../../enemies/skillStatus";
import { soundRing } from "../../hero/jory/soundRing";
import { hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "j_gong";
/** where the gong stands: this far ahead of him, and the second this far behind */
const AHEAD = 40;
/** the gong hangs this high over the floor, from a frame this tall */
const LOOK = { hang: 18, frame: 26, radius: 6 } as const;
/** Temple Bell bursts each Resonance stack for this much ability power */
const BURST = 0.4;

interface Gong {
  x: number;
  floor: number;
  left: number;
  /** seconds since it last rang, for the shimmer */
  rang: number;
}

/** one ring of a gong: the ring of sound, the pull toward it, and Temple Bell's burst of Resonance */
function ring(g: Gong): void {
  const v = skillValues(ID);
  const r = withCharms("area", v.radius ?? 50);
  const foes = soundRing(g.x, g.floor, r, {
    damage: progress.stats.ap * (v.power ?? 0),
    stagger: !!v.stagger,
    source: ID,
  });
  for (const e of foes) {
    if (v.pull && e.hp > 0 && e.rank === "minion") e.x += Math.sign(g.x - e.x) * Math.min(v.pull, Math.abs(g.x - e.x));
    if (!v.temple || e.hp <= 0) continue;
    const n = consumeStacks(e, "j_resonance");
    if (n) dealDamage(e, progress.stats.ap * BURST * n, { fromX: g.x, source: ID });
  }
  g.left--;
  g.rang = 0;
}

/** a bronze gong on a dark wooden frame, shimmering cobalt after it rings */
function drawGong(g: Gong): void {
  const top = g.floor - LOOK.frame;
  const cy = g.floor - LOOK.hang;
  hairline(g.x - 8, g.floor, g.x - 8, top, DRUM[0]);
  hairline(g.x + 8, g.floor, g.x + 8, top, DRUM[0]);
  hairline(g.x - 9, top, g.x + 9, top, DRUM[1]);
  hairline(g.x - 3, top, g.x, cy - LOOK.radius, DRUM[0]);
  hairline(g.x + 3, top, g.x, cy - LOOK.radius, DRUM[0]);
  circle(g.x, cy, LOOK.radius, PAL.brass[2]);
  circle(g.x - 1, cy - 1, LOOK.radius - 2, PAL.brass[3]);
  circle(g.x, cy, 2, PAL.brass[4]);
  px(g.x - 3, cy - 3, PAL.brass[5]);
  const k = Math.max(0, 1 - g.rang / 0.3);
  if (k <= 0) return;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    fleck(
      g.x + Math.cos(a) * (LOOK.radius + 2 + 4 * (1 - k)),
      cy + Math.sin(a) * (LOOK.radius + 2 + 4 * (1 - k)),
      PAL.beat[4],
      k * 2,
    );
  }
  glow(g.x, cy, 14, PAL.beat[3], 0.3 * k);
}

/** Gong: a spell on I that sets a gong ahead (and with its level one behind) ringing on the next beats */
export const gongSkill: SkillBehavior = {
  create: () => ({ gongs: [] as Gong[] }),
  update(m, _s, dt) {
    for (const g of m.gongs as Gong[]) g.rang += dt;
  },
  draw(m) {
    place();
    for (const g of m.gongs as Gong[]) drawGong(g);
  },
  on: {
    cast(m, event) {
      if (event.ability !== ID) return;
      const v = skillValues(ID);
      const beats = v.beats ?? 4;
      const gongs: Gong[] = [{ x: hero.x + hero.face * AHEAD, floor: hero.y, left: beats, rang: 9 }];
      if (v.second) gongs.push({ x: hero.x - hero.face * AHEAD, floor: hero.y, left: beats, rang: 9 });
      m.gongs = gongs;
    },
    tick(m) {
      const gongs = m.gongs as Gong[];
      for (const g of gongs) ring(g);
      m.gongs = gongs.filter((g) => g.left > 0);
    },
  },
};
