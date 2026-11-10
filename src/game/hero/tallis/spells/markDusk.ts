import { PAL } from "../../../../constants/palette";
import { enemyCenter } from "../../../enemies/enemy";
import { skillValues, withCharms } from "../../../skills/query";
import { nearestFoe } from "../../../skills/targets";
import { hero, lights } from "../../../state";
import { isMarked, markDusk } from "../marks";
import { tallisHost } from "../memory";

const ID = "t_markDusk";

/** Mark of Dusk: the nearest foes not yet marked are marked, one or two by its level */
export function castMarkDusk(): void {
  const v = skillValues(ID);
  const seconds = withCharms("duration", v.life);
  const skip = tallisHost.marks.map((m) => m.foe);
  for (let i = 0; i < (v.marks || 1); i++) {
    const e = nearestFoe(hero.x, hero.y - 16, skip);
    if (!e) return;
    skip.push(e);
    markDusk(e, seconds);
    const [cx, cy] = enemyCenter(e);
    lights.add(cx, cy, 30, PAL.gloam[4], 0.6, 0.3);
    hero.face = Math.sign(e.x - hero.x) || hero.face;
  }
}

/** a marked foe fell: the mark passes to the nearest foe with its level */
export function passMark(fallen: { x: number; y: number }): void {
  const v = skillValues(ID);
  if (!v.pass) return;
  const next = nearestFoe(
    fallen.x,
    fallen.y,
    tallisHost.marks.map((m) => m.foe),
  );
  if (next && !isMarked(next)) markDusk(next, withCharms("duration", v.life));
}
