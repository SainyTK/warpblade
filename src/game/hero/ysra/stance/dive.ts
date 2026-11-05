import { FEEL } from "../../../../constants/combo";
import { DIVE, DIVE_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { meleeHit } from "../../../meleeHit";
import { game, hero } from "../../../state";
import { boxAhead } from "../../../world";
import { setState, settle } from "../../actions";
import { emitYsra } from "../events";
import { cutMove } from "./cut";
import { diveImpact } from "./landing";
import { stance } from "./memory";

/** where the glaive's point runs on the way down, pixels from her feet facing right */
const POINT_BOX = [8, -12, 28, 4] as const;

/** K in the air: once per airtime, turn the glaive point down and drop along it */
export function startDive(): boolean {
  const h = hero;
  if (stance.dived) return false;
  cutMove();
  stance.dived = true;
  stance.landed = false;
  h.vx = 0;
  h.vy = Math.min(h.vy, 0);
  h.cutShort = true;
  // one swing for the whole drop, so the point strikes each foe once
  game.swing++;
  setState("dive");
  sfx.swing(0.6);
  return true;
}

/** the point skewers what it meets on the way down */
function skewer(): void {
  const hits = meleeHit([boxAhead(...POINT_BOX)], {
    power: DIVE.power * 0.5,
    kx: 40,
    ky: 120,
    feel: { stop: 0.04, shake: [0.08, 1.2], pitch: 0.9 },
  });
  if (hits) emitYsra("strike", { source: "dive", hits });
}

/** the tuck hangs her in the air; the drop runs straight at 45 degrees until the floor, where the point goes in */
export function runDive(): void {
  const h = hero;
  if (stance.landed) {
    h.vx = 0;
    if (h.st >= DIVE_TIMES.end) settle();
    return;
  }
  if (h.st < DIVE_TIMES.drop) {
    h.vx = 0;
    h.vy = 0;
    return;
  }
  h.vx = h.face * DIVE.speed;
  h.vy = DIVE.speed;
  emitYsra("travel", { x: h.x, y: h.y, from: "dive" });
  if (!h.ground) {
    skewer();
    h.st = Math.min(h.st, DIVE_TIMES.hold);
    return;
  }
  stance.landed = true;
  h.vx = 0;
  h.st = DIVE_TIMES.impact;
  diveImpact(boxAhead(8 - DIVE.reach, -DIVE.height, 8 + DIVE.reach, 4), {
    power: DIVE.power,
    kx: 70,
    ky: 0,
    launch: DIVE.launch,
    stun: DIVE.stun,
    big: true,
    feel: FEEL.crush,
  });
}
