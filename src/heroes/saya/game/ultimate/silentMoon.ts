import { ULT_LEVELS } from "../../../../constants/ultimate";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { setState, settle } from "../../../../game/hero/actions";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { skillLevel } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import { SILENT_MOON } from "../../constants/moon";
import { SKILL } from "../../constants/skills/ids";
import { BEATS } from "../../constants/timing";
import { sheatheFlash } from "../effects/sheatheFlash";
import { sayaFx } from "../skillFx";
import { sayaSound } from "../sound";
import { beginBeat, saya } from "../state";
import { releaseCuts } from "../store";
import { aimLines, createMoonLines } from "./moonLines";

/** the foes on screen, nearest first */
const nearestFirst = () => [...foesOnScreen()].sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));

/**
 * Silent Moon, Saya's ultimate: the foes on screen stand still while ink lines cross the stage through them, then she
 * sheathes and every line bursts, releasing her stored cuts with them. Its skill adds lines and power.
 */
export function castSilentMoon(level: number): void {
  const v = ultimateValues();
  beginBeat();
  setState("moon");
  hero.inv = Math.max(hero.inv, BEATS.moon.end);
  sayaSound.draw();
  const foes = nearestFirst();
  const hold = BEATS.moon.click + 0.05;
  for (const e of foes) {
    e.pinned = Math.max(e.pinned, hold);
    staggerFoe(e, hold);
  }
  const count = SILENT_MOON.lines[level - 1] + (v.lines ?? 0);
  const lines = aimLines(count, () => rng.range(-SILENT_MOON.lean, SILENT_MOON.lean), foes);
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * SILENT_MOON.share * (v.power ?? 1);
  game.fx.push(createMoonLines(lines, blow, { mark: v.mark ?? 0, twice: !!v.twice }));
  if (skillLevel(SKILL.moon)) {
    sayaFx(
      SKILL.moon,
      { x: hero.x, y: hero.y, face: hero.face, reach: 24 + count * 3 },
      { damage: blow * count * (v.twice ? 2 : 1) },
    );
  }
}

/** the stillness under way: she holds the drawn blade, then clicks it home with the lines' burst */
export function runMoon(): void {
  if (!saya.clicked && hero.st >= BEATS.moon.click) {
    saya.clicked = true;
    sayaSound.click();
    sheatheFlash();
    releaseCuts(true, { factor: ultimateValues().stored ?? 1 });
  }
  if (hero.st >= BEATS.moon.end) settle();
}
