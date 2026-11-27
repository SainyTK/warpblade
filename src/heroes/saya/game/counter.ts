import { createSlash } from "../../../game/effects/slash";
import { enemyBox } from "../../../game/enemies/enemy";
import { setState, settle } from "../../../game/hero/actions";
import { meleeHit } from "../../../game/meleeHit";
import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead, boxHit, newSwing } from "../../../game/world";
import type { Box } from "../../../types/world";
import { COUNTER_DRAW } from "../constants/guard";
import { SKILL } from "../constants/skills/ids";
import { BEATS } from "../constants/timing";
import { cleanSheathe } from "./clean";
import { sheatheFlash } from "./effects/sheatheFlash";
import { gainBreath } from "./focus";
import { SLASHES, STORE_ANGLE } from "./moves/slashes";
import { sayaFx } from "./skillFx";
import { sayaSound } from "./sound";
import { beginBeat, saya } from "./state";
import { releaseCuts, storeCut } from "./store";

/** the counter draw's reach ahead of her */
const COUNTER_BOX: Box = [-4, -42, 42, 2];

/** the counter draw starts: out of a parry, which gives a breath, or out of Still Water (`saya.stillCounter`) */
export function startCounter(): void {
  const still = saya.stillCounter;
  beginBeat();
  setState("counter");
  saya.stillCounter = still;
  if (!still) gainBreath();
  sayaSound.draw();
}

/** the parry's counter draw: Still Water's is stronger and may store */
export function startParryCounter(): void {
  saya.stillCounter = false;
  if (skillLevel(SKILL.calm)) {
    const at = { x: hero.x + hero.face * 12, y: hero.y - 18, face: hero.face };
    sayaFx(SKILL.calm, at, { damage: progress.stats.ad * COUNTER_DRAW.power * (skillEvolved(SKILL.calm) ? 2 : 1) });
  }
  startCounter();
}

/** the counter draw: one cut at the attacker, a sure critical hit, then the click releases every stored cut */
export function runCounter(): void {
  const h = hero;
  const still = saya.stillCounter ? skillValues(SKILL.still) : {};
  if (!saya.struck && h.st >= BEATS.counter.hit) {
    saya.struck = true;
    newSwing();
    game.fx.push(createSlash(h.x, h.y, h.face, SLASHES.counter));
    const power = COUNTER_DRAW.power * (still.power ?? 1);
    meleeHit([boxAhead(...COUNTER_BOX)], {
      power,
      kx: COUNTER_DRAW.kx,
      ky: COUNTER_DRAW.ky,
      big: true,
      sureCrit: true,
    });
    if (still.store) {
      const box = boxAhead(...COUNTER_BOX);
      for (const e of game.enemies)
        if (e.hp > 0 && boxHit(box, enemyBox(e))) storeCut(e, progress.stats.ad * still.store, STORE_ANGLE.drawCut);
    }
  }
  if (!saya.clicked && h.st >= BEATS.counter.click) clickCounter();
  if (h.st >= BEATS.counter.end) settle();
}

/** the counter draw's click: the blade goes home, a clean sheathe out of Still Water, else every stored cut releases */
export function clickCounter(): void {
  saya.clicked = true;
  sayaSound.click();
  sheatheFlash();
  if (saya.stillCounter && skillValues(SKILL.still).clean) cleanSheathe();
  else releaseCuts(true);
}
