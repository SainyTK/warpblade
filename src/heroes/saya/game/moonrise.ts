import { createSlash } from "../../../game/effects/slash";
import { settle } from "../../../game/hero/actions";
import { lift } from "../../../game/hero/lift";
import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { MOONRISE } from "../constants/abilities";
import { SKILL } from "../constants/skills/ids";
import { BEATS } from "../constants/timing";
import { createInkWave } from "./effects/inkWave";
import { sheatheFlash } from "./effects/sheatheFlash";
import { SLASHES } from "./moves/slashes";
import { sayaSound } from "./sound";
import { saya } from "./state";
import { releaseCuts } from "./store";
import { layTrail } from "./trail";

/** Moonrise under way: the rising draw lifts her and sends the wave (both ways, held), then the click */
export function runRise(): void {
  const h = hero;
  if (!saya.struck && h.st >= BEATS.rise.hit) {
    saya.struck = true;
    lift(MOONRISE.lift, false);
    game.fx.push(createSlash(h.x, h.y, h.face, SLASHES.moonrise));
    const hit = { now: progress.stats.ap * MOONRISE.now, store: progress.stats.ap * MOONRISE.store };
    game.fx.push(createInkWave(h.x + h.face * 6, h.y, h.face, hit));
    if (saya.wide) game.fx.push(createInkWave(h.x - h.face * 6, h.y, -h.face, hit));
    if (skillValues(SKILL.trail).rise) {
      layTrail(h.x, h.x + h.face * MOONRISE.range, h.y);
      if (saya.wide) layTrail(h.x, h.x - h.face * MOONRISE.range, h.y);
    }
  }
  if (!saya.clicked && h.st >= BEATS.rise.click) {
    saya.clicked = true;
    sayaSound.click();
    sheatheFlash();
    releaseCuts(true);
  }
  if (h.st >= BEATS.rise.end) settle();
}
