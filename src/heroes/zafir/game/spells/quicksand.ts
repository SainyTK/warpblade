import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { walks } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { TAU } from "../../../../utils/math";
import { GRAIN } from "../../constants/palette";
import { QUICKSAND } from "../../constants/spells";
import { createSpout } from "../effects/spout";
import { sandSound } from "../sound";
import { openWounds } from "../wounds";

const ID = "za_quicksand";

/** a foe standing in the pit: a walker on the floor within its reach */
const inPit = (e: Enemy, x: number, y: number, reach: number): boolean =>
  walks(e) && !e.air && Math.abs(e.x - x) <= reach && Math.abs(e.y - y) < 4;

/**
 * Quicksand: a pit opens on the floor and holds every walker in it, pulling them to its middle and cutting them on its
 * own clock; it marks them to take more from everything and, at its top level, pulls them under for a moment. Evolved
 * as the Sinking Sea, it throws a sandspout up out of its middle each time it cuts. Its numbers are Quicksand's.
 */
export function createPit(x: number, y: number, reach: number, life: number): Effect {
  let t = 0;
  let clock = 0;
  const v = skillValues(ID);
  return {
    update(dt) {
      t += dt;
      clock -= dt;
      const cut = clock <= 0;
      if (cut) clock = QUICKSAND.every;
      for (const e of foesOnScreen()) {
        if (!inPit(e, x, y, reach)) continue;
        e.halt = Math.max(e.halt, 0.2);
        e.vx += Math.sign(x - e.x) * QUICKSAND.pull * dt * 6;
        if (!cut) continue;
        dealDamage(e, progress.stats.ap * v.power, { fromX: x, source: "abilities" });
        if (v.mark) markFoe(e, ID, QUICKSAND.every * 2, v.mark);
        if (v.sink) e.stun = Math.max(e.stun, v.sink);
        openWounds(e, v.wounds ?? 0);
      }
      if (cut && skillEvolved(ID))
        game.fx.push(createSpout(x, y, hero.face, { damage: progress.stats.ap * v.spout, range: 0.25, source: ID }));
      return t < life;
    },
    drawBack() {
      place();
      const fade = Math.min(1, (life - t) / 0.3, t / 0.15);
      for (let i = 0; i < 40; i++) {
        const k = i / 40;
        const a = k * TAU * 3 + t * 4;
        const r = reach * (1 - ((k + t * 0.6) % 1));
        fleck(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.22, GRAIN[(i % 3) + 1], fade);
      }
    },
    draw() {},
  };
}

/** Quicksand: a pit ahead of him; wide, under his own feet and half as wide again */
export function castQuicksand(wide: boolean): void {
  const v = skillValues(ID);
  const x = hero.x + (wide ? 0 : hero.face * QUICKSAND.ahead);
  const y = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  const reach = withBuild("area", QUICKSAND.reach * (v.reach ?? 1) * (wide ? 1.5 : 1));
  game.fx.push(createPit(x, y, reach, withBuild("duration", v.life)));
  sandSound.hiss(0.1);
}
