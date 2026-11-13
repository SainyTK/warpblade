import { BOLT_CHAIN } from "../../constants/spells";
import { W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { enemyCenter } from "../enemies/enemy";
import { skillEvolved, skillValues, withCharms } from "../skills/query";
import { game, progress } from "../state";
import { surfaceBelow } from "../world";
import { createLightning, type LightningOptions } from "./lightning";
import { createThunderhead } from "./thunderhead";

const SKILL = "k_volt";
/** how far ahead (or behind) the bolt looks for a foe */
const REACH = 190;
/** the second strike of a bolt that strikes twice comes this long after the first */
const AGAIN = 0.3;
/** how long a struck foe is shocked */
const SHOCK = 1;

/** the nearest live foe on one side of Kael within reach */
function foeOnSide(x: number, side: number): Enemy | null {
  return (
    game.enemies
      .filter((e) => e.hp > 0 && (enemyCenter(e)[0] - x) * side > -6 && Math.abs(enemyCenter(e)[0] - x) < REACH)
      .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0] ?? null
  );
}

/** Lightning held: bolts fall one after another across the whole screen, on the foes nearest Kael first and outward,
 *  one on each; with no foe, the floor ahead takes the one bolt */
function boltChain(x: number, point: [number, number], o: LightningOptions, count: number): Enemy | null {
  const foes = game.enemies
    .filter((e) => e.hp > 0)
    .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))
    .slice(0, count);
  const each: LightningOptions = { ...o, damage: o.damage * BOLT_CHAIN.share, arcs: 0 };
  if (!foes.length) game.fx.push(createLightning(null, point, each));
  foes.forEach((foe, i) => {
    game.fx.push(createLightning(foe, point, { ...each, delay: i * BOLT_CHAIN.gap, skyFlash: i === 0 }));
  });
  return foes[0] ?? null;
}

/** Lightning: a bolt on the nearest foe in front, or on the floor ahead, arcing on; with its levels it strikes twice and
 *  also behind, and as Thunderhead a storm cloud follows. Held, a chain of bolts across the screen */
export function castBolt(x: number, y: number, face: number, power: number, wide: boolean): void {
  const v = skillValues(SKILL);
  const ap = progress.stats.ap * power;
  const target = foeOnSide(x, face);
  const markX = clamp(x + face * 80, 10, W - 10);
  const point: [number, number] = [markX, surfaceBelow(markX, y)];
  const o: LightningOptions = {
    damage: v.power * ap,
    arcDamage: v.arcPower * ap,
    arcs: Math.round(withCharms("amount", v.arcs)),
    shock: SHOCK,
    stun: v.stun,
    source: "abilities",
  };
  if (wide) {
    const first = boltChain(x, point, o, BOLT_CHAIN.base + o.arcs);
    if (skillEvolved(SKILL))
      game.fx.push(createThunderhead(first ? enemyCenter(first)[0] : markX, ap, v.cloud, v.cloudArcs));
    return;
  }
  game.fx.push(createLightning(target, point, o));
  if (v.twice) game.fx.push(createLightning(target, point, { ...o, delay: AGAIN, skyFlash: false }));
  const back = v.behind ? foeOnSide(x, -face) : null;
  if (back && back !== target) game.fx.push(createLightning(back, point, { ...o, skyFlash: false }));
  if (skillEvolved(SKILL))
    game.fx.push(createThunderhead(target ? enemyCenter(target)[0] : markX, ap, v.cloud, v.cloudArcs));
}
