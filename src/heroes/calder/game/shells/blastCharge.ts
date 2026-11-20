import { fleck, glow, place } from "../../../../engine/frame";
import { clampStageX } from "../../../../game/adventure";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { ABILITY_COLOR, CHARGE } from "../../constants/shots";
import { blastAt } from "../blastFoe";

const SKILL = "ca_charge";
/** a charge lands no nearer the stage edge than this */
const EDGE = 6;

/** a charge sits armed on the floor: a foe touching it or the end of its fuse sets it off */
function createCharge(x: number, y: number, delay: number): Effect {
  const v = skillValues(SKILL);
  const o = { t: -delay, echo: -1 };
  const fuse = withCharms("duration", v.fuse);
  const reach = withCharms("area", v.radius);
  const blow = (scale: number): void => {
    if (v.pull)
      for (const e of game.enemies) {
        const [ex] = enemyCenter(e);
        if (e.hp > 0 && Math.abs(ex - x) < reach * 1.8) e.vx += Math.sign(x - ex) * CHARGE.pull;
      }
    blastAt(null, x, y - 6, {
      damage: 0,
      splash: progress.stats.ap * v.power * scale,
      reach,
      kx: 120,
      ky: -140,
      heavy: true,
      hot: false,
      big: true,
      source: "abilities",
    });
    if (v.stun)
      for (const e of game.enemies)
        if (e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) < reach) e.stun = Math.max(e.stun, v.stun);
  };
  return {
    update(dt) {
      o.t += dt;
      if (o.echo >= 0) {
        o.echo += dt;
        if (o.echo < v.echoDelay) return true;
        blow(v.echo);
        return false;
      }
      if (o.t < 0) return true;
      const touched = game.enemies.some(
        (e) => e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) < CHARGE.touch && Math.abs(e.y - y) < 24,
      );
      if (!touched && o.t < fuse) return true;
      blow(1);
      if (!v.echo) return false;
      o.echo = 0;
      return true;
    },
    draw() {
      if (o.echo >= 0 || o.t < 0) return;
      place();
      const blink = Math.floor(o.t * (o.t > fuse - 0.6 ? 16 : 4)) % 2 === 0;
      const c = ABILITY_COLOR.charge;
      for (let i = -2; i <= 2; i += 0.5) fleck(x + i, y - 1, c);
      for (let i = -1.5; i <= 1.5; i += 0.5) fleck(x + i, y - 2, c);
      fleck(x, y - 3, blink ? WHITE : c);
      if (blink) glow(x, y - 3, 6, c, 0.4);
    },
  };
}

/** Blast Charge: a charge thrown onto the floor ahead, two from level 6; held, a row of three, evolved a row of five */
export function fireBlastCharge(_x: number, _y: number, dir: number, wide: boolean): void {
  const v = skillValues(SKILL);
  const count = (v.count ?? 1) + (wide ? 2 : 0) + (skillEvolved(SKILL) ? 2 : 0);
  for (let i = 0; i < count; i++) {
    const x = clampStageX(hero.x + dir * (CHARGE.throw + i * CHARGE.gap), EDGE);
    game.fx.push(createCharge(x, surfaceBelow(x, hero.y - 4), i * 0.06));
  }
}
