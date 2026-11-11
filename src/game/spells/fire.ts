import { SUNFLASK } from "../../constants/evolutions";
import { FLASK_THROW, SECOND_FLASK } from "../../constants/spells";
import type { Blast, Effect, Flask } from "../../types/effect";
import { skillEvolved, skillValues, withCharms } from "../skills/query";
import { game, progress } from "../state";
import { explode } from "./explosion";
import { flaskBurst, flyFlask, trailFlask } from "./flask";
import { drawFlaskBody } from "./flaskArt";
import { createFloorFire } from "./floorFire";
import { drawSunflask, launchChildFlasks } from "./sunflask";

/** seconds before a flask that touched nothing bursts anyway */
const LIFE = 2;
/** the burning floor a burst leaves: its width as a share of the burst, and its burn as a share of ability power */
const FLOOR = { width: 0.8, power: 0.25 } as const;
const SKILL = "k_flame";
/** the plain flask: its body and the fire inside it, and its light */
const FLASK_LOOK = { body: 2.6, inner: 1.6, glow: 15, glowK: 0.4 } as const;

/** one flask of flame thrown in an arc that bursts on whatever it touches first; as Sunflask it is bigger and its burst
 *  throws three more */
function createFlask(x: number, y: number, face: number, speed: number, blast: Blast): Effect {
  const o: Flask = { x, y, vx: face * FLASK_THROW.vx * speed, vy: FLASK_THROW.vy, t: 0 };
  const v = skillValues(SKILL);
  const evolved = skillEvolved(SKILL);
  const floor = v.floor ? withCharms("duration", v.floor) : 0;
  const floorDamage = progress.stats.ap * FLOOR.power;
  return {
    update(dt) {
      flyFlask(o, dt);
      trailFlask(o, evolved ? SUNFLASK.flask.trail : 2, 2);
      const at = flaskBurst(o, dt, 3);
      if (at === null) return o.t < LIFE;
      explode(o.x, at, blast);
      if (floor) game.fx.push(createFloorFire(o.x, at, blast.radius * FLOOR.width, floor, floorDamage, SKILL));
      if (evolved) launchChildFlasks(o.x, at, face, blast);
      return false;
    },
    draw() {
      if (evolved) drawSunflask(o);
      else drawFlaskBody(o, FLASK_LOOK.body, FLASK_LOOK.inner, FLASK_LOOK.glow, FLASK_LOOK.glowK);
    },
  };
}

/** Fire Flask: one flask, or two in a short spread, each bursting and setting foes burning */
export function castFire(x: number, y: number, face: number, power: number): void {
  const v = skillValues(SKILL);
  const blast: Blast = {
    radius: withCharms("area", v.radius),
    damage: v.power * progress.stats.ap * power,
    burn: withCharms("duration", v.burn),
    stun: v.stun,
    source: "abilities",
  };
  game.fx.push(createFlask(x, y, face, 1, blast));
  if (v.flasks > 1) game.fx.push(createFlask(x, y, face, SECOND_FLASK, blast));
}
