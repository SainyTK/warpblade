import { SUNFLASK } from "../../constants/evolutions";
import { FIRE_RAMP } from "../../constants/palette";
import { FLASK_THROW } from "../../constants/spells";
import { circle, glow, place, px } from "../../engine/frame";
import type { Blast, Effect, Flask } from "../../types/effect";
import { WHITE } from "../../utils/color";
import { hasPerk } from "../progress";
import { progress } from "../state";
import { explode } from "./explosion";
import { flaskBurst, flyFlask, trailFlask } from "./flask";
import { drawSunflask, launchChildFlasks } from "./sunflask";

const RADIUS = 42;
/** damage as a multiple of ability power */
const POWER = 3.6;
const BURN = 2.5;
/** seconds before a flask that touched nothing bursts anyway */
const LIFE = 2;

function drawFlask(o: Flask): void {
  place();
  circle(o.x, o.y, 2.6, FIRE_RAMP[4]);
  circle(o.x - 0.5, o.y - 0.5, 1.6, FIRE_RAMP[1]);
  px(o.x - 1, o.y - 1, WHITE);
  glow(o.x, o.y, 18, FIRE_RAMP[4], 0.5);
}

/** a flask of flame thrown in an arc that bursts on whatever it touches first; as Sunflask it is bigger and its burst throws three more */
export function castFire(x: number, y: number, face: number, power: number): Effect {
  const o: Flask = { x, y, vx: face * FLASK_THROW.vx, vy: FLASK_THROW.vy, t: 0 };
  const pyro = hasPerk("pyromancy");
  const evolved = hasPerk("sunflask");
  const blast: Blast = {
    radius: RADIUS * (pyro ? 1.5 : 1),
    damage: POWER * progress.stats.ap * power,
    burn: BURN * (pyro ? 1.8 : 1),
    source: "abilities",
  };
  return {
    update(dt) {
      flyFlask(o, dt);
      trailFlask(o, evolved ? SUNFLASK.flask.trail : 2, 2);
      const at = flaskBurst(o, dt, 3);
      if (at === null) return o.t < LIFE;
      explode(o.x, at, blast);
      if (evolved) launchChildFlasks(o.x, at, face, blast);
      return false;
    },
    draw() {
      if (evolved) drawSunflask(o);
      else drawFlask(o);
    },
  };
}
