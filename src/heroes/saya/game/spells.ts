import { ACTION_CLIPS } from "../../../constants/clips";
import { settle } from "../../../game/hero/actions";
import { lowerWard, raiseWard, type ShotWard } from "../../../game/shotWards";
import { skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { SKILL } from "../constants/skills/ids";
import { CRESCENT, RAIN, STILL } from "../constants/spells";
import { BEATS } from "../constants/timing";
import { startCounter } from "./counter";
import { createCrescent } from "./effects/crescent";
import { createInkRain } from "./effects/inkRainCloud";
import { sheatheFlash } from "./effects/sheatheFlash";
import { gainBreath } from "./focus";
import { sayaSound } from "./sound";
import { saya } from "./state";
import { releaseCuts } from "./store";

/** Crescent Wave leaves the blade: one crescent, a low second with its fifth level, three when held */
function sendCrescents(): void {
  const v = skillValues(SKILL.crescent);
  const ap = progress.stats.ap;
  const base = {
    x: hero.x + hero.face * 10,
    dir: hero.face,
    range: v.range,
    tall: v.tall,
    now: ap * v.now,
    store: ap * v.store,
    slow: v.slow ? withBuild("duration", v.slow) : 0,
    launch: v.launch ?? 0,
    burst: v.burst ? ap * v.burst : 0,
  };
  const heights = saya.wide ? CRESCENT.wide : v.pair ? [CRESCENT.wide[1], CRESCENT.low] : [CRESCENT.wide[1]];
  for (const up of heights) game.fx.push(createCrescent({ ...base, y: hero.y - up }));
}

/** Ink Rain's cloud forms ahead, two (one each side) as Monsoon; held, it rains twice as long */
function sendRain(): void {
  const v = skillValues(SKILL.rain);
  const ap = progress.stats.ap;
  const spec = {
    width: withBuild("area", v.width),
    time: withBuild("duration", v.time) * (saya.wide ? 2 : 1),
    drop: ap * v.drop,
    store: ap * v.store,
    stagger: v.stagger ?? 0,
    follow: !!v.follow,
    pin: v.pin ?? 0,
    last: v.last ? ap * v.last : 0,
  };
  const sides = v.clouds > 1 ? [1, -1] : [1];
  for (const side of sides) game.fx.push(createInkRain({ ...spec, x: hero.x + hero.face * side * RAIN.ahead }));
}

/** a spell cast in the shared cast state: it leaves the blade on the cast's hit and the blade clicks home at its end */
export function runCast(): void {
  const h = hero;
  if (!saya.struck && h.st >= ACTION_CLIPS.cast.hit) {
    saya.struck = true;
    if (saya.casting === "crescent") sendCrescents();
    if (saya.casting === "rain") sendRain();
  }
  if (!saya.clicked && h.st >= BEATS.cast.click) clickCast();
}

/** the spell's click: the blade goes home and every stored cut releases */
export function clickCast(): void {
  saya.clicked = true;
  sayaSound.click();
  sheatheFlash();
  releaseCuts(true);
}

/** Still Water's ward round her, breaking foe shots, with the skill's seventh level */
const ward: ShotWard = {
  at: () => ({ x: hero.x, y: hero.y - 16 }),
  radius: STILL.ward,
  broke: () => sayaSound.click(),
};

/** Still Water under way: she waits; a breath as it starts with its fifth level; it ends when its time runs out */
export function runStill(): void {
  const v = skillValues(SKILL.still);
  if (!saya.struck) {
    saya.struck = true;
    if (v.breath) gainBreath();
    if (v.ward) raiseWard(ward);
  }
  if (hero.st >= withBuild("duration", v.time)) endStill();
}

/** Still Water ends, with or without a blow */
function endStill(): void {
  lowerWard(ward);
  settle();
}

/** a blow meets Still Water from the front (or behind, held or as Mirror Lake): the counter draw answers it */
export function stillTakes(fromX: number): boolean {
  if (hero.state !== "still") return false;
  const v = skillValues(SKILL.still);
  const front = (fromX - hero.x) * hero.face >= 0;
  if (!front && !saya.wide && !v.behind) return false;
  if (!front) hero.face = -hero.face;
  lowerWard(ward);
  saya.stillCounter = true;
  startCounter();
  sheatheFlash();
  return true;
}
