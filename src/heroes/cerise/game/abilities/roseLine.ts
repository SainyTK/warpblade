import { settle } from "../../../../game/hero/actions";
import { skillValues } from "../../../../game/skills/query";
import { game, hero, lights, progress } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import { ROSE_LINE } from "../../constants/abilities";
import { ROSE_RAMP } from "../../look/rose";
import { createRoseLine } from "../effects/roseLine";
import { roseMark } from "../mark";
import { cerise } from "../state";

/** let a Rose Line go off her point along her line, both ways when held; Weeping Mark's lines mark what they cut */
export function releaseRoseLine(power: number, both: boolean): void {
  const y = hero.y - ROSE_LINE.height;
  const x = hero.x + hero.face * 20;
  const damage = progress.stats.ap * ROSE_LINE.power * power;
  const cut = skillValues("ce_weep").lineMark ? roseMark : undefined;
  game.fx.push(createRoseLine(x, y, hero.face, damage, "abilities", cut));
  if (both) game.fx.push(createRoseLine(hero.x - hero.face * 6, y, -hero.face, damage, "abilities", cut));
  lights.add(x, y, 26, ROSE_RAMP[4], 0.6, 0.18);
  shake(0.08, 1);
  sfx.lunge();
}

/** play the Rose Line cast: the line goes on the thrust, then back to en garde */
export function runLineCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= ROSE_LINE.release) {
    h.hitDone = true;
    releaseRoseLine(cerise.castPower, cerise.castWide);
  }
  if (h.st >= ROSE_LINE.dur) settle();
}
