import { W } from "../../../constants/stage";
import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { createSlash } from "../../../game/effects/slash";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { skillValues } from "../../../game/skills/query";
import { game, hero, ponytail, progress, scarf } from "../../../game/state";
import { boxBehind, boxHit, hitStop, shake } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { SKILL } from "../constants/skills/ids";
import { BEATS } from "../constants/timing";
import { SAYA_WARP } from "../constants/warp";
import { cleanSheathe } from "./clean";
import { sheatheFlash } from "./effects/sheatheFlash";
import { gainBreath } from "./focus";
import { SLASHES, STORE_ANGLE } from "./moves/slashes";
import { sayaSound } from "./sound";
import { beginBeat, saya } from "./state";
import { releaseCuts, storeCut } from "./store";

/** she carries on past the foe to its far side, still facing the way she came; at the stage's edge she stays beside it */
function passBeyond(foe: Enemy): void {
  const [ex] = enemyCenter(foe);
  const x = ex + hero.face * SAYA_WARP.past;
  if (x < 8 || x > W - 8) return;
  scarf.shift(x - hero.x, 0);
  ponytail.shift(x - hero.x, 0);
  hero.x = x;
}

/**
 * The arrival: she lands past the foe mid-cut; a share lands at once and the rest, a fifth more, waits for the click.
 * Both are dealt as from the foe's front, so landing at its back adds nothing to the shared warp's power.
 */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  beginBeat();
  if (foe) passBeyond(foe);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, SLASHES.pass));
  const ad = progress.stats.ad;
  const box = boxBehind(-8, -40, 30, 2);
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
    const front = e.x + e.face * 10;
    const [cx, cy] = enemyCenter(e);
    game.fx.push(createImpact(cx, cy, -hero.face, true));
    dealDamage(e, ad * power * SAYA_WARP.now, { fromX: front, kx: -hero.face * 40, ky: -40, heavy: true, sureCrit });
    const arrival = skillValues(SKILL.pass).arrival ?? 1;
    storeCut(e, ad * power * (1 - SAYA_WARP.now) * SAYA_WARP.bonus * arrival, STORE_ANGLE.warp, "attacks", true);
  }
  hitStop(0.08);
  shake(0.14, 1.8);
}

/** a beat after the arrival the blade clicks home, releasing the arrival cut with every other */
export function runWarpArrival(): void {
  if (saya.clicked || hero.st < BEATS.warp.click) return;
  saya.clicked = true;
  sayaSound.click();
  sheatheFlash();
  if (skillValues(SKILL.pass).clean) cleanSheathe();
  else releaseCuts(true);
}

/** Saya's warp: she arrives past the foe with the blade drawn and stores the arrival cut for the click; Passing Draw
 *  tunes it and makes each arrival give a breath */
export const SAYA_WARP_STYLE: WarpStyle = {
  strike,
  arrived: () => {
    if (skillValues(SKILL.pass).breath) gainBreath();
  },
  tune: () => skillValues(SKILL.pass),
};
