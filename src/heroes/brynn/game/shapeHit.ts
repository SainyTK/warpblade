import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { MoveHit } from "../../../types/move";
import { HEAVY } from "../constants/string";

/** Wide Arc pulls foes in this hard */
const DRAG = -70;
/** Wide Arc reaches flyers this high */
const TALL = -56;

/** the sweep as Wide Arc shapes it: harder, farther, behind her, dragging, reaching flyers */
function sweep(hit: MoveHit): MoveHit {
  const v = skillValues("br_cleave");
  const [x0, y0, x1, y1] = hit.box;
  return {
    ...hit,
    power: hit.power + (v.power ?? 0),
    box: [x0, v.tall ? TALL : y0, x1 + (v.reach ?? 0), y1],
    around: !!v.behind,
    kx: v.drag ? DRAG : hit.kx,
  };
}

/** the heave as Skyward Heave shapes it: harder, higher, farther, behind her */
function heave(hit: MoveHit): MoveHit {
  const v = skillValues("br_launch");
  const [x0, y0, x1, y1] = hit.box;
  return {
    ...hit,
    power: hit.power + (v.power ?? 0),
    launch: (hit.launch ?? 0) - (v.launch ?? 0),
    box: [x0, y0, x1 + (v.reach ?? 0), y1],
    around: !!v.behind,
  };
}

/** a blow of her string as her skills shape it; a heavy swing (a Keen press) reaches farther ahead and breaks guards */
export function shapeHit(id: string, hit: MoveHit): MoveHit {
  let shaped = hit;
  if (id === "sweep") shaped = sweep(hit);
  else if (id === "heave") shaped = heave(hit);
  if (!hero.keen) return shaped;
  const [x0, y0, x1, y1] = shaped.box;
  return { ...shaped, box: [x0, y0, x1 * HEAVY.reach, y1], big: true };
}
